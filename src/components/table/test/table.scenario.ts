import type { Page } from '@playwright/test';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import type {
  PerformanceRunContext,
  PerformanceScenario,
} from '../../../benchmark/playwright/benchmark.types';
import { runTableBrowserInteraction } from './table.interactions';
import { TABLE_FILTER_VALUES } from './table.scenario.constants';

/** Runs the table interaction implementation inside the Storybook frame. */
function runTableInteraction(page: Page, context: PerformanceRunContext) {
  return page.evaluate(runTableBrowserInteraction, {
    context,
    filterValues: TABLE_FILTER_VALUES,
  });
}

export const tablePerformanceScenario: PerformanceScenario = {
  componentName: BenchmarkComponent.Table,
  datasetSizes: [100, 500, 1000, 2500, 5000, 10000],
  runInteraction: runTableInteraction,
};
