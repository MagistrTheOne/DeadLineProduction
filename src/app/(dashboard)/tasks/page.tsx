"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { ProjectSelector } from "@/components/dashboard/ProjectSelector";

export default function TasksPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("1");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Задачи</h1>
          <p className="text-zinc-400">Управляйте задачами с помощью AI-powered Kanban доски</p>
        </div>
        <ProjectSelector onProjectChange={setSelectedProjectId} />
      </div>
      
      <KanbanBoard projectId={selectedProjectId} />
    </div>
  );
}
