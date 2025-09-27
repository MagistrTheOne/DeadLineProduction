"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            First AI & Human Collaboration
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            DeadLine
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 mb-4">
            First AI & Human Collaboration
          </p>
          
          <p className="text-lg text-zinc-400 mb-8">
            Author MagistrTheOne | 2025
          </p>
          
          <p className="text-xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Революционная платформа управления проектами с интеграцией 12 специализированных AI-агентов. 
            Усиливаем человеческие возможности через искусственный интеллект.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 text-lg">
              <Link href="/register">
                Начать бесплатно
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-zinc-700 text-white hover:bg-zinc-800 px-8 py-4 text-lg">
              <Link href="#features">
                Узнать больше
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
