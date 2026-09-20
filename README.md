<div align="center">

# ✈️ FINPILOT

### AI-Powered Personal Finance Decision Support Engine

<p>
  A smart financial cockpit that transforms financial data into<br/>
  clear, explainable and actionable insights.
</p>

<p>
  <img src="https://img.shields.io/badge/Agentic%20AI%20Hackathon-2026-7C3AED?style=for-the-badge" alt="Agentic AI Hackathon 2026" />
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p>
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Recharts-Charts-22B5BF?style=for-the-badge" alt="Recharts" />
</p>

</div>

---

## 💡 About FinPilot

Most finance apps look backwards — they log what you already spent. **FinPilot** is built for the moment *before* a decision: it brings accounts, transactions, budgets, subscriptions, bills and goals into one dashboard and turns them into explainable answers. Users can ask questions in natural language, test whether a purchase fits their budget, or simulate a "What-If?" change to income or spending. AI (Google Gemini) writes grounded, plain-English explanations from the user's own data, while core calculations stay deterministic and transparent — with built-in fallbacks if the AI is unavailable.

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%" valign="top">

**💰 Cockpit Dashboard**<br/>
Balances, income, expenses, budgets and goals in one view.

</td>
    <td width="50%" valign="top">

**🤖 AI Finance Assistant**<br/>
Ask about spending, subscriptions and bills — answers are grounded in your data and include supporting citations.

</td>
  </tr>
  <tr>
    <td valign="top">

**⚖️ "Can I Afford This?"**<br/>
Checks a planned purchase against surplus, category budget and goal timelines, with alternatives.

</td>
    <td valign="top">

**🔮 What-If Simulator**<br/>
Compare baseline vs. simulated outcomes for extra expenses, income drops, higher savings or cancelled subscriptions.

</td>
  </tr>
  <tr>
    <td valign="top">

**🩺 Financial Health Score**<br/>
A 0–100 "Flight Status" score across 7 dimensions, including savings rate, budget adherence and emergency runway.

</td>
    <td valign="top">

**🚨 Unusual Spending**<br/>
Flagged transactions with plain-English reasons and severity, plus a resolve action.

</td>
  </tr>
  <tr>
    <td valign="top">

**💳 Transactions, Budgets & Goals**<br/>
Track transactions, category budgets, savings goals, bills and accounts.

</td>
    <td valign="top">

**🔁 Subscription Manager**<br/>
Keep recurring services and their costs in one place.

</td>
  </tr>
  <tr>
    <td valign="top">

**🧾 Statement Import Hub**<br/>
Secure upload validation with CSV preview parsing.

</td>
    <td valign="top">

**🔐 Auth & 1-Click Demo**<br/>
Sign up / log in, or explore instantly with a seeded demo persona.

</td>
  </tr>
</table>

<sub>Also included: a ⌘/Ctrl + K command palette, a demo navigator, and interface views for cash-flow forecasts, spending analytics, a financial calendar, an insights feed and notifications. Amounts are displayed in ₹ (INR).</sub>

---

## 🤖 AI-Powered Financial Intelligence

FinPilot pairs **Google Gemini (`gemini-2.0-flash`)** with deterministic financial logic:

- 💬 **Natural-language Q&A** — the assistant receives a summary of the user's balances, income, expenses, category spending, budgets, subscriptions, bills, goals and recent transactions, and returns an answer with citations.
- ⚖️ **Explainable purchase analysis** — affordability is calculated with transparent math (surplus, budget impact, goal delay), and Gemini adds a plain-English summary.
- 🔮 **What-If analysis** — scenario outcomes are computed deterministically and shown as a before/after comparison with key observations.
- 🚨 **Explainable flags** — unusual transactions are surfaced with a stated reason and severity.
- 🛡️ **Guardrails** — the AI is instructed to stay grounded in the supplied data, avoid investment recommendations, and include a disclaimer.
- 🔁 **Graceful fallback** — if `GEMINI_API_KEY` is missing or the API call fails, rule-based responses keep the assistant and affordability features working.

---

## 🧭 How It Works

<div align="center">

**📥 Sign In or Explore the Demo**

⬇️

**🗂️ Add or Import Financial Data**

⬇️

**🧠 FinPilot Analyzes Accounts, Budgets, Bills & Goals**

⬇️

**💡 AI + Deterministic Engines Generate Insights**

⬇️

**🎯 Clearer, Better-Informed Decisions**

