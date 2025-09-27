import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, CheckCircle, XCircle, Settings } from "lucide-react";

const integrations = [
  {
    name: "Slack",
    description: "Получайте уведомления о задачах и обновлениях в Slack",
    status: "connected",
    lastSync: "2 минуты назад",
    icon: "💬"
  },
  {
    name: "GitHub",
    description: "Синхронизация с GitHub репозиториями и pull requests",
    status: "connected",
    lastSync: "5 минут назад",
    icon: "🐙"
  },
  {
    name: "Jira",
    description: "Импорт задач и проектов из Jira",
    status: "disconnected",
    lastSync: "Никогда",
    icon: "🎯"
  },
  {
    name: "Trello",
    description: "Миграция досок и карточек из Trello",
    status: "disconnected",
    lastSync: "Никогда",
    icon: "📋"
  }
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Zap className="h-8 w-8 mr-3 text-emerald-400" />
          Интеграции
        </h1>
        <p className="text-zinc-400">Управляйте подключениями с внешними сервисами</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <Card key={index} className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-white">{integration.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {integration.status === "connected" ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-zinc-500" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={
                      integration.status === "connected" 
                        ? "border-emerald-500/30 text-emerald-400" 
                        : "border-zinc-500/30 text-zinc-500"
                    }
                  >
                    {integration.status === "connected" ? "Подключено" : "Отключено"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-300">Автосинхронизация</p>
                  <p className="text-xs text-zinc-500">Последняя синхронизация: {integration.lastSync}</p>
                </div>
                <Switch 
                  checked={integration.status === "connected"}
                  disabled={integration.status === "disconnected"}
                />
              </div>
              
              <div className="flex space-x-2">
                {integration.status === "connected" ? (
                  <>
                    <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      <Settings className="h-4 w-4 mr-2" />
                      Настройки
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      Отключить
                    </Button>
                  </>
                ) : (
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Подключить
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Доступные интеграции</CardTitle>
          <CardDescription className="text-zinc-400">
            Изучите полный список доступных интеграций в маркетплейсе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Открыть маркетплейс
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

