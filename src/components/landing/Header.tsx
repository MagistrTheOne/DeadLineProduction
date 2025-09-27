"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          DeadLine
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-zinc-300 hover:text-white transition-colors">
            Возможности
          </Link>
          <Link href="#pricing" className="text-zinc-300 hover:text-white transition-colors">
            Тарифы
          </Link>
          <Link href="#about" className="text-zinc-300 hover:text-white transition-colors">
            О нас
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
            <Link href="/login">Авторизоваться</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
