import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // GigaChat API
  GIGACHAT_BASE_URL: z.string().url(),
  GIGACHAT_CLIENT_ID: z.string().min(1),
  GIGACHAT_CLIENT_SECRET: z.string().min(1),
  GIGACHAT_SCOPE: z.string().default("GIGACHAT_API_PERS"),
  
  // Session & Security
  SESSION_SECRET: z.string().min(32),
  
  // WebSocket
  WEBSOCKET_URL: z.string().url(),
  
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("DeadLine"),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
