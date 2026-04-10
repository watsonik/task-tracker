# ✅ CI Issues Recap — Полная история всех проблем с CI и как они были решены

Этот документ описывает все реальные проблемы, которые возникли при настройке GitHub Actions для проекта **task-tracker**, почему они появлялись, почему предыдущие попытки не работали и какое решение сработало в итоге.

---

# ✅ 1. CI запускался в неправильной директории

### ❌ Симптомы:

- `Error: No such file or directory`
- CI пытался выполнить шаги в:
  ```
  /home/runner/work/task-tracker/task-tracker/task-tracker
  ```

### ❌ Почему так происходило:

- GitHub Actions использует структуру:
  ```
  /home/runner/work/<repo>/<repo>
  ```
- `working-directory: ${{ github.workspace }}/task-tracker` приводил к **лишнему вложению**.

### ✅ Решение:

Убрать `/task-tracker` и оставить:

```yaml
working-directory: ${{ github.workspace }}
```

CI стал запускаться в правильном каталоге.

---

# ✅ 2. “Playwright Test did not expect test() to be called here”

### ❌ Симптомы:

```
Playwright Test did not expect test() to be called here.
No tests found.
```

### ❌ Почему это происходило:

- Playwright **не считал тест файл тестом**.
- `testMatch: "*.spec.cjs"` совпадал только с файлами в корне `testDir`, но **НЕ с поддиректориями**.
- В итоге Playwright видел файл как обычный JS‑модуль.

### ✅ Решение:

Исправить на:

```js
testMatch: "**/*.spec.cjs";
```

Теперь Playwright корректно видит тесты.

---

# ✅ 3. Конфиг Playwright НЕ загружался

### ❌ Симптом:

Playwright падал ещё до запуска тестов.

### ❌ Причина:

- Проект `"type": "module"`
- Конфиг в CJS формате → должен быть `.cjs`
- Но Playwright не находил конфиг, если директория некорректная

### ✅ Решение:

Использовать:

```
playwright.config.cjs
```

и запускать строго локальный runner:

```bash
node ./node_modules/@playwright/test/cli.js test
```

---

# ✅ 4. Глобальный Playwright конфликтовал с локальным

### ❌ Симптом:

```
You have two different versions of @playwright/test.
Permission denied
No tests found
```

### ❌ Почему:

GitHub Actions runner имеет **глобальный playwright-cli**:

```
/opt/hostedtoolcache/.../playwright
```

При вызове:

```
npx playwright ...
```

запускался НЕ твой локальный Playwright.

### ✅ Решение:

Запускать локальный runner:

```bash
node ./node_modules/@playwright/test/cli.js test
```

---

# ✅ 5. Playwright показывал “chromium executable not found”

### ❌ Причина:

Устанавливал браузеры через:

```
npx playwright install
```

но npx вызывал глобальную версию Playwright.

### ✅ Решение:

Устанавливать через локальный CLI:

```bash
node ./node_modules/playwright-core/cli.js install-deps
node ./node_modules/playwright-core/cli.js install chromium
```

---

# ✅ 6. sqlite3 падал на CI (“invalid ELF header”)

### ❌ Причина:

Локально sqlite3 собран под Windows, но в CI нужен Linux‑бинарник.

### ✅ Решение:

В backend deps:

```bash
npm rebuild sqlite3 --build-from-source
```

---

# ✅ 7. CI запускал ВСЕ джобы при ручном запуске

### ❌ Причина:

В job `e2e` не было условия `if:`  
По умолчанию все jobs запускались для `workflow_dispatch`.

### ✅ Решение:

Добавить:

```yaml
if: github.event_name == 'push' || github.event_name == 'pull_request'
```

Теперь:

- manual-e2e → запускается только вручную
- daily-e2e → только по расписанию
- e2e → только push/PR

---

# ✅ 8. Дублирование запусков при изменении README

### ❌ Причина:

CI триггерился на каждый push.

### ✅ Решение:

Использовать paths-ignore:

```yaml
paths-ignore:
  - "README.md"
  - "docs/**"
```

---

# 🎉 Итог

✅ идеальный CI  
✅ локальный Playwright runner  
✅ стабильные тесты  
✅ ежедневные прогоны  
✅ ручной запуск  
✅ никакого дублирования  
✅ никаких ложных запусков  
✅ никаких конфликтов ESM/CJS  
✅ никаких глобальных Playwright конфликтов

---
