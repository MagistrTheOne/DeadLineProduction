"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Folder } from "lucide-react";

const mockProjects = [
  { id: "1", name: "DeadLine Platform", description: "AI-powered project management" },
  { id: "2", name: "Mobile App", description: "React Native mobile application" },
  { id: "3", name: "API Backend", description: "Node.js backend services" },
];

interface ProjectSelectorProps {
  onProjectChange?: (projectId: string) => void;
}

export function ProjectSelector({ onProjectChange }: ProjectSelectorProps) {
  const [selectedProject, setSelectedProject] = useState(mockProjects[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
        >
          <Folder className="h-4 w-4 mr-2" />
          {selectedProject.name}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-zinc-900 border-zinc-800">
        <DropdownMenuLabel className="text-zinc-400">Выберите проект</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        {mockProjects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => {
              setSelectedProject(project);
              onProjectChange?.(project.id);
            }}
            className={`text-zinc-300 hover:text-white hover:bg-zinc-800 ${
              selectedProject.id === project.id ? "bg-emerald-500/20 text-emerald-400" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{project.name}</span>
              <span className="text-xs text-zinc-500">{project.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="text-emerald-400 hover:text-emerald-300 hover:bg-zinc-800">
          <Plus className="h-4 w-4 mr-2" />
          Создать новый проект
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
