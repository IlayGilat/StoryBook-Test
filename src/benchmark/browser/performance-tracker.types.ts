export type WaitForFrame = () => Promise<void>;
export type InteractionHook = (waitFrame: WaitForFrame) => Promise<void> | void;
export type InteractionTick = (
  actionIndex: number,
  waitFrame: WaitForFrame,
) => Promise<void> | void;

/** Rendering measurements collected inside the browser. */
export interface PerformanceMetrics {
  durationMs: number;
  averageFps: number;
  droppedFrames: number;
  longTasks: number;
  longTaskDurationMs: number;
}

/** Values needed to request and await a benchmark dataset. */
export interface PrepareDatasetOptions {
  containerSelector: string;
  sizeEventName: string;
  datasetSize: number;
}

/** Component-specific behavior executed during one measurement window. */
export interface BenchmarkInteractionOptions extends PrepareDatasetOptions {
  interactionWindowMs: number;
  beforeStart?: InteractionHook;
  tick?: InteractionTick;
  afterEnd?: InteractionHook;
}

/** Browser measurements returned for one dataset size. */
export interface BenchmarkInteractionResult extends PerformanceMetrics {
  datasetSize: number;
  averageFrameMs: number;
  peakHeapMb?: number;
  actionCount: number;
  actionsPerSecond: number;
}

export interface InteractionWindowResult {
  actionCount: number;
  peakHeapBytes: number;
}
