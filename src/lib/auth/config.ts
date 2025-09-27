import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const secret = new TextEncoder().encode(env.SESSION_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin" | "owner";
  subscription: "basic" | "pro" | "enterprise";
  expiresAt: Date;
}

export async function createSession(payload: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session = new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    subscription: payload.subscription,
    expiresAt: expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  const sessionToken = await session;

  const cookieStore = await cookies();
  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    secure: env.NEXT_PUBLIC_APP_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return sessionToken;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return null;
    }

    const { payload } = await jwtVerify(session, secret);
    
    // Check if session is expired
    if (new Date(payload.expiresAt as string) < new Date()) {
      await deleteSession();
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "user" | "admin" | "owner",
      subscription: payload.subscription as "basic" | "pro" | "enterprise",
      expiresAt: new Date(payload.expiresAt as string),
    };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getUserFromSession(): Promise<typeof users.$inferSelect | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    console.error("Failed to get user from session:", error);
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}
