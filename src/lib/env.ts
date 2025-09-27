import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // GigaChat API
  GIGACHAT_BASE_URL: z.string().url().default("https://gigachat.devices.sberbank.ru/api/v1"),
  GIGACHAT_CLIENT_ID: z.string().min(1).default("0199824b-4c1e-7ef1-b423-bb3156ddecee"),
  GIGACHAT_CLIENT_SECRET: z.string().min(1),
  GIGACHAT_SCOPE: z.string().default("GIGACHAT_API_PERS"),
  
  // Session & Security
  SESSION_SECRET: z.string().min(32),
  
  // WebSocket
  WEBSOCKET_URL: z.string().url().default("ws://localhost:3001"),
  
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("DeadLine"),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
