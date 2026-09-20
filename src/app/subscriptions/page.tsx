"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Repeat,
  AlertTriangle,
  TrendingUp,
  Calendar,
  CreditCard,
  Trash2,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({ totalMonthly: 0, totalAnnual: 0, activeCount: 0, priceIncreasesCount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/subscriptions");
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setMetrics(data.metrics || { totalMonthly: 0, totalAnnual: 0, activeCount: 0, priceIncreasesCount: 0 });
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      await fetch("/api/finance/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      fetchSubscriptions();
    } catch {
      //
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Subscriptions Manager</h1>
              <p className="text-xs text-slate-400">
                Track recurring outflows, detect stealth price increases, and audit cumulative annual commitments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
            {metrics.priceIncreasesCount} Price Hike Detected
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400">Monthly Commitment</span>
          <p className="mt-1 text-xl font-black text-white">
            {formatCurrency(metrics.totalMonthly)}/mo
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Recurring burn rate</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400">Annual Outflow</span>
          <p className="mt-1 text-xl font-black text-rose-400">
            {formatCurrency(metrics.totalAnnual)}/yr
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Projected 12 months</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400">Active Services</span>
          <p className="mt-1 text-xl font-black text-cyan-400">
            {metrics.activeCount} Subscriptions
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Entertainment, SaaS, Health</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <span className="text-[11px] font-medium text-slate-400">Price Increases</span>
          <p className="mt-1 text-xl font-black text-amber-400">
            {metrics.priceIncreasesCount} Flagged
          </p>
          <p className="text-[10px] text-amber-400 mt-0.5">Requires audit</p>
        </div>
      </div>

      {/* Subscriptions Grid Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className={`rounded-2xl border p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all ${
              sub.hasPriceIncrease
                ? "border-amber-500/40 bg-amber-950/15"
                : "border-white/10 bg-slate-900/60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                  {sub.category}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    sub.status === "ACTIVE"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {sub.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{sub.name}</h3>

              {sub.hasPriceIncrease && (
                <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-300">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Price increased from {formatCurrency(sub.previousAmount || 1650)} to {formatCurrency(sub.amount)} (+21%)
                  </span>
                </div>
              )}

              <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Billing Cycle:</span>
                  <span className="text-slate-200 font-semibold">{sub.billingCycle}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Renewal:</span>
                  <span className="text-cyan-300 font-mono">
                    {new Date(sub.nextBillingDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Card:</span>
                  <span className="text-slate-300">{sub.paymentMethod || "Credit Card"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-base font-extrabold text-white">{formatCurrency(sub.amount)}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {formatCurrency(sub.amount * 12)} / year
                </p>
              </div>

              <button
                onClick={() => handleToggleStatus(sub.id, sub.status)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
              >
                {sub.status === "ACTIVE" ? "Pause Reminder" : "Resume"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
