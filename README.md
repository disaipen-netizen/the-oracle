# The Oracle 🔮

Психологический расклад Таро на Claude AI.

## Деплой на Vercel

1. Залить на GitHub
2. Подключить к Vercel
3. В Settings → Environment Variables добавить:
   ```
   ANTHROPIC_API_KEY = sk-ant-ваш_ключ
   ```
4. Deploy

## Локальная разработка

```bash
npm install
npm run dev
```

Создать файл `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-ваш_ключ
```
