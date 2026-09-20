import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSessionToken } from "@/lib/auth";
import { seedDemoUser, DEMO_USER_EMAIL } from "@/lib/demo-data";

export async function POST() {
  try {
    let user = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      include: { profile: true },
    });

    if (!user) {
      await seedDemoUser();
      user = await prisma.user.findUnique({
        where: { email: DEMO_USER_EMAIL },
        include: { profile: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Could not initialize demo user" }, { status: 500 });
    }

    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("finpilot_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ error: "Failed to initialize demo session" }, { status: 500 });
  }
}
