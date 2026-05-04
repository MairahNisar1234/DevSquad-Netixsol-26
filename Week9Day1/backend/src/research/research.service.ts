import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { ResearchDocument } from '../schemas/document.schema';

/* ================= STATE DEFINITION ================= */
const ResearchState = Annotation.Root({
  question: Annotation<string>(),
  // Added isValid flag to control flow
  isValid: Annotation<boolean>({
    value: (prev, next) => next ?? prev,
    default: () => true,
  }),

  topic: Annotation<string, string>({
    value: (prev, next) => next ?? prev,
    default: () => '',
  }),

  documents: Annotation<any[], any[]>({
    value: (_, next) => next, 
    default: () => [],
  }),

  summaries: Annotation<string[], string[]>({
    value: (prev, next) => [...prev, ...next],
    default: () => [],
  }),

  contradictions: Annotation<string[], string[]>({
    value: (prev, next) => [...prev, ...next],
    default: () => [],
  }),

  trace: Annotation<string[], string[]>({
    value: (prev, next) => [...prev, ...next],
    default: () => [],
  }),

  finalAnswer: Annotation<string, string>({
    value: (_, next) => next,
    default: () => '',
  }),
});

@Injectable()
export class ResearchService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private docModel: Model<ResearchDocument>,
  ) {}

  private getDomains(q: string): string[] {
    const domains: string[] = [];
    const ql = q.toLowerCase();

    if (ql.includes('sql') || ql.includes('database')) domains.push('Databases');
    if (ql.includes('api') || ql.includes('rest') || ql.includes('graphql')) domains.push('APIs');
    if (ql.includes('microservice') || ql.includes('monolith') || ql.includes('architecture')) domains.push('Architecture');
    if (ql.includes('ssr') || ql.includes('csr') || ql.includes('rendering')) domains.push('Web Rendering');
    if (ql.includes('websocket') || ql.includes('polling') || ql.includes('communication')) domains.push('Communication');

    return domains.length ? domains : ['General'];
  }

  /* ================= NODE 0: VALIDATOR ================= */
  private async validatorNode(state: typeof ResearchState.State) {
    const domains = this.getDomains(state.question);
    
    if (domains.includes('General')) {
      return {
        isValid: false,
        topic: 'INVALID',
        summaries: ['⚠️ The query provided does not match our technical research domains (Databases, APIs, Architecture, Rendering, or Communication).'],
        contradictions: ['Irrelevant query detected.'],
        trace: ['Validator: Query blocked as non-technical/irrelevant'],
      };
    }

    return {
      isValid: true,
      trace: ['Validator: Query accepted'],
    };
  }

  /* ================= NODE 1: FINDER ================= */
  private async finderNode(state: typeof ResearchState.State) {
    const domains = this.getDomains(state.question);
    const docs = await this.docModel
      .find({ topic: { $in: domains } })
      .limit(4)
      .lean();

    return {
      topic: domains[0],
      documents: docs,
      trace: [`Retrieved ${docs.length} technical documents from ${domains.join('/')}`],
    };
  }

  /* ================= NODE 2: SUMMARIZER ================= */
  private async summarizerNode(state: typeof ResearchState.State) {
    const summaries = state.documents.map((doc) => {
      const text = doc.content || '';
      let insight = '';
      if (text.includes('Tradeoff:')) {
        insight = text.split('Tradeoff:')[1].split('.')[0];
      } else {
        const sentences = text.split('.');
        insight = sentences.length > 1 ? sentences[1] : sentences[0];
      }
      return `🔹 **${doc.title}**: ${insight.trim()}...`;
    });

    return {
      summaries,
      trace: ['Generated contextual summaries from high-density text'],
    };
  }

  /* ================= NODE 3: CHECKER ================= */
  private async checkerNode(state: typeof ResearchState.State) {
    const contradictions: string[] = [];
    const fullText = state.documents.map(d => d.content).join(' ').toLowerCase();

    if (fullText.includes('sql') && fullText.includes('nosql')) contradictions.push('ACID Consistency (SQL) vs Eventual Availability (NoSQL)');
    if (fullText.includes('microservices') && fullText.includes('latency')) contradictions.push('Scaling Autonomy vs "The Network Tax" Latency Overhead');
    if (fullText.includes('graphql') && fullText.includes('security')) contradictions.push('Frontend Query Flexibility vs Backend Depth-Attack Risks');
    if (fullText.includes('ssr') && fullText.includes('seo')) contradictions.push('SEO Visibility (SSR) vs Server Performance Bottlenecks');

    return {
      contradictions,
      trace: [`Identified ${contradictions.length} architectural tradeoffs`],
    };
  }

  /* ================= NODE 4: WRITER ================= */
  private async writerNode(state: typeof ResearchState.State) {
    const report = `
SYSTEM DESIGN INSIGHTS
${state.question.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOMAIN ${state.topic.toUpperCase()} | ANALYSIS COMPLETE

CORE FINDINGS
${state.summaries.join('\n\n')}

 ARCHITECTURAL TRADE-OFFS
${
  state.contradictions.length
    ? state.contradictions.map((c) => ` ${c}`).join('\n')
    : ' Standard architecture patterns detected—no critical conflicts identified.'
}

TECHNICAL SOURCES
${state.documents.map((d) => `▫️ ${d.title}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Synthesized by AI Research Agent
`.trim();

    return {
      finalAnswer: report,
      trace: ['Final report formatted for technical review'],
    };
  }

  /* ================= WORKFLOW COMPILATION ================= */
  async runWorkflow(question: string) {
    const workflow = new StateGraph(ResearchState)
      .addNode('validator', (s) => this.validatorNode(s))
      .addNode('finder', (s) => this.finderNode(s))
      .addNode('summarizer', (s) => this.summarizerNode(s))
      .addNode('checker', (s) => this.checkerNode(s))
      .addNode('writer', (s) => this.writerNode(s))

      .addEdge(START, 'validator')
      
      // Routing Logic
      .addConditionalEdges(
        'validator',
        (state) => (state.isValid ? 'proceed' : 'reject'),
        {
          proceed: 'finder',
          reject: 'writer', // Skip to writer to show the error in your format
        }
      )

      .addEdge('finder', 'summarizer')
      .addEdge('summarizer', 'checker')
      .addEdge('checker', 'writer')
      .addEdge('writer', END);

    const app = workflow.compile();

    return app.invoke({
      question,
      topic: '',
      documents: [],
      summaries: [],
      contradictions: [],
      trace: [],
      isValid: true
    });
  }
}