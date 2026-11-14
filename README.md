# CoreSync — AI-Native Multi-Company Work Management SaaS

CoreSync is an enterprise-grade, multi-company work management platform built for modern product and engineering teams. Inspired by the speed and precision of Linear and the power of Jira, CoreSync introduces autonomous AI Project Managers and specialized AI agents operating under strict multi-tenant governance.

---

## 🌟 Key Capabilities

- **🏢 Multi-Tenant Organization Isolation**: Strict tenant boundary guarantees Company A can never access Company B's data.
- **🛡️ Role-Based Access Control (RBAC)**: Fine-grained permissions: `OWNER`, `ADMIN`, `MANAGER`, `MEMBER`, `VIEWER`, and `AI_AGENT`.
- **🤖 Autonomous AI Project Planning**: Deconstruct high-level product goals into milestones, epics, tasks, and dependency graphs.
- **🔒 Human-in-the-Loop Governance**: AI recommendations are staged in an **Approval Center**; no autonomous agent modifies production without authorized manager review.
- **📊 Modern Work Management**: Epics, tasks, subtasks, Kanban boards, sprint tracking, and team workload analytics.

---

## 🏗️ Architecture Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React.
- **Backend**: Next.js Server Actions & API routes (Modular Monolith pattern).
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: NextAuth.js with multi-tenant session binding & Argon2/Bcrypt password hashing.
- **AI Engine**: Provider abstraction (Google Gemini API via `@google/generative-ai`, OpenAI, local Ollama-ready).

---

## 🚀 Getting Started (Windows / Local Dev)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v20+ or v24+ (Installed)
- [Git](https://git-scm.com/) (Installed)
- A free PostgreSQL database (e.g., [Neon](https://neon.tech))

### 2. Environment Setup
Copy the environment template and fill in your database and API keys:
```powershell
Copy-Item .env.example .env
```

### 3. Install Dependencies
```powershell
npm install
```

### 4. Database Setup
Generate the Prisma Client and apply migrations:
```powershell
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Roadmap & Phase Progression

- [x] **Phase 0**: Project Planning, Architecture, Environment Baseline
- [x] **Phase 1**: Application Foundation, Reusable UI Kit, Landing Page, Multi-Tenant Schema
- [ ] **Phase 2**: Authentication, Registration & Secure Sessions
- [ ] **Phase 3**: Multi-Company Architecture, Workspace Switching & RBAC
- [ ] **Phase 4**: Work Management, Projects, Epics, Tasks & Kanban Board
- [ ] **Phase 5**: Dashboard Analytics & Team Workload
- [ ] **Phase 6**: AI Assistant & Natural Language Querying
- [ ] **Phase 7**: AI Project Planner & Task Breakdown
- [ ] **Phase 8**: AI Agent System & Identity
- [ ] **Phase 9**: AI Governance, Policy Engine & Tamper-Evident Audit Logs
- [ ] **Phase 10**: Integrations (GitHub, Slack)
- [ ] **Phase 11**: Commercial SaaS, Billing & Tier Enforcement
- [ ] **Phase 12**: Production Hardening & Deployment
