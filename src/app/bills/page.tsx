"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Receipt,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [unpaidTotal, setUnpaidTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/bills");
      const data = await res.json();
      setBills(data.bills || []);
      setUnpaidTotal(data.unpaidTotal || 0);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PAID" ? "UNPAID" : "PAID";
    try {
      await fetch("/api/finance/bills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      fetchBills();
    } catch {
      //
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Recurring Obligations & Bills</h1>
              <p className="text-xs text-slate-400">
                Monitor fixed liabilities: Rent, EMIs, Broadband, Utilities, and Insurance.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400">Pending Obligations</span>
          <p className="text-base font-black text-white">{formatCurrency(unpaidTotal)}</p>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {bills.map((bill) => {
          const isPaid = bill.status === "PAID";
          const dueDateObj = new Date(bill.dueDate);
          const daysLeft = Math.ceil((dueDateObj.getTime() - Date.now()) / (1000 * 3600 * 24));

          return (
            <div
              key={bill.id}
              className={`rounded-2xl border p-5 backdrop-blur-xl shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isPaid
                  ? "border-white/5 bg-slate-950/40 opacity-75"
                  : daysLeft <= 5
                  ? "border-amber-500/30 bg-amber-950/10"
                  : "border-white/10 bg-slate-900/60"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isPaid
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                  }`}
                >
                  {isPaid ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-bold ${isPaid ? "text-slate-400 line-through" : "text-white"}`}>
                      {bill.title}
                    </h3>
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      {bill.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Biller: <strong className="text-slate-300">{bill.biller}</strong> • Due {dueDateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </p>
                  {bill.autoPay && (
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                      <Zap className="h-3 w-3" /> AutoPay Scheduled on Salary Account
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <p className="text-lg font-black text-white">{formatCurrency(bill.amount)}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {isPaid ? "Completed" : daysLeft > 0 ? `Due in ${daysLeft} days` : "Due Today"}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleStatus(bill.id, bill.status)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isPaid
                      ? "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-cyan-500/20 hover:opacity-95"
                  }`}
                >
                  {isPaid ? "Mark Unpaid" : "Mark as Paid"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
