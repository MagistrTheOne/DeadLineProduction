import { AIAgentCard } from "@/components/ai/AIAgentCard";
import { AIInsights } from "@/components/ai/AIInsights";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";

export default function AIFeaturesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Bot className="h-8 w-8 mr-3 text-emerald-400" />
          AI Features
        </h1>
        <p className="text-zinc-400">12 специализированных AI-агентов для управления проектами</p>
      </div>

      {/* AI Insights */}
      <AIInsights />

      {/* AI Agents Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-emerald-400" />
          AI Агенты
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AIAgentCard />
        </div>
      </div>
    </div>
  );
}

