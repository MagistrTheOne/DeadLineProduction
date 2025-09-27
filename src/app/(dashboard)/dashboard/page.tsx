"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Bot, 
  StickyNote, 
  Save, 
  BarChart3,
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats.server";

export default function DashboardPage() {
  const [userNotes, setUserNotes] = useState<string>("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await fetch("/api/user/notes");
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
  };

  const saveNote = async () => {
    if (!userNotes.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/user/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userNotes })
      });
      
      if (response.ok) {
        setUserNotes("");
        loadNotes();
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setLoading(false);
    }
  };

  const runAiAnalysis = async (action: string) => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: action }],
          agentId: "vasily"
        })
      });
      
      if (response.ok) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (reader) {
          let result = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += new TextDecoder().decode(value);
          }
          console.log("AI Analysis:", result);
        }
      }
    } catch (error) {
      console.error("Failed to run AI analysis:", error);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Добро пожаловать в DeadLine - First Ai & Human Collaboration</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-foreground">Быстрые действия</CardTitle>
            <CardDescription className="text-muted-foreground">
              Создайте новую задачу или проект
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full btn-primary-glass">
              <Link href="/tasks">
                <Plus className="w-4 h-4 mr-2" />
                Создать задачу
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/ai-features">
                <Bot className="w-4 h-4 mr-2" />
                AI Агенты
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-foreground">Последние активности</CardTitle>
            <CardDescription className="text-muted-foreground">
              Недавние обновления в проектах
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Задача "Рефакторинг API" перемещена в Review</p>
                  <p className="text-xs text-muted-foreground">2 минуты назад</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Новый комментарий в "UI компоненты"</p>
                  <p className="text-xs text-muted-foreground">15 минут назад</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">AI Team Lead предложил оптимизацию</p>
                  <p className="text-xs text-muted-foreground">1 час назад</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Мои заметки */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5" />
            Мои заметки
          </CardTitle>
          <CardDescription>
            Персональные заметки и идеи
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Добавить заметку..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={saveNote} 
              disabled={loading || !userNotes.trim()}
              className="btn-primary-glass"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
          
          {notes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Последние заметки:</h4>
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Василий AI - Быстрые действия */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Василий AI - Быстрые действия
          </CardTitle>
          <CardDescription>
            Получите помощь от AI-ассистента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => runAiAnalysis("Проанализируй мои текущие задачи и дай рекомендации по приоритизации")}
              disabled={aiLoading}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm font-medium">Анализ задач</span>
              <span className="text-xs text-muted-foreground">Приоритизация и рекомендации</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => runAiAnalysis("Дай рекомендации по улучшению продуктивности команды")}
              disabled={aiLoading}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm font-medium">Рекомендации</span>
              <span className="text-xs text-muted-foreground">Советы по продуктивности</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => runAiAnalysis("Покажи статистику по проектам и прогноз сроков")}
              disabled={aiLoading}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium">Прогноз</span>
              <span className="text-xs text-muted-foreground">Анализ сроков и рисков</span>
            </Button>
          </div>
          
          {aiLoading && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 animate-spin" />
                <span className="text-sm text-foreground">Василий анализирует данные...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
