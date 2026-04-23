import axios from "axios";

export async function tavilySearch(query: string) {
  const response = await axios.post(
    "https://api.tavily.com/search",
    {
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results: 5
    }
  );

  return response.data;
}