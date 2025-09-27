export interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
}

export interface AIStreamChunk {
  type: "content" | "done" | "error";
  content?: string;
  error?: string;
}

export interface GigaChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GigaChatToken {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}