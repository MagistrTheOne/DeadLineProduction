"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, Settings, LogOut, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";

export function TopBar() {
  const { user, logout } = useAuth();
  const { isConnected: wsConnected } = useWebSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [gigaChatStatus, setGigaChatStatus] = useState<boolean | null>(null);

  // Check GigaChat status on mount
  useEffect(() => {
    const checkGigaChatStatus = async () => {
      try {
        const response = await fetch("/api/ai/test");
        const data = await response.json();
        setGigaChatStatus(data.connected);
      } catch (error) {
        setGigaChatStatus(false);
      }
    };
    
    checkGigaChatStatus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "x") {
      e.preventDefault();
      // TODO: Open command palette
      console.log("Command palette opened");
    }
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Поиск задач, проектов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${
              wsConnected ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {wsConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span className="text-xs">WS</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              gigaChatStatus ? 'text-emerald-400' : gigaChatStatus === false ? 'text-red-400' : 'text-zinc-400'
            }`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span className="text-xs">AI</span>
            </div>
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-zinc-400 hover:text-white"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user && 'avatarUrl' in user ? (user as any).avatarUrl || "" : ""}
                    alt={user?.name || ""}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-zinc-400">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                <User className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem 
                className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выход</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
