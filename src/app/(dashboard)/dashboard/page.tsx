import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckSquare, TrendingUp, Bot } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400">Добро пожаловать в DeadLine - First Ai & Human Collaboration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Активные проекты
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-zinc-400">
              +1 с прошлой недели
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Задачи в работе
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-zinc-400">
              +3 с прошлой недели
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              Продуктивность
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">87%</div>
            <p className="text-xs text-zinc-400">
              +5% с прошлой недели
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-300">
              AI Агенты
            </CardTitle>
            <Bot className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-zinc-400">
              Все активны
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Быстрые действия</CardTitle>
            <CardDescription className="text-zinc-400">
              Создайте новую задачу или проект
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <Link href="/tasks">
                <Plus className="w-4 h-4 mr-2" />
                Создать задачу
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">
              <Link href="/ai-features">
                <Bot className="w-4 h-4 mr-2" />
                AI Агенты
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Последние активности</CardTitle>
            <CardDescription className="text-zinc-400">
              Недавние обновления в проектах
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Задача "Рефакторинг API" перемещена в Review</p>
                  <p className="text-xs text-zinc-400">2 минуты назад</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Новый комментарий в "UI компоненты"</p>
                  <p className="text-xs text-zinc-400">15 минут назад</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">AI Team Lead предложил оптимизацию</p>
                  <p className="text-xs text-zinc-400">1 час назад</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
