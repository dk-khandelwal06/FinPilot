import { AffordabilityAnalysis, WhatIfSimulationResult } from "@/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface FinancialContext {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalBalance: number;
  savingsRate: number;
  remainingBudget: number;
  recentTransactions: Array<{
    amount: number;
    merchant: string;
    category: string;
    date: string;
    type: string;
  }>;
  categorySpending: Record<string, number>;
  activeBudgets: Array<{ category: string; allocated: number; spent: number }>;
  subscriptions: Array<{ name: string; amount: number; billingCycle: string }>;
  bills: Array<{ title: string; amount: number; dueDate: string; status: string }>;
  goals: Array<{ title: string; current: number; target: number; monthly: number }>;
}

const SYSTEM_SAFETY_PREAMBLE = `You are FinPilot Intelligence, an advanced personal finance decision-support AI co-pilot created by Daksh Khandelwal and Khushi Kushwah for the Agentic AI Hackathon 2026.
IMPORTANT COMPLIANCE & SAFETY RULE:
- You are an informational financial decision-support tool. You are NOT an investment advisor, legal advisor, or tax professional.
- NEVER provide personalized investment recommendations, stock picks, crypto buy signals, or speculative advice.
- ALWAYS append or include this disclaimer in significant advice: "FinPilot is an informational financial decision-support tool. It does not provide investment, tax, legal, lending, or professional financial advice."
- Do NOT hallucinate transactions, merchants, or balances. Ground your answers ONLY on the provided financial context.
- When referencing amounts, cite actual categories or counts (e.g., "Based on 7 transactions in Food & Dining").
- Keep tone professional, encouraging, clear, and action-oriented like an aviation flight navigation cockpit.`;

async function callGemini(prompt: string, systemInstruction: string = SYSTEM_SAFETY_PREAMBLE): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini API");
  return text;
}

// 1. AI Finance Assistant Chat
export async function queryFinanceAssistant(
  userMessage: string,
  context: FinancialContext
): Promise<{ answer: string; citations: string[] }> {
  const contextSummary = JSON.stringify({
    totalBalance: context.totalBalance,
    monthlyIncome: context.monthlyIncome,
    monthlyExpenses: context.monthlyExpenses,
    savingsRate: `${context.savingsRate}%`,
    remainingBudget: context.remainingBudget,
    topCategories: context.categorySpending,
    activeSubscriptions: context.subscriptions.map((s) => `${s.name} (₹${s.amount}/${s.billingCycle})`),
    upcomingBills: context.bills.map((b) => `${b.title} (₹${b.amount}, due ${b.dueDate})`),
    goals: context.goals.map((g) => `${g.title}: ₹${g.current}/₹${g.target}`),
    sampleTransactions: context.recentTransactions.slice(0, 15),
  }, null, 2);

  const prompt = `Here is the user's verified financial context:
${contextSummary}

User question: "${userMessage}"

Provide a direct, explainable, grounded response. If the data is not in the context, explicitly say "I don't have enough verified transaction data to answer that accurately."
Cite specific transaction records, category totals, or budget figures that support your answer. End with an actionable recommendation.`;

  try {
    const answer = await callGemini(prompt);
    
    // Extract citations
    const citations: string[] = [];
    if (userMessage.toLowerCase().includes("food") || userMessage.toLowerCase().includes("dining")) {
      citations.push("Food & Dining category data (₹" + (context.categorySpending["Food"] || 0) + ")");
    }
    if (userMessage.toLowerCase().includes("subscription")) {
      citations.push(`${context.subscriptions.length} detected active recurring subscriptions`);
    }
    citations.push(`Verified cash balance of ₹${context.totalBalance.toLocaleString()}`);

    return { answer, citations };
  } catch (error) {
    console.warn("Gemini API call failed, using grounded algorithmic fallback:", error);
    return fallbackAssistantResponse(userMessage, context);
  }
}

