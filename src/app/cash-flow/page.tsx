"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Waves,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Bot,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function CashFlowPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<"30" | "60" | "90">("30");

  const cashFlowForecast = [
    { date: "Mar 20 (Today)", balance: 509100, delta: 0, event: "Current Verified Balance" },
    { date: "Mar 23", balance: 507601, delta: -1499, event: "Cult.fit Subscription" },
    { date: "Mar 24", balance: 506422, delta: -1179, event: "Airtel Broadband" },
    { date: "Mar 25", balance: 500332, delta: -6090, event: "Tata Power & AWS Cloud" },
    { date: "Mar 26", balance: 498333, delta: -1999, event: "OpenAI ChatGPT Plus" },
    { date: "Mar 27", balance: 498154, delta: -179, event: "Spotify Family" },
    { date: "Mar 28", balance: 497505, delta: -649, event: "Netflix Ultra HD" },
    { date: "Apr 01", balance: 587505, delta: 90000, event: "Salary (+₹125k) - Rent (-₹35k)" },
    { date: "Apr 10", balance: 607505, delta: 20000, event: "Consulting Retainer (+₹20k)" },
    { date: "Apr 15", balance: 592505, delta: -15000, event: "Mid-month groceries & living burn" },
    { date: "Apr 30", balance: 577305, delta: -15200, event: "Discretionary lifestyle & utilities" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Cash Flow Trajectory Forecast</h1>
              <p className="text-xs text-slate-400">
                Predictive balance modeling combining scheduled bills, recurring subscriptions, and income velocity.
              </p>
            </div>
          </div>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1 text-xs">
          {[
            { id: "30", label: "30 Days" },
            { id: "60", label: "60 Days" },
            { id: "90", label: "90 Days" },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHorizon(h.id as any)}
              className={`rounded-lg px-3 py-1 font-semibold transition-all ${
                selectedHorizon === h.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Cash Flow Diagnostic Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-navy-950/80 p-6 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
          <Bot className="h-4 w-4" />
          <span>FinPilot Diagnostic: Why might my balance fall before the end of the month?</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Between March 23 and March 28, your accounts will process <strong>6 recurring subscriptions and utility bills totaling ₹11,595</strong>. However, your liquid reserve of ₹5,09,100 ensures your balance never dips below ₹497,500. On April 1, your incoming salary (+₹125,000) minus rent (-₹35,000) will restore your cash position to <strong>₹587,505 (+15.4% surge)</strong>.
        </p>
      </div>

      {/* Forecast Chart */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white">Projected Account Liquidity Trajectory</h2>
            <p className="text-[11px] text-slate-400">Chronological balance progression after scheduled events</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Zero Overdraft Risk Detected</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowForecast} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
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
                dataKey="balance"
                stroke="#06B6D4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#flowGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Timeline Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-sm font-bold text-white">Upcoming Inflow / Outflow Schedule</h2>
        </div>
        <div className="divide-y divide-white/[0.04] text-xs">
          {cashFlowForecast.map((item, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400 text-[11px] w-28 shrink-0">{item.date}</span>
                <span className="text-white font-medium">{item.event}</span>
              </div>
              <div className="flex items-center gap-6 text-right">
                <span
                  className={`font-semibold font-mono ${
                    item.delta > 0 ? "text-emerald-400" : item.delta < 0 ? "text-rose-400" : "text-slate-400"
                  }`}
                >
                  {item.delta > 0 ? "+" : ""}{item.delta === 0 ? "—" : formatCurrency(item.delta)}
                </span>
                <span className="font-extrabold text-white w-24">{formatCurrency(item.balance)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
