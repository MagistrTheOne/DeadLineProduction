import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Features />
      <Pricing />
    </div>
  );
}