// Grounded fallback if network / API key issue
function fallbackAssistantResponse(userMessage: string, context: FinancialContext) {
  const query = userMessage.toLowerCase();
  let answer = "";
  const citations: string[] = [];

  if (query.includes("where did my money go") || query.includes("spent") || query.includes("spend the most")) {
    const sortedCats = Object.entries(context.categorySpending).sort((a, b) => b[1] - a[1]);
    const topCat = sortedCats[0] || ["General", 0];
    const secondCat = sortedCats[1] || ["Other", 0];
    answer = `Based on your recent transactions, your highest spending category is **${topCat[0]}** at ₹${topCat[1].toLocaleString()} (${Math.round((topCat[1] / Math.max(context.monthlyExpenses, 1)) * 100)}% of total monthly expenses), followed by **${secondCat[0]}** at ₹${secondCat[1].toLocaleString()}.\n\nYour total recorded expenses stand at ₹${context.monthlyExpenses.toLocaleString()} against an income of ₹${context.monthlyIncome.toLocaleString()}, leaving a net monthly surplus of ₹${(context.monthlyIncome - context.monthlyExpenses).toLocaleString()} (${context.savingsRate}% savings rate).`;
    citations.push(`${sortedCats.length} active spending categories analyzed`);
    citations.push(`Total expense ledger: ₹${context.monthlyExpenses.toLocaleString()}`);
  } else if (query.includes("subscription")) {
    const subTotal = context.subscriptions.reduce((sum, s) => sum + s.amount, 0);
    const subList = context.subscriptions.map(s => `• **${s.name}**: ₹${s.amount.toLocaleString()}/${s.billingCycle}`).join("\n");
    answer = `You currently have **${context.subscriptions.length} active subscriptions** committing **₹${subTotal.toLocaleString()}/month** (approx. ₹${(subTotal * 12).toLocaleString()}/year):\n\n${subList}\n\nReviewing these can free up immediate cash flow for your financial goals.`;
    citations.push(`${context.subscriptions.length} recurring subscription records verified`);
  } else if (query.includes("reduce") || query.includes("save")) {
    answer = `Analyzing your spending trends reveals 2 clear optimization opportunities:\n1. **Dining & Entertainment**: You spent ₹${(context.categorySpending["Food"] || 0).toLocaleString()} this cycle. A 15% reduction would save approx ₹${Math.round((context.categorySpending["Food"] || 0) * 0.15).toLocaleString()}/month.\n2. **Subscriptions**: You have ${context.subscriptions.length} recurring tools/services totaling ₹${context.subscriptions.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}/month. Canceling unused services could directly accelerate your goals.`;
    citations.push("Category spending variance analysis");
  } else {
    answer = `Here is your current financial flight overview:\n• **Net Balance**: ₹${context.totalBalance.toLocaleString()}\n• **Monthly Inflow**: ₹${context.monthlyIncome.toLocaleString()}\n• **Monthly Outflow**: ₹${context.monthlyExpenses.toLocaleString()}\n• **Savings Rate**: ${context.savingsRate}%\n• **Remaining Budget**: ₹${context.remainingBudget.toLocaleString()}\n\nHow can I help you navigate your finances today? You can ask about subscriptions, upcoming bills, or test a "Can I Afford This?" scenario.`;
    citations.push("Live Account & Budget ledger");
  }

  answer += `\n\n*Disclaimer: FinPilot is an informational financial decision-support tool. It does not provide investment, tax, legal, lending, or professional financial advice.*`;
  return { answer, citations };
}

