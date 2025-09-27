"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: "$40",
    period: "в месяц",
    description: "Для небольших команд и стартапов",
    features: [
      "До 5 проектов",
      "До 10 пользователей",
      "3 AI-агента",
      "Базовая аналитика",
      "Email поддержка"
    ],
    cta: "Начать бесплатно",
    popular: false,
    color: "zinc"
  },
  {
    name: "Pro",
    price: "$200",
    period: "в месяц",
    description: "Для растущих команд и среднего бизнеса",
    features: [
      "Неограниченные проекты",
      "До 50 пользователей",
      "Все 12 AI-агентов",
      "Продвинутая аналитика",
      "Приоритетная поддержка",
      "Интеграции с внешними сервисами",
      "Кастомизация процессов"
    ],
    cta: "Попробовать Pro",
    popular: true,
    color: "emerald"
  },
  {
    name: "Enterprise",
    price: "$1500",
    period: "в месяц",
    description: "Для крупных корпораций",
    features: [
      "Неограниченные проекты и пользователи",
      "Все 12 AI-агентов",
      "Полная аналитика и отчеты",
      "24/7 поддержка",
      "Все интеграции",
      "Кастомные AI-агенты",
      "Dedicated менеджер",
      "SLA гарантии",
      "On-premise развертывание"
    ],
    cta: "Связаться с нами",
    popular: false,
    color: "amber"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Тарифные планы
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Выберите план, который подходит вашей команде. Все планы включают доступ к AI-агентам.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-zinc-900 border-zinc-800 ${
                plan.popular 
                  ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' 
                  : 'hover:border-zinc-700'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Популярный
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className={`text-2xl font-bold ${
                  plan.color === 'emerald' ? 'text-emerald-400' :
                  plan.color === 'amber' ? 'text-amber-400' :
                  'text-white'
                }`}>
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-zinc-400 ml-2">{plan.period}</span>
                </div>
                <CardDescription className="text-zinc-400 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/register'}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-zinc-400 mb-4">
            Все планы включают 14-дневный бесплатный пробный период
          </p>
          <p className="text-sm text-zinc-500">
            Нет скрытых платежей. Отмена в любое время.
          </p>
        </div>
      </div>
    </section>
  );
}
