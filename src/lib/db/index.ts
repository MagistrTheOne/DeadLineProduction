import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";
import * as schema from "./schema";

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Export types for use in components
export type Database = typeof schema;
export type User = typeof schema.users.$inferSelect;
export type Project = typeof schema.projects.$inferSelect;
export type Task = typeof schema.tasks.$inferSelect;
export type Comment = typeof schema.comments.$inferSelect;
export type Notification = typeof schema.notifications.$inferSelect;
export type AIInteraction = typeof schema.aiInteractions.$inferSelect;
export type Subscription = typeof schema.subscriptions.$inferSelect;

// Insert types
export type NewUser = typeof schema.users.$inferInsert;
export type NewProject = typeof schema.projects.$inferInsert;
export type NewTask = typeof schema.tasks.$inferInsert;
export type NewComment = typeof schema.comments.$inferInsert;
export type NewNotification = typeof schema.notifications.$inferInsert;
export type NewAIInteraction = typeof schema.aiInteractions.$inferInsert;
export type NewSubscription = typeof schema.subscriptions.$inferInsert;
