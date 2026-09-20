import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedDemoUser } from "@/lib/demo-data";

export async function GET() {
  try {
    let user = await getAuthOrDemoUser();

    // If no user exists, seed demo user
    if (!user) {
      const seeded = await seedDemoUser();
      user = {
        id: seeded.id,
        email: seeded.email,
        name: seeded.name,
        role: seeded.role,
        profile: null,
      };
    }

    const userId = user.id;

    // 1. Accounts & Total Liquidity
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { balance: "desc" },
    });

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    // 2. Transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true, account: true },
      orderBy: { date: "desc" },
      take: 50,
    });

    // Compute monthly income & expenses from transactions & income table
    const incomes = await prisma.income.findMany({ where: { userId } });
    const totalMonthlyIncome = incomes.reduce((sum, i) => sum + i.amount, 0) || 145000;

    const expenseTransactions = transactions.filter((t) => t.type === "Expense");
    const totalMonthlyExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const netCashFlow = totalMonthlyIncome - totalMonthlyExpenses;
    const savingsRate = Math.max(0, Math.round((netCashFlow / Math.max(totalMonthlyIncome, 1)) * 100));

    // 3. Category Breakdown
    const categoryTotals: Record<string, { name: string; amount: number; color: string }> = {};
    for (const tx of expenseTransactions) {
      const catName = tx.category?.name || "Other";
      const catColor = tx.category?.color || "#94A3B8";
      if (!categoryTotals[catName]) {
        categoryTotals[catName] = { name: catName, amount: 0, color: catColor };
      }
      categoryTotals[catName].amount += tx.amount;
    }

    const categoryBreakdown = Object.values(categoryTotals).sort((a, b) => b.amount - a.amount);

    // 4. Budgets
    const budget = await prisma.budget.findFirst({
      where: { userId },
      include: {
        items: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalBudget = budget?.totalAmount || 95000;
    const budgetSpent = budget?.items.reduce((sum, item) => sum + item.spent, 0) || totalMonthlyExpenses;
    const remainingBudget = Math.max(0, totalBudget - budgetSpent);
    const budgetUtilization = Math.min(100, Math.round((budgetSpent / totalBudget) * 100));

    // 5. Subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: { userId, status: "ACTIVE" },
      orderBy: { nextBillingDate: "asc" },
    });
    const monthlySubscriptionCost = subscriptions.reduce((sum, s) => sum + s.amount, 0);

    // 6. Bills
    const bills = await prisma.bill.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });

    // 7. Goals
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { targetDate: "asc" },
    });

    // 8. Latest AI Insights
    const insights = await prisma.financialInsight.findMany({
      where: { userId, isDismissed: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 9. Notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    // 10. Cash Flow Trajectory points (past 30 days & projected 30 days)
    const trajectory = [
      { date: "Feb 20", actual: totalBalance - 42000, projected: totalBalance - 42000 },
      { date: "Feb 27", actual: totalBalance - 31000, projected: totalBalance - 31000 },
      { date: "Mar 01", actual: totalBalance + 55000, projected: totalBalance + 55000 },
      { date: "Mar 08", actual: totalBalance + 38000, projected: totalBalance + 38000 },
      { date: "Mar 15", actual: totalBalance + 12000, projected: totalBalance + 12000 },
      { date: "Mar 20 (Today)", actual: totalBalance, projected: totalBalance },
      { date: "Mar 27", projected: totalBalance - 14000 },
      { date: "Apr 01", projected: totalBalance + 115000 },
      { date: "Apr 15", projected: totalBalance + 85000 },
      { date: "Apr 30", projected: totalBalance + 72000 },
    ];

    return NextResponse.json({
      metrics: {
        totalBalance,
        totalIncome: totalMonthlyIncome,
        totalExpenses: totalMonthlyExpenses,
        totalSavings: netCashFlow,
        savingsRate,
        totalBudget,
        budgetSpent,
        remainingBudget,
        budgetUtilization,
        monthlySubscriptionCost,
        activeSubscriptionsCount: subscriptions.length,
      },
      accounts,
      categoryBreakdown,
      recentTransactions: transactions.slice(0, 10).map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        merchant: t.merchant,
        category: t.category?.name || "General",
        categoryColor: t.category?.color || "#94A3B8",
        date: t.date.toISOString(),
        paymentMethod: t.paymentMethod,
        isAnomaly: t.isAnomaly,
        anomalyReason: t.anomalyReason,
      })),
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        name: s.name,
        amount: s.amount,
        billingCycle: s.billingCycle,
        nextBillingDate: s.nextBillingDate.toISOString(),
        category: s.category,
        hasPriceIncrease: s.hasPriceIncrease,
        previousAmount: s.previousAmount,
      })),
      bills: bills.map((b) => ({
        id: b.id,
        title: b.title,
        amount: b.amount,
        dueDate: b.dueDate.toISOString(),
        status: b.status,
        category: b.category,
        autoPay: b.autoPay,
      })),
      goals: goals.map((g) => ({
        id: g.id,
        title: g.title,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        targetDate: g.targetDate.toISOString(),
        monthlyContribution: g.monthlyContribution,
        progressPercentage: Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)),
      })),
      insights,
      notifications,
      trajectory,
    });
  } catch (error) {
    console.error("Overview error:", error);
    return NextResponse.json({ error: "Failed to load financial cockpit" }, { status: 500 });
  }
}
