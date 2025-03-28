import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// load .env variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  // Opt out of parallel tests on CI and retry on CI only
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

export const weatherBitConfig = {
  baseUrl: process.env.QAT_PW_WEATHER_BIT_URL,
};

export const swagConfig = {
  baseUrl: process.env.QAT_PW_SWAG_URL,
};
