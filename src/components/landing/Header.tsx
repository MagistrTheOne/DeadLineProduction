"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Zap } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">

          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
              DeadLine
            </span>
            <span className="text-xs text-white -mt-1">First Ai & Human Collaboration</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="#features" className="relative group text-zinc-300 hover:text-white transition-colors duration-300">
            Возможности
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="#pricing" className="relative group text-zinc-300 hover:text-white transition-colors duration-300">
            Тарифы
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="#about" className="relative group text-zinc-300 hover:text-white transition-colors duration-300">
            О нас
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="#docs" className="relative group text-zinc-300 hover:text-white transition-colors duration-300">
            API Docs
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button 
            asChild 
            variant="ghost" 
            className="text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-all duration-300"
          >
            <Link href="/login">Войти</Link>
          </Button>
          
          <Button 
            asChild 
            className="bg-black hover:bg-conic-270 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-500/25 group"
          >
            <Link href="/demo" className="flex items-center gap-2">
              Записаться
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-zinc-300 hover:text-white transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <Link 
              href="#features" 
              className="block text-zinc-300 hover:text-white transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Возможности
            </Link>
            <Link 
              href="#pricing" 
              className="block text-zinc-300 hover:text-white transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Тарифы
            </Link>
            <Link 
              href="#about" 
              className="block text-zinc-300 hover:text-white transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              href="#docs" 
              className="block text-zinc-300 hover:text-white transition-colors duration-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              API Docs
            </Link>
            
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <Button 
                asChild 
                variant="ghost" 
                className="w-full text-zinc-300 hover:text-white hover:bg-blue-500/50 justify-start"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Войти
                </Link>
              </Button>
              
              <Button 
                asChild 
                className="w-full bg-black hover:bg-zinc-800 text-white font-semibold justify-center"
              >
                <Link href="/demo" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                  Запросить демо
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

     
    </header>
  );
}