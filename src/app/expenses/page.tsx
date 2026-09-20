"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  TrendingDown,
  Upload,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanningReceipt, setScanningReceipt] = useState(false);
  const [receiptResult, setReceiptResult] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/finance/transactions?type=Expense")
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSimulateReceiptScan = () => {
    setScanningReceipt(true);
    setReceiptResult(null);

    setTimeout(() => {
      setReceiptResult({
        merchant: "Starbucks Reserve Roastery",
        amount: 850,
        category: "Food & Dining",
        date: new Date().toISOString().split("T")[0],
        confidence: "98.4%",
        detectedItems: ["Venti Cold Brew (₹380)", "Truffle Croissant (₹470)"],
      });
      setScanningReceipt(false);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Expense Tracker & OCR Hub</h1>
              <p className="text-xs text-slate-400">
                Log purchases, scan itemized receipts with AI extraction, and monitor category distributions.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulateReceiptScan}
          disabled={scanningReceipt}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all shrink-0"
        >
          <Camera className="h-4 w-4" />
          <span>{scanningReceipt ? "Extracting Items..." : "Simulate Receipt Scan"}</span>
        </button>
      </div>

      {/* Simulated AI Receipt Extraction Result */}
      {receiptResult && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-navy-950/80 p-6 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase font-mono">
                AI Receipt Extracted ({receiptResult.confidence})
              </span>
              <h3 className="text-base font-bold text-white">{receiptResult.merchant}</h3>
            </div>
            <button
              onClick={() => setReceiptResult(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Amount Extracted:</span>
              <p className="text-lg font-black text-white">{formatCurrency(receiptResult.amount)}</p>
            </div>
            <div>
              <span className="text-slate-400">Mapped Category:</span>
              <p className="text-sm font-bold text-cyan-300">{receiptResult.category}</p>
            </div>
            <div>
              <span className="text-slate-400">Itemized Items:</span>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {receiptResult.detectedItems.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Itemized Outflows</h2>
          <span className="text-xs font-mono text-slate-400">{expenses.length} records</span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-7 w-7 text-cyan-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-mono">Loading expense items...</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04] text-xs">
            {expenses.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{tx.merchant}</p>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono"
                      style={{
                        backgroundColor: `${tx.categoryColor}15`,
                        color: tx.categoryColor || "#38BDF8",
                        border: `1px solid ${tx.categoryColor}30`,
                      }}
                    >
                      {tx.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(tx.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} • {tx.paymentMethod}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-white">-{formatCurrency(tx.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
