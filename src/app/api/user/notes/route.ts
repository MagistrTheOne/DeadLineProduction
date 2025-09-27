import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userNotes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    const notes = await db
      .select()
      .from(userNotes)
      .where(eq(userNotes.userId, userId))
      .orderBy(userNotes.updatedAt);

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Failed to fetch user notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
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

    const { content } = await request.json();
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const userId = session.userId;

    const [note] = await db
      .insert(userNotes)
      .values({
        userId,
        content: content.trim(),
      })
      .returning();

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Failed to create user note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, content } = await request.json();
    if (!id || !content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "ID and content are required" },
        { status: 400 }
      );
    }

    const userId = session.userId;

    const [updatedNote] = await db
      .update(userNotes)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(userNotes.id, id))
      .returning();

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("Failed to update user note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
