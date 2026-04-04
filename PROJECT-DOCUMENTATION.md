# 📘 Task Tracker — Full Documentation Pack

Полный комплект документации проекта: диаграммы, архитектура, sequence diagrams, overview pipelines.

---

# 🧩 1. Mermaid Diagram — Инфраструктура CI/CD

```mermaid
flowchart TB

    subgraph Dev["🧑‍💻 Developer"]
        A1[Push to repo]
        A2[Create Pull Request]
        A3[Manual Run Trigger]
    end

    subgraph GitHub["🐙 GitHub Actions"]
        subgraph Workflow["CI Workflow"]
            B1[e2e Job<br/>Triggers: push, PR]
            B2[daily-e2e Job<br/>Trigger: schedule]
            B3[manual-e2e Job<br/>Trigger: dispatch]

            subgraph Steps["Common Steps"]
                S1[Checkout]
                S2[Install Node + caching]
                S3[Backend install + sqlite rebuild]
                S4[Frontend install]
                S5[Playwright browsers install<br/>local CLI]
                S6[Start Backend]
                S7[Start Frontend]
                S8[Run Playwright runner]
                S9[Upload artifacts]
            end
        end
    end

    subgraph Systems["🧱 System Under Test"]
        C1[Backend: Express + SQLite]
        C2[Frontend: React + Vite]
        C3[Playwright: chromium-headless]
    end

    A1 --> B1
    A2 --> B1
    A3 --> B3
    B2 --> B2

    B1 --> S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9
    B3 --> S1
    B2 --> S1

    S6 --> C1
    S7 --> C2
    S8 --> C3
```

---

# 🧱 2. Архитектура Backend (Mermaid Component Diagram)

```mermaid
flowchart LR

    Client["🧑‍💻 Client / Browser"]
    Backend["🔧 Express Server (server.js)"]
    Routes["📁 Routes (auth, tasks)"]
    Controllers["🧠 Controllers (login, signup, CRUD)"]
    DB["💾 SQLite Database (data.db)"]
    JWT["🔐 JWT Auth"]
    Bcrypt["🧂 bcryptjs"]

    Client --> Backend
    Backend --> Routes
    Routes --> Controllers
    Controllers --> DB
    Controllers --> JWT
    Controllers --> Bcrypt
```

---

# 🎨 3. Архитектура Frontend (Vite + React)

```mermaid
flowchart LR

    User["🧑 User"]
    UI["🖼 React Components"]
    Hooks["🔁 Hooks & State"]
    API["🌐 API Service (fetch / axios)"]
    Backend["🔧 Express API"]

    User --> UI
    UI --> Hooks
    Hooks --> API
    API --> Backend
```

---

# 🔄 4. Sequence Diagram — “Signup → Add Task → Toggle → Delete”

```mermaid
sequenceDiagram
    participant U as User (Playwright)
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as SQLite

    U->>F: Open /
    F->>B: GET /
    B->>F: Return HTML/JS

    U->>F: Fill email/password
    U->>F: Click Sign Up
    F->>B: POST /api/signup (email, pass)
    B->>DB: INSERT user
    DB->>B: OK
    B->>F: { token }

    U->>F: Add task
    F->>B: POST /api/tasks
    B->>DB: INSERT task
    DB->>B: OK
    B->>F: task data

    U->>F: Toggle task
    F->>B: PATCH /api/tasks/:id
    B->>DB: UPDATE task SET done=1
    B->>F: { done: true }

    U->>F: Delete task
    F->>B: DELETE /api/tasks/:id
    B->>DB: DELETE
    B->>F: { ok: true }
```

---

# 🏛 5. Архитектурная Диаграмма Проекта (Full System Overview)

```mermaid
graph TD

    subgraph Frontend["React + Vite"]
        R1[Login Page]
        R2[Tasks Page]
        R3[UI State / Hooks]
    end

    subgraph Backend["Node.js + Express"]
        E1[server.js]
        E2[auth routes]
        E3[tasks routes]
        E4[controllers]
        E5[JWT middleware]
    end

    subgraph Database["SQLite"]
        D1[users table]
        D2[tasks table]
    end

    subgraph Tests["Playwright"]
        T1[auth-and-crud.spec.cjs]
        T2[chromium-headless]
    end

    subgraph CI["GitHub Actions"]
        C1[e2e (push/PR)]
        C2[daily-e2e (cron)]
        C3[manual-e2e (dispatch)]
    end

    R1 --> E2
    R2 --> E3
    E4 --> D1
    E4 --> D2
    T1 --> R1
    T1 --> R2
    C1 --> T1
    C2 --> T1
    C3 --> T1
```

---

# 📝 6. Postmortem (Google SRE Style)

## 📌 Incident Summary

CI pipeline был полностью нестабилен в течение ~7 дней:

- тесты не запускались
- pipeline ломался на разных стадиях
- глобальные бинарники нарушали работу Playwright
- SQLite ломался в Linux
- ручные джобы запускали лишние e2e джобы

## 📌 Root Causes

1. Неверная рабочая директория в GitHub Actions
2. Глобальный playwright-cli перехватывал вызовы
3. testMatch настроен некорректно
4. sqlite3 был установлен под Windows, а не Linux
5. browsers устанавливались через глобальный Playwright
6. неверные условия в workflow jobs
7. недостаточный health-check backend

## 📌 What Went Well

✅ Все проблемы были устранены  
✅ CI теперь стабильный  
✅ Тесты выполняются одинаково локально и в CI  
✅ Backend/Frontend запускаются корректно  
✅ pipeline стал профессиональным и надёжным

## 📌 What Went Wrong

❌ GitHub Actions скрывает глобальный playwright  
❌ tricky поведение with ESM/CJS  
❌ testMatch по умолчанию рискованный  
❌ sqlite3 — самый проблемный модуль cross-platform

## 📌 Action Items

✅ Использовать локальный Playwright runner  
✅ Устанавливать браузеры через playwright-core  
✅ Добавить условия if:  
✅ testMatch="\*_/_.spec.cjs"  
✅ Улучшенный health-check  
✅ Пересборка sqlite3 под Linux

Long-term:
⬜ Возможный переход на Prisma  
⬜ Unit tests для backend  
⬜ Docker контейнеризация

---

# ✅ Конец документа
