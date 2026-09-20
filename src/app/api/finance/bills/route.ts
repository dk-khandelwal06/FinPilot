import { NextResponse } from "next/server";
import { getAuthOrDemoUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const bills = await prisma.bill.findMany({
      where: { userId: user.id },
      orderBy: { dueDate: "asc" },
    });

    const unpaidTotal = bills
      .filter((b) => b.status === "UNPAID")
      .reduce((sum, b) => sum + b.amount, 0);

    return NextResponse.json({ bills, unpaidTotal });
  } catch (error) {
    console.error("Bills GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthOrDemoUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await req.json();
    const updated = await prisma.bill.update({
      where: { id, userId: user.id },
      data: { status },
    });

    return NextResponse.json({ success: true, bill: updated });
  } catch (error) {
    console.error("Bill PUT error:", error);
    return NextResponse.json({ error: "Failed to update bill" }, { status: 500 });
  }
}
