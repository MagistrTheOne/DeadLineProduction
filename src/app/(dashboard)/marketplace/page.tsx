import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Download, Star, ExternalLink } from "lucide-react";

const integrations = [
  {
    name: "Slack",
    description: "Интеграция с Slack для уведомлений и командной работы",
    category: "Коммуникации",
    status: "available",
    rating: 4.8,
    users: "10K+",
    icon: "💬"
  },
  {
    name: "GitHub",
    description: "Синхронизация с GitHub репозиториями и pull requests",
    category: "Разработка",
    status: "available",
    rating: 4.9,
    users: "15K+",
    icon: "🐙"
  },
  {
    name: "Jira",
    description: "Импорт задач и проектов из Jira",
    category: "Управление проектами",
    status: "available",
    rating: 4.7,
    users: "8K+",
    icon: "🎯"
  },
  {
    name: "Trello",
    description: "Миграция досок и карточек из Trello",
    category: "Управление проектами",
    status: "available",
    rating: 4.6,
    users: "12K+",
    icon: "📋"
  },
  {
    name: "Google Drive",
    description: "Интеграция с Google Drive для файлов и документов",
    category: "Файлы",
    status: "coming_soon",
    rating: 0,
    users: "0",
    icon: "📁"
  },
  {
    name: "Microsoft Teams",
    description: "Интеграция с Microsoft Teams для видеозвонков",
    category: "Коммуникации",
    status: "coming_soon",
    rating: 0,
    users: "0",
    icon: "🎥"
  }
];

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Store className="h-8 w-8 mr-3 text-emerald-400" />
          Маркетплейс
        </h1>
        <p className="text-zinc-400">Интеграции и расширения для DeadLine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-white">{integration.name}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {integration.category}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    integration.status === "available" 
                      ? "border-emerald-500/30 text-emerald-400" 
                      : "border-amber-500/30 text-amber-400"
                  }
                >
                  {integration.status === "available" ? "Доступно" : "Скоро"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-300">{integration.description}</p>
              
              {integration.status === "available" && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span className="text-zinc-300">{integration.rating}</span>
                  </div>
                  <span className="text-zinc-400">{integration.users} пользователей</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={integration.status === "coming_soon"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {integration.status === "available" ? "Установить" : "Скоро"}
                </Button>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Нужна другая интеграция?</CardTitle>
          <CardDescription className="text-zinc-400">
            Мы постоянно добавляем новые интеграции. Предложите свою идею!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            Предложить интеграцию
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

