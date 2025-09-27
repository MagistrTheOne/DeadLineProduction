"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Lightbulb, Users } from "lucide-react";

const mockInsights = [
  {
    type: "success",
    title: "Высокая продуктивность команды",
    description: "Команда показывает отличные результаты в последние 2 недели",
    agent: "AI Team Lead",
    priority: "high"
  },
  {
    type: "warning",
    title: "Потенциальное выгорание",
    description: "3 участника команды работают сверхурочно более 5 дней подряд",
    agent: "AI HR Manager",
    priority: "medium"
  },
  {
    type: "info",
    title: "Оптимизация процесса",
    description: "Рекомендуется автоматизировать тестирование для ускорения релизов",
    agent: "AI DevOps",
    priority: "low"
  }
];

export function AIInsights() {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "info":
        return <Lightbulb className="h-4 w-4 text-blue-400" />;
      default:
        return <Users className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-emerald-400" />
          AI Insights
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Прозактивные рекомендации от AI-агентов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInsights.map((insight, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getPriorityColor(insight.priority)}`}
                  >
                    {insight.priority === "high" ? "Высокий" :
                     insight.priority === "medium" ? "Средний" : "Низкий"}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">От {insight.agent}</span>
                  <span className="text-xs text-zinc-500">2 часа назад</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

