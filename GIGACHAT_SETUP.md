# Настройка GigaChat API для DeadLine V2

## 🔑 Полученные данные

- **Client ID**: `0199824b-4c1e-7ef1-b423-bb3156ddecee`
- **Scope**: `GIGACHAT_API_PERS`
- **Base URL**: `https://gigachat.devices.sberbank.ru/api/v1`

## 📋 Настройка окружения

1. **Скопируйте `.env.example` в `.env`**:
   ```bash
   cp .env.example .env
   ```

2. **Заполните переменные в `.env`**:
   ```env
   # GigaChat API Configuration
   GIGACHAT_BASE_URL=https://gigachat.devices.sberbank.ru/api/v1
   GIGACHAT_CLIENT_ID=0199824b-4c1e-7ef1-b423-bb3156ddecee
   GIGACHAT_CLIENT_SECRET=your_client_secret_here
   GIGACHAT_SCOPE=GIGACHAT_API_PERS
   
   # Database
   DATABASE_URL=postgres://username:password@localhost:5432/deadline_db
   
   # Session & Security
   SESSION_SECRET=your-super-secret-session-key-min-32-chars
   
   # WebSocket
   WEBSOCKET_URL=ws://localhost:3001
   ```

3. **Получите Client Secret**:
   - Перейдите в панель управления Sber GigaChat
   - Найдите раздел "API ключи" или "Авторизация"
   - Скопируйте Client Secret
   - Вставьте в `GIGACHAT_CLIENT_SECRET` в `.env` файле

## 🚀 Запуск проекта

1. **Установите зависимости**:
   ```bash
   npm install
   ```

2. **Настройте базу данных**:
   ```bash
   # Создайте PostgreSQL базу данных
   createdb deadline_db
   
   # Запустите миграции Drizzle
   npm run db:push
   ```

3. **Запустите проект**:
   ```bash
   npm run dev
   ```

## ✅ Проверка подключения

1. Откройте http://localhost:3000/ai-features
2. Проверьте статус "GigaChat API Status"
3. Если статус "Подключено" - интеграция работает
4. Если "Отключено" - проверьте настройки в `.env`

## 🔧 Тестирование API

Можно протестировать подключение через API endpoint:

```bash
curl -X GET http://localhost:3000/api/ai/test
```

Ожидаемый ответ при успешном подключении:
```json
{
  "connected": true,
  "message": "GigaChat API подключен успешно",
  "timestamp": "2025-01-25T10:30:00.000Z"
}
```

## 🛠️ Устранение проблем

### Ошибка "Failed to get token"
- Проверьте правильность `GIGACHAT_CLIENT_SECRET`
- Убедитесь, что Client ID и Secret соответствуют друг другу

### Ошибка "GigaChat API error: 401"
- Проверьте срок действия Client Secret
- Убедитесь, что scope правильный: `GIGACHAT_API_PERS`

### Ошибка "GigaChat API error: 403"
- Проверьте права доступа к API
- Убедитесь, что аккаунт имеет доступ к GigaChat API

## 📚 Дополнительная информация

- **Документация GigaChat**: https://developers.sber.ru/docs/ru/gigachat/overview
- **Лимиты API**: Проверьте лимиты запросов в панели управления
- **Мониторинг**: Используйте статус на странице AI Features для мониторинга

## 🎯 Готовые функции

После настройки GigaChat API будут доступны:

- ✅ 12 AI агентов с полной функциональностью
- ✅ Streaming чат с GigaChat
- ✅ AI Insights и рекомендации
- ✅ Real-time обновления через WebSocket
- ✅ Логирование всех AI взаимодействий
