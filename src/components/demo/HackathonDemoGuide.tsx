"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Award,
  CheckCircle2,
  Sliders,
  Scale,
  Bot,
  AlertTriangle,
  Repeat,
  Target,
  Activity,
} from "lucide-react";

export const HackathonDemoGuide: React.FC = () => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Don't render on landing page
  if (pathname === "/") return null;

  const demoSteps = [
    { title: "Cockpit Dashboard", href: "/dashboard", icon: Activity, desc: "Overview of balance, budgets & cash flow" },
    { title: "AI Assistant", href: "/ai-assistant", icon: Bot, desc: "Grounded Q&A with real cited transactions" },
    { title: "Can I Afford This?", href: "/ai-decision", icon: Scale, desc: "Affordability analysis & goal delay impact" },
    { title: "What-If Simulator", href: "/what-if", icon: Sliders, desc: "Test spending/income scenarios side-by-side" },
    { title: "Unusual Spending", href: "/anomalies", icon: AlertTriangle, desc: "Explainable duplicate & spike detection" },
    { title: "Subscriptions", href: "/subscriptions", icon: Repeat, desc: "Recurring costs & price hike alerts" },
    { title: "Financial Goals", href: "/goals", icon: Target, desc: "Runway & target date projections" },
    { title: "Flight Status", href: "/financial-health", icon: Activity, desc: "7-dimension health indicator" },
  ];

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await fetch("/api/demo/seed", { method: "POST" });
      window.location.reload();
    } catch {
      window.location.reload();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <aside
      aria-label="Demo flow guide"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-cyan-500/30 bg-[#0B132B]/95 p-3.5 shadow-2xl backdrop-blur-xl transition-all"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white shadow-md">
            <Award className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">
                3-Min Hackathon Demo Guide
              </span>
              <span className="text-[9px] font-semibold text-cyan-400 bg-cyan-500/20 px-1 py-0.5 rounded">
                2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Daksh Khandelwal & Khushi Kushwah</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reset Alex Morgan Demo Data"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin text-cyan-400" : ""}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
          <div className="grid grid-cols-2 gap-1.5">
            {demoSteps.map((step, idx) => {
              const isActive = pathname === step.href;
              const Icon = step.icon;

              return (
                <Link
                  key={step.href}
                  href={step.href}
                  className={`group flex items-center gap-2 rounded-lg p-2 text-left text-xs transition-all ${
                    isActive
                      ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-200"
                      : "bg-white/[0.03] border border-white/[0.05] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[10px] font-mono text-cyan-400">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-[11px] truncate leading-tight">{step.title}</p>
                    <p className="text-[9px] text-slate-400 truncate">{step.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
            <span>Demo Persona: <strong className="text-white">Alex Morgan</strong></span>
            <span className="text-emerald-400 font-medium">50+ records loaded</span>
          </div>
        </div>
      )}
    </aside>
  );
};
