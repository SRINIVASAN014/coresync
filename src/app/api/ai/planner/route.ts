import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { decomposeObjectiveWithCoreSyncAI } from "@/lib/ai/coresync-engine";

export async function POST(req: Request) {
  const startTime = performance.now();

  try {
    const { goal, engine = "coresync" } = await req.json();

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return NextResponse.json(
        { error: "Goal statement required" },
        { status: 400 }
      );
    }

    const cleanGoal = goal.trim();

    // 1. CoreSync AI Engine (Built-in Ultra-Fast ~25ms Local AI)
    if (engine === "coresync") {
      const coreSyncResult = decomposeObjectiveWithCoreSyncAI(cleanGoal);
      const totalTime = Math.max(Math.round(performance.now() - startTime), coreSyncResult.latencyMs);

      return NextResponse.json({
        plan: coreSyncResult.plan,
        source: "coresync",
        engine: "CoreSync AI Engine",
        version: "1.0-instant",
        latencyMs: totalTime,
        message: `Plan generated in ${totalTime}ms via built-in CoreSync AI`,
      });
    }

    // 2. Google Gemini Cloud LLM Engine
    const apiKey = process.env.GEMINI_API_KEY;
    const isGeminiConfigured = Boolean(
      apiKey &&
      apiKey.trim() !== "" &&
      apiKey !== "your-gemini-api-key" &&
      apiKey !== "dummy_key"
    );

    if (isGeminiConfigured) {
      try {
        const prompt = `
          You are an elite Principal Software Architect and Jira/Linear Product Manager.
          A team wants to achieve the following objective:
          "${cleanGoal}"

          Deconstruct this objective into a production-grade software project plan.
          Return ONLY a raw, valid JSON object with the following schema:
          {
            "projectName": "Short punchy project title",
            "projectKey": "A 3 to 4 uppercase letter prefix like 'WEB', 'AUTH', 'API'",
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
          Provide 5 to 6 high-value tasks. Do NOT wrap in markdown quotes if possible, return raw json.
        `;

        const genAI = new GoogleGenerativeAI(apiKey!);
        let result;

        // Try available Gemini models in order of best performance & uptime
        const modelsToTry = [
          "gemini-3.5-flash",
          "gemini-3.6-flash",
          "gemini-flash-lite-latest",
          "gemini-3.8-flash",
          "gemini-flash-latest",
        ];

        let lastError = null;
        for (const modelName of modelsToTry) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            result = await model.generateContent(prompt);
            if (result) break;
          } catch (e: any) {
            lastError = e;
          }
        }

        if (!result) {
          throw lastError || new Error("All Gemini models temporarily unavailable");
        }

        let text = result.response.text().trim();
        if (text.startsWith("```json")) {
          text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```\s*/, "").replace(/```$/, "").trim();
        }

        const plan = JSON.parse(text);
        const totalTime = Math.round(performance.now() - startTime);

        return NextResponse.json({
          plan,
          source: "gemini",
          engine: "Google Gemini 3.5 Flash",
          latencyMs: totalTime,
          geminiConfigured: true,
          message: `Plan generated in ${totalTime}ms via Google Gemini Cloud`,
        });
      } catch (geminiError: any) {
        console.warn(
          "Gemini API request failed or spiked, auto-falling back to CoreSync Engine:",
          geminiError?.message
        );
        // Seamless fallback to built-in CoreSync AI
        const fallbackResult = decomposeObjectiveWithCoreSyncAI(cleanGoal);
        const totalTime = Math.round(performance.now() - startTime);

        return NextResponse.json({
          plan: fallbackResult.plan,
          source: "coresync-fallback",
          engine: "CoreSync AI Engine",
          latencyMs: totalTime,
          geminiConfigured: true,
          geminiWarning: "Gemini had high demand; seamlessly generated via CoreSync Engine",
          message: `Plan generated in ${totalTime}ms via CoreSync AI`,
        });
      }
    }

    // If Gemini requested but not configured, use CoreSync AI Engine
    const coreSyncResult = decomposeObjectiveWithCoreSyncAI(cleanGoal);
    const totalTime = Math.round(performance.now() - startTime);

    return NextResponse.json({
      plan: coreSyncResult.plan,
      source: "coresync",
      engine: "CoreSync AI Engine",
      latencyMs: totalTime,
      geminiConfigured: false,
      message: `Plan generated in ${totalTime}ms via CoreSync AI Engine`,
    });
  } catch (error: any) {
    console.error("AI Planner error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate project plan" },
      { status: 500 }
    );
  }
}
