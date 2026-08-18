import { defineConfig, devices } from "@playwright/test"

/**
 * E2E config for the CuarzosMX storefront.
 *
 * `webServer` is deliberately NOT configured: the Medusa backend (:9000) and
 * the Next storefront (:8000) are long-running dev services owned by the
 * developer. Playwright must attach to them, never start or kill them.
 * See tests/README.md for the services that must be up before running.
 */
export default defineConfig({
  testDir: "./tests",
  // The checkout flow talks to a real payment gateway; parallel carts against
  // the same dev backend produce flaky, hard-to-read failures.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 180_000,
  expect: { timeout: 30_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8000",
    locale: "es-MX",
    timezoneId: "America/Mexico_City",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 30_000,
    navigationTimeout: 90_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
