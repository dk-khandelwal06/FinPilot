"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Bot,
  Scale,
  Repeat,
  AlertTriangle,
  Lock,
  ChevronRight,
  CheckCircle2,
  PieChart,
  Target,
  Waves,
  Zap,
  Cpu,
  Layers,
  HelpCircle,
  Award,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleLaunchDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard?demo=true");
        router.refresh();
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const faqs = [
    {
      q: "What makes FinPilot different from traditional finance trackers?",
      a: "Traditional tools are passive ledgers showing what already happened. FinPilot is an active AI decision-support engine. It doesn't just show your spending; it simulates future outcomes with 'Can I Afford This?' and 'What-If?' scenarios, detects price surges in subscriptions, and answers questions using grounded records with cited proofs.",
    },
    {
      q: "Does FinPilot give investment or stock recommendations?",
      a: "No. FinPilot is an informational financial decision-support tool. It does not provide investment, tax, legal, lending, or professional financial advice.",
    },
    {
      q: "How does FinPilot protect sensitive financial data?",
      a: "FinPilot enforces bank-grade security principles: password hashing via bcrypt, secure HttpOnly session cookies, strict per-user database tenancy isolation, server-only AI key access, and prompt-injection-resistant architectural boundaries.",
    },
    {
      q: "Can I test the platform immediately without signing up?",
      a: "Yes! Click 'Explore Demo' anywhere on the page to instantly load a realistic 50+ transaction dataset for demo persona Alex Morgan, complete with active budgets, subscriptions, goals, and explainable anomalies.",
    },
    {
      q: "How does the AI Assistant avoid hallucinating numbers?",
      a: "FinPilot injects verified transaction counts, category totals, and budget limits into a secured server-side prompt preamble. If data is insufficient, the engine explicitly acknowledges the gap rather than inventing figures.",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#090D16] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Animated Ambient Lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-500/15 via-emerald-500/10 to-violet-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[1200px] -left-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[2200px] -right-40 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-500/10 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin-slow" />
            <span>Built for Agentic AI Hackathon 2026</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">By Daksh Khandelwal & Khushi Kushwah</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Your Money. <br className="hidden sm:inline" />
            <span className="gradient-text">One Intelligent Cockpit.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            FinPilot transforms scattered financial data into clear, explainable, and actionable insights.
            Evaluate purchases with <strong className="text-cyan-300">&ldquo;Can I Afford This?&rdquo;</strong>, simulate future cash flow with <strong className="text-emerald-300">&ldquo;What-If?&rdquo;</strong>, and navigate personal wealth with an AI co-pilot.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLaunchDemo}
              disabled={isDemoLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isDemoLoading ? "Launching Cockpit..." : "Explore Demo (1-Click)"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
            >
              Start Financial Flight
            </Link>
          </div>

          {/* Financial Safety Rule Pill */}
          <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Informational decision-support co-pilot. Not an investment advisor.</span>
          </p>

          {/* 2. HERO COCKPIT DASHBOARD PREVIEW */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-cyan-500/30 bg-[#0B132B]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
            {/* Top cockpit header bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <h2 className="text-sm font-bold text-white text-left">FinPilot Flight Operations Deck</h2>
                  <p className="text-[11px] text-slate-400 text-left">Real-time financial status for Alex Morgan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                  Status: Optimal (88/100)
                </span>
                <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-mono text-cyan-300">
                  Savings Rate: 47%
                </span>
              </div>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-left">
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <p className="text-[11px] font-medium text-slate-400">Net Liquidity</p>
                <p className="mt-1 text-lg font-extrabold text-white">₹5,09,100</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">+₹68,160 this mo</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <p className="text-[11px] font-medium text-slate-400">Monthly Inflow</p>
                <p className="mt-1 text-lg font-extrabold text-emerald-400">₹1,45,000</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Salary + Retainer</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <p className="text-[11px] font-medium text-slate-400">Monthly Outflow</p>
                <p className="mt-1 text-lg font-extrabold text-rose-400">₹76,840</p>
                <p className="text-[10px] text-slate-400 mt-0.5">52.9% burn rate</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <p className="text-[11px] font-medium text-slate-400">Budget Progress</p>
                <p className="mt-1 text-lg font-extrabold text-cyan-400">₹76.8k / ₹95k</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[81%]" />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <p className="text-[11px] font-medium text-slate-400">Emergency Runway</p>
                <p className="mt-1 text-lg font-extrabold text-violet-400">6.6 Months</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">₹2,10,000 funded</p>
              </div>
            </div>

            {/* AI Real-Time Flight Insight Banner */}
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-navy-950/60 p-3.5 text-left">
              <Bot className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-cyan-300">FinPilot Flight Insight: </span>
                <span className="text-slate-300">
                  Your Cloud & Tech budget is exceeded by ₹3,400 due to the Croma electronics transaction. However, your strong 47% savings rate preserves a healthy ₹68,160 surplus, allowing you to reach your Emergency Runway target 45 days ahead of schedule.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION SECTION */}
      <section id="problem-solution" className="py-20 border-t border-white/[0.08] bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">The Problem vs Solution</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Why Traditional Finance Apps Fail You
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Stop searching through raw transaction lines. Start understanding the consequences of your money decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="rounded-2xl border border-rose-500/20 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  ✕
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">Traditional Finance Apps</h3>
                  <p className="text-xs text-rose-300">Passive, rearview-mirror tracking</p>
                </div>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Scattered Accounts:</strong> Money is fragmented across 4 banks, cards, and UPI apps with no single point of truth.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Blind Purchases:</strong> Buying a ₹25,000 phone without knowing whether it will cause your account balance to dip dangerously before rent.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Hidden Subscription Drains:</strong> Silent price hikes and recurring subscriptions go unnoticed for months.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span><strong>Static Spreadsheets:</strong> Manually entering numbers with no predictive capability or explainable reasoning.</span>
                </li>
              </ul>
            </div>

            {/* The FinPilot Way */}
            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-xl shadow-cyan-500/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✓
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">The FinPilot Intelligent Cockpit</h3>
                  <p className="text-xs text-cyan-400">Proactive, predictive decision support</p>
                </div>
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>One Intelligent Cockpit:</strong> All accounts, liquid cash, and credit liabilities unified in real time.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>&ldquo;Can I Afford This?&rdquo; Engine:</strong> Instant pre-purchase simulations that evaluate surplus impact, goal delays, and cash flow dips.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Subscription & Anomaly Detective:</strong> Automatic detection of duplicate charges and sneaky recurring price hikes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Grounded AI Assistant:</strong> Natural language questions answered with cited transaction proofs and zero hallucinations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 10 AI CAPABILITIES BREAKDOWN */}
      <section id="ai-capabilities" className="py-20 border-t border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Intelligent Architecture</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              10 AI Decision-Support Capabilities
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Each module is engineered to give you explainable mathematical answers rather than generic advice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "Grounded AI Finance Co-Pilot",
                desc: "Ask natural language questions like 'Where did my money go this month?' and receive answers citing actual transaction counts and categories.",
                icon: Bot,
                badge: "Core AI",
              },
              {
                title: "'Can I Afford This?' Simulator",
                desc: "Enter an impending purchase. FinPilot calculates impact on your monthly surplus, goal milestones, and cash flow without prescriptive advice.",
                icon: Scale,
                badge: "Decision Engine",
              },
              {
                title: "What-If Scenario Tester",
                desc: "Simulate what happens if you spend ₹10k extra, lose 10% income, or cancel subscriptions with side-by-side Before vs Scenario charts.",
                icon: Sparkles,
                badge: "Predictor",
              },
              {
                title: "Unusual Spending Detective",
                desc: "Flags duplicate restaurant bills, sudden cloud hosting spikes, and abnormal merchant spending with clear 'WHY WAS THIS FLAGGED?' tags.",
                icon: AlertTriangle,
                badge: "Anomaly Guard",
              },
              {
                title: "AI Budget Builder",
                desc: "Analyzes 90 days of categorized spending history to generate a realistic 50/30/20 operational budget with one click.",
                icon: PieChart,
                badge: "Automation",
              },
              {
                title: "Subscription Price Hike Watchdog",
                desc: "Monitors monthly renewals and alerts you immediately when services silently raise subscription fees.",
                icon: Repeat,
                badge: "Recurring",
              },
              {
                title: "30/60/90-Day Cash Flow Forecast",
                desc: "Projects your account balance into the future based on known bills and historical burn rate, preventing overdraft surprises.",
                icon: Waves,
                badge: "Forecasting",
              },
              {
                title: "Emergency Runway Calculator",
                desc: "Calculates precise months of coverage based on true fixed costs and suggests optimal monthly allocations to hit targets.",
                icon: Target,
                badge: "Milestones",
              },
              {
                title: "7-Dimension Flight Status",
                desc: "An objective 0-100 personal finance health score measuring savings, spending discipline, debt load, and goal progress.",
                icon: Activity,
                badge: "Status Deck",
              },
              {
                title: "Intelligent Statement Import",
                desc: "8-step validation workflow for bank PDFs, CSVs, and Excel sheets with automatic category mapping and duplicate protection.",
                icon: Layers,
                badge: "Data Hub",
              },
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 hover:border-cyan-500/30 hover:bg-slate-900/80 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {cap.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ABOUT THE BUILDERS SECTION (DAKSH KHANDELWAL & KHUSHI KUSHWAH) */}
      <section id="builders" className="py-20 border-t border-white/[0.08] bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-3">
              <Award className="h-3.5 w-3.5" />
              <span>Project Founders & Creators</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">About the Builders</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 font-medium">
              FinPilot is built by <strong className="text-white">Daksh Khandelwal</strong> and <strong className="text-white">Khushi Kushwah</strong> for the <strong className="text-cyan-400">Agentic AI Hackathon 2026</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Daksh Khandelwal Card */}
            <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 to-navy-950/90 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-xl font-extrabold text-white shadow-lg">
                  DK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Daksh Khandelwal</h3>
                  <p className="text-xs font-medium text-cyan-400">Product + AI + Full-Stack</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">FinPilot Co-Creator & Architect</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Focused on architecting the full-stack system, AI grounded reasoning engine, Next.js server actions, Prisma database schema, and high-performance financial data visualizations for FinPilot.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-cyan-400">Agentic AI Hackathon 2026</span>
                <span className="text-slate-300 font-semibold">Builder</span>
              </div>
            </div>

            {/* Khushi Kushwah Card */}
            <div className="relative rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-navy-950/90 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-violet-500 text-xl font-extrabold text-white shadow-lg">
                  KK
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Khushi Kushwah</h3>
                  <p className="text-xs font-medium text-emerald-400">Product + AI + Full-Stack</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">FinPilot Co-Creator & Designer</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Focused on designing the aviation-inspired financial cockpit design system, pre-purchase decision simulation logic, What-If scenarios, and user experience flow for FinPilot.
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-[11px] text-emerald-400">Agentic AI Hackathon 2026</span>
                <span className="text-slate-300 font-semibold">Builder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECURITY & PRIVACY SECTION */}
      <section id="security" className="py-20 border-t border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Safety & Architecture</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Bank-Grade Security Architecture
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Personal financial data is strictly sensitive. FinPilot adheres to strict zero-exposure principles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Server-Only Secrets",
                desc: "AI API keys and database credentials reside strictly on the server and are never bundled into client JavaScript.",
                icon: Lock,
              },
              {
                title: "Per-User Data Tenancy",
                desc: "Every query strictly scopes to verified user ID. Cross-user data leakage is impossible.",
                icon: ShieldCheck,
              },
              {
                title: "Bcrypt & HttpOnly Sessions",
                desc: "Strong salted password hashes and HttpOnly cookies protected against XSS and CSRF vectors.",
                icon: Zap,
              },
              {
                title: "Prompt Injection Defense",
                desc: "User inputs are strictly separated from system instructions. User financial text cannot hijack co-pilot behavior.",
                icon: Cpu,
              },
            ].map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div key={idx} className="rounded-2xl border border-white/[0.08] bg-slate-900/40 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-bold text-white">{sec.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{sec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-20 border-t border-white/[0.08] bg-slate-950/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-cyan-400 uppercase">FAQ</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`h-4 w-4 text-cyan-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 border-t border-white/5 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION (CTA) */}
      <section className="py-20 border-t border-white/[0.08] relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0F1D38] to-[#090D16] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Ready to Take Command of Your Finances?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Test the AI Decision Engine right now with one click or create your personal financial flight deck in seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunchDemo}
                disabled={isDemoLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:opacity-90 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Explore Demo Cockpit</span>
              </button>
              <Link
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
