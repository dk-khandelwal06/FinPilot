"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  Receipt,
  PieChart,
  Repeat,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Upcoming Obligation: Tata Power Electricity",
      message: "₹2,840 due in 5 days (March 25). AutoPay scheduled on HDFC Checking.",
      type: "BILL",
      time: "2 hours ago",
      read: false,
      link: "/bills",
    },
    {
      id: "2",
      title: "Budget Exceeded: Cloud & Tech",
      message: "Spent ₹18,400 against ₹15,000 operational ceiling (122.6% utilized).",
      type: "BUDGET",
      time: "Yesterday",
      read: false,
      link: "/budgets",
    },
    {
      id: "3",
      title: "Unusual Anomaly Flagged: The Table Colaba",
      message: "Duplicate charge detected: identical ₹4,200 transaction processed within 12 minutes.",
      type: "ANOMALY",
      time: "3 days ago",
      read: true,
      link: "/anomalies",
    },
    {
      id: "4",
      title: "Subscription Price Increase Detected",
      message: "OpenAI ChatGPT Plus renewed at ₹1,999 vs historical ₹1,650.",
      type: "SUB",
      time: "4 days ago",
      read: true,
      link: "/subscriptions",
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClear = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Notifications Center</h1>
            <p className="text-xs text-slate-400">
              Flight warnings, bill alerts, subscription changes, and anomaly flags.
            </p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          Mark All Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border p-4 backdrop-blur-xl transition-all flex items-start justify-between gap-4 ${
              n.read
                ? "border-white/5 bg-slate-950/40 opacity-70"
                : "border-cyan-500/30 bg-slate-900/80 shadow-lg"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  n.type === "ANOMALY"
                    ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    : n.type === "BUDGET"
                    ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                }`}
              >
                {n.type === "ANOMALY" ? "!" : n.type === "BUDGET" ? "%" : "•"}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                  <span className="font-mono">{n.time}</span>
                  {n.link && (
                    <Link href={n.link} className="text-cyan-400 hover:underline font-semibold">
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleClear(n.id)}
              className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
