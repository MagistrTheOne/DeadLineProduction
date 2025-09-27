"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useWebSocket } from "@/hooks/useWebSocket";

const columns = [
  { id: "todo", title: "К выполнению", color: "zinc" },
  { id: "in_progress", title: "В работе", color: "amber" },
  { id: "review", title: "На проверке", color: "blue" },
  { id: "done", title: "Выполнено", color: "emerald" },
];

interface KanbanBoardProps {
  projectId?: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, isLoading, updateTask } = useTasks(projectId);
  const { send, on, off } = useWebSocket(projectId);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // WebSocket listeners for real-time updates
  useEffect(() => {
    const handleTaskUpdated = (data: any) => {
      console.log("Task updated via WebSocket:", data);
      // Tasks will be refetched by useTasks hook
    };

    const handleTaskCreated = (data: any) => {
      console.log("Task created via WebSocket:", data);
    };

    const handleTaskDeleted = (data: any) => {
      console.log("Task deleted via WebSocket:", data);
    };

    const unsubscribeUpdated = on("task.updated", handleTaskUpdated);
    const unsubscribeCreated = on("task.created", handleTaskCreated);
    const unsubscribeDeleted = on("task.deleted", handleTaskDeleted);

    return () => {
      unsubscribeUpdated();
      unsubscribeCreated();
      unsubscribeDeleted();
    };
  }, [on]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    try {
      // Update task status optimistically
      await updateTask(draggedTask, { status: columnId as any });
      
      // Send WebSocket update
      send("task.moved", {
        taskId: draggedTask,
        newStatus: columnId,
        projectId,
      });
    } catch (error) {
      console.error("Failed to move task:", error);
    } finally {
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <Card 
          key={column.id} 
          className={`bg-zinc-900 border-zinc-800 transition-colors ${
            dragOverColumn === column.id ? 'border-emerald-500/50 bg-emerald-500/5' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className={`text-sm font-medium ${
                column.color === 'emerald' ? 'text-emerald-400' :
                column.color === 'amber' ? 'text-amber-400' :
                column.color === 'blue' ? 'text-blue-400' :
                'text-zinc-400'
              }`}>
                {column.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                  {tasks.filter(task => task.status === column.id).length}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.filter(task => task.status === column.id).length === 0 ? (
              <div className="text-center py-8">
                <div className="text-zinc-500 mb-2">Нет задач</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить задачу
                </Button>
              </div>
            ) : (
              tasks
                .filter(task => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`cursor-move ${
                      draggedTask === task.id ? 'opacity-50' : ''
                    }`}
                  >
                    <TaskCard task={task} />
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
