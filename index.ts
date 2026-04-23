import 'dotenv/config';
import readline from 'readline';
import OpenAI from 'openai';
import {
  Agent,
  Runner,
  tool,
  setTracingDisabled,
  OpenAIChatCompletionsModel
} from '@openai/agents';
import { z } from 'zod';

// ==============================
// 1. CONFIG
// ==============================
setTracingDisabled(false);

if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

// FIX: OpenRouter + OpenAI type mismatch
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Agents CLI Project"
  }
}) as any;

const MODEL_NAME = "meta-llama/llama-3-8b-instruct";

// ==============================
// 2. TOOL
// ==============================
const wordCounter = tool({
  name: "word_counter",
  description: "Counts words in a given text",
  parameters: z.object({
    text: z.string()
  }),
  execute: async ({ text }) => {
    const count = text.trim().split(/\s+/).length;
    console.log(`\n[Tool] word_counter → ${count}`);
    return { count };
  }
});

// ==============================
// 3. AGENTS
// ==============================

const mathAgent = new Agent({
  name: "MathAgent",
  instructions: `
You are a math expert.
Solve step-by-step.
`,
  model: MODEL_NAME,
});

const programmingAgent = new Agent({
  name: "ProgrammingAgent",
  instructions: `
You are a coding expert.
Explain clearly and use examples when needed.
Use tools when helpful.
`,
  model: MODEL_NAME,
  tools: [wordCounter],
});

const generalAgent = new Agent({
  name: "GeneralAgent",
  instructions: `
Answer general knowledge questions briefly and clearly.
`,
  model: MODEL_NAME,
});

// Router (MANDATORY HANDOFF)
const routerAgent = new Agent({
  name: "RouterAgent",
  instructions: `
You are a routing system.

Rules:
- Math → MathAgent
- Coding → ProgrammingAgent
- Others → GeneralAgent

IMPORTANT:
- DO NOT answer directly
- ONLY route (handoff)
`,
  model: MODEL_NAME,
  handoffs: [mathAgent, programmingAgent, generalAgent],
});

// ==============================
// 4. MODEL PROVIDER
// ==============================
const modelProvider = {
  getModel: async (name?: string) =>
    new OpenAIChatCompletionsModel(client, name || MODEL_NAME)
};

const runner = new Runner({ modelProvider });

// ==============================
// 5. GUARDRAIL
// ==============================
function guardrail(input: string): string | null {
  const banned = ["hack", "illegal", "violence"];

  for (const word of banned) {
    if (input.toLowerCase().includes(word)) {
      return "❌ Blocked by guardrail.";
    }
  }

  return null;
}

// ==============================
// 6. CLI
// ==============================
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("--------------------------------------");
console.log("🚀 Multi-Agent CLI Ready (OpenRouter)");
console.log("--------------------------------------");

function start() {
  rl.question("You: ", async (input: string) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    // Guardrail check
    const blocked = guardrail(input);
    if (blocked) {
      console.log("\n" + blocked + "\n");
      return start();
    }

    try {
      const result = await runner.run(routerAgent, input);

      // FIX: correct output access (NOT messages)
      console.log("\n[Answer]:", result.finalOutput, "\n");

    } catch (err: any) {
      console.error("❌ Error:", err.message);
    }

    start();
  });
}

start();