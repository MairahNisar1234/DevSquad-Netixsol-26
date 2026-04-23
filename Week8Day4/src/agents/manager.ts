export function managerAgent(query: string) {
  return {
    tasks: [
      `Find pricing details for: ${query}`,
      `Find features and limitations of: ${query}`,
      `Compare pros and cons of: ${query}`
    ]
  };
}
//takes user questions
//breaks into smaller tasks 
