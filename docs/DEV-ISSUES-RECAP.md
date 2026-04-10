# ✅ Development Issues Recap — Все проблемы разработки task‑tracker и как они были решены

Этот документ описывает все ключевые проблемы, которые возникли при разработке backend, frontend и тестов, и объясняет:

- почему ошибка возникала
- почему первоначальное решение не работало
- как проблема была решена

---

# ✅ 1. Backend падал с ошибкой sqlite3 (“invalid ELF header”)

### ❌ Почему:

SQLite3 — это **native addon**, который компилируется под ОС.

- Локально → собран под Windows
- CI → Linux
- Windows-бинарник несовместим → “invalid ELF header”

### ❌ Почему ранние попытки не помогали:

- `npm install` не пересобирает бинарники
- lockfile тащит старый Windows‑артефакт

### ✅ Рабочее решение:

```
npm rebuild sqlite3 --build-from-source
```

→ sqlite компилируется под Linux → backend запускается.

---

# ✅ 2. Тесты Playwright не видели backend

### ❌ Причина:

Backend dev process стартовал, но health-check проверял `/health`, которого нет.

### ✅ Решение:

Health check обновлён:

```bash
curl -s http://localhost:3000/health
# fallback:
curl -s http://localhost:3000
```

Теперь CI корректно определяет, что backend жив.

---

# ✅ 3. Frontend запускался, но тесты падали из‑за CORS/URLs

### ❌ Почему:

Playwright открывал `/`, а backend frontend запускался с `localhost:5173`.

### ✅ Решение:

В тестах:

```js
await page.goto("/");
```

Playwright корректно устанавливает baseURL через config → работает.

---

# ✅ 4. Сломанные Playwright тесты из-за смешивания ESM и CJS

### ❌ Причина:

- проект `"type": "module"`
- тесты сначала были `.js`, использовали `require`
- Node интерпретирует `.js` как ES‑module → require не работает

### ✅ Решение:

Тесты переведены в CJS:

```
auth-and-crud.spec.cjs
```

---

# ✅ 5. Playwright тест НЕ ЖДАЛ ответ PATCH

### ❌ Причина:

- toggle был асинхронным
- тест кликал слишком быстро
- проверка статуса шла раньше, чем backend ответил

### ✅ Решение:

Добавил:

```js
const patchOk = page.waitForResponse(...)
await checkbox.click();
await patchOk;
```

Теперь тест синхронно ждёт обновление.

---

# ✅ 6. Delete тест иногда “зависал”

### ❌ Причина:

Playwright ожидал исчезновения элемента, но frontend не обновлял state до синхронизации.

### ✅ Решение:

Использовать:

```js
await expect(item).toHaveCount(0);
```

Это заставляет Playwright ждать.

---

# ✅ 7. Проблемы с путями тестов (tests-e2e не виделись)

### ❌ Причина:

Оригинальный `testMatch`:

```js
testMatch: "*.spec.cjs";
```

→ видел только файлы в корне testDir  
→ мои файлы лежали глубже

### ✅ Решение:

```
testMatch: "**/*.spec.cjs"
```

Теперь любые вложенные тесты подхватываются.

---

# ✅ 8. Перемешивание проектов Playwright (chromium vs chromium-headless)

### ❌ Почему:

Playwright по умолчанию пытается запустить ВСЕ projects.

### ✅ Решение:

Запускать конкретный:

```
--project=chromium-headless
```

---

# ✅ 9. Express 5 + ESM + Vite → проблемы с import/require

### ❌ Причина:

Были смешаны require и import.

### ✅ Решение:

Оставить backend полностью как ESM:

```json
"type": "module"
```

И аккуратно использовать:

```js
import express from "express";
```

---

# ✅ 10. NPM конфликт package-lock.json

### ❌ Причина:

Удаление `node_modules` на Windows оставило скрытый файл `.package-lock.json` внутри node_modules → CI пытался читать его.

### ✅ Решение:

Удалить ВСЁ node_modules:

```bash
rm -rf node_modules
npm install
```

---

# 🎉 Итог

После всех исправлений:

✅ backend стабилен  
✅ frontend стабилен  
✅ тесты корректно синхронизируются  
✅ Playwright работает локально и на CI  
✅ структура проекта ясная  
✅ pipeline автоматизирован
