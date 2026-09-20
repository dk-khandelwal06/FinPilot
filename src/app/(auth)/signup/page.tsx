"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FinPilotLogo } from "@/components/common/FinPilotLogo";
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculatePasswordStrength(password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = ["bg-rose-500", "bg-rose-400", "bg-amber-400", "bg-emerald-400", "bg-cyan-400"];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      setError("Network error occurred. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1224]/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FinPilotLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Your Flight Deck</h1>
          <p className="text-xs text-slate-400 mt-1">
            Join FinPilot for intelligent personal finance decision support
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
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

            {/* Password strength meter */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Strength</span>
                  <span className="font-semibold text-slate-300">
                    {strengthLabels[Math.min(strength, 4)]}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full h-full ${
                        strength >= step
                          ? strengthColors[Math.min(strength - 1, 4)]
                          : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-2.5 text-xs font-bold text-white hover:opacity-90 active:scale-95 transition-all shadow-md shadow-cyan-500/20"
          >
            {loading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-400 hover:underline">
            Sign In
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
