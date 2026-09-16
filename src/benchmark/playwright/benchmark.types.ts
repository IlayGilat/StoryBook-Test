import type { Page } from '@playwright/test';
import type { BenchmarkInteractionResult } from '../browser/performance-tracker';
import type { BenchmarkComponent, BenchmarkIdentity } from '../registry/component-registry';

export type PerfTrackerSample = BenchmarkInteractionResult;

export interface BrowserMetrics {
  jsHeapUsedMb: number;
  domNodes: number;
  layoutDurationMs: number;
  recalcStyleDurationMs: number;
  layoutCount: number;
  recalcStyleCount: number;
  scriptDurationMs: number;
  taskDurationMs: number;
  threadTimeMs: number;
}

export interface MetricsDelta {
  jsHeapDeltaMb: number;
  domNodesDelta: number;
  layoutDurationDeltaMs: number;
  recalcStyleDurationDeltaMs: number;
  layoutCountDelta: number;
  recalcStyleCountDelta: number;
  scriptDurationDeltaMs: number;
  taskDurationDeltaMs: number;
  threadTimeDeltaMs: number;
}

export interface PerformanceRow extends PerfTrackerSample, BrowserMetrics {
  jsHeapUsedBeforeMb: number;
  jsHeapDeltaMb: number;
  peakHeapMb: number;
  domNodesBefore: number;
  domNodesDelta: number;
  layoutDurationTotalMs: number;
  recalcStyleDurationTotalMs: number;
  layoutCountTotal: number;
  recalcStyleCountTotal: number;
  scriptDurationTotalMs: number;
  taskDurationTotalMs: number;
  threadTimeTotalMs: number;
}

export interface PerformanceRunContext extends BenchmarkIdentity {
  datasetSize: number;
  interactionWindowMs: number;
}

export interface PerformanceScenario {
  componentName: BenchmarkComponent;
  datasetSizes?: readonly number[];
  interactionWindowMs?: number;
  runInteraction(page: Page, context: PerformanceRunContext): Promise<PerfTrackerSample>;
}

export interface ResolvedPerformanceConfiguration {
  datasetSizes: readonly number[];
  interactionWindowMs: number;
}

export interface PerformanceReport {
  schemaVersion: number;
  componentName: BenchmarkComponent;
  generatedAt: string;
  configuration: ResolvedPerformanceConfiguration;
  environment: { browser: string; targetRefreshRateHz: number };
  metricDescriptions: Record<keyof PerformanceRow, string>;
  results: PerformanceRow[];
}
