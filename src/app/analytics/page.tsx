"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");

  const monthlyTrendData = [
    { month: "Nov 2025", income: 145000, expenses: 72000, savings: 73000 },
    { month: "Dec 2025", income: 155000, expenses: 84000, savings: 71000 },
    { month: "Jan 2026", income: 145000, expenses: 69000, savings: 76000 },
    { month: "Feb 2026", income: 145000, expenses: 74000, savings: 71000 },
    { month: "Mar 2026", income: 145000, expenses: 76840, savings: 68160 },
  ];

  const topMerchants = [
    { name: "Apartment Rent", amount: 35000, count: 1, cat: "Housing" },
    { name: "Croma Electronics", amount: 18400, count: 1, cat: "Cloud & Tech" },
    { name: "The Table Colaba", amount: 8400, count: 2, cat: "Food & Dining" },
    { name: "Blinkit Groceries", amount: 7350, count: 4, cat: "Groceries" },
    { name: "Uber Rides", amount: 4700, count: 6, cat: "Travel & Commute" },
    { name: "Amazon Web Services", amount: 3250, count: 1, cat: "Cloud & Tech" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Advanced Spending Analytics</h1>
              <p className="text-xs text-slate-400">
                Multi-dimensional insights: Month-over-Month burn rates, top merchants, and savings pacing.
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 text-xs">
          {["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                period === p
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Income vs Expenses Bar Chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Inflow vs Outflow Velocity (MoM)</h2>
            <p className="text-[11px] text-slate-400">5-month trajectory of monthly revenue, burn, and net surplus</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Average Savings Rate: 49.2%</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
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
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`]}
              />
              <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#06B6D4" name="Net Surplus" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Merchants Breakdown */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
        <h2 className="text-sm font-bold text-white mb-4">Highest Volume Merchants (Current Cycle)</h2>
        <div className="divide-y divide-white/[0.04] text-xs">
          {topMerchants.map((m, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">{m.name}</span>
                <p className="text-[10px] text-slate-400">
                  {m.cat} • {m.count} transaction{m.count > 1 ? "s" : ""}
                </p>
              </div>
              <p className="font-extrabold text-white">{formatCurrency(m.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
