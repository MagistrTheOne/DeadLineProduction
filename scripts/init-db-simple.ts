import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, uuid, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Define schema directly here to avoid env.ts dependency
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").$type<"user" | "admin" | "owner">().notNull().default("user"),
  subscription: text("subscription").$type<"basic" | "pro" | "enterprise">().default("basic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  ownerIdx: index("projects_owner_idx").on(t.ownerId),
}));

const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").$type<"todo" | "in_progress" | "review" | "done">().notNull().default("todo"),
  priority: text("priority").$type<"low" | "medium" | "high" | "urgent">().notNull().default("medium"),
  assigneeId: uuid("assignee_id").references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  projectIdx: index("tasks_project_idx").on(t.projectId),
  statusIdx: index("tasks_status_idx").on(t.status),
}));

const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const aiInteractions = pgTable("ai_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentType: text("agent_type").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  plan: text("plan").$type<"basic" | "pro" | "enterprise">().notNull(),
  status: text("status").$type<"active" | "past_due" | "canceled">().notNull().default("active"),
  expiresAt: timestamp("expires_at"),
}, (t) => ({
  userIdx: index("subscriptions_user_idx").on(t.userId),
}));

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: { users, projects, tasks, comments, notifications, aiInteractions, subscriptions } });

async function initDatabase() {
  console.log("🚀 Initializing DeadLine V2 database...");

  try {
    // Create sample user
    const [user] = await db.insert(users).values({
      email: "admin@deadline.com",
      name: "Admin User",
      role: "owner",
      subscription: "pro",
    }).returning();

    console.log("✅ Created admin user:", user.email);

    // Create sample project
    const [project] = await db.insert(projects).values({
      name: "DeadLine Platform",
      description: "AI-powered project management platform",
      ownerId: user.id,
    }).returning();

    console.log("✅ Created sample project:", project.name);

    // Create sample tasks
    const sampleTasks = [
      {
        title: "Настроить GigaChat API",
        description: "Интеграция с Sber GigaChat для AI агентов",
        status: "done" as const,
        priority: "high" as const,
        projectId: project.id,
        order: 1,
      },
      {
        title: "Реализовать Kanban доску",
        description: "Drag-and-drop функциональность для управления задачами",
        status: "in_progress" as const,
        priority: "high" as const,
        projectId: project.id,
        order: 2,
      },
      {
        title: "Создать AI агентов",
        description: "12 специализированных AI агентов для разных ролей",
        status: "todo" as const,
        priority: "medium" as const,
        projectId: project.id,
        order: 3,
      },
      {
        title: "Настроить WebSocket",
        description: "Real-time обновления для командной работы",
        status: "review" as const,
        priority: "medium" as const,
        projectId: project.id,
        order: 4,
      },
    ];

    const createdTasks = await db.insert(tasks).values(sampleTasks).returning();
    console.log("✅ Created sample tasks:", createdTasks.length);

    // Create sample AI interaction
    await db.insert(aiInteractions).values({
      agentType: "team-lead",
      prompt: "Привет! Как дела с проектом?",
      response: "Отлично! Вижу, что команда активно работает над DeadLine платформой. Рекомендую сосредоточиться на Kanban доске - это ключевая функция для пользователей.",
      userId: user.id,
    });

    console.log("✅ Created sample AI interaction");

    // Create subscription
    await db.insert(subscriptions).values({
      userId: user.id,
      plan: "pro",
      status: "active",
    });

    console.log("✅ Created user subscription");

    console.log("🎉 Database initialization completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Users: 1`);
    console.log(`   - Projects: 1`);
    console.log(`   - Tasks: ${createdTasks.length}`);
    console.log(`   - AI Interactions: 1`);
    console.log(`   - Subscriptions: 1`);

  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log("✅ Database initialization completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database initialization failed:", error);
      process.exit(1);
    });
}

export { initDatabase };
