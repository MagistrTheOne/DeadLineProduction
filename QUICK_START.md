# 🚀 Быстрый старт DeadLine V2

## 📋 Предварительные требования

- Node.js 18+ 
- npm или yarn
- PostgreSQL база данных (рекомендуется Neon)

## 🗄️ Настройка базы данных

### Вариант 1: Neon (рекомендуется)

1. **Создайте аккаунт на [neon.tech](https://neon.tech)**
2. **Создайте новый проект**
3. **Скопируйте Connection String**
4. **Обновите .env файл:**

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Вариант 2: Локальная PostgreSQL

1. **Установите PostgreSQL:**
   ```bash
   # Windows (с Chocolatey)
   choco install postgresql
   
   # macOS (с Homebrew)
   brew install postgresql
   
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   ```

2. **Создайте базу данных:**
   ```bash
   createdb deadline_db
   ```

3. **Обновите .env файл:**
   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/deadline_db
   ```

## 🔧 Установка и запуск

### 1. Установите зависимости
```bash
npm install
```

### 2. Настройте переменные окружения
Скопируйте `.env.example` в `.env` и заполните:

```env
# Database
DATABASE_URL=your_database_url_here

# GigaChat API
GIGACHAT_CLIENT_ID=0199824b-4c1e-7ef1-b423-bb3156ddecee
GIGACHAT_CLIENT_SECRET=your_client_secret_here
GIGACHAT_SCOPE=GIGACHAT_API_PERS

# Session & Security
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# WebSocket
WEBSOCKET_URL=ws://localhost:3001
```

### 3. Создайте схему базы данных
```bash
npm run db:push
```

### 4. Инициализируйте тестовыми данными
```bash
npm run db:init
```

### 5. Запустите проект
```bash
npm run dev
```

## ✅ Проверка установки

1. **Откройте http://localhost:3000**
2. **Зарегистрируйтесь или войдите**
3. **Проверьте Dashboard**
4. **Откройте AI Features и проверьте статус GigaChat**

## 🎯 Готовые функции

После настройки будут доступны:

- ✅ **Dashboard** - метрики и быстрые действия
- ✅ **Tasks** - Kanban доска с drag-and-drop
- ✅ **AI Features** - 12 AI агентов с GigaChat
- ✅ **Chat** - real-time командный чат
- ✅ **Settings** - профиль и подписка
- ✅ **Payment** - тарифы и оплата

## 🛠️ Полезные команды

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск продакшена
npm run start

# База данных
npm run db:push      # Создать схему
npm run db:studio    # Открыть Drizzle Studio
npm run db:init      # Инициализировать данными

# Тестирование
npm run db:studio    # Веб-интерфейс для БД
```

## 🔍 Мониторинг

- **Drizzle Studio**: `npm run db:studio` - веб-интерфейс для БД
- **GigaChat Status**: http://localhost:3000/ai-features
- **API Test**: http://localhost:3000/api/ai/test

## 📚 Документация

- [Настройка GigaChat](GIGACHAT_SETUP.md)
- [Настройка базы данных](DATABASE_SETUP.md)
- [Схема проекта](project.md)

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте переменные окружения в `.env`
2. Убедитесь, что база данных доступна
3. Проверьте статус GigaChat API
4. Посмотрите логи в консоли браузера
