import { expect, test } from '@playwright/test';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import { loadBenchmarkDataset, runPerformanceTest } from '../../../benchmark/playwright/benchmark-runner';
import { tablePerformanceScenario } from './table.scenario';

test.describe('table performance stress test', () => {
  test('preserves sorting, filtering, and scrolling behavior', async ({ page }) => {
    await loadBenchmarkDataset(page, BenchmarkComponent.Table, 100);

    const component = page.locator('storybook-table');
    const rows = component.locator('tbody tr');
    await expect(rows).toHaveCount(100);
    await component.getByRole('button', { name: /ID/ }).click();
    await expect(rows.first().locator('td').first()).toHaveText('100');

    await component.getByRole('searchbox').fill('Record 42');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Record 42');

    const viewport = component.locator('.table-viewport');
    await component.getByRole('searchbox').fill('');
    await viewport.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  });

  test('measures every configured dataset size', async ({ page }) => {
    await runPerformanceTest(page, tablePerformanceScenario);
  });
});
