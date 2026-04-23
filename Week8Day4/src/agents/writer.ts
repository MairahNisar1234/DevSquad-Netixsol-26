export function writerAgent(researchResults: any[]) {
  const allFindings = researchResults.flatMap(r => r.findings);

  return `
# 📊 Structured Comparison Report

## 🧠 Key Insights

${allFindings
  .map((f: any) => `- ${f.content}`)
  .join("\n")}

---

## 🔗 Sources
${researchResults
  .flatMap(r => r.sources)
  .map((s: string) => `- ${s}`)
  .join("\n")}
`;
}