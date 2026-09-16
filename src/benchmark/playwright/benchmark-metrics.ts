import type { CDPSession } from '@playwright/test';
import type {
  BrowserMetrics,
  MetricsDelta,
  PerformanceRow,
  PerfTrackerSample,
} from './benchmark.types';

type CdpMetric = { name: string; value: number };

function readMetric(metrics: readonly CdpMetric[], name: string): number {
  return metrics.find((metric) => metric.name === name)?.value ?? 0;
}

function round(value: number): number {
  return Number(value.toFixed(2));
}

/** Converts raw Chrome DevTools Protocol values into named benchmark units. */
export function parseCdpMetrics(metrics: readonly CdpMetric[]): BrowserMetrics {
  return {
    jsHeapUsedMb: readMetric(metrics, 'JSHeapUsedSize') / (1024 * 1024),
    domNodes: Math.round(readMetric(metrics, 'Nodes')),
    layoutDurationMs: readMetric(metrics, 'LayoutDuration') * 1000,
    recalcStyleDurationMs: readMetric(metrics, 'RecalcStyleDuration') * 1000,
    layoutCount: Math.round(readMetric(metrics, 'LayoutCount')),
    recalcStyleCount: Math.round(readMetric(metrics, 'RecalcStyleCount')),
    scriptDurationMs: readMetric(metrics, 'ScriptDuration') * 1000,
    taskDurationMs: readMetric(metrics, 'TaskDuration') * 1000,
    threadTimeMs: readMetric(metrics, 'ThreadTime') * 1000,
  };
}

/** Reads the browser process metrics used by the benchmark report. */
export async function readBrowserMetrics(client: CDPSession): Promise<BrowserMetrics> {
  const response = await client.send('Performance.getMetrics');
  return parseCdpMetrics(response.metrics);
}

/** Requests garbage collection when the current browser supports the CDP commands. */
export async function forceGarbageCollection(client: CDPSession): Promise<void> {
  try {
    await client.send('HeapProfiler.enable');
    await client.send('HeapProfiler.collectGarbage');
  } catch {
    // Unsupported browser environments continue without forced collection.
  }
}

/** Calculates measurements accumulated during an interaction window. */
export function calculateMetricsDelta(before: BrowserMetrics, after: BrowserMetrics): MetricsDelta {
  return {
    jsHeapDeltaMb: round(after.jsHeapUsedMb - before.jsHeapUsedMb),
    domNodesDelta: after.domNodes - before.domNodes,
    layoutDurationDeltaMs: round(after.layoutDurationMs - before.layoutDurationMs),
    recalcStyleDurationDeltaMs: round(after.recalcStyleDurationMs - before.recalcStyleDurationMs),
    layoutCountDelta: after.layoutCount - before.layoutCount,
    recalcStyleCountDelta: after.recalcStyleCount - before.recalcStyleCount,
    scriptDurationDeltaMs: round(after.scriptDurationMs - before.scriptDurationMs),
    taskDurationDeltaMs: round(after.taskDurationMs - before.taskDurationMs),
    threadTimeDeltaMs: round(after.threadTimeMs - before.threadTimeMs),
  };
}

function resolvePeakHeapMb(
  sample: PerfTrackerSample,
  beforeHeapMb: number,
  afterHeapMb: number,
): number {
  return round(Math.max(sample.peakHeapMb ?? 0, beforeHeapMb, afterHeapMb));
}

/** Combines browser-side samples and CDP snapshots into one report row. */
export function createPerformanceRow(
  datasetSize: number,
  sample: PerfTrackerSample,
  before: BrowserMetrics,
  after: BrowserMetrics,
): PerformanceRow {
  const delta = calculateMetricsDelta(before, after);
  const beforeHeapMb = round(before.jsHeapUsedMb);
  const afterHeapMb = round(after.jsHeapUsedMb);

  return {
    datasetSize,
    durationMs: round(sample.durationMs),
    averageFps: round(sample.averageFps),
    averageFrameMs: round(1000 / Math.max(sample.averageFps, 0.001)),
    droppedFrames: sample.droppedFrames,
    longTasks: sample.longTasks,
    longTaskDurationMs: round(sample.longTaskDurationMs),
    peakHeapMb: resolvePeakHeapMb(sample, beforeHeapMb, afterHeapMb),
    actionCount: sample.actionCount,
    actionsPerSecond: sample.actionsPerSecond,
    jsHeapUsedMb: afterHeapMb,
    jsHeapUsedBeforeMb: beforeHeapMb,
    jsHeapDeltaMb: delta.jsHeapDeltaMb,
    domNodes: after.domNodes,
    domNodesBefore: before.domNodes,
    domNodesDelta: delta.domNodesDelta,
    layoutDurationMs: delta.layoutDurationDeltaMs,
    layoutDurationTotalMs: round(after.layoutDurationMs),
    recalcStyleDurationMs: delta.recalcStyleDurationDeltaMs,
    recalcStyleDurationTotalMs: round(after.recalcStyleDurationMs),
    layoutCount: delta.layoutCountDelta,
    layoutCountTotal: after.layoutCount,
    recalcStyleCount: delta.recalcStyleCountDelta,
    recalcStyleCountTotal: after.recalcStyleCount,
    scriptDurationMs: delta.scriptDurationDeltaMs,
    scriptDurationTotalMs: round(after.scriptDurationMs),
    taskDurationMs: delta.taskDurationDeltaMs,
    taskDurationTotalMs: round(after.taskDurationMs),
    threadTimeMs: delta.threadTimeDeltaMs,
    threadTimeTotalMs: round(after.threadTimeMs),
  };
}
