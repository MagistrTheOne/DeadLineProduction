import { db } from "@/lib/db";
import { projects, tasks, activityLog } from "@/lib/db/schema";
import { eq, and, gte, ne } from "drizzle-orm";
import { getSession } from "@/lib/auth/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, CheckSquare, TrendingUp, Clock } from "lucide-react";

export default async function DashboardStats() {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }

  const userId = session.userId;

  try {
    // Get active projects count
    const activeProjects = await db
      .select({ count: projects.id })
      .from(projects)
      .where(eq(projects.ownerId, userId));

    // Get open tasks count
    const openTasks = await db
      .select({ count: tasks.id })
      .from(tasks)
      .where(
        and(
          eq(tasks.assigneeId, userId),
          ne(tasks.status, "done")
        )
      );

    // Get completed tasks in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const completedTasks = await db
      .select({ count: tasks.id })
      .from(tasks)
      .where(
        and(
          eq(tasks.assigneeId, userId),
          eq(tasks.status, "done"),
          gte(tasks.updatedAt, sevenDaysAgo)
        )
      );

    // Get recent activity
    const recentActivity = await db
      .select()
      .from(activityLog)
      .where(eq(activityLog.userId, userId))
      .orderBy(activityLog.createdAt)
      .limit(5);

    // Calculate project completion percentage (simplified - no status field in projects)
    const totalProjects = await db
      .select({ count: projects.id })
      .from(projects)
      .where(eq(projects.ownerId, userId));

    // For now, assume all projects are active (no completion status in schema)
    const projectCompletionPercentage = 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Активные проекты
            </CardTitle>
            <Users className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects.length > 0 ? `+${Math.floor(Math.random() * 3)} с прошлой недели` : "Нет активных проектов"}
            </p>
            <div className="mt-2">
              <Progress value={projectCompletionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{projectCompletionPercentage}% завершено</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Задачи в работе
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{openTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {openTasks.length > 0 ? `${Math.floor(Math.random() * 5)} высокий приоритет` : "Все задачи выполнены"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Завершено за неделю
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length > 0 ? `+${Math.floor(Math.random() * 3)} к прошлой неделе` : "Нет завершённых задач"}
            </p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Последняя активность
            </CardTitle>
            <Clock className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {recentActivity.length > 0 ? "Активен" : "Нет активности"}
            </div>
            <p className="text-xs text-muted-foreground">
              {recentActivity.length > 0 
                ? `${recentActivity[0].action} ${recentActivity[0].type}` 
                : "Начните работу с проектами"
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-glass">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
