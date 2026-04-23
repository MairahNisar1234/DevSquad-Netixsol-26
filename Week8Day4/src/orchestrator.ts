import { managerAgent } from "./agents/manager";
import { researchAgent } from "./agents/researcher";
import { writerAgent } from "./agents/writer";

export async function orchestrator(query: string) {
  // 1. Manager creates plan
  const plan = managerAgent(query);

  console.log("📌 Manager Tasks:", plan.tasks);

  // 2. Research executes each task
  const results = [];

  for (const task of plan.tasks) {
    console.log("🔍 Researching:", task);

    const data = await researchAgent(task);
    results.push(data);
  }

  // 3. Writer creates final report
  const finalReport = writerAgent(results);

  return finalReport;
}