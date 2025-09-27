"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RefreshCw, Bot, AlertTriangle } from "lucide-react";

interface GigaChatStatusData {
  connected: boolean;
  message: string;
  timestamp: string;
}

export function GigaChatStatus() {
  const [status, setStatus] = useState<GigaChatStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/test");
      const data = await response.json();
      setStatus(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error("Failed to check GigaChat status:", error);
      setStatus({
        connected: false,
        message: "Ошибка при проверке подключения",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />;
    }
    if (status?.connected) {
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    }
    return <XCircle className="h-5 w-5 text-red-400" />;
  };

  const getStatusColor = () => {
    if (isLoading) return "border-amber-500/30 text-amber-400";
    if (status?.connected) return "border-emerald-500/30 text-emerald-400";
    return "border-red-500/30 text-red-400";
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bot className="h-5 w-5 mr-2 text-emerald-400" />
          GigaChat API Status
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Статус подключения к Sber GigaChat API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium text-white">
                {isLoading ? "Проверка подключения..." : status?.message}
              </p>
              {lastChecked && (
                <p className="text-xs text-zinc-500">
                  Последняя проверка: {lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getStatusColor()}
          >
            {isLoading ? "Проверка" : status?.connected ? "Подключено" : "Отключено"}
          </Badge>
        </div>

        {!status?.connected && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-medium">
                  Проблема с подключением
                </p>
                <p className="text-xs text-red-300 mt-1">
                  Проверьте настройки GIGACHAT_CLIENT_SECRET в .env файле
                </p>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={checkStatus} 
          disabled={isLoading}
          variant="outline"
          className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Проверить подключение
        </Button>
      </CardContent>
    </Card>
  );
}
