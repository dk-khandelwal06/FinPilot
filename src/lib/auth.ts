import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "finpilot-dev-secret-key-agentic-ai-hackathon-2026");

const COOKIE_NAME = "finpilot_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSessionToken(payload: SessionPayload): string {
  const secret = JWT_SECRET || "finpilot-dev-secret-key-agentic-ai-hackathon-2026";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const secret = JWT_SECRET || "finpilot-dev-secret-key-agentic-ai-hackathon-2026";
    return jwt.verify(token, secret) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
    };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function getAuthOrDemoUser() {
  const user = await getCurrentUser();
  if (user) return user;

  const demo = await prisma.user.findFirst({
    where: { role: "DEMO" },
    include: { profile: true },
  });

  if (demo) {
    return {
      id: demo.id,
      email: demo.email,
      name: demo.name,
      role: demo.role,
      profile: demo.profile,
    };
  }

  return null;
}

