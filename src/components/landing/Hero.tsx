"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative min-h-screen bg-black text-white flex items-center"
      aria-label="Hero DeadLine"
    >
      <div className="container mx-auto px-4 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            DeadLine
          </h1>

          <p className="text-xl md:text-2xl text-zinc-200 mb-3">
            First AI &amp; Human Collaboration
          </p>

          <p className="text-sm md:text-base text-zinc-400 mb-10">
            Author&nbsp;MagistrTheOne&nbsp;|&nbsp;2025
          </p>

          <p className="text-xl text-zinc-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Платформа управления проектами с 12 специализированными AI-агентами.
            Усиливаем команды, не подменяем их.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 text-lg border border-white/15"
            >
              <Link href="/register" aria-label="Попробовать DeadLine">
                Попробовать
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg"
            >
              <Link href="#features" aria-label="Узнать больше о возможностях">
                Узнать больше
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
