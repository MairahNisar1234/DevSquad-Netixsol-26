import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { setDefaultOpenAIClient, run } from '@openai/agents';
import { routerAgent, applyGuardrails } from './agents';

/**
 * 🔥 FORCE BUNDLE: Tells Vercel's bundler to include the package
 * even if it's only used via eval() later.
 */
// @ts-ignore
import * as forceBundle from 'pdfjs-dist';

@Injectable()
export class GraderService implements OnModuleInit {
  private readonly logger = new Logger(GraderService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');
    
    if (!apiKey) {
      this.logger.error('GROQ_API_KEY is missing! Agents will not function.');
      return;
    }

    const groqClient = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    // Sets the client for all agents globally
    setDefaultOpenAIClient(groqClient);
    this.logger.log('AI Grader Service: Multi-Agent system initialized.');
  }

  /**
   * 🔥 VERCEL-FIXED PDF EXTRACTION
   */
  async extractText(fileBuffer: Buffer): Promise<string> {
  try {
    // 1. Polyfill DOMMatrix for the serverless environment
    if (typeof (global as any).DOMMatrix === 'undefined') {
      (global as any).DOMMatrix = class DOMMatrix {
        constructor() {}
        static fromFloat32Array() { return new DOMMatrix(); }
        static fromFloat64Array() { return new DOMMatrix(); }
      };
    }

    /**
     * 🔥 THE FIX: 
     * We point DIRECTLY to the physical file on the Vercel server.
     * This bypasses the "package resolution" logic that is failing.
     */
    const pdfjsLib = await eval(`import('/var/task/node_modules/pdfjs-dist/legacy/build/pdf.mjs')`);

    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = false;
    }

    const uint8Array = new Uint8Array(fileBuffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      disableFontFace: true,
      verbosity: 0,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.replace(/\s+/g, ' ').trim();
  } catch (err: any) {
    this.logger.error(`PDF Extraction failed: ${err.message}`);
    // If the absolute path failed, let's try one more fallback for local dev
    if (err.message.includes('Cannot find package')) {
       this.logger.warn('Absolute path failed, trying relative fallback...');
       const fallbackLib = await eval(`import('pdfjs-dist/legacy/build/pdf.mjs')`);
       // ... (rest of logic)
    }
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}

  /**
   * Swarm execution entry point
   */
  async processWithAgents(file: Express.Multer.File, userPrompt: string) {
    // 1. Guardrails Check
    const guardrailMessage = applyGuardrails(userPrompt);
    if (guardrailMessage) {
      return { status: 'rejected', message: guardrailMessage };
    }

    try {
      // 2. Extract content from the PDF
      const text = await this.extractText(file.buffer);

      // 3. Inject text into global context
      (global as any).extractedText = text;

      // 4. Run the Agent Swarm
      const result = (await run(routerAgent, userPrompt)) as any;

      // 5. Extract results with fallbacks
      const finalResponse = result.finalOutput || 
                            (result.messages && result.messages[result.messages.length - 1]?.content) || 
                            "No response generated.";
      
      const finishingAgent = result.lastAgent?.name || 
                             result.agent?.name || 
                             'Assistant';

      // 6. Cleanup
      delete (global as any).extractedText;

      return {
        fileName: file.originalname,
        status: 'Success',
        agentResponse: finalResponse,
        finalAgent: finishingAgent,
      };
    } catch (err: any) {
      this.logger.error(`Agent processing failed: ${err.message}`);
      delete (global as any).extractedText;
      
      return { 
        status: 'Error', 
        message: 'The AI swarm failed to process this request.',
        details: err.message 
      };
    }
  }
}