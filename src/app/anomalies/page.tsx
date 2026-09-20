"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  RefreshCw,
} from "lucide-react";

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/anomalies");
      const data = await res.json();
      setAnomalies(data.anomalies || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      await fetch("/api/ai/anomalies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setAnomalies((prev) => prev.filter((a) => a.id !== id));
    } catch {
      //
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Unusual Spending Detective</h1>
              <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 font-mono">
                {anomalies.length} Flagged
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Explainable AI anomaly detection: flags potential duplicate payments, statistical spikes, and out-of-pattern merchants.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">Scanning transaction ledger for statistical variance...</p>
        </div>
      ) : anomalies.length === 0 ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-8 text-center max-w-md mx-auto">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">All Anomaly Checks Clear</h3>
          <p className="text-xs text-slate-400 mt-1">
            No statistical outliers, duplicate charges, or abnormal merchant spikes detected in your current cycle.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {anomalies.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
                    !
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{a.merchant}</h3>
                      <span className="rounded bg-rose-500/10 text-rose-400 px-1.5 py-0.5 text-[9px] font-bold border border-rose-500/20">
                        {a.severity} VARIANCE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {a.category} • Paid via {a.accountName} • {new Date(a.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div>
                    <p className="text-lg font-black text-rose-400">
                      {formatCurrency(a.amount)}
                    </p>
                    <p className="text-[10px] text-slate-400">Expense Outflow</p>
                  </div>
                  <button
                    onClick={() => handleResolve(a.id)}
                    disabled={resolvingId === a.id}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30 transition-all shrink-0"
                  >
                    {resolvingId === a.id ? "Resolving..." : "Mark Verified"}
                  </button>
                </div>
              </div>

              {/* WHY WAS THIS FLAGGED? Section */}
              <div className="mt-4 rounded-xl border border-white/5 bg-slate-950/60 p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>WHY WAS THIS FLAGGED? (Explainable AI Grounding)</span>
                </div>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed font-sans">
                  {a.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
