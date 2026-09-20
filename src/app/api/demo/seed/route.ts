import { NextResponse } from "next/server";
import { seedDemoUser } from "@/lib/demo-data";

export async function POST() {
  try {
    const user = await seedDemoUser();
    return NextResponse.json({
      success: true,
      message: "Alex Morgan demo dataset successfully refreshed",
      userId: user.id,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed demo data" }, { status: 500 });
  }
}
