"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FinPilotLogo } from "../common/FinPilotLogo";
import {
  Sparkles,
  Command,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Compass,
  ArrowRight,
} from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
  onOpenCommand?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenCommand }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isLandingPage = pathname === "/";

  const handleDemoLaunch = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard?demo=true");
        router.refresh();
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090D16]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center group">
          <FinPilotLogo size="md" />
        </Link>

        {/* Center Navigation for Landing or Global Shortcuts */}
        {isLandingPage ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#problem-solution" className="hover:text-cyan-400 transition-colors">
              Solution
            </a>
            <a href="#ai-capabilities" className="hover:text-cyan-400 transition-colors">
              AI Capabilities
            </a>
            <a href="#decision-support" className="hover:text-cyan-400 transition-colors">
              Decision Support
            </a>
            <a href="#builders" className="hover:text-cyan-400 transition-colors">
              Builders
            </a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">
              Security
            </a>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            {/* Quick Command Palette trigger */}
            <button
              onClick={onOpenCommand}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 transition-all shadow-inner"
            >
              <Command className="h-3.5 w-3.5 text-cyan-400" />
              <span>Search or command...</span>
              <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
                Ctrl K
              </kbd>
            </button>

            {/* Financial Safety Pill */}
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Decision Support Only</span>
            </div>
          </div>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Button (Highlighted for Hackathon) */}
          <button
            onClick={handleDemoLaunch}
            disabled={isDemoLoading}
            className="relative group overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 p-[1px] text-xs font-semibold shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <span className="flex items-center gap-1.5 rounded-[7px] bg-slate-950 px-3 py-1.5 text-cyan-300 group-hover:bg-opacity-80 transition-all">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin-slow" />
              {isDemoLoading ? "Loading Flight..." : "Explore Demo"}
            </span>
          </button>

          {user ? (
            /* User profile dropdown */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 p-1.5 text-sm text-slate-200 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 text-xs font-bold text-white shadow">
                  {user.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate text-xs font-medium">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="text-xs font-medium text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    {user.role === "DEMO" && (
                      <span className="mt-1 inline-block text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                        Demo Flight Mode
                      </span>
                    )}
                  </div>

                  <div className="py-1 text-xs text-slate-300">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5 hover:text-cyan-400"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      Financial Cockpit
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5 hover:text-cyan-400"
                    >
                      <User className="h-3.5 w-3.5" />
                      Settings & Currency
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !isAuthPage ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="hidden sm:flex items-center gap-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/30 transition-all shadow-sm"
              >
                Get Started
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
