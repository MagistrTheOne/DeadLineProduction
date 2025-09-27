import { pgTable, uuid, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: text("role").$type<"user" | "admin" | "owner">().notNull().default("user"),
  subscription: text("subscription").$type<"basic" | "pro" | "enterprise">().default("basic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    ownerId: uuid("owner_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    ownerIdx: index("projects_owner_idx").on(t.ownerId),
  })
);

// Tasks table
export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status")
      .$type<"todo" | "in_progress" | "review" | "done">()
      .notNull()
      .default("todo"),
    priority: text("priority")
      .$type<"low" | "medium" | "high" | "urgent">()
      .notNull()
      .default("medium"),
    assigneeId: uuid("assignee_id").references(() => users.id),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    projectIdx: index("tasks_project_idx").on(t.projectId),
    statusIdx: index("tasks_status_idx").on(t.status),
  })
);

// Comments table
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI Interactions table
export const aiInteractions = pgTable("ai_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentType: text("agent_type").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    plan: text("plan")
      .$type<"basic" | "pro" | "enterprise">()
      .notNull(),
    status: text("status")
      .$type<"active" | "past_due" | "canceled">()
      .notNull()
      .default("active"),
    expiresAt: timestamp("expires_at"),
  },
  (t) => ({
    userIdx: index("subscriptions_user_idx").on(t.userId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  comments: many(comments),
  notifications: many(notifications),
  subscriptions: many(subscriptions),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const aiInteractionsRelations = relations(aiInteractions, ({ one }) => ({
  user: one(users, {
    fields: [aiInteractions.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
