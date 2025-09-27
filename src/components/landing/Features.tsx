"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  MessageSquare,
  Target,
  Clock,
  TrendingUp,
  Settings,
  FileText,
  Lightbulb
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "12 AI-агентов",
    description: "Специализированные AI-агенты для каждого аспекта управления проектами: от планирования до аналитики"
  },
  {
    icon: Users,
    title: "Командная работа",
    description: "Усиление человеческих возможностей через AI, а не их замена. Совместная работа человека и ИИ"
  },
  {
    icon: Zap,
    title: "Real-time синхронизация",
    description: "Мгновенные обновления задач, уведомлений и чатов без перезагрузки страницы"
  },
  {
    icon: Shield,
    title: "Enterprise безопасность",
    description: "Корпоративная безопасность из коробки с RBAC, аудитом и защитой данных"
  },
  {
    icon: BarChart3,
    title: "Аналитика и метрики",
    description: "Глубокий анализ производительности команды, KPI и прогнозирование рисков"
  },
  {
    icon: MessageSquare,
    title: "AI-чат",
    description: "Интеллектуальный чат с контекстными предложениями и проактивными уведомлениями"
  },
  {
    icon: Target,
    title: "Умное планирование",
    description: "AI-агенты помогают планировать спринты, распределять задачи и прогнозировать deadlines"
  },
  {
    icon: Clock,
    title: "Автоматизация рутины",
    description: "AI генерирует типовые задачи, документацию, отчеты и тест-кейсы автоматически"
  },
  {
    icon: TrendingUp,
    title: "Оптимизация процессов",
    description: "Непрерывное улучшение процессов на основе анализа данных и рекомендаций AI"
  },
  {
    icon: Settings,
    title: "Гибкая настройка",
    description: "Полная кастомизация досок, процессов и интеграций под нужды вашей команды"
  },
  {
    icon: FileText,
    title: "Документация",
    description: "Автоматическая генерация технической документации, API docs и пользовательских руководств"
  },
  {
    icon: Lightbulb,
    title: "Инновации",
    description: "Поиск возможностей для инноваций, анализ трендов и конкурентная разведка"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Возможности DeadLine V2
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Полнофункциональная платформа управления проектами с интеграцией искусственного интеллекта
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-zinc-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
