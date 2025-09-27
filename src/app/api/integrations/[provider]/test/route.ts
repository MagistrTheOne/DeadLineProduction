import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/config";
import { testGigaChatConnection } from "@/lib/ai/gigachat";

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

    // Test different providers
    switch (provider) {
      case "gigachat":
        try {
          const isConnected = await testGigaChatConnection();
          return NextResponse.json({
            success: isConnected,
            message: isConnected 
              ? "GigaChat API подключен успешно" 
              : "Не удалось подключиться к GigaChat API",
            provider,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "Ошибка при тестировании GigaChat API",
            error: error instanceof Error ? error.message : "Unknown error",
            provider,
            timestamp: new Date().toISOString(),
          });
        }

      case "websocket":
        // Test WebSocket connection
        try {
          const WebSocket = require('ws');
          const wsUrl = process.env.WEBSOCKET_URL || "ws://localhost:3001";
          
          return new Promise((resolve) => {
            const ws = new WebSocket(wsUrl);
            const timeout = setTimeout(() => {
              ws.close();
              resolve(NextResponse.json({
                success: false,
                message: "WebSocket сервер недоступен (таймаут)",
                provider,
                timestamp: new Date().toISOString(),
              }));
            }, 3000);

            ws.on('open', () => {
              clearTimeout(timeout);
              ws.close();
              resolve(NextResponse.json({
                success: true,
                message: "WebSocket сервер доступен",
                provider,
                timestamp: new Date().toISOString(),
              }));
            });

            ws.on('error', (error) => {
              clearTimeout(timeout);
              resolve(NextResponse.json({
                success: false,
                message: "WebSocket сервер недоступен",
                error: error.message,
                provider,
                timestamp: new Date().toISOString(),
              }));
            });
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "WebSocket сервер недоступен",
            error: error instanceof Error ? error.message : "Unknown error",
            provider,
            timestamp: new Date().toISOString(),
          });
        }

      case "slack":
      case "github":
        return NextResponse.json({
          success: false,
          message: "Интеграция не реализована",
          provider,
          timestamp: new Date().toISOString(),
        }, { status: 501 });

      case "neon":
        // Test Neon database connection
        try {
          const { db } = await import("@/lib/db");
          await db.execute("SELECT 1");
          return NextResponse.json({
            success: true,
            message: "Neon database подключен успешно",
            provider,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          return NextResponse.json({
            success: false,
            message: "Ошибка подключения к Neon database",
            error: error instanceof Error ? error.message : "Unknown error",
            provider,
            timestamp: new Date().toISOString(),
          });
        }

      default:
        return NextResponse.json({
          success: false,
          message: "Неизвестный провайдер интеграции",
          provider,
          timestamp: new Date().toISOString(),
        }, { status: 400 });
    }
  } catch (error) {
    console.error("Integration test error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        message: "Ошибка при тестировании интеграции"
      },
      { status: 500 }
    );
  }
}
