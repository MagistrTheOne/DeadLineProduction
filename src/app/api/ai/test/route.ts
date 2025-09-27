import { NextRequest, NextResponse } from "next/server";
import { testGigaChatConnection } from "@/lib/ai/gigachat";
import { getSession } from "@/lib/auth/config";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isConnected = await testGigaChatConnection();
    
    return NextResponse.json({
      connected: isConnected,
      message: isConnected 
        ? "GigaChat API подключен успешно" 
        : "Не удалось подключиться к GigaChat API",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GigaChat test error:", error);
    return NextResponse.json(
      { 
        connected: false,
        error: "Internal server error",
        message: "Ошибка при тестировании подключения к GigaChat API"
      },
      { status: 500 }
    );
  }
}
