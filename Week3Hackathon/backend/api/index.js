// api/index.js
import app from "../server.js";
import connectDB from "../db.js";

export default async function handler(req, res) {
  await connectDB(); // ensures DB connected serverless-friendly
  return app(req, res); // forwards request to Express
}