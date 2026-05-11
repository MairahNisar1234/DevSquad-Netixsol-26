import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenAI } from 'openai';
import { Submission } from './schemas/submission.schema';

@Injectable()
export class GraderService implements OnModuleInit {
  private readonly logger = new Logger(GraderService.name);
  private groqClient!: OpenAI;

  constructor(
    private configService: ConfigService,
    @InjectModel(Submission.name)
    private submissionModel: Model<Submission>,
  ) {}

  onModuleInit() {
    try {
      const apiKey = this.configService.get<string>('GROQ_API_KEY');

      if (!apiKey) {
        this.logger.error('GROQ_API_KEY is missing!');
        return;
      }

      this.groqClient = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });

      this.logger.log('Groq client initialized successfully');
    } catch (error: any) {
      this.logger.error(`Initialization Error: ${error.message}`);
    }
  }


async extractText(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const PDFParser = require('pdf2json');
      const pdfParser = new PDFParser();

      pdfParser.on('pdfParser_dataError', (err: any) => {
        reject(new Error(err.parserError));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          let text = '';

          pdfData.Pages.forEach((page: any) => {
            page.Texts.forEach((textItem: any) => {
              textItem.R.forEach((r: any) => {
                // ✅ SAFE decoding (prevents URI malformed crash)
                try {
                  text += decodeURIComponent(r.T) + ' ';
                } catch {
                  text += (r.T || '') + ' ';
                }
              });
            });
          });

          // cleanup
          text = text
            .replace(/%/g, '')
            .replace(/\s+/g, ' ')
            .trim();

          if (!text || text.length < 5) {
            return reject(new Error('Empty or invalid PDF text'));
          }

          resolve(text);
        } catch (e: any) {
          reject(e);
        }
      });

      pdfParser.parseBuffer(fileBuffer);
    } catch (err: any) {
      reject(new Error(`PDF Read Error: ${err.message}`));
    }
  });
}

  async processAssignments(
    files: Express.Multer.File[],
    teacherPrompt: string,
    assignmentTitle: string,
    markingMode: string,
    userId: string,
  ) {
    const results: any[] = [];

    if (!files || files.length === 0) {
      return { message: 'No files uploaded' };
    }

    for (const file of files) {
      try {
        this.logger.log(`Processing ${file.originalname}`);

        if (file.mimetype !== 'application/pdf') {
          results.push({
            fileName: file.originalname,
            status: 'Skipped',
            error: 'Not a PDF file',
          });
          continue;
        }

        const text = await this.extractText(file.buffer);

        const modeRules =
          markingMode === 'strict'
            ? `STRICT MODE: Be ruthless. Irrelevant or messy code MUST get ≤ 10. Deduct heavily for bad naming/missing comments.`
            : `LOOSE MODE: Be lenient. If the logic is mostly correct, give a passing grade even if style is poor.`;

        const enhancedPrompt = `
          ASSIGNMENT: ${assignmentTitle}
          TEACHER RULES: ${teacherPrompt}
          ${modeRules}

          STUDENT SUBMISSION TEXT:
          """
          ${text}
          """

          INSTRUCTIONS: 
          1. Extract Student Name and Roll Number.
          2. Score from 0 to 100 based on the rules.
          3. Provide constructive remarks.
          
          OUTPUT JSON ONLY: 
          {"studentName": "...", "rollNumber": "...", "score": 0, "remarks": "..."}
        `;

        const completion = await this.groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: 'You are a strict academic grader. Return ONLY raw JSON.',
            },
            { role: 'user', content: enhancedPrompt },
          ],
        });

        const rawOutput = completion.choices?.[0]?.message?.content || '{}';
        const parsedData = this.parseAIResponse(rawOutput);

        const savedRecord = await this.submissionModel.create({
          fileName: file.originalname,
          assignmentTitle,
          studentName: parsedData.studentName,
          rollNumber: parsedData.rollNumber,
          score: parsedData.score,
          remarks: parsedData.remarks,
          teacherId: userId,
          markingMode,
        });

        results.push({
          fileName: file.originalname,
          status: 'Success',
          data: savedRecord,
        });
      } catch (err: any) {
        this.logger.error(`Error processing ${file.originalname}: ${err.message}`);
        results.push({
          fileName: file.originalname,
          status: 'Failed',
          error: err.message,
        });
      }
    }

    return results;
  }

  private parseAIResponse(rawOutput: string) {
    try {
      const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawOutput);

      return {
        studentName: parsed.studentName || 'Unknown',
        rollNumber: parsed.rollNumber || 'Unknown',
        score: isNaN(Number(parsed.score)) ? 0 : Number(parsed.score),
        remarks: parsed.remarks || 'No remarks provided.',
      };
    } catch (error) {
      this.logger.error('Failed to parse AI JSON response');
      return {
        studentName: 'Unknown',
        rollNumber: 'Unknown',
        score: 0,
        remarks: 'Error: AI response was not in valid format.',
      };
    }
  }

  async getHistory(userId: string) {
    return this.submissionModel
      .find({ teacherId: userId })
      .sort({ createdAt: -1 });
  }
}