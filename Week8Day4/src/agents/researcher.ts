import { tavilySearch } from "../tools/tavily";

export async function researchAgent(task: string) {
  const data = await tavilySearch(task);
//structured data 
  const cleaned = data.results.map((r: any) => ({
    title: r.title,
    content: r.content,
    url: r.url
  }));

  return {
    task,
    findings: cleaned,
    sources: cleaned.map((r: any) => r.url)
  };
}