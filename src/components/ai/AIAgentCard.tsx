"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AI_AGENTS } from "@/lib/ai/agents";
import { Bot, MessageSquare, Zap } from "lucide-react";

export function AIAgentCard() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <>
      {AI_AGENTS.map((agent) => (
        <Card 
          key={agent.id} 
          className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-colors cursor-pointer"
          onClick={() => setSelectedAgent(agent.id)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Bot className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-white">{agent.name}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {agent.description}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                {agent.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Возможности:</h4>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-zinc-800 text-zinc-300"
                    >
                      {capability}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-zinc-800 text-zinc-300">
                      +{agent.capabilities.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">AI Powered</span>
                </div>
                <Button 
                  size="sm" 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAgent(agent.id);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Чат
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

