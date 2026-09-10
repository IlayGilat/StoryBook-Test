import { test } from '@playwright/test';
import { runPerformanceTest } from '../../performance/run-performance-test';
import { paginationPerformanceScenario } from './utils/pagination-performance';

test.describe('pagination performance stress test', () => {
  test('navigates pages during the interaction window', async ({ page }) => {
    await runPerformanceTest(page, paginationPerformanceScenario);
  });
});