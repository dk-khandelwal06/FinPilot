"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Sliders,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { WhatIfSimulationResult } from "@/types";

export default function WhatIfSimulatorPage() {
  const [scenarioType, setScenarioType] = useState<
    "EXTRA_EXPENSE" | "INCOME_DROP" | "SAVINGS_INCREASE" | "CANCEL_SUBSCRIPTIONS"
  >("EXTRA_EXPENSE");
  const [amount, setAmount] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhatIfSimulationResult | null>(null);

  const runSim = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/what-if", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioType, amount }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, [scenarioType, amount]);

  useEffect(() => {
    runSim();
  }, [runSim]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">What-If Scenario Simulator</h1>
            <p className="text-xs text-slate-400">
              Interactive financial flight simulator: model potential changes to test durability before committing.
            </p>
          </div>
        </div>
      </div>

      {/* Scenario Control Panel */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Simulation Vector
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { type: "EXTRA_EXPENSE", label: "Extra Spending", desc: "Test discretionary shock" },
              { type: "INCOME_DROP", label: "Income Reduction", desc: "Test market downturn" },
              { type: "SAVINGS_INCREASE", label: "Boost Monthly Savings", desc: "Accelerate milestones" },
              { type: "CANCEL_SUBSCRIPTIONS", label: "Trim Subscriptions", desc: "Reclaim lost cash flow" },
            ].map((s) => (
              <button
                key={s.type}
                type="button"
                onClick={() => setScenarioType(s.type as any)}
                className={`rounded-xl border p-3.5 text-left transition-all ${
                  scenarioType === s.type
                    ? "border-cyan-400 bg-cyan-500/20 text-white shadow-md shadow-cyan-500/10"
                    : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <p className="text-xs font-bold">{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Simulated Monthly Delta</span>
            <span className="text-base font-extrabold text-cyan-300 font-mono">
              {formatCurrency(amount)} / month
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>₹1,000/mo</span>
            <span>₹25,000/mo</span>
            <span>₹50,000/mo</span>
          </div>
        </div>
      </div>

      {/* Before vs Scenario Side-by-Side Comparison */}
      {result && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Baseline Card */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                    Current Baseline
                  </span>
                  <h3 className="text-base font-bold text-white">Present Flight Path</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">No Changes</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Monthly Inflow:</span>
                  <span className="font-semibold text-white">{formatCurrency(result.baseline.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Monthly Outflow:</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(result.baseline.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Net Monthly Surplus:</span>
                  <span className="font-extrabold text-emerald-400">{formatCurrency(result.baseline.monthlySurplus)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Savings Rate:</span>
                  <span className="font-semibold text-cyan-300">{result.baseline.savingsRate}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">12-Month Projected Net:</span>
                  <span className="font-extrabold text-white">{formatCurrency(result.baseline.projectedYearEndBalance)}</span>
                </div>
              </div>
            </div>

            {/* Simulated Scenario Card */}
            <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-900/90 to-navy-950/90 p-6 backdrop-blur-xl shadow-xl shadow-cyan-500/5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
                    Simulated Flight
                  </span>
                  <h3 className="text-base font-bold text-white">{result.scenarioName}</h3>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    result.deltas.surplusChange >= 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {result.deltas.surplusChange >= 0 ? "+" : ""}
                  {formatCurrency(result.deltas.surplusChange)}/mo
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Monthly Inflow:</span>
                  <span className="font-semibold text-white">{formatCurrency(result.simulated.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Monthly Outflow:</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(result.simulated.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Net Monthly Surplus:</span>
                  <span
                    className={`font-extrabold ${
                      result.simulated.monthlySurplus >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatCurrency(result.simulated.monthlySurplus)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Savings Rate:</span>
                  <span className="font-semibold text-cyan-300">{result.simulated.savingsRate}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">12-Month Projected Net:</span>
                  <span className="font-extrabold text-white">{formatCurrency(result.simulated.projectedYearEndBalance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Key Observations & Adjustments */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>FinPilot Predictive Assessment</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              {result.keyObservations.map((obs, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{obs}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[11px] font-semibold text-slate-400 mb-2">Recommended Flight Plan Actions:</p>
              <div className="space-y-1 text-xs text-slate-300">
                {result.recommendedAdjustments.map((adj, i) => (
                  <p key={i} className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>{adj}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
