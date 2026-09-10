import { defineConfig, devices } from "@playwright/test";

const testPort = process.env.TEST_PORT || "3005";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || `http://127.0.0.1:${testPort}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${testPort}`,
        url: `http://127.0.0.1:${testPort}`,
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
        env: {
          NO_PROXY: "127.0.0.1,localhost,::1",
          HTTP_PROXY: "",
          HTTPS_PROXY: "",
          http_proxy: "",
          https_proxy: "",
        },
      },
});
