import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 120000,
  reporter: 'list',
  outputDir: '.artifacts/test-results',
  use: {
    baseURL: process.env['STORYBOOK_URL'] ?? 'http://127.0.0.1:6006',
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npx http-server .artifacts/storybook-static --port 6006 --host 127.0.0.1 --silent',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
});
