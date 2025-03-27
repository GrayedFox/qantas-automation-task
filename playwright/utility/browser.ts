import { chromium, Page } from 'playwright';

/**
 * Setup shared browser context for all tests
 */
export const setupBrowser = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  return await context.newPage();
};

/**
 * Teardown shared browser context for all tests
 */
export const teardownBrowser = async (page: Page) => {
  await page.close();
};
