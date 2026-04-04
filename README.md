# ✅ Task Tracker — Full‑Stack приложение (Node.js + SQLite + React + Playwright)

Task Tracker — это полнофункциональное full‑stack приложение для ведения задач, включающее:

- 🚀 Backend: Node.js + Express + SQLite3
- 🎨 Frontend: React + Vite
- 🤖 E2E тесты: Playwright
- ✅ CI/CD: GitHub Actions (backend + frontend + Playwright)
- 📦 Артефакты: HTML‑report, trace, видео, скриншоты

---

# 📌 Возможности

- ✅ Регистрация пользователей (signup)
- ✅ Авторизация (JWT login)
- ✅ CRUD для задач
- ✅ SQLite база данных
- ✅ UI на React (Vite)
- ✅ Полный E2E тест: signup → add → toggle → delete
- ✅ Автоматический CI
- ✅ Ежедневные прогоны
- ✅ Ручной запуск тестов из GitHub UI

---

# 🧱 Стек технологий

### Backend:

- Node.js 20
- Express 5
- SQLite3
- bcryptjs
- jsonwebtoken

### Frontend:

- React
- Vite
- Fetch API

### E2E:

- Playwright (chromium-headless)

### CI:

- GitHub Actions
- Локальный Playwright runner
- Cron‑schedule + manual dispatch

---

# 📂 Структура проекта

```
task-tracker/
│
├── src/                       # backend
│   ├── server.js
│   ├── db.js
│   └── routes/
│
├── web/                       # frontend
│   ├── index.html
│   ├── src/
│   └── package.json
│
├── tests-e2e/                 # Playwright tests
│   └── auth-and-crud.spec.cjs
│
├── playwright.config.cjs      # Playwright config (CJS)
├── package.json               # backend deps
└── data.db                    # SQLite database
```

---

# ▶️ Локальный запуск

## ✅ Установка зависимостей

```bash
npm install
cd web
npm install
cd ..
```

## ✅ Запуск backend

```bash
npm start
```

Backend:

```
http://localhost:3000
```

## ✅ Запуск frontend

```bash
cd web
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 🧪 Запуск тестов Playwright локально

## Установка браузеров

```bash
npx playwright install
```

## Запуск тестов

```bash
npx playwright test --project=chromium-headless
```

## Просмотр отчёта

```bash
npx playwright show-report
```

---

# ✅ CI/CD (GitHub Actions)

Полный pipeline выполняет:

1. Установка backend зависимостей
2. Пересборка sqlite3 под Linux (`npm rebuild sqlite3 --build-from-source`)
3. Установка frontend зависимостей
4. Установка Playwright‑браузеров локально
5. Запуск backend в фоне
6. Health‑check backend
7. Запуск frontend dev server
8. Health‑check фронтенда
9. Запуск Playwright runner
10. Сохранение артефактов:

- playwright-report (HTML)
- test-results (video, screenshots, trace)

11. Cleanup (kill процессов)

---

# ⚙️ Триггеры CI

```yaml
on:
  push: # каждый push
  pull_request: # каждый PR
  workflow_dispatch: # ручной запуск
  schedule:
    - cron: "0 3 * * *" # ежедневный запуск
```

✅ 03:00 UTC = 06:00 Минск  
✅ Полноценный nightly regression  
✅ Можно запустить вручную в GitHub Actions

---

# 📦 Артефакты CI

| Папка                | Описание                  |
| -------------------- | ------------------------- |
| `playwright-report/` | HTML‑отчёт                |
| `test-results/`      | Видео / скриншоты / trace |

Доступны в Actions → конкретный run → Artifacts.

---

# 🧠 Почему используется локальный Playwright runner

GitHub runner содержит глобальный playwright-cli, который:

- несовместим по версии
- не имеет прав исполнения
- ломает тесты (“did not expect test()…”, “No tests found”, “permission denied”)

Поэтому CI запускает только локальный runner:

```bash
node ./node_modules/@playwright/test/cli.js test
```

И устанавливает только локальные браузеры:

```bash
node ./node_modules/playwright-core/cli.js install chromium
```

---

# 🐞 Troubleshooting

### Backend не стартует в CI

```bash
npm rebuild sqlite3 --build-from-source
```

### Ошибка “did not expect test()…”

Запускается не тот runner.  
Используй:

```bash
node ./node_modules/@playwright/test/cli.js test
```

### chromium-headless не найден

Установка браузеров:

```bash
node ./node_modules/playwright-core/cli.js install chromium
```

### frontend health-check падает

Проверь:

```bash
curl http://localhost:5173
```

---

# 👨‍💻 Автор

**Ihar Sakun**  
QA Automation / Full‑Stack Engineer  
GitHub: https://github.com/watsonik

---

# ✅ Лицензия

MIT
``
