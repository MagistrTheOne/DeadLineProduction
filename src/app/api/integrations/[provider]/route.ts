import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { integrationSettings, activityLog } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider } = await params;
    const userId = session.userId;

    const settings = await db
      .select()
      .from(integrationSettings)
      .where(and(
        eq(integrationSettings.userId, userId),
        eq(integrationSettings.provider, provider)
      ))
      .limit(1);

    return NextResponse.json({ 
      settings: settings[0] || null,
      provider 
    });
  } catch (error) {
    console.error("Failed to fetch integration settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider } = await params;
    const userId = session.userId;
    const { enabled, autosync, intervalMin, config } = await request.json();

    // Upsert integration settings
    const [result] = await db
      .insert(integrationSettings)
      .values({
        userId,
        provider,
        enabled: enabled || false,
        autosync: autosync || false,
        intervalMin: intervalMin || 60,
        config: config ? JSON.stringify(config) : null,
      })
      .onConflictDoUpdate({
        target: [integrationSettings.userId, integrationSettings.provider],
        set: {
          enabled,
          autosync,
          intervalMin,
          config: config ? JSON.stringify(config) : null,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Log activity
    await db.insert(activityLog).values({
      userId,
      type: "integration",
      action: enabled ? "connected" : "disconnected",
      payload: JSON.stringify({ provider, enabled, autosync }),
    });

    return NextResponse.json({ 
      success: true,
      settings: result 
    });
  } catch (error) {
    console.error("Failed to update integration settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
