import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { Conversation } from './schemas/conversation.schema';

@Injectable()
export class CricketService {
  private llm: ChatOpenAI;
  private readonly logger = new Logger(CricketService.name);

  constructor(
    @InjectModel(Conversation.name) 
    private readonly conversationModel: Model<Conversation>,
    @InjectModel('PlayerModel') 
    private readonly playerModel: Model<any>,
    @InjectModel('YearlyPlayerModel') 
    private readonly yearlyPlayerModel: Model<any>,
  ) {
    this.llm = new ChatOpenAI({
      apiKey: process.env.GROK_API_KEY, 
      configuration: { baseURL: 'https://api.groq.com/openai/v1' },
      modelName: 'llama-3.3-70b-versatile', 
      temperature: 0,
    });
  }

  async ask(question: string, sessionId: string = 'default-session', userId: string) {
  this.logger.log(`--- New Request ---`);
  try {
    const recentLogs = await this.conversationModel
      .find({ sessionId }) 
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    const history: BaseMessage[] = recentLogs.reverse().flatMap((log) => [
      new HumanMessage(log.question),
      new AIMessage(log.answer),
    ]);

    const standaloneQuestion = await this.rewriteQuestion(question, history);
    this.logger.log(`Rewritten Question: "${standaloneQuestion}"`);

    // --- 1. Intent Guard & Interceptors ---
    
    // Check for conversation summary requests
    if (/summary|summarize|what have we discussed/i.test(question)) {
      const summaryData = await this.getChatSummary(userId);
      return { response: summaryData.summary, sessionId, isSummary: true };
    }

    // Define keywords to identify cricket-related intent
    const cricketKeywords = /stats|player|runs|wickets|score|average|who is|how did|match|cricket|performance|batting|bowling/i;
    const yearMatch = standaloneQuestion.match(/\b(19\d{2}|20\d{2})\b/);
    
    // If it's not cricket-related and doesn't contain a year, stop here
    if (!cricketKeywords.test(standaloneQuestion) && !yearMatch) {
      return { 
        response: "I'm sorry, I'm a cricket statistics assistant. I can only help with queries about cricket players, match statistics, or yearly records. How can I help you with cricket today?", 
        sessionId 
      };
    }

    // --- 2. DYNAMIC DATA RETRIEVAL ---
    let contextData = "";

    if (yearMatch) {
      const yearStr = yearMatch[0];
      const yearNum = parseInt(yearStr, 10);

      // Clean the question to extract the potential name, removing Markdown symbols
      const nameOnly = standaloneQuestion
        .replace(yearStr, '')
        .replace(/[#*`]/g, '') 
        .replace(/stats|of|year|for|player/gi, '')
        .trim();

      if (!nameOnly || nameOnly.length < 2) {
        this.logger.log(`[YEARLY] General year request for ${yearNum}. Fetching top performers.`);
        
        const topYearlyPlayers = await this.yearlyPlayerModel
          .find({ year: yearNum })
          .sort({ runs: -1 }) 
          .limit(10) // Increased to 10 for better coverage
          .exec();

        contextData = topYearlyPlayers.length > 0 
          ? JSON.stringify(topYearlyPlayers) 
          : `No general stats found for the year ${yearNum}.`;
      } else {
        this.logger.log(`[YEARLY] Searching for player: "${nameOnly}" in year: ${yearNum}`);
        
        const yearlyStats = await this.getYearlyStatsFromDatabase(nameOnly, yearNum);
        
        if (yearlyStats) {
          contextData = JSON.stringify(yearlyStats);
        } else {
          // Fallback: If yearly stats are missing, get general career profile
          const careerStats = await this.getStatsFromDatabase(nameOnly);
          contextData = careerStats 
            ? `YEARLY_DATA_MISSING_BUT_CAREER_FOUND: ${JSON.stringify(careerStats)}`
            : `No specific stats found for ${nameOnly} in the year ${yearNum}.`;
        }
      }
    } else {
      // General career search
      const playerStats = await this.getStatsFromDatabase(standaloneQuestion);
      contextData = playerStats ? JSON.stringify(playerStats) : "No player profile found.";
    }

    // --- 3. Generate AI response ---
    const aiResponse = await this.llm.invoke(`
      You are an expert cricket stats assistant.
      
      CONTEXT FROM DATABASE:
      ${contextData}

      USER QUESTION:
      ${standaloneQuestion}

      INSTRUCTIONS:
      - Use markdown tables to present statistics.
      - If "YEARLY_DATA_MISSING_BUT_CAREER_FOUND", explain that specific year data is unavailable and provide career stats instead.
      - For general year requests, provide a table of the top performers found in the context.
      - Use player names instead of IDs whenever available.
      - Be professional and concise.
    `);

    const finalAnswer = aiResponse.content as string;

    const newConversation = new this.conversationModel({
      userId: new Types.ObjectId(userId),
      sessionId,
      question,
      answer: finalAnswer,
      mongoQuery: { standaloneQuestion, retrievedData: contextData },
    });
    await newConversation.save();

    return { response: finalAnswer, sessionId };
  } catch (error: any) {
    this.logger.error(`Error in ask method: ${error.message}`);
    throw error;
  }
}

  private async getYearlyStatsFromDatabase(name: string, year: number) {
  const cleanedName = this.cleanNameForSearch(name);
  return this.yearlyPlayerModel.findOne({
    year: year,
    $or: [
      { short_name: { $regex: cleanedName, $options: 'i' } },
      { full_name: { $regex: cleanedName, $options: 'i' } }
    ]
  }).exec();
}

  private async getStatsFromDatabase(query: string) {
    const nameToSearch = this.cleanNameForSearch(query);
    if (!nameToSearch || nameToSearch.length < 2) return null;
    return this.playerModel.findOne({
      $or: [
        { short_name: { $regex: nameToSearch, $options: 'i' } },
        { full_name: { $regex: nameToSearch, $options: 'i' } }
      ]
    }).exec();
  }

  private cleanNameForSearch(input: string): string {
    return input
      .replace(/(what|who|is|are|the|info|about|profile|stats|of|player|year|in)/gi, '')
      .replace(/[?.,]/g, '')
      .replace(/\s+/g, ' ')
      .split(/'s| batting| bowling/i)[0]
      .trim();
  }

 private async rewriteQuestion(currentQuestion: string, history: BaseMessage[]): Promise<string> {
  if (history.length === 0) return currentQuestion;

  const historyText = history
    .map((m) => `${m instanceof HumanMessage ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  const prompt = `Review the history and the new question.
  
  STRICT RULES:
  1. If the user asks for "stats of [Year]" or "top players in [Year]" WITHOUT a pronoun (he/she/his), DO NOT include names from history. Output ONLY the year.
  2. If the user uses pronouns (e.g., "his stats", "how was he"), THEN resolve the name from history.
  3. If the user mentions a NEW name, use that name and ignore history.
  
  History:
  ${historyText}
  
  Follow-up: "${currentQuestion}"
  
  Searchable Entity:`;

  const response = await this.llm.invoke(prompt);
  return (response.content as string).trim();
}

  // --- RE-ADDED MISSING METHODS ---

  async getHistory(userId: string) {
    this.logger.log(`Fetching history for user: ${userId}`);
    return this.conversationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getChatSummary(userId: string) {
    const history = await this.conversationModel.find({ userId: new Types.ObjectId(userId) }).exec();
    if (!history || history.length === 0) return { summary: "No history found." };
    const historyText = history.map((m) => `User: ${m.question}\nAI: ${m.answer}`).join('\n\n');
    const response = await this.llm.invoke(`Summarize the players and stats discussed:\n\n${historyText}`);
    return { summary: response.content };
  }
}