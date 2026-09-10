import { expect, test } from '@playwright/test';
import { runPerformanceTest } from '../../performance/run-performance-test';
import { treeGridPerformanceScenario } from './utils/tree-grid-performance';

test.describe('tree grid performance stress test', () => {
  test('verifies tree grid interaction and hierarchy features', async ({ page }) => {
    await page.goto('/iframe.html?id=performance-tree-grid--populated&viewMode=story');
    await page.locator('storybook-tree-grid-container[data-ready="true"]').waitFor();

    // Verify initial rows are rendered
    const rows = page.locator('tbody tr.tree-row');
    await expect(rows.first()).toBeVisible();

    // Verify expand/collapse toggle
    const firstToggle = page.locator('.toggle-btn').first();
    const initialRowCount = await rows.count();
    await firstToggle.click();
    const updatedRowCount = await rows.count();
    expect(updatedRowCount).not.toBe(initialRowCount);

    // Toggle back
    await firstToggle.click();

    // Test cascading checkbox selection
    const firstCheckbox = page.locator('tbody .col-select input[type="checkbox"]').first();
    await firstCheckbox.check();
    const selectedCount = page.locator('.selected-count');
    await expect(selectedCount).not.toHaveText('0 selected');

    // Test search filter auto-expansion
    const filterInput = page.locator('input[type="search"]');
    await filterInput.fill('Platform');
    await expect(page.locator('tbody tr.tree-row').first()).toBeVisible();
    await filterInput.fill('');
  });

  test('evaluates tree grid performance during interaction window', async ({ page }) => {
    try {
      await runPerformanceTest(page, treeGridPerformanceScenario);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Breaking point')) {
        console.log(`Identified tree grid breaking point: ${err.message}`);
        return;
      }
      throw err;
    }
  });
});

