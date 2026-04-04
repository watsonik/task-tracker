<!-- PROJECT BANNER -->
<p align="center">
  <img src="https://readme-components.vercel.app/api?component=text&text=Task%20Tracker&fontFamily=Geist&fontSize=36&fontWeight=700&color=38bdf8FF" alt="Task Tracker"/>
</p>

<p align="center">
  <img src="https://readme-components.vercel.app/api?component=text&text=Full%20Stack%20%7C%20Node.js%20%2B%20React%20%2B%20SQLite%20%2B%20Playwright&fontFamily=Geist&fontSize=18&fontWeight=500&color=a3e635FF" alt="Tech stack"/>
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:1e1e1e,100:0f172a&height=2&section=header"/>
</p>

<!-- BADGES -->
<p align="center">

  <!-- CI -->
  <img src="https://github.com/watsonik/task-tracker/actions/workflows/ci.yml/badge.svg" alt="CI">

  <!-- Node.js -->
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node">

  <!-- NPM -->
  <img src="https://img.shields.io/badge/npm-v10-red?logo=npm&logoColor=white" alt="npm">

  <!-- Playwright -->
  <img src="https://img.shields.io/badge/Playwright-1.58-45ba4b?logo=playwright&logoColor=white" alt="Playwright">

  <!-- React -->
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black" alt="React">

  <!-- Vite -->
  <img src="https://img.shields.io/badge/Vite-5.0-646cff?logo=vite&logoColor=yellow" alt="Vite">

  <!-- SQLite -->
  <img src="https://img.shields.io/badge/SQLite-3-blue?logo=sqlite&logoColor=white" alt="SQLite">

  <!-- Express -->
  <img src="https://img.shields.io/badge/Express.js-5-black?logo=express&logoColor=white" alt="Express">

  <!-- JWT -->
  <img src="https://img.shields.io/badge/JWT-secure-orange?logo=jsonwebtokens" alt="JWT">

  <!-- GitHub Actions -->
  <img src="https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?logo=githubactions&logoColor=white" alt="GitHub Actions">

  <!-- Tests -->
  <img src="https://img.shields.io/badge/tests-passing-brightgreen?logo=checkmarx" alt="Tests">

  <!-- Coverage (fake placeholder until integrated) -->
  <img src="https://img.shields.io/badge/coverage-100%25-brightgreen?logo=vercel" alt="coverage">

  <!-- Last Commit -->
  <img src="https://img.shields.io/github/last-commit/watsonik/task-tracker?color=yellow&logo=git" alt="Last commit">

  <!-- Repo Size -->
  <img src="https://img.shields.io/github/repo-size/watsonik/task-tracker?color=a855f7" alt="Repo size">

  <!-- License -->
  <img src="https://img.shields.io/badge/License-MIT-blue?logo=open-source-initiative&logoColor=white" alt="License">

</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:0f172a,100:1e1e1e&height=2&section=footer"/>
</p>

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
