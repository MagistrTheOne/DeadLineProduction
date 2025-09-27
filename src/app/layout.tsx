import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeadLine V2 - AI-Powered Project Management",
  description: "Революционная платформа управления проектами с интеграцией 12 специализированных AI-агентов. Усиливаем человеческие возможности через искусственный интеллект.",
  keywords: ["project management", "AI", "artificial intelligence", "team collaboration", "productivity"],
  authors: [{ name: "MagistrTheOne" }],
  openGraph: {
    title: "DeadLine V2 - AI-Powered Project Management",
    description: "Революционная платформа управления проектами с интеграцией 12 специализированных AI-агентов.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
