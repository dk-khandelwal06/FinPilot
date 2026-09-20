"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  TrendingUp,
  Briefcase,
  Laptop,
  Plus,
  RefreshCw,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function IncomePage() {
  const [incomes, setIncomes] = useState<any[]>([
    {
      id: "1",
      source: "TechCorp Global Primary Salary",
      amount: 125000,
      frequency: "Monthly",
      category: "Salary",
      isRecurring: true,
      date: "2026-03-01",
    },
    {
      id: "2",
      source: "AI Architecture Consulting Retainer",
      amount: 20000,
      frequency: "Monthly",
      category: "Freelance",
      isRecurring: true,
      date: "2026-03-10",
    },
  ]);

  const totalMonthlyIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Inflow & Income Streams</h1>
              <p className="text-xs text-slate-400">
                Track primary salary deposits, freelance retainers, and recurring income velocity.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400">Total Monthly Inflow</span>
          <p className="text-xl font-black text-emerald-400">{formatCurrency(totalMonthlyIncome)}/mo</p>
        </div>
      </div>

      {/* Income Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {incomes.map((inc) => (
          <div
            key={inc.id}
            className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <Briefcase className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{inc.source}</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {inc.frequency} • {inc.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400">Inflow Amount</span>
                <p className="text-xl font-extrabold text-white">{formatCurrency(inc.amount)}</p>
              </div>
              <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-400">
                Recurring Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
