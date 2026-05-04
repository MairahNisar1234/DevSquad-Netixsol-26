"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyGuardrails = exports.routerAgent = exports.qaAgent = exports.summaryAgent = exports.analystAgent = exports.countWords = exports.getDocumentContent = void 0;
const agents_1 = require("@openai/agents");
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const groqClient = new openai_1.OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});
(0, agents_1.setDefaultOpenAIClient)(groqClient);
exports.getDocumentContent = (0, agents_1.tool)({
    name: 'get_document_content',
    description: 'Retrieve the text content of the uploaded PDF.',
    parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
    },
    execute: async () => {
        return { content: global.extractedText || "No document content found." };
    },
});
exports.countWords = (0, agents_1.tool)({
    name: 'count_document_words',
    description: 'Get the word count of the document.',
    parameters: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false
    },
    execute: async () => {
        const text = global.extractedText || "";
        const count = text.split(/\s+/).filter(w => w.length > 0).length;
        return { wordCount: count };
    },
});
exports.analystAgent = new agents_1.Agent({
    name: 'Document_Analyst',
    handoffDescription: 'Use for identifying document type and structure.',
    instructions: 'You are an Analyst. Use get_document_content to identify the document type.',
    model: 'llama-3.1-8b-instant',
    tools: [exports.getDocumentContent],
});
exports.summaryAgent = new agents_1.Agent({
    name: 'Summarizer',
    handoffDescription: 'Use for overviews or when the user asks "what is this about".',
    instructions: `
    You are a professional Document Analyst. 
    1. You MUST call 'get_document_content' before doing anything else.
    2. If 'get_document_content' returns "No content", DO NOT proceed. 
    3. Once you have the text, provide a 3-4 sentence detailed summary of the main topics.
    4. ONLY after the summary, mention the word count.
    5. If the document looks like a bank statement, list the account holder name and final balance.
  `,
    model: 'llama-3.1-8b-instant',
    tools: [exports.getDocumentContent, exports.countWords],
});
exports.qaAgent = new agents_1.Agent({
    name: 'QA_Specialist',
    handoffDescription: 'Use for answering specific questions about data inside the document.',
    instructions: 'You are a QA Specialist. Use get_document_content to answer questions strictly from the text.',
    model: 'llama-3.1-8b-instant',
    tools: [exports.getDocumentContent],
});
exports.routerAgent = new agents_1.Agent({
    name: 'Router',
    instructions: `
    You are an efficient Assistant. 
    Your ONLY goal is to hand off to the right specialist as fast as possible.
    If the user input is nonsense, ignore it and hand off to the Analyst to ask for clarification.
  `,
    model: 'llama-3.1-8b-instant',
    handoffs: [exports.analystAgent, exports.summaryAgent, exports.qaAgent],
});
const applyGuardrails = (input) => {
    const cleanInput = input.trim().toLowerCase();
    if (/^\d{5,}$/.test(cleanInput)) {
        return "This is just a string of numbers. Please ask a real question or leave.";
    }
    const gibberishRegex = /(.)\1{4,}|[bcdfghjklmnpqrstvwxyz]{6,}/i;
    if (gibberishRegex.test(cleanInput)) {
        return "Invalid input detected. Stop smashing your keyboard and ask something relevant.";
    }
    const stupidPrompts = ['hi', 'hello', 'test', 'blah', 'stuff', 'ok', 'bye'];
    if (cleanInput.length < 4 || stupidPrompts.includes(cleanInput)) {
        return "This request is too vague or unprofessional. Provide a clear instruction or exit.";
    }
    return null;
};
exports.applyGuardrails = applyGuardrails;
//# sourceMappingURL=agents.logic.js.map