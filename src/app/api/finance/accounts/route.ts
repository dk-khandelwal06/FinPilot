import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { balance: "desc" },
    });

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    return NextResponse.json({ accounts, totalBalance });
  } catch (error) {
    console.error("Accounts GET error:", error);
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, type, balance, institution, accountNumber, color } = await req.json();

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        name,
        type: type || "Checking",
        balance: parseFloat(balance) || 0,
        institution: institution || "Bank",
        accountNumber: accountNumber || "•••• 0000",
        color: color || "#06B6D4",
      },
    });

    return NextResponse.json({ success: true, account });
  } catch (error) {
    console.error("Account POST error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
