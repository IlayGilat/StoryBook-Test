import type { CDPSession } from '@playwright/test';

export interface PerfTrackerSample {
  durationMs: number;
  averageFps: number;
  droppedFrames: number;
  longTasks: number;
  longTaskDurationMs: number;
  peakHeapMb?: number;
}

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
  datasetSize: number;
  averageFrameMs: number;
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

export interface PerformanceLimits {
  heapLimitMb: number;
  fpsLimit: number;
}

export function parseCdpMetrics(metricsList: Array<{ name: string; value: number }>): BrowserMetrics {
  const getVal = (name: string): number => metricsList.find((metric) => metric.name === name)?.value ?? 0;

  return {
    jsHeapUsedMb: getVal('JSHeapUsedSize') / (1024 * 1024),
    domNodes: Math.round(getVal('Nodes')),
    layoutDurationMs: getVal('LayoutDuration') * 1000,
    recalcStyleDurationMs: getVal('RecalcStyleDuration') * 1000,
    layoutCount: Math.round(getVal('LayoutCount')),
    recalcStyleCount: Math.round(getVal('RecalcStyleCount')),
    scriptDurationMs: getVal('ScriptDuration') * 1000,
    taskDurationMs: getVal('TaskDuration') * 1000,
    threadTimeMs: getVal('ThreadTime') * 1000,
  };
}

export async function readBrowserMetrics(client: CDPSession): Promise<BrowserMetrics> {
  const response = await client.send('Performance.getMetrics');
  return parseCdpMetrics(response.metrics);
}

export async function forceGarbageCollection(client: CDPSession): Promise<void> {
  try {
    await client.send('HeapProfiler.enable');
    await client.send('HeapProfiler.collectGarbage');
  } catch {
    // Non-CDP or unsupported environment fallback
  }
}

export function calculateMetricsDelta(before: BrowserMetrics, after: BrowserMetrics): MetricsDelta {
  return {
    jsHeapDeltaMb: Number((after.jsHeapUsedMb - before.jsHeapUsedMb).toFixed(2)),
    domNodesDelta: after.domNodes - before.domNodes,
    layoutDurationDeltaMs: Number((after.layoutDurationMs - before.layoutDurationMs).toFixed(2)),
    recalcStyleDurationDeltaMs: Number((after.recalcStyleDurationMs - before.recalcStyleDurationMs).toFixed(2)),
    layoutCountDelta: after.layoutCount - before.layoutCount,
    recalcStyleCountDelta: after.recalcStyleCount - before.recalcStyleCount,
    scriptDurationDeltaMs: Number((after.scriptDurationMs - before.scriptDurationMs).toFixed(2)),
    taskDurationDeltaMs: Number((after.taskDurationMs - before.taskDurationMs).toFixed(2)),
    threadTimeDeltaMs: Number((after.threadTimeMs - before.threadTimeMs).toFixed(2)),
  };
}

