"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";

const columns = [
  { id: "todo", title: "К выполнению", color: "zinc" },
  { id: "in_progress", title: "В работе", color: "amber" },
  { id: "review", title: "На проверке", color: "blue" },
  { id: "done", title: "Выполнено", color: "emerald" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch tasks from API
    // For now, show empty state
    setIsLoading(false);
  }, []);

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
        <Card key={column.id} className="bg-zinc-900 border-zinc-800">
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
                  <TaskCard key={task.id} task={task} />
                ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
