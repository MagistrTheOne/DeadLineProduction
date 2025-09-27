"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Bot, 
  MessageSquare, 
  Github, 
  Database, 
  Wifi, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  Settings
} from "lucide-react";

interface Integration {
  provider: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  autosync: boolean;
  intervalMin: number;
  status: "connected" | "disconnected" | "error";
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  const defaultIntegrations: Integration[] = [
    {
      provider: "gigachat",
      name: "GigaChat AI",
      description: "AI-ассистент для анализа и генерации контента",
      icon: <Bot className="h-5 w-5" />,
      enabled: false,
      autosync: false,
      intervalMin: 60,
      status: "disconnected"
    },
    {
      provider: "websocket",
      name: "WebSocket",
      description: "Real-time обновления и уведомления",
      icon: <Wifi className="h-5 w-5" />,
      enabled: false,
      autosync: false,
      intervalMin: 30,
      status: "disconnected"
    },
    {
      provider: "slack",
      name: "Slack",
      description: "Интеграция с командным чатом",
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: false,
      autosync: false,
      intervalMin: 15,
      status: "disconnected"
    },
    {
      provider: "github",
      name: "GitHub",
      description: "Синхронизация с репозиториями",
      icon: <Github className="h-5 w-5" />,
      enabled: false,
      autosync: false,
      intervalMin: 30,
      status: "disconnected"
    },
    {
      provider: "neon",
      name: "Neon Database",
      description: "Подключение к базе данных",
      icon: <Database className="h-5 w-5" />,
      enabled: true,
      autosync: true,
      intervalMin: 60,
      status: "connected"
    }
  ];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      // Load settings for each integration
      const promises = defaultIntegrations.map(async (integration) => {
        try {
          const response = await fetch(`/api/integrations/${integration.provider}`);
          if (response.ok) {
            const data = await response.json();
            return {
              ...integration,
              enabled: data.settings?.enabled || false,
              autosync: data.settings?.autosync || false,
              intervalMin: data.settings?.intervalMin || integration.intervalMin,
              status: (data.settings?.enabled ? "connected" : "disconnected") as "connected" | "disconnected" | "error"
            };
          }
        } catch (error) {
          console.error(`Failed to load ${integration.provider}:`, error);
        }
        return integration;
      });

      const results = await Promise.all(promises);
      setIntegrations(results);
    } catch (error) {
      console.error("Failed to load integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIntegration = async (provider: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/integrations/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled })
      });

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.provider === provider 
              ? { ...integration, enabled, status: enabled ? "connected" : "disconnected" }
              : integration
          )
        );
      }
    } catch (error) {
      console.error(`Failed to toggle ${provider}:`, error);
    }
  };

  const toggleAutosync = async (provider: string, autosync: boolean) => {
    try {
      const integration = integrations.find(i => i.provider === provider);
      if (!integration) return;

      const response = await fetch(`/api/integrations/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          enabled: integration.enabled,
          autosync,
          intervalMin: integration.intervalMin
        })
      });

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(i => 
            i.provider === provider ? { ...i, autosync } : i
          )
        );
      }
    } catch (error) {
      console.error(`Failed to toggle autosync for ${provider}:`, error);
    }
  };

  const updateInterval = async (provider: string, intervalMin: number) => {
    try {
      const integration = integrations.find(i => i.provider === provider);
      if (!integration) return;

      const response = await fetch(`/api/integrations/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          enabled: integration.enabled,
          autosync: integration.autosync,
          intervalMin
        })
      });

      if (response.ok) {
        setIntegrations(prev => 
          prev.map(i => 
            i.provider === provider ? { ...i, intervalMin } : i
          )
        );
      }
    } catch (error) {
      console.error(`Failed to update interval for ${provider}:`, error);
    }
  };

  const testIntegration = async (provider: string) => {
    try {
      setTesting(provider);
      const response = await fetch(`/api/integrations/${provider}/test`, {
        method: "POST"
      });

      const data = await response.json();
      
      if (data.success) {
        setIntegrations(prev => 
          prev.map(i => 
            i.provider === provider ? { ...i, status: "connected" } : i
          )
        );
      } else {
        setIntegrations(prev => 
          prev.map(i => 
            i.provider === provider ? { ...i, status: "error" } : i
          )
        );
      }
    } catch (error) {
      console.error(`Failed to test ${provider}:`, error);
      setIntegrations(prev => 
        prev.map(i => 
          i.provider === provider ? { ...i, status: "error" } : i
        )
      );
    } finally {
      setTesting(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-foreground" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Подключено";
      case "error":
        return "Ошибка";
      default:
        return "Отключено";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Интеграции</h1>
          <p className="text-muted-foreground">Управление подключениями к внешним сервисам</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="card-glass">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Интеграции</h1>
        <p className="text-muted-foreground">Управление подключениями к внешним сервисам</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.provider} className="card-glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {integration.description}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => testIntegration(integration.provider)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Проверить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(integration.status)}
                  <span className="text-sm font-medium">
                    {getStatusText(integration.status)}
                  </span>
                </div>
                <Badge variant={integration.enabled ? "default" : "secondary"}>
                  {integration.enabled ? "Активна" : "Неактивна"}
                </Badge>
              </div>

              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Подключение</span>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={(enabled) => toggleIntegration(integration.provider, enabled)}
                />
              </div>

              {/* Autosync */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Автосинхронизация</span>
                <Switch
                  checked={integration.autosync}
                  onCheckedChange={(autosync) => toggleAutosync(integration.provider, autosync)}
                  disabled={!integration.enabled}
                />
              </div>

              {/* Interval */}
              {integration.autosync && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Интервал (мин)</span>
                    <span className="text-sm font-medium">{integration.intervalMin}</span>
                  </div>
                  <Slider
                    value={[integration.intervalMin]}
                    onValueChange={([value]) => updateInterval(integration.provider, value)}
                    min={5}
                    max={240}
                    step={5}
                    disabled={!integration.enabled}
                    className="w-full"
                  />
                </div>
              )}

              {/* Test Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => testIntegration(integration.provider)}
                disabled={testing === integration.provider}
                className="w-full"
              >
                {testing === integration.provider ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Тестирование...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Проверить подключение
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}