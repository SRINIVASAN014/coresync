import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(
    apiKey &&
    apiKey.trim() !== "" &&
    apiKey !== "your-gemini-api-key" &&
    apiKey !== "dummy_key"
  );

  return NextResponse.json({
    isConfigured,
    model: "gemini-1.5-flash",
  });
}

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Gemini API Key." },
        { status: 400 }
      );
    }

    const cleanKey = apiKey.trim();

    // 1. Verify API Key with a lightweight test prompt against Google Gemini
    try {
      const testGenAI = new GoogleGenerativeAI(cleanKey);
      const testModel = testGenAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      await testModel.generateContent("Test connection");
    } catch (testError: any) {
      return NextResponse.json(
        {
          success: false,
          error:
            testError?.message ||
            "Failed to validate key with Google Gemini API. Please check that the key is valid and has active quota.",
        },
        { status: 400 }
      );
    }

    // 2. Persist to .env file in project root
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf-8");
    }

    if (/^GEMINI_API_KEY=/m.test(envContent)) {
      envContent = envContent.replace(
        /^GEMINI_API_KEY=.*$/m,
        `GEMINI_API_KEY="${cleanKey}"`
      );
    } else {
      envContent = envContent.trimEnd() + `\nGEMINI_API_KEY="${cleanKey}"\n`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");

    // 3. Update runtime environment
    process.env.GEMINI_API_KEY = cleanKey;

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Google Gemini 1.5 Flash!",
    });
  } catch (error: any) {
    console.error("Failed to save Gemini API Key:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update configuration" },
      { status: 500 }
    );
  }
}
