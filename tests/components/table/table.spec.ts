import { expect, test } from '@playwright/test';
import { runPerformanceTest } from '../../performance/run-performance-test';
import { tablePerformanceScenario } from './utils/table-performance';

test.describe('table performance stress test', () => {
  test('finds the rendering breaking point after 10s of interaction', async ({ page }) => {
    await expect(runPerformanceTest(page, tablePerformanceScenario)).rejects.toThrow(/Breaking point/);
  });
});
