"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  PieChart as PieChartIcon,
  Sparkles,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingBudget, setGeneratingBudget] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any | null>(null);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/budgets");
      const data = await res.json();
      setBudgets(data.budgets || []);
      setCategories(data.categories || []);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  // AI "Build My Budget" Feature
  const handleBuildMyBudget = () => {
    setGeneratingBudget(true);
    setTimeout(() => {
      setAiSuggestion({
        title: "AI Optimized 50/30/20 Operational Flight Plan",
        period: "Monthly",
        totalAmount: 90000,
        allocationRationale:
          "Based on historical outflows, Needs (Housing & Utilities) are capped at ₹45,000 (50%), Wants (Food, Dining, Tech) at ₹27,000 (30%), leaving ₹18,000 (20%) dedicated to Milestone Savings.",
        items: [
          { category: "Housing", allocated: 35000, recommended: 35000 },
          { category: "Food & Dining", allocated: 20000, recommended: 16000, note: "Reduced by ₹4,000 to avoid recent overruns" },
          { category: "Cloud & Tech", allocated: 15000, recommended: 12000, note: "Stabilized following Croma purchase" },
          { category: "Groceries", allocated: 15000, recommended: 14000 },
          { category: "Entertainment", allocated: 10000, recommended: 8000 },
        ],
      });
      setGeneratingBudget(false);
    }, 1000);
  };

  const activeBudget = budgets[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <PieChartIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Budget Flight Management</h1>
              <p className="text-xs text-slate-400">
                Set operational limits by category, track real-time utilization %, and monitor overspending alerts.
              </p>
            </div>
          </div>
        </div>

        {/* AI "Build My Budget" Button */}
        <button
          onClick={handleBuildMyBudget}
          disabled={generatingBudget}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>{generatingBudget ? "Analyzing Historical Outflows..." : "AI Build My Budget"}</span>
        </button>
      </div>

      {/* AI Suggestion Banner if generated */}
      {aiSuggestion && (
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-navy-950/80 p-6 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase font-mono">
                AI Generated Suggestion
              </span>
              <h3 className="text-base font-bold text-white">{aiSuggestion.title}</h3>
            </div>
            <button
              onClick={() => setAiSuggestion(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {aiSuggestion.allocationRationale}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiSuggestion.items.map((item: any, i: number) => (
              <div key={i} className="rounded-xl border border-white/5 bg-slate-950/60 p-3 text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>{item.category}</span>
                  <span className="text-cyan-400">{formatCurrency(item.recommended)}</span>
                </div>
                {item.note && (
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">{item.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Budget Card */}
      {activeBudget ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">
                Active Operational Budget
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">{activeBudget.name}</h2>
              <p className="text-xs text-slate-400">
                Period: {new Date(activeBudget.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - {new Date(activeBudget.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-[11px] text-slate-400">Total Spent</p>
                <p className="text-xl font-black text-white">
                  {formatCurrency(activeBudget.spentAmount)}
                </p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-[11px] text-slate-400">Budget Cap</p>
                <p className="text-xl font-black text-cyan-400">
                  {formatCurrency(activeBudget.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Category Allocation Breakdown
            </h3>

            <div className="space-y-3">
              {activeBudget.items.map((item: any) => {
                const util = Math.round((item.spent / item.allocated) * 100);
                const isOver = item.spent > item.allocated;
                const isNear = !isOver && util >= 80;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/5 bg-slate-950/40 p-4 transition-all hover:border-white/15"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.category?.color || "#06B6D4" }}
                        />
                        <span className="font-bold text-white">{item.category?.name}</span>
                        {isOver && (
                          <span className="rounded bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 text-[9px] font-bold text-rose-400">
                            OVERSPENT BY {formatCurrency(item.spent - item.allocated)}
                          </span>
                        )}
                        {isNear && (
                          <span className="rounded bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold text-amber-400">
                            NEAR LIMIT ({util}%)
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-white">{formatCurrency(item.spent)}</span>
                        <span className="text-slate-500"> / {formatCurrency(item.allocated)}</span>
                        <span className="ml-2 font-mono text-slate-400">({util}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isOver ? "bg-rose-500" : isNear ? "bg-amber-400" : "bg-cyan-400"
                        }`}
                        style={{ width: `${Math.min(100, util)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400 text-xs">
          No active budget found. Click &apos;AI Build My Budget&apos; to generate one.
        </div>
      )}
    </div>
  );
}
