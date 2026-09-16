import * as fs from 'fs';
import * as path from 'path';
import {
  PERFORMANCE_METRIC_DESCRIPTIONS,
  PERFORMANCE_REPORT_BROWSER,
  PERFORMANCE_REPORT_REFRESH_RATE_HZ,
  PERFORMANCE_REPORT_SCHEMA_VERSION,
} from './benchmark.constants';
import type {
  PerformanceReport,
  PerformanceRow,
  PerformanceScenario,
  ResolvedPerformanceConfiguration,
} from './benchmark.types';

function createPerformanceReport(
  scenario: PerformanceScenario,
  configuration: ResolvedPerformanceConfiguration,
  results: PerformanceRow[],
): PerformanceReport {
  return {
    schemaVersion: PERFORMANCE_REPORT_SCHEMA_VERSION,
    componentName: scenario.componentName,
    generatedAt: new Date().toISOString(),
    configuration,
    environment: {
      browser: PERFORMANCE_REPORT_BROWSER,
      targetRefreshRateHz: PERFORMANCE_REPORT_REFRESH_RATE_HZ,
    },
    metricDescriptions: PERFORMANCE_METRIC_DESCRIPTIONS,
    results,
  };
}

/** Writes the latest self-contained report for one component. */
export function savePerformanceReport(
  scenario: PerformanceScenario,
  configuration: ResolvedPerformanceConfiguration,
  results: PerformanceRow[],
): void {
  const artifactDirectory = path.resolve(process.cwd(), '.artifacts');
  const reportPath = path.join(
    artifactDirectory,
    `${scenario.componentName}-performance-report.json`,
  );
  fs.mkdirSync(artifactDirectory, { recursive: true });
  fs.writeFileSync(
    reportPath,
    JSON.stringify(createPerformanceReport(scenario, configuration, results), null, 2),
    'utf-8',
  );
}