</div>

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :-- | :-- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & UI** | Tailwind CSS, Framer Motion, Lucide React |
| **Charts** | Recharts |
| **Backend** | Next.js Route Handlers |
| **Database** | Prisma ORM 6 with SQLite |
| **Authentication** | bcryptjs, JSON Web Tokens (HttpOnly cookie sessions) |
| **AI** | Google Gemini 2.0 Flash (server-side REST calls) |
| **Testing** | `tsx` test script (`npm test`) |

---

## 📁 Project Structure

```text
FinPilot/
├── prisma/          # schema.prisma + migrations
├── scripts/         # seed.ts (demo data)
├── src/
│   ├── app/         # pages + API routes (auth, finance, ai)
│   ├── components/  # layout, common, demo UI
│   ├── lib/         # auth, gemini, prisma, demo data
│   └── types/
├── tests/           # finpilot.test.ts
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Run Locally

**Prerequisite:** Node.js 18.18 or later.

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd FinPilot

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Set up the database (generate client + create SQLite schema)
npm run prisma:generate
npm run prisma:push

# 5. (Optional) Seed the demo persona
npm run seed

# 6. Start the development server
npm run dev
```

Open **http://localhost:3000** and click **Explore Demo** on the landing page, or create an account.

Run the test suite with `npm test`.

---

## 🔑 Environment Variables

Sensitive credentials belong in environment variables — **never commit real secrets**. Copy `.env.example` to `.env` (Prisma's CLI reads `.env`) and fill in:

| Variable | Purpose |
| :-- | :-- |
| `DATABASE_URL` | Database connection string (SQLite for local development) |
| `JWT_SECRET` | Secret used to sign session tokens — use a long random value in production |
| `GEMINI_API_KEY` | Google Gemini API key, used server-side only (optional — fallbacks apply without it) |
| `NODE_ENV` | `development`, `production` or `test` |

---

## 🔐 Security & Privacy

- 🔒 **Password hashing** with bcrypt (12 rounds)
- 🍪 **Session cookies** — signed JWTs stored in `HttpOnly`, `SameSite=Lax` cookies (`Secure` in production) with a 7-day expiry
- 👤 **User data isolation** — finance queries are scoped to the signed-in user's ID
- 🧱 **Server-side API key** — the Gemini key is read only in server code
- 🗝️ **Environment variables** — secrets and local database files are excluded via `.gitignore`
- 📤 **Upload validation** — 10 MB limit, extension allow-list, MIME check, filename sanitization, in-memory processing
- ✅ **Input validation** — API routes check required fields and amounts

> Demo mode uses a seeded sample persona, not real financial data.

---

> ⚠️ **Disclaimer:** FinPilot is an informational financial decision-support tool. It does not provide investment, tax, legal, lending, or professional financial advice.

---

## 🏆 Built for Agentic AI Hackathon 2026

| | |
| :-- | :-- |
| **Hackathon** | Agentic AI Hackathon 2026 |
| **Problem Statement** | Personal Finance Decision Support Agent |
| **Focus** | AI-powered financial decision support |

---

<div align="center">

## 👥 Team

<table>
  <tr>
    <td align="center" width="50%" valign="top">
      <h3>Daksh Khandelwal</h3>
      <p>2nd Year · B.S. in AI &amp; Data Science · IIT Jodhpur</p>
      <p>📧 Email: <a href="mailto:dk.khandelwaliit@gmail.com">dk.khandelwaliit@gmail.com</a></p>
      <p>💼 LinkedIn: <a href="https://www.linkedin.com/in/daksh-khandelwal-b02748391/">https://www.linkedin.com/in/daksh-khandelwal-b02748391/</a></p>
      <p>💻 GitHub: <a href="https://github.com/dk-khandelwal06">https://github.com/dk-khandelwal06</a></p>
    </td>
    <td align="center" width="50%" valign="top">
      <h3>Khushi Kushwah</h3>
      <p>2nd Year · B.S. in AI &amp; Data Science · IIT Jodhpur</p>
      <p>📧 Email: <a href="mailto:khushikushwah213@gmail.com">khushikushwah213@gmail.com</a></p>
      <p>💻 GitHub: <a href="https://github.com/khushikushwah213">https://github.com/khushikushwah213</a></p>
    </td>
  </tr>
</table>

</div>

---

## 🚀 Project Origin

FinPilot was developed as our solution to the **Personal Finance Decision Support Agent** problem statement for the Agentic AI Hackathon 2026.

The idea focuses on bringing scattered financial information together and using AI to turn it into understandable, explainable, and actionable everyday financial insights.

<div align="center">

<sub>✈️ Built with care for smarter everyday money decisions.</sub>

</div>
