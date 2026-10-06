import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL ?? "msedge",
    headless: true,
    trace: "retain-on-failure",
  },
});
