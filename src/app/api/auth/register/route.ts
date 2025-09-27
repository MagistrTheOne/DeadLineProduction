import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/auth/config";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser[0]) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        role: "user",
        subscription: "basic",
      })
      .returning();

    // Create session
    await createSession({
      userId: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
      role: newUser[0].role,
      subscription: newUser[0].subscription || "basic",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        name: newUser[0].name,
        role: newUser[0].role,
        subscription: newUser[0].subscription,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
