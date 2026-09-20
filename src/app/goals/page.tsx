"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Target,
  Sparkles,
  Shield,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  DollarSign,
  X,
} from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newCurrent, setNewCurrent] = useState("");
  const [newMonthly, setNewMonthly] = useState("");
  const [newCategory, setNewCategory] = useState("Savings");

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/goals");
      const data = await res.json();
      setGoals(data.goals || []);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddContribution = async (goalId: string, amount: number) => {
    try {
      await fetch("/api/finance/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: goalId, contributionAmount: amount }),
      });
      fetchGoals();
    } catch {
      //
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;

    try {
      const res = await fetch("/api/finance/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          targetAmount: parseFloat(newTarget),
          currentAmount: parseFloat(newCurrent || "0"),
          monthlyContribution: parseFloat(newMonthly || "5000"),
          category: newCategory,
        }),
      });

      if (res.ok) {
        setShowAddGoal(false);
        setNewTitle("");
        setNewTarget("");
        setNewCurrent("");
        setNewMonthly("");
        fetchGoals();
      }
    } catch {
      //
    }
  };

  // Emergency runway calculation
  const emergencyGoal = goals.find((g) => g.title.toLowerCase().includes("emergency")) || goals[0];
  const monthsCoverage = emergencyGoal ? (emergencyGoal.currentAmount / 35000).toFixed(1) : "6.0";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Financial Flight Goals & Runway</h1>
              <p className="text-xs text-slate-400">
                Track personal milestone pacing, emergency fund resilience, and projected target dates.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Flight Milestone</span>
        </button>
      </div>

      {/* Emergency Fund Runway Spotlight Card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900/90 to-navy-950/80 p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase font-mono">
                Emergency Runway Planner
              </span>
              <span className="text-xs text-slate-400">Fixed Cost Baseline</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">6-Month Emergency Runway Cushion</h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Based on monthly fixed obligations of approx ₹35,000, your current liquid buffer of {formatCurrency(emergencyGoal?.currentAmount || 210000)} provides approx <strong>{monthsCoverage} months of complete survival runway</strong>.
            </p>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 shrink-0">
          <p className="text-[11px] font-mono text-slate-400">Runway Status</p>
          <p className="text-2xl font-black text-emerald-400">{monthsCoverage} Months</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Target: 6.0 Months</p>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                  {goal.category}
                </span>
                <span className="text-xs font-bold text-cyan-400 font-mono">
                  {goal.progressPercentage}%
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{goal.title}</h3>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Funded:</span>
                  <span className="font-bold text-white">{formatCurrency(goal.currentAmount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Target Goal:</span>
                  <span className="font-bold text-slate-300">{formatCurrency(goal.targetAmount)}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${goal.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Monthly Contribution:</span>
                  <span className="text-white font-semibold">{formatCurrency(goal.monthlyContribution)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Date:</span>
                  <span className="text-cyan-300 font-mono">
                    {new Date(goal.targetDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Completion:</span>
                  <span className="text-emerald-400 font-mono">
                    {goal.monthsToCompletion} months left
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contribution Button */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Allocate from Surplus</span>
              <button
                onClick={() => handleAddContribution(goal.id, 5000)}
                className="flex items-center gap-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+₹5,000</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE GOAL MODAL */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B132B] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Create New Flight Goal</h3>
              <button
                onClick={() => setShowAddGoal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Goal Milestone Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Electric Vehicle Down Payment"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="150000"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Current Saved So Far (₹)</label>
                <input
                  type="number"
                  value={newCurrent}
                  onChange={(e) => setNewCurrent(e.target.value)}
                  placeholder="25000"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Planned Monthly Contribution (₹)</label>
                <input
                  type="number"
                  value={newMonthly}
                  onChange={(e) => setNewMonthly(e.target.value)}
                  placeholder="10000"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
