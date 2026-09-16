import type { PerformanceRow } from './benchmark.types';

export const DEFAULT_DATASET_SIZES = [100, 1000, 5000, 10000] as const;
export const DEFAULT_INTERACTION_WINDOW_MS = 10_000;
export const PERFORMANCE_REPORT_SCHEMA_VERSION = 1;
export const PERFORMANCE_REPORT_BROWSER = 'Chromium';
export const PERFORMANCE_REPORT_REFRESH_RATE_HZ = 60;

export const PERFORMANCE_METRIC_DESCRIPTIONS: Record<keyof PerformanceRow, string> = {
  datasetSize: 'Top-level records supplied to the component.',
  durationMs: 'Measured interaction duration in milliseconds.',
  averageFps: 'Animation frames observed per second during interaction.',
  averageFrameMs: 'Average milliseconds per observed animation frame.',
  droppedFrames: 'Estimated frames missed relative to a 60 Hz refresh rate.',
  longTasks: 'Observed browser tasks lasting longer than 50 ms.',
  longTaskDurationMs: 'Combined duration of observed long tasks.',
  actionCount: 'Completed interaction-loop iterations.',
  actionsPerSecond: 'Completed interaction-loop iterations per second.',
  peakHeapMb: 'Highest JavaScript heap measurement seen during the interaction.',
  jsHeapUsedMb: 'JavaScript heap used after the interaction and garbage collection.',
  jsHeapUsedBeforeMb: 'JavaScript heap used before the interaction and after data rendering.',
  jsHeapDeltaMb: 'Change in JavaScript heap use across the interaction.',
  domNodes: 'DOM node count after the interaction.',
  domNodesBefore: 'DOM node count before the interaction.',
  domNodesDelta: 'Change in DOM node count across the interaction.',
  layoutDurationMs: 'Browser layout time spent during the interaction.',
  layoutDurationTotalMs: 'Cumulative browser layout time reported after the interaction.',
  layoutCount: 'Browser layout operations during the interaction.',
  layoutCountTotal: 'Cumulative browser layout operations after the interaction.',
  recalcStyleDurationMs: 'Style recalculation time spent during the interaction.',
  recalcStyleDurationTotalMs: 'Cumulative style recalculation time after the interaction.',
  recalcStyleCount: 'Style recalculation operations during the interaction.',
  recalcStyleCountTotal: 'Cumulative style recalculation operations after the interaction.',
  scriptDurationMs: 'JavaScript execution time during the interaction.',
  scriptDurationTotalMs: 'Cumulative JavaScript execution time after the interaction.',
  taskDurationMs: 'Browser task time during the interaction.',
  taskDurationTotalMs: 'Cumulative browser task time after the interaction.',
  threadTimeMs: 'Renderer thread time during the interaction.',
  threadTimeTotalMs: 'Cumulative renderer thread time after the interaction.',
};
