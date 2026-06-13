# 🔐 Где хранить API-ключи

GitHub **автоматически блокирует** пуш, если в коде есть секреты
(Supabase service role, Google OAuth secret, Lovable API key и т.д.).
Чтобы этого не случилось, в проекте используется такая схема:

```
.env             ← реальные ключи (НИКОГДА не коммитится, в .gitignore)
.env.example     ← шаблон без значений (коммитится в репозиторий)
```

## 🚀 Быстрый старт после клонирования с GitHub

```bash
cp .env.example .env
# открой .env и подставь свои значения
bun install
bun run dev
```

## 📍 Куда какие ключи класть

| Переменная | Где взять | Где используется |
|---|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` | Lovable Cloud → Backend | Клиент (браузер) |
| `SUPABASE_SERVICE_ROLE_KEY` | Lovable Cloud → Backend | **Только** server functions |
| `LOVABLE_API_KEY` | Создаётся автоматически в Lovable | AI-матчинг профессий |
| `GOOGLE_OAUTH_*` | Google Cloud Console | Если используешь свой Google OAuth |

## ⚠️ Правила безопасности

1. **Никогда** не коммить `.env` — он уже в `.gitignore`.
2. Всё, что начинается на `VITE_` — попадёт в браузер. Туда кладём ТОЛЬКО публичные ключи.
3. `SERVICE_ROLE_KEY` и `LOVABLE_API_KEY` — серверные. Читай их только внутри `createServerFn` через `process.env.X`.
4. Если случайно закоммитил ключ — сразу ротируй его в дашборде провайдера.

## 🛡 Защита от GitHub Secret Scanning

GitHub сканирует репозитории на утечки. Если он найдёт ключ Supabase/Google в коде,
пуш будет отклонён. Эта схема (`.env` в `.gitignore` + `.env.example` с плейсхолдерами)
полностью предотвращает такую блокировку.
