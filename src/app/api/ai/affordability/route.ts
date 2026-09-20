import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluateAffordability } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount, item, category } = await req.json();

    const purchaseAmount = parseFloat(amount);
    if (isNaN(purchaseAmount) || purchaseAmount <= 0) {
      return NextResponse.json({ error: "Valid purchase amount is required" }, { status: 400 });
    }

    const userId = user.id;

    // Accounts
    const accounts = await prisma.account.findMany({ where: { userId } });
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    // Incomes
    const incomes = await prisma.income.findMany({ where: { userId } });
    const monthlyIncome = incomes.reduce((sum, i) => sum + i.amount, 0) || 145000;

    // Expenses
    const transactions = await prisma.transaction.findMany({
      where: { userId, type: "Expense" },
      include: { category: true },
    });
    const monthlyExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

    const categorySpending: Record<string, number> = {};
    for (const t of transactions) {
      const cat = t.category?.name || "Other";
      categorySpending[cat] = (categorySpending[cat] || 0) + t.amount;
    }

    // Budgets
    const budget = await prisma.budget.findFirst({
      where: { userId },
      include: { items: { include: { category: true } } },
    });

    const activeBudgets = (budget?.items || []).map((item) => ({
      category: item.category.name,
      allocated: item.allocated,
      spent: item.spent,
    }));

    // Goals
    const goals = await prisma.goal.findMany({ where: { userId } });

    const context = {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)),
      remainingBudget: Math.max(0, (budget?.totalAmount || 95000) - monthlyExpenses),
      recentTransactions: [],
      categorySpending,
      activeBudgets,
      subscriptions: [],
      bills: [],
      goals: goals.map((g) => ({
        title: g.title,
        current: g.currentAmount,
        target: g.targetAmount,
        monthly: g.monthlyContribution,
      })),
    };

    const analysis = await evaluateAffordability(
      purchaseAmount,
      item || "Planned Purchase",
      category || "Shopping",
      context
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Affordability error:", error);
    return NextResponse.json({ error: "Failed to evaluate affordability" }, { status: 500 });
  }
}
