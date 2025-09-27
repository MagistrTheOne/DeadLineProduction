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
  Lightbulb,
} from "lucide-react";
import { useState } from "react";

const features = [
  { icon: Brain, title: "12 AI-агентов", description: "Агенты для планирования, приоритезации, анализа рисков, код-ассиста и QA. Работают в контексте проекта и прав доступа" },
  { icon: Users, title: "Командная работа", description: "AI предлагает — команда подтверждает. Роли, ревью и прозрачная история решений без навязчивой магии" },
  { icon: Zap, title: "Real-time синхронизация", description: "Обновления задач, уведомлений и чатов без перезагрузки. Веб-сокеты, back-pressure, авто-reconnect" },
  { icon: Shield, title: "Enterprise-безопасность", description: "RBAC/ABAC, аудит действий, маскирование данных, SSO/SAML/OIDC. Политики хранения и экспорта артефактов" },
  { icon: BarChart3, title: "Аналитика и метрики", description: "Throughput, lead/cycle time, прогноз дедлайнов, ранняя детекция блокеров. Дашборды по спринтам и продуктам" },
  { icon: MessageSquare, title: "AI-чат", description: "Контекстные ответы по задачам и коммитам, быстрые ссылки, алерты и брифы к стендапу" },
  { icon: Target, title: "Умное планирование", description: "Распределение по навыкам и загрузке, авторазбивка эпиков, сценарии «what-if» и оценка рисков" },
  { icon: Clock, title: "Автоматизация рутины", description: "Шаблоны задач, чек-листы, тест-кейсы, changelog и релиз-ноты. Консистентная документация" },
  { icon: TrendingUp, title: "Оптимизация процессов", description: "Рекомендации по WIP-лимитам, SLA и качеству ревью на основе фактических данных команды" },
  { icon: Settings, title: "Гибкая настройка", description: "Кастом-воркфлоу, статусы, поля, вебхуки и интеграции. Профили конфигураций на команду/продукт" },
  { icon: FileText, title: "Документация", description: "Автогенерация техдоков, API-описаний и пользовательских гайдов с версионированием" },
  { icon: Lightbulb, title: "Инсайты и R&D", description: "Поиск инсайтов, бенчмаркинг и конкурентная разведка под вашу доменную модель" },
] as const;

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="features" className="relative py-32 bg-zinc-950 text-white">
      {/* Dark + glass background (decorative, ignore hydration mismatches) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"
        aria-hidden="true"
        suppressHydrationWarning
      />
      <div
        className="absolute inset-x-0 top-0 h-40 bg-white/5 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden="true"
        suppressHydrationWarning
      />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white/80">
                Enterprise Features
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            DeadLine V2
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-white/80">
              Project Management Platform
            </span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mt-4">
            Платформа управления проектами с AI для корпоративных команд: строгий интерфейс,
            прозрачные процессы, предсказуемые релизы.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card
                className="h-full bg-white/5 backdrop-blur-md border border-white/10
                           transition-all duration-300 group-hover:scale-[1.02] group-hover:border-white/20"
              >
                <CardHeader className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center
                                 bg-white/10 border border-white/15"
                      aria-hidden="true"
                    >
                      <feature.icon className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>

                    {/* Minimalist indicator */}
                    <div
                      className={`w-2 h-2 rounded-full transition-colors ${
                        hoveredIndex === index ? "bg-white" : "bg-white/40"
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <CardTitle className="text-white text-xl font-semibold mb-3">
                    {feature.title}
                  </CardTitle>

                  <CardDescription className="text-white/80 leading-relaxed text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* CTA (white text + glass) */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4">
            <button
              className="group inline-flex items-center gap-3 px-8 py-4
                         bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl
                         transition-all duration-300 hover:scale-105 border border-white/15
                         shadow-lg hover:shadow-white/20"
              aria-label="Запросить демо DeadLine V2"
            >
              <span>Запросить демо</span>
              <div className="w-1 h-1 bg-white rounded-full group-hover:w-2 transition-all duration-300" aria-hidden="true" />
            </button>

            <p className="text-white/60 text-sm">
              Готово для команд от 10 до 10 000+ участников
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
