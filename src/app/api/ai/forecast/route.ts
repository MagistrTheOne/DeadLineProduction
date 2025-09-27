import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tasks, projects } from "@/lib/db/schema";
import { eq, and, isNull, ne } from "drizzle-orm";
import { getSession } from "@/lib/auth/config";
import { sendMessageToGigaChat } from "@/lib/ai/gigachat";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's open tasks
    const userTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        dueDate: tasks.dueDate,
        createdAt: tasks.createdAt,
        projectTitle: projects.title,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(tasks.userId, userId),
          ne(tasks.status, "completed")
        )
      )
      .limit(20);

    // Get user's active projects
    const userProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.userId, userId),
          ne(projects.status, "completed")
        )
      )
      .limit(10);

    // Prepare data for AI analysis
    const tasksData = userTasks.map(task => ({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.projectTitle,
      daysSinceCreated: Math.floor((Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    }));

    const projectsData = userProjects.map(project => ({
      title: project.title,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt
    }));

    // Create prompt for AI analysis
    const prompt = `
Проанализируй следующие данные о задачах и проектах пользователя:

ЗАДАЧИ (${tasksData.length}):
${tasksData.map((task, i) => `
${i + 1}. ${task.title}
   Статус: ${task.status}
   Приоритет: ${task.priority}
   Дедлайн: ${task.dueDate || 'Не установлен'}
   Проект: ${task.project || 'Без проекта'}
   Дней с создания: ${task.daysSinceCreated}
`).join('')}

ПРОЕКТЫ (${projectsData.length}):
${projectsData.map((project, i) => `
${i + 1}. ${project.title}
   Статус: ${project.status}
   Создан: ${new Date(project.createdAt).toLocaleDateString()}
`).join('')}

Пожалуйста, проанализируй эти данные и дай:
1. Оценку рисков просрочки задач (высокий/средний/низкий)
2. Рекомендации по приоритизации
3. Прогноз сроков выполнения
4. Предложения по оптимизации рабочего процесса

Отвечай структурированно и конкретно.
`;

    // Send to GigaChat
    const response = await sendMessageToGigaChat(
      [{ role: "user", content: prompt }],
      "vasily"
    );

    return NextResponse.json({
      success: true,
      forecast: response,
      tasksAnalyzed: tasksData.length,
      projectsAnalyzed: projectsData.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI forecast error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to generate forecast",
        message: "Ошибка при генерации прогноза"
      },
      { status: 500 }
    );
  }
}
