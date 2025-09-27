import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Shield, CreditCard, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <Settings className="h-8 w-8 mr-3 text-emerald-400" />
          Настройки
        </h1>
        <p className="text-zinc-400">Управляйте своим профилем и настройками аккаунта</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-emerald-400" />
                Профиль
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Обновите информацию о себе
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-emerald-500 text-white text-xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    Изменить фото
                  </Button>
                  <p className="text-xs text-zinc-500 mt-1">JPG, PNG до 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Имя</Label>
                  <Input
                    id="name"
                    defaultValue="John Doe"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-zinc-300">О себе</Label>
                <Input
                  id="bio"
                  defaultValue="Senior Developer"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-400" />
                Безопасность
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Управляйте паролем и безопасностью
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-zinc-300">Текущий пароль</Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-zinc-300">Новый пароль</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-zinc-300">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Изменить пароль
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription & Preferences */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-emerald-400" />
                Подписка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 mb-2">
                  Pro Plan
                </Badge>
                <p className="text-2xl font-bold text-white">$200/месяц</p>
                <p className="text-sm text-zinc-400">До 50 пользователей</p>
              </div>

              <Separator className="bg-zinc-800" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Следующий платеж</span>
                  <span className="text-white">15 января 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Способ оплаты</span>
                  <span className="text-white">**** 4242</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                  Управлять подпиской
                </Button>
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  Скачать счет
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-emerald-400" />
                Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Email уведомления</p>
                  <p className="text-xs text-zinc-400">Получать уведомления на email</p>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                  Включено
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Push уведомления</p>
                  <p className="text-xs text-zinc-400">Уведомления в браузере</p>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                  Включено
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">AI Insights</p>
                  <p className="text-xs text-zinc-400">Рекомендации от AI агентов</p>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                  Включено
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Palette className="h-5 w-5 mr-2 text-emerald-400" />
                Внешний вид
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Темная тема</span>
                  <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-400">
                    Активна
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Компактный режим</span>
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
                    Выключено
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

