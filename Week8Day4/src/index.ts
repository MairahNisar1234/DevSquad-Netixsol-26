import dotenv from "dotenv";
import { orchestrator } from "./orchestrator";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("🧠 Enter your research query: ", async (query) => {
  console.log("\n🚀 Running multi-agent system...\n");

  const report = await orchestrator(query);

  console.log("\n========================\n");
  console.log(report);

  rl.close();
});