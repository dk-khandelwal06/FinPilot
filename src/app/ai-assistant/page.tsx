"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  User,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

interface Message {
  id: string;
  sender: "USER" | "AI";
  content: string;
  citations?: string[];
  timestamp: string;
}

function AIAssistantContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "AI",
      content:
        "Hello Alex! I am **FinPilot Intelligence**, your grounded personal finance decision-support co-pilot. I have analyzed your 4 accounts, 50+ recent transactions, active budgets, subscriptions, and goals.\n\nHow can I help you navigate your finances today?",
      citations: [
        "Verified HDFC Checking, ICICI Savings, Axis Credit Card ledgers",
        "March 2026 Flight Budget & Category allocations",
      ],
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Where did my money go this month?",
    "Which subscriptions cost me the most?",
    "What expenses can I safely reduce?",
    "How much of my budget is committed?",
    "How can I accelerate my Emergency Fund goal?",
    "Why was my Croma transaction flagged?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "USER",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        content: data.answer || "I was unable to complete the analysis.",
        citations: data.citations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "AI",
          content:
            "I encountered a temporary connection issue communicating with the AI decision engine. Please retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090D16] text-slate-100 max-w-6xl mx-auto p-3 sm:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white shadow-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">FinPilot AI Finance Co-Pilot</h1>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                Grounded Reasoning
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Answers strictly cite your stored transactions, budgets, and goals with zero hallucination.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
          <span>Decision Support Only</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar shrink-0">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0">
          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          Quick Prompts:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-1 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all shrink-0 active:scale-95"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 sm:p-4 rounded-2xl border border-white/[0.06] bg-slate-950/40 backdrop-blur-md">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.sender === "USER" ? "ml-auto justify-end" : "mr-auto justify-start"
            }`}
          >
            {msg.sender === "AI" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mt-1">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === "USER"
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
                  : "border border-white/10 bg-slate-900/80 text-slate-200 shadow-xl"
              }`}
            >
              <div className="whitespace-pre-line font-sans">{msg.content}</div>

              {/* Verified Citations List */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                  <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    Verified Financial Sources & Proofs:
                  </p>
                  {msg.citations.map((c, i) => (
                    <p key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>{c}</span>
                    </p>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-slate-400 text-right mt-2 font-mono">
                {msg.timestamp}
              </p>
            </div>

            {msg.sender === "USER" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="h-4 w-4 animate-spin-slow" />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-xs text-cyan-300 flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing transaction records and computing grounded flight answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask FinPilot about spending, budgets, subscriptions, or financial goals..."
          className="flex-1 rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function AIAssistantPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            <p className="text-xs text-slate-400 font-mono">Initializing FinPilot Co-Pilot Engine...</p>
          </div>
        </div>
      }
    >
      <AIAssistantContent />
    </React.Suspense>
  );
}

