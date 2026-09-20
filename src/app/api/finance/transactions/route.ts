import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const anomalyOnly = searchParams.get("anomaly") === "true";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const whereClause: any = { userId: user.id };

    if (search) {
      whereClause.OR = [
        { merchant: { contains: search } },
        { notes: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (category && category !== "ALL") {
      whereClause.category = { name: category };
    }

    if (type && type !== "ALL") {
      whereClause.type = type;
    }

    if (anomalyOnly) {
      whereClause.isAnomaly = true;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: { category: true, account: true },
      orderBy: { date: "desc" },
      take: limit,
    });

    const categories = await prisma.category.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, color: true, type: true },
    });

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, type: true, balance: true },
    });

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        date: t.date.toISOString(),
        merchant: t.merchant,
        category: t.category?.name || "General",
        categoryColor: t.category?.color || "#94A3B8",
        categoryId: t.categoryId,
        accountName: t.account?.name || "Cash",
        accountId: t.accountId,
        paymentMethod: t.paymentMethod,
        isRecurring: t.isRecurring,
        isAnomaly: t.isAnomaly,
        anomalyReason: t.anomalyReason,
        notes: t.notes,
        tags: t.tags,
      })),
      categories,
      accounts,
    });
  } catch (error) {
    console.error("Transactions GET error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { amount, type, merchant, categoryId, accountId, date, notes, paymentMethod, isRecurring } = data;

    if (!amount || !merchant) {
      return NextResponse.json({ error: "Amount and Merchant are required" }, { status: 400 });
    }

    const txDate = date ? new Date(date) : new Date();

    // Check for unusual spending / anomaly
    let isAnomaly = false;
    let anomalyReason: string | null = null;
    const numAmount = parseFloat(amount);

    if (numAmount > 15000 && type === "Expense") {
      isAnomaly = true;
      anomalyReason = `High amount: ₹${numAmount.toLocaleString()} is significantly above typical transaction size`;
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: numAmount,
        type: type || "Expense",
        merchant,
        categoryId: categoryId || null,
        accountId: accountId || null,
        date: txDate,
        notes: notes || null,
        paymentMethod: paymentMethod || "UPI",
        isRecurring: !!isRecurring,
        isAnomaly,
        anomalyReason,
      },
      include: { category: true, account: true },
    });

    // Update account balance if account selected
    if (accountId) {
      const delta = type === "Expense" ? -numAmount : numAmount;
      await prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: delta } },
      });
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Transaction POST error:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // Verify ownership
    const tx = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    });

    if (!tx) {
      return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 404 });
    }

    await prisma.transaction.delete({ where: { id } });

    // Revert account balance
    if (tx.accountId) {
      const revertDelta = tx.type === "Expense" ? tx.amount : -tx.amount;
      await prisma.account.update({
        where: { id: tx.accountId },
        data: { balance: { increment: revertDelta } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Transaction DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}
