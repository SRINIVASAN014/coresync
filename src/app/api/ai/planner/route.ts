import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function generateFallbackPlan(goal: string) {
  const lower = goal.toLowerCase();

  let projectName = "Full-Stack Web Application Platform";
  let projectKey = "WEB";
  let description =
    "Architect and engineer a modern, high-performance web platform with enterprise-grade security, scalability, and UX.";
  let milestones = [
    {
      title: "Design System & Frontend Architecture",
      description: "Establish UI components, responsive layout system, and client state orchestration.",
    },
    {
      title: "Backend API & Database Integration",
      description: "Develop high-throughput REST/GraphQL endpoints, database schemas, and caching layers.",
    },
    {
      title: "Production Deployment & Security Hardening",
      description: "Implement CI/CD pipeline, automated testing suites, and SOC2/ISO27001 compliance monitors.",
    },
  ];
  let tasks = [
    {
      title: "Establish Next.js App Router and Design System tokens",
      description: "Set up component library, typography scale, responsive navigation, and dark/light theme switching with Tailwind CSS.",
      priority: "HIGH",
    },
    {
      title: "Implement Secure Authentication and Session Middleware",
      description: "Configure OAuth2 PKCE / NextAuth providers with role-based access control (RBAC) and protected route proxies.",
      priority: "URGENT",
    },
    {
      title: "Design PostgreSQL Relational Schema and Prisma ORM Migrations",
      description: "Model core entities, multi-tenant organization boundaries, relational indexes, and automated migration scripts.",
      priority: "HIGH",
    },
    {
      title: "Develop RESTful CRUD APIs with Server Actions & Zod Validation",
      description: "Create type-safe mutation handlers, input validation schemas, and real-time cache revalidation pipelines.",
      priority: "MEDIUM",
    },
    {
      title: "Configure Automated CI/CD Workflows and Cloud Infrastructure",
      description: "Set up GitHub Actions build checks, automated linting, preview deployments, and production SSL edge monitoring.",
      priority: "MEDIUM",
    },
  ];

  if (
    lower.includes("sso") ||
    lower.includes("auth") ||
    lower.includes("identity") ||
    lower.includes("zero-trust")
  ) {
    projectName = "Zero-Trust Identity & SSO Infrastructure";
    projectKey = "AUTH";
    description =
      "Enterprise single sign-on (SSO) architecture supporting SAML 2.0, OAuth2 PKCE, and role-based access control with SOC2 compliance.";
    milestones = [
      {
        title: "Identity Provider Integration",
        description: "Configure SAML 2.0, OIDC, and directory sync with Okta, Azure AD, and Google Workspace.",
      },
      {
        title: "MFA & WebAuthn Enforcement",
        description: "Implement FIDO2 WebAuthn biometric security and adaptive risk-based authentication.",
      },
      {
        title: "Audit Logging & Compliance Sign-off",
        description: "Automated cryptographic audit trails, session revocation, and SOC2 evidence export.",
      },
    ];
    tasks = [
      {
        title: "Configure SAML 2.0 and OIDC metadata exchange",
        description: "Implement enterprise identity federation with Just-In-Time (JIT) user provisioning.",
        priority: "URGENT",
      },
      {
        title: "Implement WebAuthn / Passkey registration flow",
        description: "Build hardware token and biometric MFA challenge endpoints with fallback OTP.",
        priority: "HIGH",
      },
      {
        title: "Enforce Fine-Grained RBAC Permission Matrix",
        description: "Set up role hierarchy (Owner, Admin, Member, Guest) across API endpoints.",
        priority: "HIGH",
      },
      {
        title: "Develop Immutable Audit Log Streaming Service",
        description: "Emit structured JSON audit events for all login, privilege escalation, and token refresh actions.",
        priority: "MEDIUM",
      },
    ];
  } else if (
    lower.includes("payment") ||
    lower.includes("billing") ||
    lower.includes("checkout") ||
    lower.includes("stripe")
  ) {
    projectName = "High-Throughput Payments & Billing Engine";
    projectKey = "PAY";
    description =
      "Scalable multi-currency payment orchestration engine with idempotent transaction processing and automated reconciliation.";
    milestones = [
      {
        title: "Payment Gateway Core",
        description: "Direct integration with Stripe / Adyen with webhooks and signature verification.",
      },
      {
        title: "Subscription & Invoicing Automation",
        description: "Tiered billing rules, proration logic, and automated invoice PDF generation.",
      },
      {
        title: "PCI-DSS Level 1 Security Verification",
        description: "Tokenization, zero-plaintext cardholder data policy, and audit reporting.",
      },
    ];
    tasks = [
      {
        title: "Implement Idempotent Payment Intent Processor",
        description: "Handle checkout sessions with distributed Redis locks to prevent duplicate debits.",
        priority: "URGENT",
      },
      {
        title: "Build Secure Webhook Event Consumer",
        description: "Asynchronously consume payment success, dispute, and refund events with retry queues.",
        priority: "HIGH",
      },
      {
        title: "Create Customer Billing & Subscription Portal",
        description: "Allow organizations to upgrade seats, switch plans, and download VAT invoices.",
        priority: "MEDIUM",
      },
      {
        title: "Configure Automated Revenue Reconciliation Job",
        description: "Nightly ledger balance check comparing internal database records with payment processor payouts.",
        priority: "MEDIUM",
      },
    ];
  } else if (
    lower.includes("mobile") ||
    lower.includes("ios") ||
    lower.includes("android")
  ) {
    projectName = "Cross-Platform Mobile Application";
    projectKey = "MOB";
    description =
      "Native-performance mobile application with offline-first synchronization, push notifications, and biometric authentication.";
    milestones = [
      {
        title: "Core Navigation & Design System",
        description: "Establish responsive layouts, component library, and gesture handlers.",
      },
      {
        title: "Offline Sync & Local Storage",
        description: "Implement local database caching with conflict-free replication to cloud.",
      },
      {
        title: "App Store & Play Store Release",
        description: "Beta testing via TestFlight, store asset compilation, and automated submission.",
      },
    ];
    tasks = [
      {
        title: "Build Mobile UI Components & Navigation Stack",
        description: "Implement tab bar, drawer navigation, and fluid transition animations.",
        priority: "HIGH",
      },
      {
        title: "Implement Offline Data Sync Engine",
        description: "Cache data locally with background sync queue upon network reconnect.",
        priority: "URGENT",
      },
      {
        title: "Configure APNs & FCM Push Notifications",
        description: "Handle background notifications and deep linking to specific project issues.",
        priority: "MEDIUM",
      },
      {
        title: "Integrate Biometric FaceID / Fingerprint Login",
        description: "Secure keychain storage for refresh tokens with biometric authentication prompt.",
        priority: "HIGH",
      },
    ];
  } else {
    const cleanGoal = goal.trim().replace(/^to\s+/i, "");
    const words = cleanGoal.split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      const titleWords = words
        .slice(0, 4)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      projectName = `${titleWords} Project`;
      const keyCandidate = titleWords.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (keyCandidate.length >= 3) {
        projectKey = keyCandidate.slice(0, 3);
      }
      description = `Architectural execution plan for: "${goal}". Structured for agile engineering with strict enterprise quality gates.`;
    }
  }

  return { projectName, projectKey, description, milestones, tasks };
}

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== "string") {
      return NextResponse.json(
        { error: "Goal statement required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isGeminiConfigured = Boolean(
      apiKey &&
      apiKey.trim() !== "" &&
      apiKey !== "your-gemini-api-key" &&
      apiKey !== "dummy_key"
    );

    if (isGeminiConfigured) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
          You are an elite Principal Software Architect and Jira/Linear Product Manager.
          A team wants to achieve the following objective:
          "${goal}"

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

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith("```json")) {
          text = text.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        } else if (text.startsWith("```")) {
          text = text.replace(/^```\s*/, "").replace(/```$/, "").trim();
        }

        const plan = JSON.parse(text);
        return NextResponse.json({
          plan,
          source: "gemini",
          geminiConfigured: true,
        });
      } catch (geminiError: any) {
        console.warn(
          "Gemini API request failed, falling back to intelligent architecture engine:",
          geminiError?.message
        );
        const fallbackPlan = generateFallbackPlan(goal);
        return NextResponse.json({
          plan: fallbackPlan,
          source: "synthesized",
          geminiConfigured: true,
          geminiWarning: geminiError?.message || "Gemini API call timed out or rate-limited",
        });
      }
    }

    // When Gemini API Key is not yet configured, produce an intelligent tailored plan
    const fallbackPlan = generateFallbackPlan(goal);
    return NextResponse.json({
      plan: fallbackPlan,
      source: "synthesized",
      geminiConfigured: false,
    });
  } catch (error: any) {
    console.error("AI Planner error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate project plan" },
      { status: 500 }
    );
  }
}
