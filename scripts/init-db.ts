import { db } from "../src/lib/db";
import { users, projects, tasks, comments, notifications, aiInteractions, subscriptions } from "../src/lib/db/schema";

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
