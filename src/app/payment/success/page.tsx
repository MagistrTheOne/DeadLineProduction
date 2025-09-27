import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles, Bot } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Платеж успешно обработан!
              </h1>
              <p className="text-xl text-zinc-300 mb-2">
                Добро пожаловать в DeadLine Pro
              </p>
              <p className="text-zinc-400">
                Ваша подписка активирована и готова к использованию
              </p>
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                <Sparkles className="h-5 w-5 mr-2 text-emerald-400" />
                Что дальше?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <span className="text-zinc-300">Настройте свой первый проект</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <span className="text-zinc-300">Пригласите команду (до 50 пользователей)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                  <span className="text-zinc-300">Изучите возможности 12 AI-агентов</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">4</span>
                  </div>
                  <span className="text-zinc-300">Настройте интеграции и автоматизацию</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/dashboard">
                  <Bot className="h-4 w-4 mr-2" />
                  Перейти в Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                <Link href="/ai-features">
                  Изучить AI Features
                </Link>
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <p className="text-sm text-zinc-500">
                Подтверждение отправлено на ваш email. Если у вас есть вопросы, 
                обратитесь в нашу службу поддержки.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

