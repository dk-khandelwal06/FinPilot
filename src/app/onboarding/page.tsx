"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FinPilotLogo } from "@/components/common/FinPilotLogo";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Briefcase,
  Target,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState("INR");
  const [country, setCountry] = useState("India");
  const [monthlyIncome, setMonthlyIncome] = useState("125000");
  const [employmentType, setEmploymentType] = useState("Salaried Professional");
  const [primaryGoal, setPrimaryGoal] = useState("Emergency Fund");
  const [savingsTarget, setSavingsTarget] = useState("35000");
  const [existingDebt, setExistingDebt] = useState("0");
  const [emergencyFund, setEmergencyFund] = useState("150000");
  const [isFinishing, setIsFinishing] = useState(false);

  const totalSteps = 6;

  const handleFinish = async () => {
    setIsFinishing(true);
    // Simulates saving profile and redirecting to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0B1224]/95 p-8 shadow-2xl backdrop-blur-xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <FinPilotLogo size="sm" />
          <div className="text-right">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Step {step} / {totalSteps}
            </span>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* STEP 1: Country & Currency */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold text-white">Select Your Currency & Region</h2>
            <p className="text-xs text-slate-400">
              FinPilot adapts currency formatting and localization across all dashboards.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Currency</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { code: "INR", label: "Indian Rupee (₹)" },
                    { code: "USD", label: "US Dollar ($)" },
                    { code: "EUR", label: "Euro (€)" },
                    { code: "GBP", label: "British Pound (£)" },
                  ].map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setCurrency(c.code)}
                      className={`rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                        currency === c.code
                          ? "border-cyan-400 bg-cyan-500/20 text-white"
                          : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Monthly Income */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold text-white">Income Velocity & Employment</h2>
            <p className="text-xs text-slate-400">
              Used to calculate your savings rate and baseline cash flow runway.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Estimated Monthly Inflow ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="125000"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Employment Profile</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Salaried Professional", "Tech Freelancer", "Startup Founder", "Consultant"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmploymentType(type)}
                      className={`rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${
                        employmentType === type
                          ? "border-cyan-400 bg-cyan-500/20 text-white"
                          : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Goals */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold text-white">What is your primary milestone?</h2>
            <p className="text-xs text-slate-400">
              FinPilot will test your purchase decisions against this milestone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                { name: "Emergency Fund", desc: "Build 6 months of living expenses buffer" },
                { name: "Tech Hardware / Gear", desc: "Save for workstation, laptop, or camera" },
                { name: "Vacation / Travel", desc: "Fund an international trip or expedition" },
                { name: "Home Down Payment", desc: "Accelerate long-term real estate savings" },
              ].map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => setPrimaryGoal(g.name)}
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    primaryGoal === g.name
                      ? "border-cyan-400 bg-cyan-500/20 text-white"
                      : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-bold text-white">{g.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Monthly Savings & Debt */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold text-white">Savings Target & Existing Liabilities</h2>
            <p className="text-xs text-slate-400">
              Helps FinPilot gauge your monthly discretionary cash flow margin.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Monthly Savings ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={savingsTarget}
                  onChange={(e) => setSavingsTarget(e.target.value)}
                  placeholder="35000"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Existing Revolving Debt or EMI ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={existingDebt}
                  onChange={(e) => setExistingDebt(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Emergency Fund Status */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-bold text-white">Emergency Fund Reserves</h2>
            <p className="text-xs text-slate-400">
              Your liquid safety cushion across savings accounts and deposits.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Current Liquid Savings Buffer ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={emergencyFund}
                  onChange={(e) => setEmergencyFund(e.target.value)}
                  placeholder="150000"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-emerald-400">
                ✓ Provides approx {(parseFloat(emergencyFund || "0") / (parseFloat(monthlyIncome || "100000") * 0.5)).toFixed(1)} months of emergency expense coverage.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: Generated Financial Flight Snapshot */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Personalized Flight Snapshot Generated!</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              FinPilot has calibrated your cockpit profile based on your parameters.
            </p>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Monthly Inflow:</span>
                <strong className="text-white">{currencySymbol}{parseInt(monthlyIncome).toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Savings Pacing:</span>
                <strong className="text-emerald-400">{currencySymbol}{parseInt(savingsTarget).toLocaleString()}/mo ({Math.round((parseInt(savingsTarget) / Math.max(parseInt(monthlyIncome), 1)) * 100)}%)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Primary Milestone:</span>
                <strong className="text-cyan-300">{primaryGoal}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Liquid Buffer:</span>
                <strong className="text-violet-300">{currencySymbol}{parseInt(emergencyFund).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          {step > 1 && step < 6 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isFinishing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-95 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isFinishing ? "Calibrating Cockpit..." : "Enter Financial Cockpit"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
