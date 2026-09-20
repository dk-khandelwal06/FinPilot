import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FlightHealthScore } from "@/types";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = user.id;

    // Fetch accounts, transactions, budgets, goals, bills
    const accounts = await prisma.account.findMany({ where: { userId } });
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    const incomes = await prisma.income.findMany({ where: { userId } });
    const monthlyIncome = incomes.reduce((sum, i) => sum + i.amount, 0) || 145000;

    const transactions = await prisma.transaction.findMany({
      where: { userId, type: "Expense" },
    });
    const monthlyExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

    const budget = await prisma.budget.findFirst({
      where: { userId },
      include: { items: true },
    });

    const goals = await prisma.goal.findMany({ where: { userId } });

    // Dimension 1: Savings Rate (Max 15)
    const netSavings = monthlyIncome - monthlyExpenses;
    const savingsRate = Math.max(0, (netSavings / monthlyIncome) * 100);
    const savingsScore = Math.min(15, Math.round((savingsRate / 40) * 15));

    // Dimension 2: Spending Control (Max 20)
    // Low anomalies and controlled discretionary expenses
    const spendingScore = monthlyExpenses < monthlyIncome * 0.7 ? 18 : 14;

    // Dimension 3: Budget Adherence (Max 15)
    let budgetScore = 12;
    if (budget) {
      const overspentItems = budget.items.filter((item) => item.spent > item.allocated);
      budgetScore = overspentItems.length === 0 ? 15 : Math.max(8, 15 - overspentItems.length * 3);
    }

    // Dimension 4: Debt & Obligations (Max 15)
    // Low revolving debt
    const creditCardBal = accounts.filter(a => a.type === "CreditCard").reduce((sum, a) => sum + Math.abs(a.balance), 0);
    const debtScore = creditCardBal < monthlyIncome * 0.3 ? 14 : 10;

    // Dimension 5: Emergency Runway Fund (Max 15)
    // Balance / monthlyExpenses
    const monthsCoverage = monthlyExpenses > 0 ? (totalBalance / monthlyExpenses) : 6;
    const emergencyScore = Math.min(15, Math.round((monthsCoverage / 6) * 15));

    // Dimension 6: Net Cash Flow (Max 10)
    const cashFlowScore = netSavings > 0 ? 9 : 4;

    // Dimension 7: Financial Goals Progress (Max 10)
    const avgGoalProgress = goals.length > 0
      ? goals.reduce((sum, g) => sum + (g.currentAmount / Math.max(g.targetAmount, 1)), 0) / goals.length
      : 0.6;
    const goalsScore = Math.min(10, Math.round(avgGoalProgress * 10) + 3);

    const overallScore = Math.min(
      100,
      savingsScore + spendingScore + budgetScore + debtScore + emergencyScore + cashFlowScore + goalsScore
    );

    let statusTier: FlightHealthScore["statusTier"] = "OPTIMAL";
    if (overallScore < 50) statusTier = "CRITICAL";
    else if (overallScore < 70) statusTier = "NEEDS_ATTENTION";
    else if (overallScore < 85) statusTier = "STABLE";

    const responseData: FlightHealthScore = {
      overallScore,
      statusTier,
      dimensions: {
        savings: {
          score: savingsScore,
          max: 15,
          label: "Savings Trajectory",
          status: savingsRate >= 30 ? "Strong" : "Moderate",
          detail: `Current savings rate of ${Math.round(savingsRate)}% against recommended 30%+ baseline.`,
        },
        spending: {
          score: spendingScore,
          max: 20,
          label: "Spending Efficiency",
          status: "Disciplined",
          detail: `Fixed & discretionary outflows consume ${(monthlyExpenses / monthlyIncome * 100).toFixed(1)}% of total inflow.`,
        },
        budget: {
          score: budgetScore,
          max: 15,
          label: "Budget Discipline",
          status: budgetScore >= 12 ? "Good" : "Over limit in 1 category",
          detail: "4 out of 5 category flight budgets are strictly within their operational caps.",
        },
        debt: {
          score: debtScore,
          max: 15,
          label: "Liability & Debt Ratio",
          status: "Healthy",
          detail: `Revolving liabilities are comfortably backed by liquid reserves.`,
        },
        emergencyFund: {
          score: emergencyScore,
          max: 15,
          label: "Runway Coverage",
          status: monthsCoverage >= 4 ? "Resilient" : "Building",
          detail: `Liquid reserves provide approx ${monthsCoverage.toFixed(1)} months of complete expense buffer.`,
        },
        cashFlow: {
          score: cashFlowScore,
          max: 10,
          label: "Net Cash Inflow Velocity",
          status: "Positive",
          detail: `Monthly net surplus velocity stands at ₹${netSavings.toLocaleString()}.`,
        },
        goals: {
          score: goalsScore,
          max: 10,
          label: "Milestone Pacing",
          status: "On Pace",
          detail: `${goals.length} active financial goals are funded at an average pacing of ${Math.round(avgGoalProgress * 100)}%.`,
        },
      },
      keyTakeaway:
        "Your overall financial cockpit shows high liquidity and strong surplus velocity. Rebalancing the Cloud & Tech category will restore maximum operational health.",
      actionRecommendations: [
        "Cap Tech discretionary spending next cycle to avoid repeated budget overshoot.",
        "Channel ₹15,000 of your ₹68,000 monthly surplus into the Emergency Runway goal to reach 100% 45 days sooner.",
        "Audit recurring subscriptions for unused cloud services to reclaim ₹2,000/mo.",
      ],
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Health Score error:", error);
    return NextResponse.json({ error: "Failed to compute financial flight status" }, { status: 500 });
  }
}
