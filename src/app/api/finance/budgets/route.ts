import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const categories = await prisma.category.findMany({
      where: { userId: user.id, type: "Expense" },
    });

    return NextResponse.json({ budgets, categories });
  } catch (error) {
    console.error("Budgets GET error:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, totalAmount, period, items } = await req.json();

    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        name: name || "Monthly Flight Budget",
        totalAmount: parseFloat(totalAmount) || 80000,
        period: period || "Monthly",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 86400000),
        items: {
          create: (items || []).map((item: any) => ({
            categoryId: item.categoryId,
            allocated: parseFloat(item.allocated) || 0,
            spent: parseFloat(item.spent) || 0,
          })),
        },
      },
      include: {
        items: { include: { category: true } },
      },
    });

    return NextResponse.json({ success: true, budget });
  } catch (error) {
    console.error("Budget POST error:", error);
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 });
  }
}
