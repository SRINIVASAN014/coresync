import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== "string") {
      return NextResponse.json({ error: "Goal statement required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an elite Principal Software Architect and Jira/Linear Product Manager.
      A team wants to achieve the following objective:
      "${goal}"

      Deconstruct this objective into a production-grade software project plan.
      Return ONLY a raw, valid JSON object with the following schema:
      {
        "projectName": "Short punchy project title",
        "projectKey": "A 3 to 4 uppercase letter prefix like 'SSO', 'AUTH', 'API'",
        "description": "Comprehensive 2-sentence architectural summary of the project",
        "milestones": [
          { "title": "Milestone 1 title", "description": "Scope of milestone" },
          { "title": "Milestone 2 title", "description": "Scope of milestone" },
          { "title": "Milestone 3 title", "description": "Scope of milestone" }
        ],
        "tasks": [
          {
            "title": "Clear actionable engineering task",
            "description": "Implementation details, acceptance criteria, or tools",
            "priority": "URGENT" | "HIGH" | "MEDIUM" | "LOW"
          }
        ]
      }
      Provide 4 to 6 high-value tasks. Do NOT wrap in markdown quotes if possible, return raw json.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const plan = JSON.parse(text);
    return NextResponse.json({ plan });
  } catch (error: any) {
    console.error("AI Planner error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate project plan" },
      { status: 500 }
    );
  }
}
