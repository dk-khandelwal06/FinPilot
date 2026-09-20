"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Award,
  ChevronRight,
  ShieldCheck,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function HelpPage() {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedback("");
      setFeedbackSent(false);
    }, 3000);
  };

  const guides = [
    {
      title: "Understanding 'Can I Afford This?'",
      desc: "Learn how FinPilot simulates purchase impact on your projected monthly surplus, category budgets, and goal milestones without giving generic advice.",
      href: "/ai-decision",
    },
    {
      title: "Running What-If Scenarios",
      desc: "Simulate what happens if your income drops by 10% or if you cancel subscriptions, with side-by-side Before vs Scenario flight metrics.",
      href: "/what-if",
    },
    {
      title: "Detecting Duplicate & Unusual Charges",
      desc: "How our explainable AI identifies statistical spending spikes, duplicate restaurant transactions, and sudden recurring subscription increases.",
      href: "/anomalies",
    },
    {
      title: "Building an AI Operational Budget",
      desc: "How the AI Budget Builder constructs realistic 50/30/20 category caps based on your previous 90 days of categorized spending.",
      href: "/budgets",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Help Center & Documentation</h1>
            <p className="text-xs text-slate-400">
              Tutorials, architectural guidelines, and support contacts for FinPilot.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tutorials & Guides */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
          Core Feature Flight Guides
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {guides.map((g, i) => (
            <Link
              key={i}
              href={g.href}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-white">{g.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{g.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Explore Workflow</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Founders & Hackathon Contact Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-navy-950/80 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Created for Agentic AI Hackathon 2026</h3>
            <p className="text-xs text-cyan-400 font-mono">
              Daksh Khandelwal & Khushi Kushwah (Product + AI + Full-Stack)
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          FinPilot was built to redefine how individuals evaluate financial trade-offs using explainable, grounded AI decision engines. For questions, technical walkthroughs, or judge inquiries, reach out through the hackathon portal.
        </p>
      </div>

      {/* Feedback / Inquiry Form */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Have Feedback or Feature Request?</h3>
        <p className="text-xs text-slate-400">
          Send a quick message directly to the engineering and product team.
        </p>

        <form onSubmit={handleSendFeedback} className="space-y-3">
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts, suggestions, or hackathon questions..."
            className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            {feedbackSent && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Message sent to founders!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
