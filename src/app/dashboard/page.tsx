"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PieChart as PieChartIcon,
  Bot,
  Scale,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Receipt,
  Repeat,
  Target,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/overview");
      if (!res.ok) throw new Error("Failed to fetch overview");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load financial cockpit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-xs text-slate-400 font-mono">Calibrating Financial Cockpit...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 max-w-md mx-auto">
          <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">Cockpit Link Unavailable</p>
          <p className="text-xs text-rose-300 mt-1">{error || "Unable to reach database"}</p>
          <button
            onClick={loadData}
            className="mt-4 rounded-lg bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { metrics, accounts, categoryBreakdown, recentTransactions, subscriptions, bills, goals, insights, trajectory } = data;

  const COLORS = ["#10B981", "#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#14B8A6"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Cockpit Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white font-display">
              Financial Cockpit
            </h1>
            <span className="rounded-md bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn scattered financial data into clear, explainable, and actionable insights.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/ai-assistant"
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-sm"
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ask Co-Pilot</span>
          </Link>

          <Link
            href="/ai-decision"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-all shadow-sm"
          >
            <Scale className="h-3.5 w-3.5 text-emerald-400" />
            <span>Can I Afford This?</span>
          </Link>

          <Link
            href="/what-if"
            className="flex items-center gap-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 px-3.5 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/25 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span>What-If Simulator</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Net Liquidity */}
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Net Liquidity</span>
            <Wallet className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-white tracking-tight">
            {formatCurrency(metrics.totalBalance)}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            <span>Across 4 accounts</span>
          </p>
        </div>

        {/* Monthly Inflow */}
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Monthly Inflow</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-emerald-400 tracking-tight">
            {formatCurrency(metrics.totalIncome)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Salary + Retainers</p>
        </div>

        {/* Monthly Outflow */}
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Monthly Outflow</span>
            <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-rose-400 tracking-tight">
            {formatCurrency(metrics.totalExpenses)}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {Math.round((metrics.totalExpenses / metrics.totalIncome) * 100)}% burn rate
          </p>
        </div>

        {/* Monthly Surplus */}
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Net Monthly Surplus</span>
            <PiggyBank className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-white tracking-tight">
            {formatCurrency(metrics.totalSavings)}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">
            {metrics.savingsRate}% Savings Velocity
          </p>
        </div>

        {/* Remaining Budget */}
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Remaining Budget</span>
            <PieChartIcon className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-cyan-300 tracking-tight">
            {formatCurrency(metrics.remainingBudget)}
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${metrics.budgetUtilization > 100 ? "bg-rose-500" : "bg-cyan-400"}`}
              style={{ width: `${Math.min(100, metrics.budgetUtilization)}%` }}
            />
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="glass-card p-4 rounded-xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Subscriptions</span>
            <Repeat className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-amber-300 tracking-tight">
            {formatCurrency(metrics.monthlySubscriptionCost)}/mo
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {metrics.activeSubscriptionsCount} active services
          </p>
        </div>
      </div>

      {/* 3. AI FLIGHT INSIGHT BANNER */}
      {insights && insights.length > 0 && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-navy-950/80 p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  FinPilot Daily Flight Insight
                </span>
                <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-slate-300">
                  {insights[0].period}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white mt-0.5">{insights[0].title}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {insights[0].explanation}
              </p>
              {insights[0].dataBasis && (
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Grounding proof: {insights[0].dataBasis}
                </p>
              )}
            </div>
          </div>

          {insights[0].actionUrl && (
            <Link
              href={insights[0].actionUrl}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-sm"
            >
              <span>{insights[0].actionLabel || "Investigate"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* 4. CHARTS SECTION: Cash Flow Forecaster & Category Donut */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cash Flow Forecaster Area Chart (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Cash Flow Trajectory & 30-Day Forecast</span>
                <span className="rounded bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 font-mono border border-emerald-500/20">
                  AI Projected
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Shows liquidity balance including upcoming salary and bill deductions
              </p>
            </div>
            <Link
              href="/cash-flow"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              Detailed Projection <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="projectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1224",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "Balance"]}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#actualGrad)"
                  name="Historical Balance"
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#projectedGrad)"
                  name="Projected Flight"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown Donut (1 Col) */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/60 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-white">Expense Distribution</h2>
              <p className="text-[11px] text-slate-400">By category allocation this month</p>
            </div>
            <Link href="/expenses" className="text-xs text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {categoryBreakdown.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1224",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.75rem",
                    fontSize: "0.75rem",
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, "Spent"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-3 border-t border-white/10">
            {categoryBreakdown.slice(0, 4).map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: c.color || COLORS[i % COLORS.length] }}
                />
                <span className="truncate text-slate-300">{c.name}:</span>
                <span className="font-semibold text-white ml-auto">
                  ₹{Math.round(c.amount / 1000)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT TRANSACTIONS & UPCOMING OBLIGATIONS */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions (2 Cols) */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Transactions Ledger</h2>
              <p className="text-[11px] text-slate-400">Real-time inflows, outflows, and anomaly detections</p>
            </div>
            <Link
              href="/transactions"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              Full Ledger <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04] overflow-hidden">
            {recentTransactions.slice(0, 6).map((tx: any) => (
              <div
                key={tx.id}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      tx.type === "Income"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : tx.isAnomaly
                        ? "bg-rose-500/15 text-rose-400"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {tx.type === "Income" ? "+" : "-"}
                  </span>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white truncate">{tx.merchant}</p>
                      {tx.isAnomaly && (
                        <span className="rounded bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 text-[9px] font-bold text-rose-400 uppercase">
                          Anomaly Flag
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {tx.category} • {new Date(tx.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} • {tx.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-bold ${
                      tx.type === "Income" ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {tx.type === "Income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bills & Goals (1 Col) */}
        <div className="space-y-6">
          {/* Upcoming Bills Card */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/60">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Receipt className="h-4 w-4 text-cyan-400" />
                <span>Upcoming Obligations</span>
              </h2>
              <Link href="/bills" className="text-xs text-cyan-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {bills.slice(0, 3).map((bill: any) => (
                <div
                  key={bill.id}
                  className="p-2.5 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">{bill.title}</p>
                    <p className="text-[10px] text-slate-400">
                      Due {new Date(bill.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} • {bill.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹{bill.amount.toLocaleString()}</p>
                    {bill.autoPay && (
                      <span className="text-[9px] text-emerald-400 font-mono">AutoPay ON</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Pacing Card */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/60">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Financial Flight Goals</span>
              </h2>
              <Link href="/goals" className="text-xs text-cyan-400 hover:underline">
                Milestones
              </Link>
            </div>

            <div className="space-y-3">
              {goals.slice(0, 2).map((goal: any) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{goal.title}</span>
                    <span className="text-cyan-400 font-bold">{goal.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹{goal.currentAmount.toLocaleString()} funded</span>
                    <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
