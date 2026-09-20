"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  AlertTriangle,
  Sparkles,
  Bookmark,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function InsightsPage() {
  const [filterPeriod, setFilterPeriod] = useState<"ALL" | "TODAY" | "THIS_WEEK" | "THIS_MONTH">("ALL");

  const [insights, setInsights] = useState<any[]>([
    {
      id: "1",
      title: "Discretionary Tech Spending Spike",
      explanation:
        "Your Cloud & Tech expenses exceeded the allocated monthly flight budget by ₹3,400 (+22.6%) due to the Croma purchase. Reducing discretionary gadget spend will restore balance.",
      type: "BUDGET_WARNING",
      severity: "WARNING",
      dataBasis: "Croma Electronics transaction (₹18,400) on March 12",
      actionLabel: "View Tech Budget",
      actionUrl: "/budgets",
      period: "THIS_MONTH",
      isSaved: false,
    },
    {
      id: "2",
      title: "Subscription Price Increase Detected",
      explanation:
        "OpenAI ChatGPT Plus renewed at ₹1,999 vs historical ₹1,650 (+21.1% currency fluctuation). Review recurring services to eliminate unused licenses.",
      type: "SUBSCRIPTION_ALERT",
      severity: "INFO",
      dataBasis: "Comparison of last 2 billing cycles for OpenAI",
      actionLabel: "Audit Subscriptions",
      actionUrl: "/subscriptions",
      period: "THIS_WEEK",
      isSaved: false,
    },
    {
      id: "3",
      title: "High Liquidity Surplus Opportunity",
      explanation:
        "Maintaining a 47% savings rate this month allows you to allocate an extra ₹15,000 toward reaching your Emergency Runway goal 45 days early.",
      type: "SAVINGS_OPPORTUNITY",
      severity: "SUCCESS",
      dataBasis: "Monthly net surplus of ₹68,160 across active accounts",
      actionLabel: "Accelerate Goal",
      actionUrl: "/goals",
      period: "TODAY",
      isSaved: false,
    },
  ]);

  const handleDismiss = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleSave = (id: string) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isSaved: !i.isSaved } : i))
    );
  };

  const filtered = insights.filter(
    (i) => filterPeriod === "ALL" || i.period === filterPeriod
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Flight Insights Feed</h1>
              <p className="text-xs text-slate-400">
                Actionable intelligence derived continuously from your transaction stream.
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 text-xs">
          {[
            { id: "ALL", label: "All Insights" },
            { id: "TODAY", label: "Today" },
            { id: "THIS_WEEK", label: "This Week" },
            { id: "THIS_MONTH", label: "This Month" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPeriod(p.id as any)}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                filterPeriod === p.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${
                    item.severity === "WARNING"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : item.severity === "SUCCESS"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{item.period}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleSave(item.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    item.isSaved
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                  title={item.isSaved ? "Saved" : "Save insight"}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Dismiss insight"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                {item.explanation}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-[11px] text-slate-400 font-mono">
                Data Proof: {item.dataBasis}
              </div>

              {item.actionUrl && (
                <Link
                  href={item.actionUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
                >
                  <span>{item.actionLabel || "Take Action"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
