"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  FileText,
  Download,
  Bot,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("MONTHLY");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (format: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`FinPilot ${reportType} Report successfully compiled in ${format.toUpperCase()} format!`);
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Financial Reports & Audits</h1>
              <p className="text-xs text-slate-400">
                Automated monthly syntheses, tax preparation exports, and AI retrospective observations.
              </p>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload("csv")}
            disabled={downloading}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Type Switcher */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["MONTHLY", "ANNUAL", "TAX PREP", "SUBSCRIPTION AUDIT", "CASH FLOW"].map((t) => (
          <button
            key={t}
            onClick={() => setReportType(t)}
            className={`rounded-xl px-4 py-2 font-semibold transition-all ${
              reportType === t
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-cyan-500/15"
                : "border border-white/10 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Generated Report Preview Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">
              Audit Executive Summary
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              March 2026 Monthly Financial Flight Review
            </h2>
            <p className="text-xs text-slate-400">Persona: Alex Morgan • Verified Records: 52</p>
          </div>
          <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            Health: 88/100 (Optimal)
          </span>
        </div>

        {/* AI Key Observations */}
        <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Bot className="h-4 w-4 text-cyan-400" />
            <span>AI Executive Retrospective</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            During March 2026, total inflow reached ₹145,000 across salary and freelance retainer streams against total outflows of ₹76,840, delivering a strong <strong>47% net savings rate (₹68,160 surplus)</strong>. Discretionary spending in Cloud & Tech peaked at ₹18,400 due to a single high-ticket electronics purchase. All fixed obligations (Rent, Utilities) were fulfilled on schedule.
          </p>
        </div>

        {/* Breakdown Key Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
            <span className="text-slate-400">Gross Inflows</span>
            <p className="text-base font-extrabold text-emerald-400 mt-1">₹1,45,000</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
            <span className="text-slate-400">Operating Outflows</span>
            <p className="text-base font-extrabold text-rose-400 mt-1">₹76,840</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
            <span className="text-slate-400">Milestone Contributions</span>
            <p className="text-base font-extrabold text-cyan-300 mt-1">₹45,000</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5">
            <span className="text-slate-400">Liquid Runway</span>
            <p className="text-base font-extrabold text-violet-300 mt-1">6.6 Months</p>
          </div>
        </div>
      </div>
    </div>
  );
}
