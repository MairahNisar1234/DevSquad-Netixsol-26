import dotenv from "dotenv";
import { tavilySearch } from "./tavily";

dotenv.config();

async function test() {
  try {
    const result = await tavilySearch("What is Stripe payment gateway?");

    console.log("✅ Tavily Connected Successfully!\n");

    console.log("📌 First Result:");
    console.log(result.results?.[0]);

    console.log("\n📚 Total Results:", result.results?.length);
  } catch (error) {
    console.error("❌ Tavily Error:", error);
  }
}

test();