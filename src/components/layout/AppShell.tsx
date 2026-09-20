"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "../common/CommandPalette";
import { HackathonDemoGuide } from "../demo/HackathonDemoGuide";
import { Menu, X, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface AppShellProps {
  children: React.ReactNode;
  user: any;
}

export const AppShell: React.FC<AppShellProps> = ({ children, user }) => {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = pathname === "/";
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/onboarding");

  // Show full cockpit sidebar if not landing or pure auth page
  const showSidebar = !isLandingPage && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100">
      {/* Top Navbar */}
      <Navbar user={user} onOpenCommand={() => setIsCommandOpen(true)} />

      {/* Main Container */}
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}

        {/* Mobile Sidebar Drawer */}
        {showSidebar && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-[#090D16] border-r border-white/10 z-50 flex flex-col h-full">
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <span className="font-bold text-sm text-cyan-400">FinPilot Cockpit</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Mobile drawer toggle button for dashboard pages */}
          {showSidebar && (
            <div className="lg:hidden flex items-center justify-between border-b border-white/[0.06] bg-slate-900/40 px-4 py-2">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                <Menu className="h-4 w-4 text-cyan-400" />
                <span>Cockpit Menu</span>
              </button>
              <button
                onClick={() => setIsCommandOpen(true)}
                className="text-xs text-slate-400 hover:text-cyan-400 font-mono"
              >
                Ctrl+K Search
              </button>
            </div>
          )}

          <div className="flex-1">{children}</div>

          {/* Global Regulatory & Safety Disclaimer Banner */}
          <footer className="mt-auto border-t border-white/[0.06] bg-[#060913] py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
            <div className="max-w-5xl mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-slate-300">
                <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
                <span>
                  <strong>FinPilot Compliance Notice:</strong> FinPilot is an informational financial decision-support tool. It does not provide investment, tax, legal, lending, or professional financial advice.
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-400 pt-2 border-t border-white/[0.04]">
                <span>
                  Built by <strong className="text-slate-300">Daksh Khandelwal</strong> & <strong className="text-slate-300">Khushi Kushwah</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-mono">Agentic AI Hackathon 2026</span>
                <span className="text-slate-600">•</span>
                <Link href="/help" className="hover:text-cyan-400 transition-colors">
                  Help Center & Documentation
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Sticky 3-Minute Hackathon Demo Presentation Toolbar */}
      <HackathonDemoGuide />
    </div>
  );
};
