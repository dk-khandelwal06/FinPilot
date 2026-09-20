import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { targetDate: "asc" },
    });

    return NextResponse.json({
      goals: goals.map((g) => {
        const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
        const remaining = Math.max(0, g.targetAmount - g.currentAmount);
        const monthsLeft = g.monthlyContribution > 0 ? Math.ceil(remaining / g.monthlyContribution) : 0;
        return {
          ...g,
          progressPercentage: progress,
          remainingAmount: remaining,
          monthsToCompletion: monthsLeft,
        };
      }),
    });
  } catch (error) {
    console.error("Goals GET error:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, targetAmount, currentAmount, targetDate, monthlyContribution, category } = await req.json();

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        targetDate: targetDate ? new Date(targetDate) : new Date(Date.now() + 180 * 86400000),
        monthlyContribution: parseFloat(monthlyContribution) || 5000,
        category: category || "Savings",
      },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Goal POST error:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, contributionAmount } = await req.json();
    const amount = parseFloat(contributionAmount);

    const goal = await prisma.goal.update({
      where: { id, userId: user.id },
      data: { currentAmount: { increment: amount } },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Goal PUT error:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}
