import * as fs from 'fs';
import * as path from 'path';
import type { Page } from '@playwright/test';
import {
  createPerformanceRow,
  forceGarbageCollection,
  formatConsoleRow,
  getPerformanceFailures,
  printPerformanceTable,
  readBrowserMetrics,
  type PerformanceLimits,
  type PerformanceRow,
  type PerfTrackerSample,
} from './performance-utils';

export interface PerformanceScenario {
  storyUrl: string;
  readySelector: string;
  datasetSizes: number[];
  interactionWindowMs: number;
  limits: PerformanceLimits;
  runInteraction(page: Page, datasetSize: number, interactionWindowMs: number): Promise<PerfTrackerSample>;
}

export function savePerformanceReport(scenario: PerformanceScenario, rows: PerformanceRow[]): void {
  const artifactDir = path.resolve(process.cwd(), '.artifacts');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const scenarioName = scenario.storyUrl.match(/id=([^&]+)/)?.[1] ?? 'performance-scenario';
  const report = {
    scenario: scenarioName,
    storyUrl: scenario.storyUrl,
    timestamp: new Date().toISOString(),
    limits: scenario.limits,
    results: rows,
  };

  fs.writeFileSync(path.join(artifactDir, `${scenarioName}-report.json`), JSON.stringify(report, null, 2), 'utf-8');
  fs.writeFileSync(path.join(artifactDir, 'performance-report.json'), JSON.stringify(report, null, 2), 'utf-8');
}

export async function runPerformanceTest(page: Page, scenario: PerformanceScenario): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');

  const rows: PerformanceRow[] = [];

  try {
    for (const datasetSize of scenario.datasetSizes) {
      await page.goto(scenario.storyUrl);
      await page.locator(scenario.readySelector).waitFor();
      await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await client.send('Performance.enable');
      await forceGarbageCollection(client);

      const beforeMetrics = await readBrowserMetrics(client);
      const sample = await scenario.runInteraction(page, datasetSize, scenario.interactionWindowMs);
      await forceGarbageCollection(client);
      const afterMetrics = await readBrowserMetrics(client);
      const row: PerformanceRow = createPerformanceRow(datasetSize, sample, beforeMetrics, afterMetrics);
      rows.push(row);

      printPerformanceTable([formatConsoleRow(row)]);

      const failures = getPerformanceFailures(row, scenario.limits);
      if (failures.length > 0) {
        throw new Error(`Breaking point at dataset size ${datasetSize}: ${failures.join('; ')}`);
      }
    }
  } finally {
    if (rows.length > 0) {
      savePerformanceReport(scenario, rows);
    }
  }
}