// 2. "Can I Afford This?" Affordability Decision Engine
export async function evaluateAffordability(
  purchaseAmount: number,
  purchaseName: string,
  category: string,
  context: FinancialContext
): Promise<AffordabilityAnalysis> {
  const currentSurplus = context.monthlyIncome - context.monthlyExpenses;
  const projectedSurplus = currentSurplus - purchaseAmount;
  const projectedBalance = context.totalBalance - purchaseAmount;

  // Find matching budget if any
  const matchedBudget = context.activeBudgets.find(b => b.category.toLowerCase() === category.toLowerCase()) || {
    category,
    allocated: 20000,
    spent: context.categorySpending[category] || 8000,
  };

  const newCategoryTotal = matchedBudget.spent + purchaseAmount;
  const willExceed = newCategoryTotal > matchedBudget.allocated;
  const overage = willExceed ? newCategoryTotal - matchedBudget.allocated : 0;

  // Impact on primary goal
  const primaryGoal = context.goals[0] || { title: "Emergency Fund", current: 50000, target: 150000, monthly: 15000 };
  const goalDelayMonths = primaryGoal.monthly > 0 ? Number((purchaseAmount / primaryGoal.monthly).toFixed(1)) : 1;

  let canAfford: AffordabilityAnalysis["canAfford"] = "YES_COMFORTABLE";
  if (projectedBalance < 15000 || projectedSurplus < 0) {
    canAfford = "NOT_RECOMMENDED";
  } else if (willExceed || projectedSurplus < currentSurplus * 0.3) {
    canAfford = "FEASIBLE_WITH_ADJUSTMENTS";
  }

  const prompt = `Analyze this purchase decision:
- Item: ${purchaseName}
- Amount: ₹${purchaseAmount}
- User Current Balance: ₹${context.totalBalance}
- Monthly Income: ₹${context.monthlyIncome}
- Current Monthly Expenses: ₹${context.monthlyExpenses}
- Current Monthly Surplus: ₹${currentSurplus}
- Projected Monthly Surplus after purchase: ₹${projectedSurplus}
- Category: ${category} (Allocated: ₹${matchedBudget.allocated}, Spent so far: ₹${matchedBudget.spent})
- Primary Goal: ${primaryGoal.title} (Target: ₹${primaryGoal.target}, Monthly contribution: ₹${primaryGoal.monthly})

Provide a structured analysis. DO NOT say "Yes you should buy it" or "No do not buy it". Say "Based on the data provided, this purchase would reduce your monthly surplus by ₹${purchaseAmount}."
Return concise bullets for alternative options and constraints.`;

  let impactSummary = `Based on the data provided, this purchase of ₹${purchaseAmount.toLocaleString()} would reduce your projected monthly surplus from ₹${currentSurplus.toLocaleString()} to ₹${projectedSurplus.toLocaleString()}.`;

  try {
    const aiText = await callGemini(prompt);
    impactSummary = aiText.slice(0, 350);
  } catch {
    // Grounded fallback
    if (canAfford === "NOT_RECOMMENDED") {
      impactSummary = `Based on your verified financial ledger, spending ₹${purchaseAmount.toLocaleString()} will cause your monthly cash flow to dip into a deficit of ₹${Math.abs(projectedSurplus).toLocaleString()} and severely deplete your available liquidity.`;
    } else if (canAfford === "FEASIBLE_WITH_ADJUSTMENTS") {
      impactSummary = `Based on your records, this purchase of ₹${purchaseAmount.toLocaleString()} is feasible, but it will exceed your ${category} budget by ₹${overage.toLocaleString()} and delay your "${primaryGoal.title}" milestone by approx ${goalDelayMonths} months.`;
    }
  }

  return {
    purchaseAmount,
    purchaseName,
    canAfford,
    impactSummary,
    currentMonthlySurplus: currentSurplus,
    projectedMonthlySurplus: projectedSurplus,
    budgetImpact: {
      category,
      currentAllocated: matchedBudget.allocated,
      currentSpent: matchedBudget.spent,
      newTotal: newCategoryTotal,
      willExceed,
      overageAmount: overage,
    },
    goalImpact: {
      affectedGoalName: primaryGoal.title,
      delayMonths: goalDelayMonths,
      message: `Allocating ₹${purchaseAmount.toLocaleString()} to this purchase is equivalent to ${goalDelayMonths} months of contributions to ${primaryGoal.title}.`,
    },
    cashFlowImpact: {
      lowBalanceWarning: projectedBalance < 20000,
      lowestProjectedBalance: projectedBalance,
      projectedDate: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
    },
    alternativeOptions: [
      `Save ₹${Math.round(purchaseAmount / 3).toLocaleString()}/month over 3 months to purchase without depleting surplus`,
      `Offset cost by reducing non-essential dining/subscriptions by ₹${Math.round(purchaseAmount * 0.3).toLocaleString()}`,
      `Consider pre-owned or deferred purchase until your ${primaryGoal.title} reaches 70%`,
    ],
    calculationsExplanation: [
      `Current monthly income: ₹${context.monthlyIncome.toLocaleString()} - committed expenses: ₹${context.monthlyExpenses.toLocaleString()} = ₹${currentSurplus.toLocaleString()} surplus`,
      `After one-time deduction: ₹${currentSurplus.toLocaleString()} - ₹${purchaseAmount.toLocaleString()} = ₹${projectedSurplus.toLocaleString()} net margin`,
      `Safety liquidity buffer post-purchase: ₹${projectedBalance.toLocaleString()}`,
    ],
  };
}

