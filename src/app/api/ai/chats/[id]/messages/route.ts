import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiMessages, aiChats, activityLog } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { sendMessageToGigaChat } from "@/lib/ai/gigachat";
import { getSession } from "@/lib/auth/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatId } = await params;
    
    const messages = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.chatId, chatId))
      .orderBy(aiMessages.createdAt);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: chatId } = await params;
    const { content, agent = "vasily" } = await request.json();
    
    // Сохраняем сообщение пользователя
    const [userMessage] = await db
      .insert(aiMessages)
      .values({
        chatId,
        role: "user",
        content,
      })
      .returning();

    // Получаем историю сообщений для контекста
    const messageHistory = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.chatId, chatId))
      .orderBy(aiMessages.createdAt);

    // Подготавливаем сообщения для GigaChat
    const gigaChatMessages = messageHistory.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    }));

    // Создаем поток ответа
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Получаем поток от GigaChat
          const gigaChatStream = await sendMessageToGigaChat(gigaChatMessages, agent);
          const reader = gigaChatStream.getReader();
          
          let assistantContent = "";
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.type === 'content' && data.content) {
                    assistantContent += data.content;
                    
                    // Отправляем чанк клиенту
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${JSON.stringify({
                        type: 'content',
                        content: data.content
                      })}\n\n`)
                    );
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
          
          // Сохраняем полный ответ ассистента
          if (assistantContent) {
            await db
              .insert(aiMessages)
              .values({
                chatId,
                role: "assistant",
                content: assistantContent,
              });

            // Log activity
            await db.insert(activityLog).values({
              userId: session.userId,
              type: "ai_message",
              action: "assistant_response",
              payload: JSON.stringify({ chatId, agent, messageLength: assistantContent.length }),
            });
          }
          
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({
              type: 'error',
              error: 'Failed to get AI response'
            })}\n\n`)
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
