import type { Metadata } from "next";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "FinPilot — AI-Powered Personal Finance Decision Support Engine",
  description:
    "Created by Daksh Khandelwal and Khushi Kushwah for the Agentic AI Hackathon 2026. FinPilot turns scattered financial data into clear, explainable, and actionable insights with an intelligent financial cockpit.",
  keywords: [
    "FinPilot",
    "Personal Finance",
    "AI Decision Support",
    "Agentic AI Hackathon 2026",
    "Daksh Khandelwal",
    "Khushi Kushwah",
    "Financial Cockpit",
    "Affordability Engine",
    "What-If Simulator",
  ],
  authors: [
    { name: "Daksh Khandelwal" },
    { name: "Khushi Kushwah" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#090D16] text-slate-100 antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
