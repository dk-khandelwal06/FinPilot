import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runWhatIfSimulation } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { scenarioType, amount } = await req.json();

    const simAmount = parseFloat(amount);
    if (isNaN(simAmount) || simAmount <= 0) {
      return NextResponse.json({ error: "Valid scenario amount is required" }, { status: 400 });
    }

    const userId = user.id;

    // Fetch user context
    const accounts = await prisma.account.findMany({ where: { userId } });
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    const incomes = await prisma.income.findMany({ where: { userId } });
    const monthlyIncome = incomes.reduce((sum, i) => sum + i.amount, 0) || 145000;

    const transactions = await prisma.transaction.findMany({
      where: { userId, type: "Expense" },
    });
    const monthlyExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

    const context = {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)),
      remainingBudget: 0,
      recentTransactions: [],
      categorySpending: {},
      activeBudgets: [],
      subscriptions: [],
      bills: [],
      goals: [],
    };

    const result = await runWhatIfSimulation(scenarioType || "EXTRA_EXPENSE", simAmount, context);

    return NextResponse.json(result);
  } catch (error) {
    console.error("What-If error:", error);
    return NextResponse.json({ error: "Failed to run simulation" }, { status: 500 });
  }
}
