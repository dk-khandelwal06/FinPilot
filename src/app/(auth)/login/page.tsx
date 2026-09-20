"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FinPilotLogo } from "@/components/common/FinPilotLogo";
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Network connection error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLaunch = async () => {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      if (res.ok) {
        router.push("/dashboard?demo=true");
        router.refresh();
      } else {
        setError("Failed to initialize demo");
      }
    } catch {
      setError("Failed to initialize demo");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1224]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FinPilotLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign In to Cockpit</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your AI personal finance decision engine
          </p>
        </div>

        {/* 1-Click Demo Login Banner (Hackathon Demo) */}
        <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Hackathon Judge or Demo Guest?</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Skip signup and test with Alex Morgan&apos;s pre-populated 50+ record dataset.
          </p>
          <button
            type="button"
            onClick={handleDemoLaunch}
            disabled={demoLoading}
            className="mt-3 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition-all"
          >
            {demoLoading ? "Preparing Flight Deck..." : "Explore Demo (1-Click Instant)"}
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#0B1224] px-3 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
            or sign in with email
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 active:scale-95 transition-all shadow-sm"
          >
            {loading ? "Authenticating..." : "Sign In to FinPilot"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-cyan-400 hover:underline">
            Create an Account
          </Link>
        </p>

        <div className="mt-6 pt-4 border-t border-white/5 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          <span>Informational personal finance tool. Not investment advice.</span>
        </div>
      </div>
    </div>
  );
}
