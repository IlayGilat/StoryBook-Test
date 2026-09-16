import { expect, test } from '@playwright/test';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import { loadBenchmarkDataset, runPerformanceTest } from '../../../benchmark/playwright/benchmark-runner';
import { treeDatasetSchema } from '../data/tree-grid.data';
import { createTreeRoot } from '../data/tree-grid.factory';
import { treeGridPerformanceScenario } from './tree-grid.scenario';

test.describe('tree grid performance stress test', () => {
  test('rejects an invalid parent-child relationship', () => {
    const root = createTreeRoot(0, () => 0.5);
    root.children[0].parentId = root.id + 1;

    expect(treeDatasetSchema.safeParse([root]).success).toBe(false);
  });

  test('preserves tree grid interaction and hierarchy features', async ({ page }) => {
    await loadBenchmarkDataset(page, BenchmarkComponent.TreeGrid, 20);
    const component = page.locator('storybook-tree-grid');

    // Verify initial rows are rendered
    const rows = component.locator('tbody tr.tree-row');
    await expect(rows.first()).toBeVisible();

    // Verify expand/collapse toggle
    const firstToggle = component.locator('.toggle-btn').first();
    const initialRowCount = await rows.count();
    await firstToggle.click();
    const updatedRowCount = await rows.count();
    expect(updatedRowCount).not.toBe(initialRowCount);

    // Toggle back
    await firstToggle.click();

    // Test cascading checkbox selection
    const firstCheckbox = component.locator('tbody .col-select input[type="checkbox"]').first();
    await firstCheckbox.check();
    const selectedCount = component.locator('.selected-count');
    await expect(selectedCount).not.toHaveText('0 selected');

    // Test search filter auto-expansion
    const filterInput = component.locator('input[type="search"]');
    await filterInput.fill('Platform');
    await expect(component.locator('tbody tr.tree-row').first()).toBeVisible();
    await filterInput.fill('');
  });

  test('evaluates tree grid performance during interaction window', async ({ page }) => {
    await runPerformanceTest(page, treeGridPerformanceScenario);
  });
});
