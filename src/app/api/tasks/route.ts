import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { tasks, projects, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/config";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  projectId: z.string().uuid("Invalid project ID"),
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assigneeId: z.string().uuid().optional(),
  order: z.number().optional(),
});

// GET /api/tasks - Get all tasks for a project
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Verify user has access to the project
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project[0]) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get tasks with assignee information
    const tasksList = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        order: tasks.order,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        assignee: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(tasks)
      .leftJoin(users, eq(tasks.assigneeId, users.id))
      .where(eq(tasks.projectId, projectId))
      .orderBy(tasks.order);

    return NextResponse.json({ tasks: tasksList });
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, projectId, assigneeId } = createTaskSchema.parse(body);

    // Verify user has access to the project
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project[0]) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get the highest order number for the project
    const lastTask = await db
      .select({ order: tasks.order })
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(tasks.order)
      .limit(1);

    const newOrder = lastTask[0] ? lastTask[0].order + 1 : 0;

    // Create the task
    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        priority,
        projectId,
        assigneeId,
        order: newOrder,
      })
      .returning();

    return NextResponse.json({ task: newTask[0] }, { status: 201 });
  } catch (error) {
    console.error("Create task error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

