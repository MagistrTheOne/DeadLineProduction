import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      subscription: session.subscription,
    });
  } catch (error) {
    console.error("Get user error:", error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
