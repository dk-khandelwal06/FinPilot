"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Wallet,
  CreditCard,
  Building,
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/finance/accounts")
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data.accounts || []);
        setTotalBalance(data.totalBalance || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Accounts & Wallets</h1>
              <p className="text-xs text-slate-400">
                Manage checking accounts, high-yield savings, credit lines, and instant UPI wallets.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2 text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400">Net Liquid Position</span>
          <p className="text-xl font-black text-white">{formatCurrency(totalBalance)}</p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: `${acc.color || "#06B6D4"}20`,
                    color: acc.color || "#06B6D4",
                    border: `1px solid ${acc.color || "#06B6D4"}40`,
                  }}
                >
                  {acc.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">{acc.accountNumber}</span>
              </div>

              <h3 className="text-base font-bold text-white">{acc.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{acc.institution || "Personal Account"}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono">Current Balance</span>
                <p
                  className={`text-xl font-black ${
                    acc.balance >= 0 ? "text-white" : "text-rose-400"
                  }`}
                >
                  {formatCurrency(acc.balance)}
                </p>
              </div>

              {acc.isDefault && (
                <span className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 text-[10px] font-semibold text-cyan-400">
                  Primary Salary Account
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
