"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900 border-zinc-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Вход в DeadLine</CardTitle>
        <CardDescription className="text-zinc-400">
          Войдите в свой аккаунт для продолжения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Вход...
              </>
            ) : (
              "Войти"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-zinc-400">
            Нет аккаунта?{" "}
            <a href="/register" className="text-emerald-400 hover:text-emerald-300">
              Зарегистрироваться
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
