import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { queryFinanceAssistant } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userId = user.id;

    // Fetch user context
    const accounts = await prisma.account.findMany({ where: { userId } });
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    const incomes = await prisma.income.findMany({ where: { userId } });
    const monthlyIncome = incomes.reduce((sum, i) => sum + i.amount, 0) || 145000;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      take: 40,
    });

    const expenseTxs = transactions.filter((t) => t.type === "Expense");
    const monthlyExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

    const categorySpending: Record<string, number> = {};
    for (const t of expenseTxs) {
      const cat = t.category?.name || "Other";
      categorySpending[cat] = (categorySpending[cat] || 0) + t.amount;
    }

    const budget = await prisma.budget.findFirst({
      where: { userId },
      include: { items: { include: { category: true } } },
    });

    const activeBudgets = (budget?.items || []).map((item) => ({
      category: item.category.name,
      allocated: item.allocated,
      spent: item.spent,
    }));

    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: "ACTIVE" },
    });

    const bills = await prisma.bill.findMany({
      where: { userId },
      take: 5,
    });

    const goals = await prisma.goal.findMany({
      where: { userId },
    });

    const context = {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate: Math.max(0, Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)),
      remainingBudget: Math.max(0, (budget?.totalAmount || 95000) - monthlyExpenses),
      recentTransactions: transactions.map((t) => ({
        amount: t.amount,
        merchant: t.merchant,
        category: t.category?.name || "General",
        date: t.date.toISOString().split("T")[0],
        type: t.type,
      })),
      categorySpending,
      activeBudgets,
      subscriptions: subscriptions.map((s) => ({
        name: s.name,
        amount: s.amount,
        billingCycle: s.billingCycle,
      })),
      bills: bills.map((b) => ({
        title: b.title,
        amount: b.amount,
        dueDate: b.dueDate.toISOString().split("T")[0],
        status: b.status,
      })),
      goals: goals.map((g) => ({
        title: g.title,
        current: g.currentAmount,
        target: g.targetAmount,
        monthly: g.monthlyContribution,
      })),
    };

    const response = await queryFinanceAssistant(message, context);

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 });
  }
}
