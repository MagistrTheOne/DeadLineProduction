import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiChats, activityLog } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    
    const chats = await db
      .select()
      .from(aiChats)
      .where(eq(aiChats.userId, userId))
      .orderBy(aiChats.updatedAt);

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, agent = "vasily" } = await request.json();
    
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    const userId = session.userId;
    
    const [chat] = await db
      .insert(aiChats)
      .values({
        title: title.trim(),
        agent,
        userId,
      })
      .returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      type: "ai_chat",
      action: "created",
      payload: JSON.stringify({ chatId: chat.id, agent, title: title.trim() }),
    });

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Failed to create chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
