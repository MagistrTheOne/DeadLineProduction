"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Срочно";
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return priority;
    }
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-white line-clamp-2">
            {task.title}
          </h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {task.description && (
          <p className="text-xs text-zinc-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className={`text-xs ${getPriorityColor(task.priority)}`}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.slice(0, 2).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-zinc-700 text-zinc-300"
                >
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-zinc-700 text-zinc-300">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            {task.assignee ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback className="bg-emerald-500 text-white text-xs">
                    {task.assignee.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-zinc-400">{task.assignee.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-zinc-500">
                <User className="h-3 w-3" />
                <span className="text-xs">Не назначено</span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center space-x-1 text-zinc-500">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">{task.dueDate}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
