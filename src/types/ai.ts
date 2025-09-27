export interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  agentId?: string;
}

export interface AIChatRequest {
  agentId: string;
  messages: AIChatMessage[];
  projectId?: string;
}

export interface AIChatResponse {
  success: boolean;
  message?: string;
  stream?: ReadableStream;
}

export interface AIInsight {
  id: string;
  type: "suggestion" | "warning" | "recommendation";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  agentId: string;
  projectId: string;
  createdAt: Date;
}

export interface AIStreamChunk {
  type: "content" | "done" | "error";
  content?: string;
  error?: string;
}
