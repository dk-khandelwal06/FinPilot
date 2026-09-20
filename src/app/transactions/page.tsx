"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  Calendar,
  CreditCard,
} from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [anomalyOnly, setAnomalyOnly] = useState(false);

  // Add Transaction Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newMerchant, setNewMerchant] = useState("");
  const [newType, setNewType] = useState("Expense");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newAccountId, setNewAccountId] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("UPI");
  const [isAdding, setIsAdding] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (categoryFilter !== "ALL") params.set("category", categoryFilter);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      if (anomalyOnly) params.set("anomaly", "true");

      const res = await fetch(`/api/finance/transactions?${params.toString()}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
      setCategories(data.categories || []);
      setAccounts(data.accounts || []);
      if (data.categories?.length && !newCategoryId) {
        setNewCategoryId(data.categories[0].id);
      }
      if (data.accounts?.length && !newAccountId) {
        setNewAccountId(data.accounts[0].id);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, typeFilter, anomalyOnly, newCategoryId, newAccountId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || !newMerchant) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(newAmount),
          merchant: newMerchant,
          type: newType,
          categoryId: newCategoryId,
          accountId: newAccountId,
          notes: newNotes,
          paymentMethod: newPaymentMethod,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewAmount("");
        setNewMerchant("");
        setNewNotes("");
        fetchTransactions();
      }
    } catch {
      //
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction record?")) return;
    try {
      await fetch(`/api/finance/transactions?id=${id}`, { method: "DELETE" });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch {
      //
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Transactions Ledger</h1>
              <p className="text-xs text-slate-400">
                Complete record of inflows, outflows, account transfers, and anomaly tags.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-lg space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by merchant, notes, or tags..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-white/10 border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/20 transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Filters:</span>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="Expense">Expenses Only</option>
              <option value="Income">Incomes Only</option>
            </select>

            {/* Category selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Anomaly filter pill */}
            <button
              type="button"
              onClick={() => setAnomalyOnly(!anomalyOnly)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                anomalyOnly
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:text-white"
              }`}
            >
              Anomalies Only
            </button>
          </div>

          <div className="text-slate-400 text-[11px] font-mono">
            Showing {transactions.length} verified records
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="h-7 w-7 text-cyan-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-mono">Loading records...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-slate-950/60 text-[11px] uppercase font-mono text-slate-400">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Merchant / Entity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Account & Method</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{tx.merchant}</span>
                        {tx.isAnomaly && (
                          <span
                            title={tx.anomalyReason || "Flagged statistical anomaly"}
                            className="rounded bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 text-[9px] font-bold text-rose-400"
                          >
                            ANOMALY
                          </span>
                        )}
                      </div>
                      {tx.notes && <p className="text-[10px] text-slate-400 mt-0.5">{tx.notes}</p>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium"
                        style={{
                          backgroundColor: `${tx.categoryColor}15`,
                          color: tx.categoryColor || "#38BDF8",
                          border: `1px solid ${tx.categoryColor}30`,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {tx.accountName} • <span className="text-slate-500">{tx.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-bold">
                      <span className={tx.type === "Income" ? "text-emerald-400" : "text-white"}>
                        {tx.type === "Income" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B132B] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Record Transaction</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Expense", "Income"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`rounded-xl border p-2 font-semibold text-xs transition-all ${
                        newType === t
                          ? "border-cyan-400 bg-cyan-500/20 text-white"
                          : "border-white/10 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Merchant / Entity Name</label>
                <input
                  type="text"
                  required
                  value={newMerchant}
                  onChange={(e) => setNewMerchant(e.target.value)}
                  placeholder="e.g. Starbucks or TechCorp Salary"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="1500"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Account</label>
                  <select
                    value={newAccountId}
                    onChange={(e) => setNewAccountId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Payment Method</label>
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="UPI">UPI / QR Code</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Notes / Tags (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Team lunch celebration"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
                >
                  {isAdding ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
