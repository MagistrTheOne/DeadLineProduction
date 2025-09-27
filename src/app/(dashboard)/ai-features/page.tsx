"use client";

import { useState } from "react";
import { AIAgentCard } from "@/components/ai/AIAgentCard";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";
import { GigaChatStatus } from "@/components/ai/GigaChatStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, X } from "lucide-react";

export default function AIFeaturesPage() {
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Bot className="h-8 w-8 mr-3 text-emerald-400" />
          AI Features
        </h1>
        <p className="text-zinc-400">12 специализированных AI-агентов для управления проектами</p>
      </div>

      {/* GigaChat Status */}
      <GigaChatStatus />

      {/* AI Insights */}
      <AIInsights />

      {/* AI Agents Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-emerald-400" />
          AI Агенты
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AIAgentCard onAgentSelect={setSelectedAgent} />
        </div>
      </div>

      {/* AI Chat Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <AIChat 
              agentId={selectedAgent.id}
              agentName={selectedAgent.name}
              onClose={() => setSelectedAgent(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

