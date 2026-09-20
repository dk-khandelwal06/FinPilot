# FinPilot

### AI-Powered Personal Finance Decision Support Engine

> **Agentic AI Hackathon 2026**  
> Built by: **Daksh Khandelwal** & **Khushi Kushwah**

---

## ⚠️ Financial Disclaimer

> **"FinPilot is an informational financial decision-support tool. It does not provide investment, tax, legal, lending, or professional financial advice."**  
> FinPilot models scenarios and highlights tradeoffs to support user autonomy. It does not execute trades, sell financial instruments, or act as a fiduciary adviser.

---

## 🧭 Product Overview

Most personal finance apps operate like a rearview mirror—logging transactions after money has already left your account. **FinPilot** is an AI-powered financial cockpit engineered for **pre-decision intelligence**:

- **Pre-Purchase Feasibility ("Can I Afford This?")**: Before making an discretionary purchase (e.g., ₹25,000 noise-cancelling headphones), users test the transaction against their live budget surplus, recurring obligations, and active savings goals. FinPilot calculates the exact trade-off without judgmental language.
- **Dynamic Cash Flow Trajectory**: Visualizes running cash balances over 30-to-90 day horizons, taking into account scheduled salary deposits, recurring subscriptions, and upcoming bills.
- **Explainable Anomaly & Subscription Detective**: Automatically flags duplicate restaurant charges, stealth subscription rate hikes, and billing spikes with plain-English rationales (**"WHY WAS THIS FLAGGED?"**).
- **Grounded AI Financial Co-Pilot**: Answers natural language questions with verified citations from your ledger data (e.g., transaction count, merchant name, and total spent), strictly guarding against AI hallucinations.
- **1-Click Instant Demo Experience**: Evaluators can instantly explore persona **Alex Morgan** (₹5,09,100 net liquid wealth, 39 realistic transactions, 4 accounts, 5 subscriptions, and 3 active goals) without any registration barrier.

---

## 🌟 Key Features

| Capability | Purpose | Security / Grounding |
| :--- | :--- | :--- |
| **"Can I Afford This?" Engine** | Simulates prospective purchase impacts on surplus and goal dates | Deterministic mathematical calculation + Gemini 2.0 reasoning |
| **What-If Scenario Simulator** | Models income shocks, extra recurring expenses, or emergency repairs | Live before-and-after variance matrix |
| **Financial Health Cockpit** | Comprehensive score (0–100) across Savings, Debt, Emergency Fund, and Budget Adherence | Normalized multi-factor weighted rubric |
| **Grounded Co-Pilot Chat** | Natural language queries on spending, categories, and trends | Strict server-side prompt injection defense & cited proofs |
| **Statement & Receipt Import** | 8-step statement ingestion for CSV, XLSX, and PDF files | In-memory safe parsing, 10MB limit, MIME whitelist |
| **Subscription Guard** | Tracks recurring SaaS, cloud services, and entertainment memberships | Detects unexpected price increases and renewals |
| **Bill & Cash Calendar** | Visual calendar mapping out bill due dates and paydays | Prevents missed due dates and overdraft surprises |
| **Multi-Account Aggregator** | Unified view across Checking, Savings, Credit Cards, and UPI Wallets | User-scoped tenant data isolation |

---

## 🛠️ Technology Stack

- **Frontend & App Framework**: Next.js 15 (App Router, React Server Components, Server-Side API Handlers)
- **Language**: TypeScript 5.8 (Strict type checking, zero `any` shortcuts)
- **Styling**: Tailwind CSS with custom FinPilot fintech design system tokens and glassmorphism
- **Data Visualization**: Recharts (Cash Flow Area Chart, Category Donut Breakdown, MoM Inflow/Outflow Bar)
- **Icons & Micro-Interactions**: Lucide React, Framer Motion
- **Database & ORM**: SQLite (`file:./dev.db`) for frictionless local development; Prisma ORM 6.4 (PostgreSQL ready for cloud/production)
- **Authentication**: Salted Bcrypt (12 rounds) password hashing, JWT session cookies with `HttpOnly`, `SameSite=Lax`, and production `Secure` flags
- **AI Engine**: Google Gemini 2.0 Flash via server-side SDK with algorithmic fallback mechanisms

---

## 🏗️ Architecture Overview

```
finpilot/
├── prisma/
│   ├── schema.prisma               # Complete multi-tenant relational schema
│   └── migrations/                 # Version-controlled SQL migration scripts
├── public/                         # Static branding and assets
├── scripts/
│   └── seed.ts                     # Rich demo persona generator (Alex Morgan)
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Login, Signup, Onboarding
│   │   ├── accounts/               # Account ledger & liquidity view
│   │   ├── ai-assistant/           # Grounded natural language co-pilot
│   │   ├── ai-decision/            # "Can I Afford This?" purchase evaluator
│   │   ├── anomalies/              # Unusual spending & duplicate detective
│   │   ├── api/                    # 14 authenticated JSON API endpoints
│   │   │   ├── ai/                 # Affordability, Anomalies, Chat, What-If
│   │   │   ├── auth/               # Login, Signup, Demo Login, Logout, Me
│   │   │   ├── demo/               # Seed endpoint
│   │   │   └── finance/            # Transactions, Accounts, Budgets, Goals, Import
│   │   ├── budgets/                # Category envelopes & adherence tracking
│   │   ├── cash-flow/              # 30-day forward cash flow forecast
│   │   ├── dashboard/              # Central financial cockpit
│   │   ├── import/                 # Statement upload hub with validation
│   │   ├── what-if/                # Interactive flight simulator
│   │   └── page.tsx                # High-converting fintech product landing page
│   ├── lib/
│   │   ├── auth.ts                 # Bcrypt, JWT verification, and user sessions
│   │   ├── currency.ts             # INR (₹) formatting and arithmetic normalization
│   │   ├── demo-data.ts            # Persona dataset and category seeds
│   │   ├── gemini.ts               # Server-only Gemini 2.0 client & defense prompt
│   │   └── prisma.ts               # Singleton Prisma client instance
│   └── types/                      # Shared domain types & DTOs
└── tests/
    └── finpilot.test.ts            # 15 automated security, auth, and logic tests
```

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js >= 18.18.0 (Node v20 or v22 recommended)
- npm >= 9.0.0

