import type { CDPSession, Page } from '@playwright/test';
import { loadBenchmarkDataset } from './benchmark-page';
import {
  createPerformanceRow,
  forceGarbageCollection,
  readBrowserMetrics,
} from './benchmark-metrics';
import { formatConsoleRow, printPerformanceTable } from './benchmark-console';
import { savePerformanceReport } from './benchmark-report';
import { resolvePerformanceConfiguration } from './benchmark-config';
import type { PerformanceRow, PerformanceScenario } from './benchmark.types';

export { loadBenchmarkDataset } from './benchmark-page';
export {
  DEFAULT_DATASET_SIZES,
  DEFAULT_INTERACTION_WINDOW_MS,
} from './benchmark.constants';
export type {
  PerformanceRunContext,
  PerformanceScenario,
} from './benchmark.types';

/** Measures one dataset size and combines browser and CDP metrics. */
async function measureDatasetSize(
  page: Page,
  scenario: PerformanceScenario,
  datasetSize: number,
  interactionWindowMs: number,
  client: CDPSession,
): Promise<PerformanceRow> {
  const context = await loadBenchmarkDataset(
    page,
    scenario.componentName,
    datasetSize,
    interactionWindowMs,
  );
  await forceGarbageCollection(client);

  const beforeMetrics = await readBrowserMetrics(client);
  const sample = await scenario.runInteraction(page, context);
  await forceGarbageCollection(client);
  const afterMetrics = await readBrowserMetrics(client);
  return createPerformanceRow(datasetSize, sample, beforeMetrics, afterMetrics);
}

/** Runs every configured size and writes the component's latest report. */
export async function runPerformanceTest(page: Page, scenario: PerformanceScenario): Promise<void> {
  const configuration = resolvePerformanceConfiguration(scenario);
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');
  const results: PerformanceRow[] = [];

  try {
    for (const datasetSize of configuration.datasetSizes) {
      const previousRow = results.length > 0 ? results[results.length - 1] : undefined;
      const row = await measureDatasetSize(
        page,
        scenario,
        datasetSize,
        configuration.interactionWindowMs,
        client,
      );
      results.push(row);
      printPerformanceTable([formatConsoleRow(row, previousRow)]);
    }
  } finally {
    if (results.length > 0) savePerformanceReport(scenario, configuration, results);
  }
}
