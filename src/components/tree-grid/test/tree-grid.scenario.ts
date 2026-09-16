import type { Page } from '@playwright/test';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import type {
  PerformanceRunContext,
  PerformanceScenario,
} from '../../../benchmark/playwright/benchmark.types';
import { runTreeGridBrowserInteraction } from './tree-grid.interactions';
import { TREE_GRID_FILTER_VALUES } from './tree-grid.scenario.constants';

/** Runs the tree-grid interaction implementation inside the Storybook frame. */
function runTreeGridInteraction(page: Page, context: PerformanceRunContext) {
  return page.evaluate(runTreeGridBrowserInteraction, {
    context,
    filterValues: TREE_GRID_FILTER_VALUES,
  });
}

export const treeGridPerformanceScenario: PerformanceScenario = {
  componentName: BenchmarkComponent.TreeGrid,
  datasetSizes: [100, 500, 1000, 2500, 5000],
  runInteraction: runTreeGridInteraction,
};
