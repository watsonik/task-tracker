const { test, expect } = require("@playwright/test");

test("signup → add task → toggle → delete", async ({ page }) => {
    await page.goto('http://your-app-url/signup');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('text=Sign up');
    await expect(page.locator('h1')).toHaveText('Tasks');

    await page.fill('input[name="new-task"]', 'New task');
    await page.click('text=Add');
    const item = page.locator('text=New task');
    await expect(item).toBeVisible();

    const checkbox = item.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();

    await Promise.all([
        page.waitForResponse('**/tasks/*', { method: 'PATCH' }),
        await checkbox.click(),
    ]);
    await expect(checkbox).toBeChecked();
    await expect(item).toHaveCSS('text-decoration', 'line-through');

    await page.click('text=Delete');
    await expect(page.locator('text=New task')).toHaveCount(0);
});