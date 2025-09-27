import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { aiInteractions } from "@/lib/db/schema";
import { sendMessageToGigaChat, parseGigaChatStream } from "@/lib/ai/gigachat";
import { getAgentById } from "@/lib/ai/agents";
import { env } from "@/lib/env";

const chatSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1, "Message content is required"),
  })).min(1, "At least one message is required"),
  projectId: z.string().uuid("Invalid project ID").optional(),
});

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    if (!checkRateLimit(session.userId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { agentId, messages, projectId } = chatSchema.parse(body);

    // Get agent configuration
    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Check if GigaChat credentials are available
    const hasGigaChatCredentials = !!(
      env.GIGACHAT_CLIENT_ID &&
      env.GIGACHAT_CLIENT_SECRET &&
      env.GIGACHAT_BASE_URL &&
      env.GIGACHAT_CLIENT_SECRET !== "your_client_secret_here"
    );

    if (!hasGigaChatCredentials) {
      // Return a mock response when credentials are not available
      const mockResponse = `Привет! Я ${agent.name}. К сожалению, GigaChat API не настроен, поэтому я не могу дать полноценный ответ. Пожалуйста, настройте переменные окружения GIGACHAT_CLIENT_ID, GIGACHAT_CLIENT_SECRET и GIGACHAT_BASE_URL для полноценной работы.`;

      // Log the interaction
      await db.insert(aiInteractions).values({
        agentType: agentId,
        prompt: messages[messages.length - 1]?.content || "",
        response: mockResponse,
        userId: session.userId,
      });

      return new NextResponse(
        new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            const chunks = mockResponse.split(" ");
            
            chunks.forEach((chunk, index) => {
              setTimeout(() => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: "content",
                  content: chunk + " "
                })}\n\n`));
                
                if (index === chunks.length - 1) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    type: "done"
                  })}\n\n`));
                  controller.close();
                }
              }, index * 100);
            });
          }
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        }
      );
    }

    // Prepare messages for GigaChat
    const systemMessage = {
      role: "system" as const,
      content: agent.systemPrompt,
    };

    const gigaChatMessages = [systemMessage, ...messages];

    // Get streaming response from GigaChat
    const stream = await sendMessageToGigaChat(gigaChatMessages, agentId);
    const parsedStream = parseGigaChatStream(stream);

    // Create a new stream that logs the interaction
    let fullResponse = "";
    
    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          try {
            const reader = parsedStream.getReader();
            
            while (true) {
              const { done, value } = await reader.read();
              
              if (done) {
                // Log the complete interaction
                await db.insert(aiInteractions).values({
                  agentType: agentId,
                  prompt: messages[messages.length - 1]?.content || "",
                  response: fullResponse,
                  userId: session.userId,
                });
                
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: "done"
                })}\n\n`));
                controller.close();
                break;
              }

              if (value.type === "content") {
                fullResponse += value.content;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: "content",
                  content: value.content
                })}\n\n`));
              } else if (value.type === "error") {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: "error",
                  error: value.error
                })}\n\n`));
                controller.close();
                break;
              }
            }
          } catch (error) {
            console.error("Stream error:", error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: "error",
              error: "Stream processing error"
            })}\n\n`));
            controller.close();
          }
        }
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("AI chat error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