### Step 1: Clone Repository
```bash
git clone https://github.com/daksh-khandelwal/finpilot.git
cd finpilot
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your `.env.local` variables:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="generate-a-random-32-character-secret-key-here"
GEMINI_API_KEY="your-gemini-api-key-from-google-ai-studio"
NODE_ENV="development"
```
> *Note: If `GEMINI_API_KEY` is not provided, FinPilot automatically falls back to its deterministic rule-based heuristic engine so all features remain functional.*

### Step 4: Run Prisma Database Migrations
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Seed Demo Persona Data
Populate the database with the Alex Morgan demo persona:
```bash
npm run seed
```

### Step 6: Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎮 Demo Mode

FinPilot provides an instantaneous demo experience:
1. Navigate to the landing page at `http://localhost:3000`.
2. Click **"Explore Demo"** in the top navigation or hero section.
3. FinPilot generates or loads persona **Alex Morgan** (`demo@finpilot.io` / `demoPassword123!`), logs in through a secure session cookie, and opens the cockpit dashboard preloaded with 39 transactions, 4 accounts, 5 subscriptions, and live cash flow projections.
4. Use the floating **Demo Navigator** widget on the bottom-right corner to jump across all primary product capabilities.

---

## 🤖 AI Configuration & Grounding

FinPilot's AI assistant uses Google's `gemini-2.0-flash` model with defense-in-depth security:
- **Server-Side Key Isolation**: `GEMINI_API_KEY` is loaded exclusively inside server-side code (`src/lib/gemini.ts`) and is never sent to the client.
- **Evidence-Based Grounding**: The AI co-pilot is injected with the user's categorized spending summary, budget status, and recent transactions as read-only context. It is strictly instructed to cite specific transaction numbers and category totals.
- **Prompt Injection Defense**: User queries are isolated from system instructions with boundaries. The system prompt prevents system prompt leaking, role manipulation, or execution of destructive operations.
- **Algorithmic Fallbacks**: If the AI API is rate-limited or offline, FinPilot automatically responds with deterministic financial calculations so the application never breaks.

---

## 🧪 Testing & Verification

Run the comprehensive automated test suite:
```bash
npm test
```

The test runner validates:
1. **Cryptography & Auth**: Bcrypt password hashing, salt validation, JWT signature issuance, and rejection of tampered tokens.
2. **Multi-Tenant User Isolation**: Proves that User B cannot query or access User A's financial transactions.
3. **Demo Persona Integrity**: Verifies Alex Morgan's accounts, 39 transactions, budgets, subscriptions, and anomaly items.
4. **Affordability Engine Math**: Proves exact calculation of surplus deltas, budget limits, and alternative financing recommendations.
5. **What-If Scenario Deltas**: Validates accurate mathematical modeling of 12-month net wealth shifts.

---

## 🛡️ Security & Privacy Architecture

- **No Secrets in Client Bundles**: Zero `NEXT_PUBLIC_` environment variables contain sensitive keys.
- **Strict User Tenancy**: Every Prisma query explicitly includes `where: { userId: user.id }`. User IDs from untrusted request bodies are never trusted blindly.
- **Secure Sessions**: Authentication tokens are stored in `HttpOnly`, `SameSite=Lax` cookies, protected against XSS-based credential theft.
- **File Upload Protection**: Statement and receipt uploads in `/api/finance/import` are validated against a strict 10MB size limit, extension whitelist (`.csv`, `.xlsx`, `.pdf`, `.png`, `.jpg`), MIME validation, and filename sanitization. Uploaded files are processed strictly in-memory and never written as executable files to disk.
- **Safe Rendering**: All AI responses and transaction titles are sanitized and rendered as React text nodes, preventing raw HTML injection or stored XSS.

---

## 🚀 Vercel Deployment Guide

FinPilot is engineered to deploy seamlessly to **Vercel**:

### 1. Database Setup (PostgreSQL)
For production deployment, use a managed cloud PostgreSQL database (such as **Neon**, **Supabase**, or **Vercel Postgres**):
1. In `prisma/schema.prisma`, update the datasource provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Generate the PostgreSQL migrations:
   ```bash
   npx prisma migrate dev --name init_postgres
   ```

### 2. Configure Environment Variables in Vercel
In your Vercel Project Settings → Environment Variables, add:
- `DATABASE_URL`: `postgresql://user:password@host:5432/dbname?sslmode=require`
- `JWT_SECRET`: A secure 32+ character random string
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: `production`

### 3. Deploy
Push to your GitHub repository and import the project into Vercel. The build script automatically runs `prisma generate && next build`.

---

## 👥 Authors & Credits

FinPilot was created for the **Agentic AI Hackathon 2026** by:

- **Daksh Khandelwal** — Co-Creator, Product Architect, AI Engineer & Full-Stack Developer
- **Khushi Kushwah** — Co-Creator, Product Architect, UI/UX Designer & Full-Stack Developer
