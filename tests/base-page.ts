import { Page, Locator } from "@playwright/test"

/**
 * The storefront renders the same `data-testid` twice on several screens
 * (a mobile layout and a desktop layout, one hidden by CSS). A bare
 * `getByTestId(...)` therefore trips Playwright's strict mode. Every page
 * object below goes through `testId()`, which resolves to the visible one.
 */
export class BasePage {
  constructor(protected page: Page) {}

  /** First *visible* element with this test id (dodges the mobile/desktop duplicates). */
  testId(id: string): Locator {
    return this.page.getByTestId(id).locator("visible=true").first()
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" })
  }
}
