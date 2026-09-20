import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const anomalies = await prisma.transaction.findMany({
      where: { userId: user.id, isAnomaly: true },
      include: { category: true, account: true },
      orderBy: { date: "desc" },
    });

    const totalAnomalousAmount = anomalies.reduce((sum, a) => sum + a.amount, 0);

    return NextResponse.json({
      anomalies: anomalies.map((a) => ({
        id: a.id,
        amount: a.amount,
        merchant: a.merchant,
        category: a.category?.name || "Uncategorized",
        categoryColor: a.category?.color || "#EF4444",
        accountName: a.account?.name || "Credit Card",
        date: a.date.toISOString(),
        reason: a.anomalyReason || "Significant statistical variance from historical patterns",
        severity: a.amount > 10000 ? "HIGH" : "MEDIUM",
      })),
      count: anomalies.length,
      totalAmount: totalAnomalousAmount,
    });
  } catch (error) {
    console.error("Anomalies GET error:", error);
    return NextResponse.json({ error: "Failed to fetch anomalies" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    const updated = await prisma.transaction.update({
      where: { id, userId: user.id },
      data: { isAnomaly: false, anomalyReason: null },
    });

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    console.error("Anomalies PUT error:", error);
    return NextResponse.json({ error: "Failed to resolve anomaly" }, { status: 500 });
  }
}
