import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/config";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0]) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // In a real app, you would hash passwords and compare
    // For now, we'll use a simple check (replace with bcrypt in production)
    const isValidPassword = password === "password123"; // Replace with actual password check

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    await createSession({
      userId: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
      subscription: user[0].subscription || "basic",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
        subscription: user[0].subscription,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