// 3. What-If Scenario Simulator
export async function runWhatIfSimulation(
  scenarioType: "EXTRA_EXPENSE" | "INCOME_DROP" | "SAVINGS_INCREASE" | "CANCEL_SUBSCRIPTIONS",
  amount: number,
  context: FinancialContext
): Promise<WhatIfSimulationResult> {
  const baseIncome = context.monthlyIncome;
  const baseExpenses = context.monthlyExpenses;
  const baseSurplus = baseIncome - baseExpenses;
  const baseSavingsRate = Math.max(0, Math.round((baseSurplus / Math.max(baseIncome, 1)) * 100));
  const baseYearEnd = context.totalBalance + baseSurplus * 12;

  let simIncome = baseIncome;
  let simExpenses = baseExpenses;
  let scenarioName = "Custom Scenario";

  switch (scenarioType) {
    case "EXTRA_EXPENSE":
      simExpenses = baseExpenses + amount;
      scenarioName = `Spend ₹${amount.toLocaleString()} Extra Monthly`;
      break;
    case "INCOME_DROP":
      simIncome = Math.max(0, baseIncome - amount);
      scenarioName = `Income Reduction of ₹${amount.toLocaleString()} (-${Math.round((amount / baseIncome) * 100)}%)`;
      break;
    case "SAVINGS_INCREASE":
      simExpenses = Math.max(0, baseExpenses - amount);
      scenarioName = `Boost Savings by ₹${amount.toLocaleString()}/mo`;
      break;
    case "CANCEL_SUBSCRIPTIONS":
      simExpenses = Math.max(0, baseExpenses - amount);
      scenarioName = `Cancel ₹${amount.toLocaleString()} in Subscriptions`;
      break;
  }

  const simSurplus = simIncome - simExpenses;
  const simSavingsRate = Math.max(0, Math.round((simSurplus / Math.max(simIncome, 1)) * 100));
  const simYearEnd = context.totalBalance + simSurplus * 12;
  const surplusChange = simSurplus - baseSurplus;
  const annualNetImpact = surplusChange * 12;

  return {
    scenarioName,
    baseline: {
      monthlyIncome: baseIncome,
      monthlyExpenses: baseExpenses,
      monthlySurplus: baseSurplus,
      savingsRate: baseSavingsRate,
      projectedYearEndBalance: baseYearEnd,
    },
    simulated: {
      monthlyIncome: simIncome,
      monthlyExpenses: simExpenses,
      monthlySurplus: simSurplus,
      savingsRate: simSavingsRate,
      projectedYearEndBalance: simYearEnd,
    },
    deltas: {
      surplusChange,
      savingsRateChange: simSavingsRate - baseSavingsRate,
      annualNetImpact,
    },
    keyObservations: [
      `Monthly surplus would shift from ₹${baseSurplus.toLocaleString()} to ₹${simSurplus.toLocaleString()} (${surplusChange >= 0 ? "+" : ""}₹${surplusChange.toLocaleString()}/month).`,
      `Over 12 months, this represents a net financial shift of ₹${annualNetImpact.toLocaleString()} in your total wealth trajectory.`,
      `Your personal savings rate moves from ${baseSavingsRate}% to ${simSavingsRate}%.`,
    ],
    recommendedAdjustments: [
      surplusChange < 0
        ? "Rebalance discretionary categories like Entertainment or Shopping to absorb the delta."
        : "Direct the additional surplus toward your highest priority goal to accelerate completion.",
      "Review your 3-month cash flow forecast to confirm liquidity remains healthy.",
    ],
  };
}
