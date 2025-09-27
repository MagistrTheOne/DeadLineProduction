import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Users, Bot } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <MessageSquare className="h-8 w-8 mr-3 text-emerald-400" />
          Командный чат
        </h1>
        <p className="text-zinc-400">Общайтесь с командой в реальном времени</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3">
          <Card className="bg-zinc-900 border-zinc-800 h-[600px] flex flex-col">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-emerald-400" />
                Общий канал
              </CardTitle>
              <CardDescription className="text-zinc-400">
                3 участника онлайн
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Mock messages */}
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">John Doe</span>
                      <span className="text-xs text-zinc-500">14:30</span>
                    </div>
                    <p className="text-sm text-zinc-300">Привет команда! Как дела с новым фичами?</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-emerald-500 text-white">AS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">Anna Smith</span>
                      <span className="text-xs text-zinc-500">14:32</span>
                    </div>
                    <p className="text-sm text-zinc-300">Все идет по плану! UI компоненты готовы на 80%</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-amber-500 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-emerald-400">AI Team Lead</span>
                      <span className="text-xs text-zinc-500">14:35</span>
                    </div>
                    <p className="text-sm text-zinc-300">Отлично! Рекомендую провести code review до конца недели</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-500 text-white">MK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">Mike Kim</span>
                      <span className="text-xs text-zinc-500">14:37</span>
                    </div>
                    <p className="text-sm text-zinc-300">Согласен с AI Team Lead. Запланируем на завтра</p>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-zinc-800 p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                  />
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Online Users */}
        <div className="lg:col-span-1">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Участники</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-zinc-400">Team Lead</p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-500 text-white">AS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Anna Smith</p>
                  <p className="text-xs text-zinc-400">Frontend Dev</p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-500 text-white">MK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Mike Kim</p>
                  <p className="text-xs text-zinc-400">Backend Dev</p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-amber-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-400">AI Team Lead</p>
                  <p className="text-xs text-zinc-400">AI Assistant</p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

