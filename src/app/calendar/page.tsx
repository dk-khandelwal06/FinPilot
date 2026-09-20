"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Repeat,
  TrendingUp,
  Target,
} from "lucide-react";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("March 2026");

  const calendarEvents = [
    { day: 1, type: "INCOME", title: "TechCorp Salary Deposit", amount: 125000, category: "Salary" },
    { day: 1, type: "BILL", title: "Apartment Rent", amount: 35000, category: "Housing" },
    { day: 10, type: "INCOME", title: "AI Consulting Retainer", amount: 20000, category: "Freelance" },
    { day: 12, type: "EXPENSE", title: "Croma Tech Gear", amount: 18400, category: "Cloud & Tech" },
    { day: 23, type: "SUB", title: "Cult.fit Elite Fitness", amount: 1499, category: "Health" },
    { day: 24, type: "BILL", title: "Airtel Xstream Fiber", amount: 1179, category: "Utilities" },
    { day: 25, type: "BILL", title: "Tata Power Electricity", amount: 2840, category: "Utilities" },
    { day: 25, type: "SUB", title: "Amazon Web Services (AWS)", amount: 3250, category: "Cloud" },
    { day: 26, type: "SUB", title: "ChatGPT Plus & Team AI", amount: 1999, category: "AI Tech" },
    { day: 27, type: "SUB", title: "Spotify Family Audio", amount: 179, category: "Media" },
    { day: 28, type: "SUB", title: "Netflix Premium Ultra HD", amount: 649, category: "Media" },
    { day: 31, type: "GOAL", title: "Emergency Runway Monthly Allocation", amount: 20000, category: "Savings" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Financial Calendar Timeline</h1>
              <p className="text-xs text-slate-400">
                Synchronized schedule of recurring bills, subscription renewals, salary deposits, and goal milestones.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white font-mono">{currentMonth}</span>
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white mb-2">March 2026 Scheduled Events</h2>

        <div className="divide-y divide-white/[0.04]">
          {calendarEvents.map((evt, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-2 rounded-lg transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 font-mono text-cyan-400 font-bold">
                  {evt.day}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{evt.title}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        evt.type === "INCOME"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : evt.type === "BILL"
                          ? "bg-amber-500/10 text-amber-400"
                          : evt.type === "SUB"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-violet-500/10 text-violet-400"
                      }`}
                    >
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{evt.category}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${
                    evt.type === "INCOME" ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {evt.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(evt.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
