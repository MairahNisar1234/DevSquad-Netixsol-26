import { OpenAI } from "openai";
import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { Connection } from "mongoose";

/* ================= STATE ================= */
export const GraphState = Annotation.Root({
  question: Annotation<string>(),
  route: Annotation<
    "stats" | "simple" | "unknown" | "clarify" | "irrelevant"
  >(),
  collection: Annotation<
    "matches" | "teams" | "summaries" | "player_info" | "unknown"
  >(),
  mongoQuery: Annotation<any[]>(),
  results: Annotation<any[]>(),
  finalResponse: Annotation<string>(),
  clarificationOptions: Annotation<string[] | null>(),
  resolvedPlayerName: Annotation<string | null>(),
  rawPlayerName: Annotation<string | null>(),
  pendingQuestion: Annotation<string | null>(),
  resolvedPlayerId: Annotation<number | null>(),
});

export type GraphStateType = typeof GraphState.State;

/* ================= CLASS ================= */
export class CricketGraph {
  private grok: OpenAI;

  constructor(private connection: Connection) {
    this.grok = new OpenAI({
      apiKey: process.env.GROK_API_KEY!,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  /* ================= TIMEOUT ================= */
  private async withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("LLM timeout")), ms)
      ),
    ]);
  }

  /* ================= EXTRACT NAME ================= */
  private async extractPlayerName(question: string): Promise<string | null> {
    const res = await this.withTimeout(
      this.grok.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Extract ONLY the cricket player name from the question. Return ONLY a raw string name. If not found, return NULL.",
          },
          { role: "user", content: question },
        ],
        max_tokens: 20,
      })
    );

    let name = res.choices[0]?.message?.content?.trim();

    if (!name) return null;

    name = name
      .replace(/```/g, "")
      .replace(/[{}[\]"]/g, "")
      .replace(/\bname\s*:\s*/i, "")
      .trim();

    if (!name || name.toLowerCase() === "null") return null;
    if (name.length < 3 || name.length > 60) return null;

    return name;
  }

  /* ================= NORMALIZE ================= */
  private async normalizePlayerName(rawName: string): Promise<string> {
    const res = await this.withTimeout(
      this.grok.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "Fix cricket player spelling. Return ONLY corrected name.",
          },
          { role: "user", content: rawName },
        ],
        max_tokens: 30,
      })
    );

    return res.choices[0]?.message?.content?.trim() || rawName;
  }

  /* ================= FIND CANDIDATES ================= */
  private async findPlayerCandidates(name: string): Promise<any[]> {
    const regex = name.split(/\s+/).join(".*");

    return (
      (await this.connection.db
        ?.collection("player_info")
        .find({
          $or: [
            { full_name: { $regex: regex, $options: "i" } },
            { short_name: { $regex: regex, $options: "i" } },
          ],
        })
        .limit(10)
        .toArray()) || []
    );
  }

  /* ================= ROUTER ================= */
  private async routeQuestion(
    state: GraphStateType
  ): Promise<Partial<GraphStateType>> {
    const q = state.question.toLowerCase();

    const rawName = await this.extractPlayerName(state.question);

    let resolvedName: string | null = null;
    let resolvedPlayerId: number | null = null;

    const cleanName =
      typeof rawName === "string"
        ? rawName.replace(/[{}"]/g, "").replace(/name:/gi, "").trim()
        : null;

    console.log("[ROUTER] RAW NAME:", rawName);
    console.log("[ROUTER] CLEAN NAME:", cleanName);

    const isValidName =
      !!cleanName &&
      cleanName.length >= 3 &&
      cleanName.length <= 60 &&
      /^[a-zA-Z\s.'-]+$/.test(cleanName);

    if (isValidName) {
      const normalized =
        cleanName.split(" ").length < 2
          ? await this.normalizePlayerName(cleanName)
          : cleanName;

      const candidates = await this.findPlayerCandidates(normalized);

      console.log("[ROUTER] Candidates:", candidates);

      if (!candidates.length) {
        return {
          route: "clarify",
          collection: "player_info",
          clarificationOptions: [],
          resolvedPlayerName: null,
          rawPlayerName: cleanName,
          resolvedPlayerId: null,
        };
      }

      if (candidates.length === 1) {
        resolvedName = candidates[0].full_name;
        resolvedPlayerId = candidates[0].player_id;
      } else {
        const best =
          candidates.find(c => {
            const n = c.full_name.toLowerCase();
            return (
              n === cleanName.toLowerCase() ||
              n.includes(cleanName.toLowerCase())
            );
          }) || candidates[0];

        resolvedName = best.full_name;
        resolvedPlayerId = best.player_id;
      }
    }

    const isProfile =
      q.includes("profile") ||
      q.includes("bio") ||
      q.includes("who is") ||
      q.includes("details");

    // ✅ FIXED GUARD (IMPORTANT)
    if (!resolvedPlayerId && !resolvedName) {
      return {
        route: "clarify",
        collection: "player_info",
        clarificationOptions: [],
        resolvedPlayerName: null,
        rawPlayerName: cleanName,
        resolvedPlayerId: null,
      };
    }

    return {
      route: "stats",
      collection: isProfile ? "player_info" : "summaries",
      resolvedPlayerName: resolvedName,
      rawPlayerName: cleanName,
      resolvedPlayerId,
    };
  }

  /* ================= BUILD QUERY ================= */
 private async buildQuery(
  state: GraphStateType
): Promise<Partial<GraphStateType>> {
  console.log("\n================ BUILD QUERY START ================");
  console.log("[INPUT QUESTION]", state.question);
  console.log("[RESOLVED NAME]", state.resolvedPlayerName);
  console.log("[RAW NAME]", state.rawPlayerName);
  console.log("[PLAYER ID]", state.resolvedPlayerId);

  let pipeline: any[] = [];

  // ================= SAFE MATCH =================
  const match: any = {};

  if (state.resolvedPlayerId !== null && state.resolvedPlayerId !== undefined) {
    const id = Number(state.resolvedPlayerId);

    // 🔥 FIX: handle string/number mismatch in DB
    match.player_id = { $in: [id, String(id)] };
  } else if (state.resolvedPlayerName) {
    match.full_name = new RegExp(
      state.resolvedPlayerName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
  } else {
    return {
      mongoQuery: [{ $match: { player_id: -1 } }],
    };
  }

  pipeline.push({ $match: match });

  const isStats = state.collection === "summaries";

  // ================= STATS PIPELINE =================
  if (isStats) {
    pipeline.push({
      $group: {
        _id: "$player_id",

        total_matches: { $sum: "$matches_played" },
        total_runs: { $sum: "$runs" },
        total_wickets: { $sum: "$wickets" },
        total_centuries: { $sum: "$centuries" },
        total_catches: { $sum: "$catches" },

        avg_batting: { $avg: "$bat_avg" },
        avg_bowling: { $avg: "$bowl_avg" },

        highest_score: { $max: "$highest_score" },

        formats: { $addToSet: "$match_format" },
        years: { $addToSet: "$year" },
      },
    });

    // 🔥 FIX: correct mapping AFTER group
    pipeline.push({
      $project: {
        _id: 0,
        player_id: "$_id",

        total_matches: 1,
        total_runs: 1,
        total_wickets: 1,
        total_centuries: 1,
        total_catches: 1,

        avg_batting: 1,
        avg_bowling: 1,

        highest_score: 1,

        formats: 1,
        years: 1,
      },
    });
  }

  // ================= PROFILE PIPELINE =================
  else {
    pipeline.push({
      $project: {
        player_id: 1,
        full_name: 1,
        short_name: 1,
        country: 1,
        role: 1,
        dob: 1,
        batting_style: 1,
        bowling_style: 1,
        image_url: 1,
      },
    });
  }

  console.log("[FINAL PIPELINE SENT TO MONGO]");
  console.dir(pipeline, { depth: null });

  console.log("================ BUILD QUERY END ================\n");

  return {
    mongoQuery: pipeline,
  };
}

  /* ================= EXEC ================= */
  private async execute(
    state: GraphStateType
  ): Promise<Partial<GraphStateType>> {
    console.log("\n================ EXEC START ================");
    console.log("[COLLECTION]", state.collection);
    console.log("[PIPELINE]", JSON.stringify(state.mongoQuery, null, 2));

    try {
      const collection = state.collection || "summaries";

      const results =
        (await this.connection.db
          ?.collection(collection)
          .aggregate(state.mongoQuery || [])
          .toArray()) || [];

      console.log("[EXEC RESULT COUNT]", results.length);

      return { results };
    } catch (err) {
      console.error("❌ EXEC ERROR:", err);
      return { results: [] };
    }
  }

  /* ================= FORMAT ================= */
 private async format(
  state: GraphStateType
): Promise<Partial<GraphStateType>> {
  const data = state.results || [];
  const first = data[0];

  if (!first) {
    return { finalResponse: "No results found." };
  }

  // ================= STATS FORMAT =================
  if (state.collection === "summaries" || first.total_runs !== undefined) {
    return {
      finalResponse:
        `### 📊 Player Stats\n\n` +
        `| Matches | ${first.total_matches ?? first.matches_played ?? "-"} |\n` +
        `| Runs | ${first.total_runs ?? first.runs ?? "-"} |\n` +
        `| Wickets | ${first.total_wickets ?? first.wickets ?? "-"} |\n` +
        `| Centuries | ${first.total_centuries ?? first.centuries ?? "-"} |\n` +
        `| Highest Score | ${first.highest_score ?? "-"} |\n` +
        `| Batting Avg | ${first.avg_batting ?? first.bat_avg ?? "-"} |\n` +
        `| Bowling Avg | ${first.avg_bowling ?? first.bowl_avg ?? "-"} |\n` +
        `| Formats | ${(first.formats || []).join(", ") || "-"} |\n` +
        `| Years | ${(first.years || []).join(", ") || "-"} |\n`,
    };
  }

  // ================= PROFILE FORMAT =================
  if (first.full_name || first.short_name) {
    return {
      finalResponse:
        `### 🏏 Player Profile\n\n` +
        `| Name | ${first.full_name || first.short_name} |\n` +
        `| Country | ${first.country || "-"} |\n` +
        `| Role | ${first.role || "-"} |\n` +
        `| Batting | ${first.batting_style || "-"} |\n` +
        `| Bowling | ${first.bowling_style || "-"} |\n`,
    };
  }

  return {
    finalResponse: "No formatted data available.",
  };
}

  /* ================= GRAPH ================= */
  public build() {
    return new StateGraph(GraphState)
      .addNode("router", this.routeQuestion.bind(this))
      .addNode("build", this.buildQuery.bind(this))
      .addNode("exec", this.execute.bind(this))
      .addNode("format", this.format.bind(this))
      .addEdge(START, "router")
      .addEdge("router", "build")
      .addEdge("build", "exec")
      .addEdge("exec", "format")
      .addEdge("format", END)
      .compile();
  }
}