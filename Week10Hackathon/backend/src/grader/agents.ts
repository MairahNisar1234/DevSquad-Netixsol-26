// src/grader/agents.ts
import { Agent, tool, setDefaultOpenAIClient } from '@openai/agents';

// --- 🛠 TOOLS ---
export const getDocumentContent = tool({
  name: 'get_document_content',
  description: 'Retrieve the text content of the uploaded PDF.',
  parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
  execute: async () => {
    return { content: (global as any).extractedText || "No document content found." };
  },
});

export const countWords = tool({
  name: 'count_document_words',
  description: 'Get the word count of the document.',
  parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
  execute: async () => {
    const text = (global as any).extractedText || "";
    const count = text.split(/\s+/).filter(w => w.length > 0).length;
    return { wordCount: count };
  },
});

// --- 🧠 SPECIALIST AGENTS ---
export const analystAgent = new Agent({
  name: 'Document_Analyst',
  handoffDescription: 'Use for identifying document type and structure.',
  instructions: 'You are an Analyst. Use get_document_content to identify the document type.',
  model: 'llama-3.1-8b-instant',
  tools: [getDocumentContent],
});

export const summaryAgent = new Agent({
  name: 'Summarizer',
  handoffDescription: 'Use for overviews or when the user asks "what is this about".',
  instructions: `You are a professional Document Analyst. 1. Call get_document_content...`,
  model: 'llama-3.1-8b-instant',
  tools: [getDocumentContent, countWords],
});

export const qaAgent = new Agent({
  name: 'QA_Specialist',
  handoffDescription: 'Use for answering specific questions.',
  instructions: 'You are a QA Specialist. Use get_document_content to answer questions.',
  model: 'llama-3.1-8b-instant',
  tools: [getDocumentContent],
});

// --- 🚦 ROUTER AGENT ---
export const routerAgent = new Agent({
  name: 'Router',
  instructions: 'Route to the right specialist as fast as possible.',
  model: 'llama-3.1-8b-instant',
  handoffs: [analystAgent, summaryAgent, qaAgent],
});

// --- 🛡 GUARDRAILS ---
export const applyGuardrails = (input: string): string | null => {
  const cleanInput = input.trim().toLowerCase();
  if (/^\d{5,}$/.test(cleanInput)) return "Just numbers detected.";
  if (cleanInput.length < 4) return "Request too vague.";
  return null; 
};