export function createPerformanceRow(
  datasetSize: number,
  sample: PerfTrackerSample,
  beforeOrAfterMetrics: BrowserMetrics,
  maybeAfterMetrics?: BrowserMetrics,
): PerformanceRow {
  const before = maybeAfterMetrics ? beforeOrAfterMetrics : beforeOrAfterMetrics;
  const after = maybeAfterMetrics ? maybeAfterMetrics : beforeOrAfterMetrics;
  const delta = calculateMetricsDelta(before, after);

  const afterHeapMb = Number(after.jsHeapUsedMb.toFixed(2));
  const beforeHeapMb = Number(before.jsHeapUsedMb.toFixed(2));
  const peakHeapMb = sample.peakHeapMb !== undefined
    ? Math.max(sample.peakHeapMb, afterHeapMb, beforeHeapMb)
    : Math.max(afterHeapMb, beforeHeapMb);

  return {
    datasetSize,
    durationMs: Number(sample.durationMs.toFixed(2)),
    averageFps: Number(sample.averageFps.toFixed(2)),
    averageFrameMs: Number((1000 / Math.max(sample.averageFps, 0.001)).toFixed(2)),
    droppedFrames: sample.droppedFrames,
    longTasks: sample.longTasks,
    longTaskDurationMs: sample.longTaskDurationMs,
    peakHeapMb: Number(peakHeapMb.toFixed(2)),

    // Memory
    jsHeapUsedMb: afterHeapMb,
    jsHeapUsedBeforeMb: beforeHeapMb,
    jsHeapDeltaMb: delta.jsHeapDeltaMb,
    domNodes: after.domNodes,
    domNodesBefore: before.domNodes,
    domNodesDelta: delta.domNodesDelta,

    // Rendering costs (delta for the interaction window, total for cumulative after value)
    layoutDurationMs: delta.layoutDurationDeltaMs,
    layoutDurationTotalMs: Number(after.layoutDurationMs.toFixed(2)),
    recalcStyleDurationMs: delta.recalcStyleDurationDeltaMs,
    recalcStyleDurationTotalMs: Number(after.recalcStyleDurationMs.toFixed(2)),
    layoutCount: delta.layoutCountDelta,
    layoutCountTotal: after.layoutCount,
    recalcStyleCount: delta.recalcStyleCountDelta,
    recalcStyleCountTotal: after.recalcStyleCount,
    scriptDurationMs: delta.scriptDurationDeltaMs,
    scriptDurationTotalMs: Number(after.scriptDurationMs.toFixed(2)),
    taskDurationMs: delta.taskDurationDeltaMs,
    taskDurationTotalMs: Number(after.taskDurationMs.toFixed(2)),
    threadTimeMs: delta.threadTimeDeltaMs,
    threadTimeTotalMs: Number(after.threadTimeMs.toFixed(2)),
  };
}

export function formatConsoleRow(row: PerformanceRow) {
  return {
    datasetSize: row.datasetSize,
    durationMs: row.durationMs,
    averageFps: row.averageFps,
    droppedFrames: row.droppedFrames,
    longTaskDurationMs: row.longTaskDurationMs,
    jsHeapUsedMb: row.jsHeapUsedMb,
    domNodes: row.domNodes,
    domNodesDelta: row.domNodesDelta,
  };
}

export function printPerformanceTable(rows: Record<string, unknown>[]): void {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]!);
  const widths = headers.map((h) => Math.max(h.length, ...rows.map((r) => String(r[h] ?? '').length)));
  const pad = (v: unknown, len: number) => (typeof v === 'number' ? String(v).padStart(len) : String(v ?? '').padEnd(len));
  const top = '┌' + widths.map((w) => '─'.repeat(w + 2)).join('┬') + '┐';
  const mid = '├' + widths.map((w) => '─'.repeat(w + 2)).join('┼') + '┤';
  const bot = '└' + widths.map((w) => '─'.repeat(w + 2)).join('┴') + '┘';
  const headerStr = '│ ' + headers.map((h, i) => String(h).padEnd(widths[i]!)).join(' │ ') + ' │';
  const rowStrs = rows.map((r) => '│ ' + headers.map((h, i) => pad(r[h], widths[i]!)).join(' │ ') + ' │');
  console.log([top, headerStr, mid, ...rowStrs, bot].join('\n'));
}

export function getPerformanceFailures(row: PerformanceRow, limits: PerformanceLimits): string[] {
  const failures: string[] = [];
  const averageFrameLimitMs = 1000 / limits.fpsLimit;

  if (row.jsHeapUsedMb > limits.heapLimitMb) failures.push(`JS heap ${row.jsHeapUsedMb.toFixed(2)}MB > ${limits.heapLimitMb}MB`);
  if (row.averageFps < limits.fpsLimit) failures.push(`average FPS ${row.averageFps.toFixed(2)} < ${limits.fpsLimit}`);
  if (row.averageFrameMs > averageFrameLimitMs) failures.push(`average frame ${row.averageFrameMs.toFixed(2)}ms > ${averageFrameLimitMs.toFixed(2)}ms`);

  return failures;
}
