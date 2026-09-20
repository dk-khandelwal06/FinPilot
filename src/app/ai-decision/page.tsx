"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Target,
  ArrowRight,
  TrendingDown,
  Info,
  ShieldCheck,
} from "lucide-react";
import { AffordabilityAnalysis } from "@/types";

export default function AffordabilityDecisionPage() {
  const [amount, setAmount] = useState("25000");
  const [item, setItem] = useState("Sony WH-1000XM5 Headphones");
  const [category, setCategory] = useState("Shopping");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AffordabilityAnalysis | null>(null);

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/affordability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          item,
          category,
        }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              &quot;Can I Afford This?&quot; Decision Engine
            </h1>
            <p className="text-xs text-slate-400">
              Objective pre-purchase consequence simulator grounded in your real balances, budget, and goals.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
        <form onSubmit={handleEvaluate} className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Purchase Item / Description
            </label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="e.g. Ergonomic Standing Desk"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Price / Cost (₹ INR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25000"
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Shopping">Shopping & Lifestyle</option>
              <option value="Cloud & Tech">Tech Gear & Electronics</option>
              <option value="Travel & Commute">Travel & Vacations</option>
              <option value="Food & Dining">Dining & Outings</option>
              <option value="Entertainment">Entertainment & Hobbies</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? "Analyzing Financial Flight Plan..." : "Simulate Purchase Impact"}</span>
            </button>
          </div>
        </form>

        {/* Quick presets */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Quick Tests:</span>
          {[
            { label: "₹4,500 Dinner", amt: "4500", name: "Gourmet Weekend Dinner", cat: "Food & Dining" },
            { label: "₹25,000 Headphones", amt: "25000", name: "Sony XM5 Headphones", cat: "Shopping" },
            { label: "₹85,000 M3 Monitor", amt: "85000", name: "Apple Studio Display", cat: "Cloud & Tech" },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setAmount(preset.amt);
                setItem(preset.name);
                setCategory(preset.cat);
              }}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all text-[11px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Output Result */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Status Verdict Header */}
          <div
            className={`rounded-2xl border p-6 backdrop-blur-xl ${
              analysis.canAfford === "YES_COMFORTABLE"
                ? "border-emerald-500/30 bg-emerald-950/20"
                : analysis.canAfford === "FEASIBLE_WITH_ADJUSTMENTS"
                ? "border-amber-500/30 bg-amber-950/20"
                : "border-rose-500/30 bg-rose-950/20"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold shadow-lg ${
                    analysis.canAfford === "YES_COMFORTABLE"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : analysis.canAfford === "FEASIBLE_WITH_ADJUSTMENTS"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {analysis.canAfford === "YES_COMFORTABLE" ? "✓" : analysis.canAfford === "FEASIBLE_WITH_ADJUSTMENTS" ? "!" : "✕"}
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Decision Assessment
                  </span>
                  <h2 className="text-lg font-extrabold text-white">
                    {analysis.canAfford === "YES_COMFORTABLE"
                      ? "Comfortably Feasible Within Liquidity"
                      : analysis.canAfford === "FEASIBLE_WITH_ADJUSTMENTS"
                      ? "Feasible With Category Rebalancing"
                      : "Significant Risk to Monthly Cash Flow"}
                  </h2>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                <p className="text-[11px] text-slate-400">Projected Monthly Surplus</p>
                <p
                  className={`text-xl font-black ${
                    analysis.projectedMonthlySurplus >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatCurrency(analysis.projectedMonthlySurplus)}
                </p>
                <p className="text-[10px] text-slate-400">
                  down from {formatCurrency(analysis.currentMonthlySurplus)}
                </p>
              </div>
            </div>

            {/* Impact Summary statement */}
            <div className="mt-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <p>{analysis.impactSummary}</p>
            </div>
          </div>

          {/* 3 Impact Dimension Breakdown Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* 1. Category Budget Impact */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs mb-3">
                <TrendingDown className="h-4 w-4 text-cyan-400" />
                <span>Budget Impact ({analysis.budgetImpact.category})</span>
              </div>
              <p className="text-xs text-slate-400">
                Current spent: <strong className="text-white">{formatCurrency(analysis.budgetImpact.currentSpent)}</strong> / {formatCurrency(analysis.budgetImpact.currentAllocated)}
              </p>
              <div className="mt-2 text-xs">
                {analysis.budgetImpact.willExceed ? (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Exceeds budget by {formatCurrency(analysis.budgetImpact.overageAmount)}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    Within allocated budget limits
                  </span>
                )}
              </div>
            </div>

            {/* 2. Goal Delay Impact */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs mb-3">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Goal Pacing Impact</span>
              </div>
              <p className="text-xs font-medium text-white">{analysis.goalImpact.affectedGoalName}</p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {analysis.goalImpact.message}
              </p>
            </div>

            {/* 3. Cash Flow Trajectory */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
              <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs mb-3">
                <Calendar className="h-4 w-4 text-violet-400" />
                <span>Lowest Projected Balance</span>
              </div>
              <p className="text-lg font-extrabold text-white">
                {formatCurrency(analysis.cashFlowImpact.lowestProjectedBalance)}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {analysis.cashFlowImpact.lowBalanceWarning ? (
                  <span className="text-amber-400">⚠️ Approaches minimum buffer limit</span>
                ) : (
                  <span className="text-emerald-400">✓ Comfortable reserve buffer intact</span>
                )}
              </p>
            </div>
          </div>

          {/* Alternative Strategy Recommendations */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-cyan-400" />
              <span>Smart Strategic Alternatives & Mitigations</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {analysis.alternativeOptions.map((opt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{opt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-[10px] text-slate-400 font-mono">
                Explainable Calculation: {analysis.calculationsExplanation.join(" → ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
