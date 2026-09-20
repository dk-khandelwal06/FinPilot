"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { FlightHealthScore } from "@/types";

export default function FinancialHealthPage() {
  const [data, setData] = useState<FlightHealthScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance/financial-health")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              FinPilot Financial Flight Status
            </h1>
            <p className="text-xs text-slate-400">
              Personal finance health indicator evaluated across 7 operational flight dimensions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scorecard */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0E1A38] to-[#0B1224] p-8 shadow-2xl backdrop-blur-xl text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-400">
            FinPilot Operational Indicator
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Status: {data.statusTier}
          </h2>
          <p className="text-xs text-slate-300 max-w-xl mt-2 leading-relaxed font-sans">
            {data.keyTakeaway}
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end justify-center shrink-0 sm:border-l sm:border-white/10 sm:pl-8">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-cyan-400 bg-slate-950/80 shadow-2xl shadow-cyan-500/20">
            <span className="text-3xl font-black text-white">{data.overallScore}</span>
            <span className="text-[10px] text-slate-400 absolute bottom-4 font-mono">/ 100</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 mt-2">
            Optimal Flight Pacing
          </span>
        </div>
      </div>

      {/* 7 Dimensions Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          7-Dimension Flight Score Breakdown
        </h3>

        <div className="grid sm:grid-cols-2 gap-3.5">
          {Object.entries(data.dimensions).map(([key, dim]) => (
            <div
              key={key}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{dim.label}</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {dim.score} / {dim.max} pts
                </span>
              </div>

              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full"
                  style={{ width: `${(dim.score / dim.max) * 100}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">{dim.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Recommendations */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Priority Actions to Maximize Flight Status</span>
        </h3>
        <div className="space-y-2 text-xs text-slate-300">
          {data.actionRecommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Compliance Notice */}
      <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 text-[11px] text-slate-400 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> This snapshot is an internal educational indicator derived from your entered records. It is not an official credit score, risk rating, or lending metric, and should not be used as professional financial advice.
        </p>
      </div>
    </div>
  );
}
