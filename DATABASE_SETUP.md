# Настройка базы данных DeadLine V2

## 🗄️ Схема базы данных

Проект использует PostgreSQL с Drizzle ORM. Схема включает:

- **users** - пользователи системы
- **projects** - проекты
- **tasks** - задачи с Kanban статусами
- **comments** - комментарии к задачам
- **notifications** - уведомления
- **ai_interactions** - взаимодействия с AI агентами
- **subscriptions** - подписки пользователей

## 🚀 Быстрая настройка

### 1. Установите зависимости
```bash
npm install
```

### 2. Настройте переменные окружения
Скопируйте `.env.example` в `.env` и заполните:

```env
# Database
DATABASE_URL=postgres://username:password@localhost:5432/deadline_db

# GigaChat API
GIGACHAT_CLIENT_ID=0199824b-4c1e-7ef1-b423-bb3156ddecee
GIGACHAT_CLIENT_SECRET=your_client_secret_here
GIGACHAT_SCOPE=GIGACHAT_API_PERS

# Session & Security
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# WebSocket
WEBSOCKET_URL=ws://localhost:3001
```

### 3. Создайте базу данных
```bash
# Для локальной PostgreSQL
createdb deadline_db

# Или используйте Neon (рекомендуется)
# Создайте проект на https://neon.tech
# Скопируйте DATABASE_URL в .env
```

### 4. Запустите миграции
```bash
# Создать и применить схему
npm run db:push

# Инициализировать тестовыми данными
npm run db:init
```

## 📊 Доступные команды

```bash
# Создать и применить схему
npm run db:push

# Сгенерировать миграции
npm run db:generate

# Применить миграции
npm run db:migrate

# Открыть Drizzle Studio
npm run db:studio

# Инициализировать тестовыми данными
npm run db:init
```

## 🔍 Проверка базы данных

### Drizzle Studio
```bash
npm run db:studio
```
Откроется веб-интерфейс для просмотра и редактирования данных.

### SQL запросы
```sql
-- Проверить таблицы
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Проверить пользователей
SELECT * FROM users;

-- Проверить задачи
SELECT t.*, p.name as project_name 
FROM tasks t 
JOIN projects p ON t.project_id = p.id;
```

## 📈 Тестовые данные

После `npm run db:init` будут созданы:

- **1 пользователь**: admin@deadline.com (owner, pro subscription)
- **1 проект**: "DeadLine Platform"
- **4 задачи**: с разными статусами и приоритетами
- **1 AI взаимодействие**: пример диалога с Team Lead
- **1 подписка**: Pro план

## 🛠️ Устранение проблем

### Ошибка подключения к БД
```bash
# Проверьте DATABASE_URL
echo $DATABASE_URL

# Проверьте доступность БД
psql $DATABASE_URL -c "SELECT 1;"
```

### Ошибка миграций
```bash
# Сбросить и пересоздать схему
npm run db:push --force

# Или удалить и пересоздать БД
dropdb deadline_db
createdb deadline_db
npm run db:push
```

### Проблемы с правами
```bash
# Дать права пользователю
GRANT ALL PRIVILEGES ON DATABASE deadline_db TO your_user;
```

## 🎯 Готовые функции

После настройки БД будут доступны:

- ✅ Аутентификация пользователей
- ✅ Управление проектами и задачами
- ✅ Kanban доска с drag-and-drop
- ✅ AI агенты с логированием взаимодействий
- ✅ Real-time уведомления
- ✅ Система подписок

## 📚 Дополнительная информация

- **Drizzle ORM**: https://orm.drizzle.team
- **PostgreSQL**: https://www.postgresql.org
- **Neon Database**: https://neon.tech (рекомендуется для продакшена)
