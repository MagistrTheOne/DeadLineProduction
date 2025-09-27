import { z } from "zod";

// Security: Prevent API keys from being exposed in production
if (process.env.NODE_ENV === 'production') {
  // Ensure sensitive data is not logged or exposed
  const sensitiveKeys = ['GIGACHAT_CLIENT_SECRET', 'DATABASE_URL', 'SESSION_SECRET'];
  sensitiveKeys.forEach(key => {
    if (process.env[key]) {
      // Mask sensitive values in production logs
      const originalValue = process.env[key];
      if (originalValue && originalValue.length > 8) {
        process.env[key] = originalValue.substring(0, 8) + '***MASKED***';
      }
    }
  });
}

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // GigaChat API
  GIGACHAT_BASE_URL: z.string().url().default("https://gigachat.devices.sberbank.ru/api/v1"),
  GIGACHAT_TOKEN_URL: z.string().url().default("https://ngw.devices.sberbank.ru:9443/api/v2/oauth"),
  GIGACHAT_CLIENT_ID: z.string().min(1).default("0199824b-4c1e-7ef1-b423-bb3156ddecee"),
  GIGACHAT_CLIENT_SECRET: z.string().min(1).default("your_client_secret_here"),
  GIGACHAT_AUTH_BASIC: z.string().optional(),
  GIGACHAT_SCOPE: z.string().default("GIGACHAT_API_PERS"),
  
  // Session & Security
  SESSION_SECRET: z.string().min(32).default("deadline-super-secret-session-key-32-chars-minimum"),
  
  // WebSocket
  WEBSOCKET_URL: z.string().url().default("ws://localhost:3001"),
  
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("DeadLine"),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "test"]).default("development"),
});

// Parse with safe defaults for missing values
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_vebzG4FSIt9T@ep-bold-breeze-aeczjyp3-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  GIGACHAT_BASE_URL: process.env.GIGACHAT_BASE_URL,
  GIGACHAT_TOKEN_URL: process.env.GIGACHAT_TOKEN_URL,
  GIGACHAT_CLIENT_ID: process.env.GIGACHAT_CLIENT_ID,
  GIGACHAT_CLIENT_SECRET: process.env.GIGACHAT_CLIENT_SECRET,
  GIGACHAT_AUTH_BASIC: process.env.GIGACHAT_AUTH_BASIC,
  GIGACHAT_SCOPE: process.env.GIGACHAT_SCOPE,
  SESSION_SECRET: process.env.SESSION_SECRET,
  WEBSOCKET_URL: process.env.WEBSOCKET_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});

export type Env = z.infer<typeof envSchema>;
