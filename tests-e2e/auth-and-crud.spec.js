import { test, expect } from "@playwright/test";

test("signup → add task → toggle → delete", async ({ page }) => {
  // 1) Открыть приложение
  await page.goto("/");

  // 2) Регистрация нового пользователя (уникальный email)
  const email = `u${Date.now()}@example.com`;
  await page.getByPlaceholder("email").fill(email);
  await page.getByPlaceholder("password").fill("secret123");
  await page.getByRole("button", { name: "Sign up" }).click();

  // 3) Проверить , что попали на экран задач
  await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();

  // 4) Добавить задачу
  await page.getByPlaceholder("New task").fill("Interview prep");
  await page.getByRole("button", { name: "Add" }).click();

  const item = page.locator("li", { hasText: "Interview prep" });
  await expect(item).toBeVisible();

  // 5) Переключить чекбокс → статус "done" (ожидаем зачёркнутый текст)
  const checkbox = item.locator('input[type="checkbox"]');

  await expect(checkbox).not.toBeChecked();

  // Кликаем и ждём, пока придёт успешный PATCH на /api/tasks/:id
  const patchOk = page.waitForResponse(
    (res) =>
      res.request().method() === "PATCH" &&
      /\/api\/tasks\/\d+$/.test(res.url()) &&
      res.status() === 200,
  );

  await checkbox.click();
  await patchOk;

  // Теперь чекбокс должен стать отмеченным
  await expect(checkbox).toBeChecked();

  //   await checkbox.check();
  await expect(item.locator("span")).toHaveCSS(
    "text-decoration-line",
    "line-through",
  );

  // 6) Удалить задачу
  await item.getByRole("button", { name: "Delete" }).click();
  await expect(item).toHaveCount(0);
});
