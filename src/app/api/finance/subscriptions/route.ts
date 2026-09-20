import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      orderBy: { nextBillingDate: "asc" },
    });

    const monthlyTotal = subscriptions
      .filter((s) => s.status === "ACTIVE")
      .reduce((sum, s) => sum + s.amount, 0);

    const annualTotal = monthlyTotal * 12;

    return NextResponse.json({
      subscriptions,
      metrics: {
        totalMonthly: monthlyTotal,
        totalAnnual: annualTotal,
        activeCount: subscriptions.filter((s) => s.status === "ACTIVE").length,
        priceIncreasesCount: subscriptions.filter((s) => s.hasPriceIncrease).length,
      },
    });
  } catch (error) {
    console.error("Subscriptions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { name, amount, billingCycle, nextBillingDate, category, paymentMethod } = data;

    const sub = await prisma.subscription.create({
      data: {
        userId: user.id,
        name,
        amount: parseFloat(amount),
        billingCycle: billingCycle || "Monthly",
        startDate: new Date(),
        nextBillingDate: nextBillingDate ? new Date(nextBillingDate) : new Date(Date.now() + 30 * 86400000),
        category: category || "Entertainment",
        paymentMethod: paymentMethod || "Credit Card",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, subscription: sub });
  } catch (error) {
    console.error("Subscription POST error:", error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await req.json();
    const updated = await prisma.subscription.update({
      where: { id, userId: user.id },
      data: { status },
    });

    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    console.error("Subscription PUT error:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
