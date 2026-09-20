"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  DollarSign,
  Download,
  Trash2,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState("dark");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    alert("Compiling complete user financial records JSON archive...");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cockpit Settings & Preferences</h1>
            <p className="text-xs text-slate-400">
              Manage localization, currency preferences, AI engine controls, and data security.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Profile Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            <span>Personal Flight Profile</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Alex Morgan"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <input
                type="email"
                disabled
                defaultValue="alex.morgan@finpilot.io"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-400 opacity-80 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Currency & Localization Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>Currency & Regional Format</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { code: "INR", label: "Indian Rupee (₹)", desc: "Lakhs / Crores" },
              { code: "USD", label: "US Dollar ($)", desc: "Standard USD" },
              { code: "EUR", label: "Euro (€)", desc: "European Euro" },
              { code: "GBP", label: "British Pound (£)", desc: "UK Sterling" },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCurrency(c.code)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  currency === c.code
                    ? "border-cyan-400 bg-cyan-500/20 text-white"
                    : "border-white/10 bg-slate-950 text-slate-400"
                }`}
              >
                <p className="font-bold">{c.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{c.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* AI Co-Pilot Preferences */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>AI Co-Pilot Controls</span>
          </h2>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/5">
            <div>
              <p className="font-semibold text-white">Grounded Decision Reasoning</p>
              <p className="text-[11px] text-slate-400">
                Allow AI to analyze your transactions to power &apos;Can I Afford This?&apos; and What-If simulations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                aiEnabled ? "bg-cyan-500" : "bg-slate-800"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  aiEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Security & Export */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Data Rights & Security</span>
          </h2>

          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-white/5">
            <div>
              <p className="font-semibold text-white">Export Complete Financial Ledger</p>
              <p className="text-[11px] text-slate-400">
                Download all accounts, transactions, and budgets in encrypted JSON archive format.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-semibold text-slate-200 hover:bg-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Preferences saved
            </span>
          )}
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
