"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Grid,
  Scale,
  Sparkles,
  AlertTriangle,
  PieChart,
  Repeat,
  Waves,
  Target,
  FileText,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AISpecialistsPage() {
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);

  const specialists = [
    {
      id: "coach",
      name: "AI Financial Coach",
      category: "Advisory & Habit",
      desc: "Holistic flight co-pilot analyzing your spending pacing, habits, and financial resilience.",
      href: "/ai-assistant?q=Give+me+a+complete+coaching+assessment+of+my+current+financial+habits",
      icon: Compass,
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "purchase-sim",
      name: "AI Purchase Simulator",
      category: "Decision Support",
      desc: "Simulate purchase affordability with surplus impact, goal delay, and risk evaluations.",
      href: "/ai-decision",
      icon: Scale,
      color: "from-emerald-500 to-cyan-500",
    },
    {
      id: "what-if",
      name: "AI What-If Simulator",
      category: "Scenario Modeling",
      desc: "Model potential income fluctuations, extra spending, or savings boosts side-by-side.",
      href: "/what-if",
      icon: Sparkles,
      color: "from-violet-500 to-purple-500",
    },
    {
      id: "spending-detective",
      name: "AI Spending Detective",
      category: "Anomaly Detection",
      desc: "Uncovers statistical outliers, duplicate charges, and unexpected price surges with explainable proofs.",
      href: "/anomalies",
      icon: AlertTriangle,
      color: "from-rose-500 to-amber-500",
    },
    {
      id: "budget-builder",
      name: "AI Budget Builder",
      category: "Optimization",
      desc: "Auto-constructs a 50/30/20 operational flight budget from your last 90 days of categorized spending.",
      href: "/budgets",
      icon: PieChart,
      color: "from-amber-500 to-emerald-500",
    },
    {
      id: "sub-detective",
      name: "AI Subscription Detective",
      category: "Recurring Outflow",
      desc: "Audits monthly subscriptions, detects stealth price increases, and models annual cumulative drain.",
      href: "/subscriptions",
      icon: Repeat,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "cash-flow",
      name: "AI Cash-Flow Predictor",
      category: "Liquidity Trajectory",
      desc: "Forecasts account balances 30, 60, and 90 days ahead to prevent overdrafts and liquidity dips.",
      href: "/cash-flow",
      icon: Waves,
      color: "from-teal-500 to-emerald-500",
    },
    {
      id: "goal-planner",
      name: "AI Goal Planner",
      category: "Milestone Pacing",
      desc: "Calculates realistic contribution pacing for Emergency Funds, hardware upgrades, and expeditions.",
      href: "/goals",
      icon: Target,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "monthly-review",
      name: "AI Monthly Reviewer",
      category: "Retrospective",
      desc: "Synthesizes monthly inflows, outflows, and net delta comparisons against prior months.",
      href: "/reports",
      icon: FileText,
      color: "from-indigo-500 to-cyan-500",
    },
    {
      id: "flight-status",
      name: "AI Flight Status Evaluator",
      category: "Health Score",
      desc: "Computes 7-dimensional FinPilot Financial Flight Status (0-100) with prioritized action recommendations.",
      href: "/financial-health",
      icon: Bot,
      color: "from-cyan-400 to-emerald-400",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Grid className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FinPilot AI Specialists Suite</h1>
            <p className="text-xs text-slate-400">
              10 dedicated AI co-pilots configured for specialized personal finance workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {specialists.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.id}
              href={s.href}
              className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${s.color} text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {s.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Launch Specialist</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
