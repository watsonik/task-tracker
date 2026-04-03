// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests-e2e",
  testMatch: ["**/*.spec.cjs"],
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173", //наш Vite фронтенд
    headless: false, // для наглядности запускаем в headed режиме
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    launchOptions: { slowMo: 200 }, // замедлить для наглядности

    // 🔽 Всегда сохраняем артефакты:
    trace: "on", // записывать трейс всегда
    screenshot: "on", // скриншоты всегда
    video: "on", // видео всегда
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-headless",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        launchOptions: { slowMo: 0 },
        trace: "retain-on-failure", // можно оставить on / retain-on-failure
        video: "retain-on-failure",
        screenshot: "only-on-failure",
      },
    },
  ],
});
