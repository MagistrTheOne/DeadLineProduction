"use client";

import { useState } from "react";
import { AI_AGENTS } from "@/lib/ai/agents";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    agentId: string,
    messages: ChatMessage[],
    onChunk: (chunk: { type: string; content?: string; error?: string }) => void
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                onChunk(data);
              } catch (parseError) {
                // Skip invalid JSON
                continue;
              }
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      onChunk({ type: "error", error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentById = (agentId: string) => {
    return AI_AGENTS.find(agent => agent.id === agentId);
  };

  const getAllAgents = () => {
    return AI_AGENTS;
  };

  return {
    sendMessage,
    getAgentById,
    getAllAgents,
    isLoading,
    error,
  };
}

