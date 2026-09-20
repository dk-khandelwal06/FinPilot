"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  LayoutDashboard,
  ArrowLeftRight,
  TrendingDown,
  TrendingUp,
  PieChart,
  Repeat,
  Receipt,
  Target,
  Waves,
  BarChart3,
  Activity,
  Bot,
  Scale,
  Sparkles,
  AlertTriangle,
  FileText,
  Calendar,
  Wallet,
  UploadCloud,
  Settings,
  HelpCircle,
  X,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  name: string;
  category: "Navigation" | "AI Intelligence" | "Action" | "Demo Prompt";
  href?: string;
  icon: React.ElementType;
  description?: string;
  action?: () => void;
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const commands: CommandItem[] = [
    // AI Decision Tools
    { name: "FinPilot AI Assistant", category: "AI Intelligence", href: "/ai-assistant", icon: Bot, description: "Natural language financial reasoning" },
    { name: "Can I Afford This? Engine", category: "AI Intelligence", href: "/ai-decision", icon: Scale, description: "Pre-purchase affordability simulator" },
    { name: "What-If Scenario Simulator", category: "AI Intelligence", href: "/what-if", icon: Sparkles, description: "Simulate expense or income shifts" },
    { name: "Unusual Spending Detective", category: "AI Intelligence", href: "/anomalies", icon: AlertTriangle, description: "Explainable anomaly flags" },
    { name: "Financial Flight Status", category: "AI Intelligence", href: "/financial-health", icon: Activity, description: "7-dimensional health score" },
    { name: "Build My Budget (AI)", category: "AI Intelligence", href: "/budgets", icon: PieChart, description: "Auto-generate 50/30/20 budget" },

    // Navigation
    { name: "Dashboard (Financial Cockpit)", category: "Navigation", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions Ledger", category: "Navigation", href: "/transactions", icon: ArrowLeftRight },
    { name: "Expenses Tracker", category: "Navigation", href: "/expenses", icon: TrendingDown },
    { name: "Income Streams", category: "Navigation", href: "/income", icon: TrendingUp },
    { name: "Subscriptions Manager", category: "Navigation", href: "/subscriptions", icon: Repeat },
    { name: "Recurring Bills", category: "Navigation", href: "/bills", icon: Receipt },
    { name: "Financial Goals", category: "Navigation", href: "/goals", icon: Target },
    { name: "Cash Flow Forecast", category: "Navigation", href: "/cash-flow", icon: Waves },
    { name: "Spending Analytics", category: "Navigation", href: "/analytics", icon: BarChart3 },
    { name: "Accounts & Wallets", category: "Navigation", href: "/accounts", icon: Wallet },
    { name: "Financial Calendar", category: "Navigation", href: "/calendar", icon: Calendar },
    { name: "Reports & Statement Exports", category: "Navigation", href: "/reports", icon: FileText },
    { name: "Import Data Hub (CSV/PDF)", category: "Navigation", href: "/import", icon: UploadCloud },
    { name: "Settings & Currency", category: "Navigation", href: "/settings", icon: Settings },
    { name: "Help Center & FAQ", category: "Navigation", href: "/help", icon: HelpCircle },

    // Demo Prompts
    { name: "Where did I spend the most this month?", category: "Demo Prompt", href: "/ai-assistant?q=Where+did+my+money+go+this+month", icon: Bot, description: "AI category analysis" },
    { name: "Can I afford a ₹25,000 purchase?", category: "Demo Prompt", href: "/ai-decision?amount=25000&item=New+Phone", icon: Scale, description: "Test affordability simulation" },
    { name: "Which subscriptions cost me the most?", category: "Demo Prompt", href: "/subscriptions", icon: Repeat, description: "Review recurring costs" },
    { name: "What if my income drops by 10%?", category: "Demo Prompt", href: "/what-if?type=INCOME_DROP&amount=14500", icon: Sparkles, description: "Simulate income reduction" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = commands.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B1224] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-slate-900/60">
          <Search className="h-5 w-5 text-cyan-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cockpit, launch AI simulator, or jump to view..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/[0.04]">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching commands or pages found. Try searching for &apos;AI&apos;, &apos;Budget&apos;, or &apos;Transactions&apos;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white group-hover:text-cyan-200">
                          {item.name}
                        </span>
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 uppercase">
                          {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] text-slate-400 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-slate-300">↵</kbd> to select
            </span>
            <span>
              <kbd className="rounded bg-slate-800 px-1 py-0.5 font-mono text-slate-300">esc</kbd> to close
            </span>
          </div>
          <span className="text-cyan-400 font-mono">FinPilot Cockpit Navigation</span>
        </div>
      </div>
    </div>
  );
};
