import { OpenAI } from 'openai';
import { StateGraph, START, END } from '@langchain/langgraph';
import { Connection } from 'mongoose';

// 1. Updated State
export interface GraphState {
  question: string;
  isCricketRelated: boolean;
  // matches: match events, teams: team results, summaries: player yearly stats, player_info: name/id mapping
  collectionName: 'matches' | 'teams' | 'summaries' | 'player_info' | 'unknown';
  resolvedPlayerId: number | null; // Stores the ID found in player_info
  mongoQuery: any[];
  results: any[];
  finalResponse: string;
}

export class CricketGraph {
  private grok: OpenAI;
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
    this.grok = new OpenAI({
      apiKey: process.env.GROK_API_KEY || '',
      baseURL: process.env.GROK_BASE_URL || 'https://api.groq.com/openai/v1',
    });
  }

  // NODE 1: Relevancy & Collection Logic
  private async checkRelevancy(state: GraphState) {
    const prompt = `
      Analyze: "${state.question}"
      1. Is it about cricket stats?
      2. Which collection is best?
         - 'matches': Specific match scores/grounds (uses player_id).
         - 'teams': Team win/loss/toss records (uses team_name).
         - 'summaries': Yearly player aggregates (uses player_id).
         - 'player_info': Only if the user asks for general info about a player.
      
      Respond in JSON: { "relevant": boolean, "collection": "string" }
    `;

    const res = await this.grok.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: "Return JSON only." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(res.choices[0]?.message?.content || '{}');
    return { 
      isCricketRelated: !!data.relevant, 
      collectionName: data.collection || 'unknown'
    };
  }

  // NODE 2: Player Name to ID Mapper (Crucial for your new dataset)
 private async mapPlayerName(state: GraphState) {
    if (!state.isCricketRelated || state.collectionName === 'teams') return { resolvedPlayerId: null };

    const extractRes = await this.grok.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: `Extract the full name of the cricket player from: "${state.question}". Return ONLY the name or "None".` }]
    });

    const name = extractRes.choices[0]?.message?.content?.trim();
    if (!name || name.toLowerCase() === 'none') return { resolvedPlayerId: null };

    const db = this.connection.db;
    // Using regex for partial matches (e.g., "Kohli" matches "Virat Kohli")
    const player = await db?.collection('player_info').findOne({ 
      name: { $regex: name, $options: 'i' } 
    });

    return { resolvedPlayerId: player ? player.player_id : null };
  }

  // NODE 3: Query Generator (Updated with your real field names)
  private async generateQuery(state: GraphState) {
    if (!state.isCricketRelated || state.collectionName === 'unknown') return { mongoQuery: [] };

    const playerContext = state.resolvedPlayerId 
      ? `CRITICAL: The player_id is ${state.resolvedPlayerId}. Use this NUMBER in your $match stage.` 
      : "No specific player_id found.";

    const prompt = `
      You are a MongoDB Expert. Generate an aggregation pipeline for '${state.collectionName}'.
      QUESTION: "${state.question}"
      ${playerContext}

      STRICT RULES:
      1. Return ONLY a valid JSON array [ ... ].
      2. Quote all keys and operators (e.g., "$match", "$sum").
      3. Use "ground" for locations and "year" (Number) for years.
      4. For location matches, use: { "ground": { "$regex": "Sharjah", "$options": "i" } }
    `;

    const res = await this.grok.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: "You are a JSON-only API." }, { role: "user", content: prompt }]
    });

    let content = res.choices[0]?.message?.content || "[]";
    try {
      // Extract array portion and fix unquoted operators
      let cleanJson = content.substring(content.indexOf("["), content.lastIndexOf("]") + 1);
      cleanJson = cleanJson.replace(/(?<!")(\$[a-zA-Z0-9_]+)(?!")/g, '"$1"'); // Fix $match -> "$match"
      
      return { mongoQuery: JSON.parse(cleanJson) };
    } catch (e) {
      console.error("Query Parse Failure:", content);
      return { mongoQuery: [] };
    }
  }

  // NODE 4: Executor
  private async executeQuery(state: GraphState) {
    if (!state.isCricketRelated || state.mongoQuery.length === 0) return { results: [] };

    try {
      const db = this.connection.db;
      const results = await db?.collection(state.collectionName).aggregate(state.mongoQuery).toArray();
      return { results: results || [] };
    } catch (error) {
      console.error("Mongo Error:", error);
      return { results: [] };
    }
  }

  // NODE 5: Formatter
 private async formatResponse(state: GraphState) {
  if (!state.isCricketRelated) return { finalResponse: "I specialize in cricket stats. How can I help?" };
  
  // 1. Check if results actually exist
  if (!state.results || state.results.length === 0) {
    return { finalResponse: "I checked the database, but no records matched that request." };
  }

  // 2. ENRICHMENT: Map the ID to a Name manually before the AI sees it
  const db = this.connection.db;
  const enrichedResults = await Promise.all(state.results.map(async (row) => {
    const id = row._id || row.player_id;
    if (id && typeof id === 'number') {
      const playerDoc = await db?.collection('player_info').findOne({ player_id: id });
      return { 
        ...row, 
        player_name: playerDoc ? playerDoc.name : `Player (ID: ${id})` 
      };
    }
    return row;
  }));

  // 3. STRICT PROMPT: Force the AI to use the data and stop yapping
  const prompt = `
    SYSTEM: You are a factual Cricket Stats Bot.
    DATA: ${JSON.stringify(enrichedResults)}
    QUESTION: "${state.question}"

    RULES:
    - Use the 'player_name' provided in the data.
    - If a player has the highest total_runs, they ARE the answer.
    - NEVER say you don't have information if there is data in the JSON above.
    - DO NOT provide Python code or hypothetical scenarios.
    - Answer in 1-2 professional sentences.
  `;

  const res = await this.grok.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You provide direct answers based on provided JSON data. No disclaimers." },
      { role: "user", content: prompt }
    ]
  });

  return { finalResponse: res.choices[0]?.message?.content || "Formatting error." };
}

  public build() {
    return new StateGraph<GraphState>({
      channels: {
        question: { value: (l, r) => r, default: () => "" },
        isCricketRelated: { value: (l, r) => r, default: () => false },
        collectionName: { value: (l, r) => r, default: () => 'unknown' as const },
        resolvedPlayerId: { value: (l, r) => r, default: () => null },
        mongoQuery: { value: (l, r) => r, default: () => [] },
        results: { value: (l, r) => r, default: () => [] },
        finalResponse: { value: (l, r) => r, default: () => "" },
      }
    })
      .addNode("check_relevancy", this.checkRelevancy.bind(this))
      .addNode("map_player", this.mapPlayerName.bind(this))
      .addNode("generate_query", this.generateQuery.bind(this))
      .addNode("execute_query", this.executeQuery.bind(this))
      .addNode("format_response", this.formatResponse.bind(this))
      
      .addEdge(START, "check_relevancy")
      .addConditionalEdges(
        "check_relevancy",
        (state) => state.isCricketRelated ? "map_player" : "format_response"
      )
      .addEdge("map_player", "generate_query")
      .addEdge("generate_query", "execute_query")
      .addEdge("execute_query", "format_response")
      .addEdge("format_response", END)
      
      .compile();
  }
}