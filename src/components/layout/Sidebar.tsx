"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
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
  Grid,
  FileText,
  Calendar,
  Wallet,
  UploadCloud,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  highlight?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  badge?: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "", onItemClick }) => {
  const pathname = usePathname();

  const navSections: NavSection[] = [
    {
      title: "FINANCIAL COCKPIT",
      items: [
        { name: "Cockpit Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Transactions Ledger", href: "/transactions", icon: ArrowLeftRight },
        { name: "Expenses Tracker", href: "/expenses", icon: TrendingDown },
        { name: "Income Streams", href: "/income", icon: TrendingUp },
        { name: "Budget Operations", href: "/budgets", icon: PieChart },
      ],
    },
    {
      title: "AI INTELLIGENCE SUITE",
      badge: "AI Powered",
      items: [
        { name: "FinPilot AI Assistant", href: "/ai-assistant", icon: Bot, highlight: true },
        { name: "Can I Afford This?", href: "/ai-decision", icon: Scale, highlight: true },
        { name: "What-If Simulator", href: "/what-if", icon: Sparkles },
        { name: "Unusual Spending", href: "/anomalies", icon: AlertTriangle, badge: "AI Alert" },
        { name: "AI Specialists (10)", href: "/ai-specialists", icon: Grid },
        { name: "Flight Insights Feed", href: "/insights", icon: Activity },
      ],
    },
    {
      title: "PLANNING & CASH FLOW",
      items: [
        { name: "Cash Flow Forecast", href: "/cash-flow", icon: Waves },
        { name: "Subscriptions Manager", href: "/subscriptions", icon: Repeat },
        { name: "Recurring Bills", href: "/bills", icon: Receipt },
        { name: "Financial Goals", href: "/goals", icon: Target },
        { name: "Spending Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Financial Flight Status", href: "/financial-health", icon: Activity },
      ],
    },
    {
      title: "TOOLS & SETTINGS",
      items: [
        { name: "Accounts & Wallets", href: "/accounts", icon: Wallet },
        { name: "Financial Calendar", href: "/calendar", icon: Calendar },
        { name: "Reports & Audits", href: "/reports", icon: FileText },
        { name: "Import Data Hub", href: "/import", icon: UploadCloud },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Settings & Profile", href: "/settings", icon: Settings },
        { name: "Help & FAQ", href: "/help", icon: HelpCircle },
      ],
    },
  ];

  return (
    <aside
      className={`flex flex-col w-64 border-r border-white/[0.08] bg-[#090D16]/90 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto px-3 py-4 select-none ${className}`}
    >
      <div className="space-y-6 flex-1">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </span>
              {section.badge && (
                <span className="text-[9px] font-semibold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                  {section.badge}
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 border-l-2 border-cyan-400 shadow-sm"
                        : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                    } ${item.highlight ? "font-semibold text-cyan-200" : ""}`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? "text-cyan-400"
                            : item.highlight
                            ? "text-cyan-400/80 group-hover:text-cyan-300"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-500/20 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Compliance Badge at bottom of sidebar */}
      <div className="mt-4 pt-4 border-t border-white/[0.08] px-2 text-[11px] text-slate-400">
        <p className="leading-snug">
          <span className="font-semibold text-slate-300">FinPilot</span> Informational Decision
          Engine. Not investment advice.
        </p>
      </div>
    </aside>
  );
};
