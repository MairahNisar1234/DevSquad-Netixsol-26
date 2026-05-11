import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/schema/product.schema';
import { SymptomMap } from './symptom-match.schema';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as tmp from 'tmp';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  
  private groq = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

 constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(SymptomMap.name) private symptomMapModel: Model<SymptomMap> // 👈 Inject the SymptomMap
  ) {}
  /**
   * SPEECH-TO-TEXT: Transcribes audio using Groq's FREE Whisper model
   */
  async transcribeAudio(file: Express.Multer.File): Promise<string> {
    this.logger.log(`🎙️ Processing Voice Input: ${file.originalname}`);
    
    const tempFile = tmp.fileSync({ postfix: '.webm' });
    fs.writeFileSync(tempFile.name, file.buffer);

    try {
      const transcription = await this.groq.audio.transcriptions.create({
        file: fs.createReadStream(tempFile.name),
        model: "whisper-large-v3", // Free on Groq
      });
      return transcription.text;
    } catch (error: any) {
      this.logger.error(`❌ Transcription Error: ${error.message}`);
      throw new Error('Failed to process voice input.');
    } finally {
      tempFile.removeCallback(); 
    }
  }

 async getAiResponse(userMessage: string) {
  // 1. Get all products for context
  const products = await this.productModel.find().lean();
  const productContext = products
    .map(p => `- Name: ${p.title} | Symptoms: ${p.symptoms_addressed} | Price: PKR ${p.price}`)
    .join('\n');

  try {
    // 2. Generate the Text Response
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a professional Pharmacy Assistant. 
          CONTEXT: ${productContext}
          RULES: 
          1. Recommend products based on 'symptoms_addressed'.
          2. Mention the specific product names clearly in your response.`
        },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
    });

    // The '|| ""' ensures that if the content is null, it becomes an empty string
const aiText = completion.choices[0].message.content || ""; 

// Now TypeScript is happy because aiText is guaranteed to be a string
const recommendedProducts = await this.searchProducts(aiText);

    
    return { 
      response: aiText, 
      products: recommendedProducts // This is what renders the cards!
    };

  } catch (error: any) {
    this.logger.error('❌ AI Chat Error:', error.message);
    throw error;
  }
}

  async searchProducts(userQuery: string) {
    try {
      const products = await this.productModel.find().lean();
      const productList = products.map(p => ({ title: p.title, symptoms: p.symptoms_addressed }));

      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Return ONLY a JSON array of matching titles: ${JSON.stringify(productList)}`
          },
          { role: "user", content: userQuery },
        ],
        temperature: 0,
      });

      const recommendedTitles = JSON.parse(completion.choices[0].message.content || "[]");
      return await this.productModel.find({ title: { $in: recommendedTitles } }).lean();
    } catch (error: any) {
      return [];
    }
  }
 async analyzeSymptoms(text: string) {
    const allMappings = await this.symptomMapModel.find().lean();
    const symptomsList = allMappings.map(m => m.symptom);

    // 1. Log what's actually in your DB
    this.logger.log(`🔍 Symptoms available in DB: ${symptomsList.join(', ')}`);

const prompt = `
  User Input: "${text}"
  Categories: [${symptomsList.join(', ')}]
  Instruction: Pick the category that BEST matches the user input. 
  If "tired" is mentioned, pick "tired". If "vomiting" or "nausea" is mentioned, pick "digestion".
  Return ONLY the category name.
`;    
    const aiClassification = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0, // Keep it at 0 for strictness
    });

    const matchedSymptom = aiClassification.choices[0]?.message?.content?.trim().toLowerCase().replace('.', '');
    this.logger.log(`🤖 AI classified input as: "${matchedSymptom}"`);

    // 2. Use case-insensitive search
    const mapping = await this.symptomMapModel.findOne({ 
        symptom: { $regex: new RegExp(`^${matchedSymptom}$`, 'i') } 
    });

    if (mapping) {
      this.logger.log(`✅ Found mapping for ${matchedSymptom}. Products: ${mapping.recommendedProducts}`);
      const products = await this.productModel.find({
        title: { $in: mapping.recommendedProducts }
      }).lean();

      return {
        explanation: `Since you mentioned ${matchedSymptom}, I suggest:`,
        products: products
      };
    }
    
    this.logger.warn(`⚠️ No mapping found for "${matchedSymptom}". Falling back to general AI.`);
    return this.getAiResponse(text);
}
async seedSymptoms() {
  const count = await this.symptomMapModel.countDocuments();
  if (count > 0) return { message: "Database already has symptoms!" };

  const initialData = [
    { 
      symptom: "tired", 
      recommendedProducts: ["Iron Vital", "Omega-3 Fish Oil"] 
    },
    { 
      symptom: "hair fall", 
      recommendedProducts: ["Biotin Max", "Ashwagandha"] 
    },
    { 
      symptom: "weak bones", 
      recommendedProducts: ["Calcium Plus", "Glucosamine"] 
    },
    { 
      symptom: "stress", 
      recommendedProducts: ["Magnesium Night", "Ashwagandha", "Melatonin Sleep"] 
    },
    {
      symptom: "digestion",
      recommendedProducts: ["Probiotic Gold"]
    },
    {
      symptom: "immunity",
      recommendedProducts: ["Vitamin C"]
    }
  ];

  await this.symptomMapModel.insertMany(initialData);
  return { message: "Symptoms seeded successfully!", data: initialData };
}
  
}