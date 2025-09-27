"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Wifi, WifiOff } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  type: "user" | "ai";
}

interface RealTimeChatProps {
  projectId?: string;
}

export function RealTimeChat({ projectId }: RealTimeChatProps) {
  const { user } = useAuth();
  const { send, on, off, isConnected } = useWebSocket(projectId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket listeners
  useEffect(() => {
    const handleChatMessage = (data: any) => {
      setMessages(prev => [...prev, {
        id: data.id || Date.now().toString(),
        content: data.content,
        userId: data.userId,
        userName: data.userName,
        userAvatar: data.userAvatar,
        timestamp: new Date(data.timestamp || Date.now()),
        type: data.type || "user",
      }]);
    };

    const handleUserJoined = (data: any) => {
      setOnlineUsers(prev => [...new Set([...prev, data.userId])]);
    };

    const handleUserLeft = (data: any) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    };

    const unsubscribeMessage = on("chat.message", handleChatMessage);
    const unsubscribeJoined = on("user.joined", handleUserJoined);
    const unsubscribeLeft = on("user.left", handleUserLeft);

    return () => {
      unsubscribeMessage();
      unsubscribeJoined();
      unsubscribeLeft();
    };
  }, [on]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: new Date(),
      type: "user",
    };

    // Add message optimistically
    setMessages(prev => [...prev, message]);

    // Send via WebSocket
    send("chat.message", {
      content: message.content,
      userId: message.userId,
      userName: message.userName,
      userAvatar: message.userAvatar,
      timestamp: message.timestamp.toISOString(),
      type: "user",
    });

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-emerald-400" />
            Командный чат
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${
              isConnected ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span className="text-sm">
                {isConnected ? 'Подключено' : 'Отключено'}
              </span>
            </div>
            <Badge variant="outline" className="border-zinc-700 text-zinc-300">
              {onlineUsers.length} онлайн
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-400 py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
            <p>Начните общение с командой</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.userId === user?.id ? "flex-row-reverse space-x-reverse" : ""
              }`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.userAvatar} />
                  <AvatarFallback className={
                    message.type === "ai" 
                      ? "bg-emerald-500 text-white" 
                      : "bg-blue-500 text-white"
                  }>
                    {message.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-lg px-3 py-2 ${
                  message.userId === user?.id 
                    ? "bg-blue-500 text-white" 
                    : message.type === "ai"
                    ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-100"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
            disabled={!isConnected}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || !isConnected}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
