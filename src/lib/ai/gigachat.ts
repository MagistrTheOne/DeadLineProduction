import { env } from "@/lib/env";
import { AIStreamChunk } from "@/types/ai";

// Generate RqUID for GigaChat requests
function generateRqUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface GigaChatToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GigaChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GigaChatRequest {
  model: string;
  messages: GigaChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

let cachedToken: GigaChatToken | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken.access_token;
  }

  try {
    // Prepare Basic auth header
    let authHeader: string;
    if (env.GIGACHAT_AUTH_BASIC) {
      authHeader = `Basic ${env.GIGACHAT_AUTH_BASIC}`;
    } else {
      const credentials = Buffer.from(`${env.GIGACHAT_CLIENT_ID}:${env.GIGACHAT_CLIENT_SECRET}`).toString('base64');
      authHeader = `Basic ${credentials}`;
    }

    const rqUID = generateRqUID();
    
    const response = await fetch(env.GIGACHAT_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "RqUID": rqUID,
        "Authorization": authHeader,
      },
      body: new URLSearchParams({
        scope: env.GIGACHAT_SCOPE,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GigaChat token request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to get token: ${response.status} ${response.statusText}`);
    }

    const token: GigaChatToken = await response.json();
    
    // Cache the token
    cachedToken = token;
    tokenExpiry = Date.now() + (token.expires_in * 1000) - 60000; // 1 minute buffer
    
    return token.access_token;
  } catch (error) {
    console.error("Failed to get GigaChat token:", error);
    throw new Error("Failed to authenticate with GigaChat");
  }
}

export async function sendMessageToGigaChat(
  messages: GigaChatMessage[],
  agentId: string
): Promise<ReadableStream<Uint8Array>> {
  try {
    const accessToken = await getAccessToken();
    
    const request: GigaChatRequest = {
      model: "GigaChat",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    };

    const response = await fetch(`${env.GIGACHAT_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify(request),
      // Ignore SSL certificate errors in development
      ...(process.env.NODE_ENV === 'development' && {
        // @ts-ignore - Node.js specific option
        agent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      })
    });

    if (!response.ok) {
      throw new Error(`GigaChat API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body from GigaChat");
    }

    return response.body;
  } catch (error) {
    console.error("GigaChat API error:", error);
    throw error;
  }
}

export function parseGigaChatStream(stream: ReadableStream<Uint8Array>): ReadableStream<AIStreamChunk> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<AIStreamChunk>({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            controller.enqueue({ type: "done" });
            controller.close();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                controller.enqueue({ type: "done" });
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  controller.enqueue({
                    type: "content",
                    content,
                  });
                }
              } catch (parseError) {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        }
      } catch (error) {
        controller.enqueue({
          type: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        controller.close();
      }
    },
  });
}

export async function testGigaChatConnection(): Promise<boolean> {
  try {
    const accessToken = await getAccessToken();
    
    // Test with a simple completion request
    const testResponse = await fetch(`${env.GIGACHAT_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "GigaChat",
        messages: [
          {
            role: "user",
            content: "Привет! Это тестовое сообщение для проверки подключения."
          }
        ],
        temperature: 0.7,
        max_tokens: 50,
        stream: false,
      })
    });

    return testResponse.ok;
  } catch (error) {
    console.error("GigaChat connection test failed:", error);
    return false;
  }
}
