import { RealTimeChat } from "@/components/chat/RealTimeChat";
import { MessageSquare } from "lucide-react";

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

      <div className="h-[600px]">
        <RealTimeChat projectId="1" />
      </div>
    </div>
  );
}

