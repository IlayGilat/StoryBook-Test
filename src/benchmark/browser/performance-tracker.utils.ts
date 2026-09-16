import {
  DROPPED_FRAME_THRESHOLD_MS,
  LONG_TASK_THRESHOLD_MS,
  TARGET_FRAME_MS,
} from './performance-tracker.constants';
import type {
  BenchmarkInteractionOptions,
  InteractionWindowResult,
  WaitForFrame,
} from './performance-tracker.types';

/** Waits for two animation frames so pending layout and paint can complete. */
export function waitForDoubleRaf(): Promise<void> {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
}

/** Selects one supported long-work observer type to avoid double counting. */
export function selectLongTaskEntryType(supportedTypes: readonly string[]): string | undefined {
  if (supportedTypes.includes('long-animation-frame')) return 'long-animation-frame';
  if (supportedTypes.includes('longtask')) return 'longtask';
  return undefined;
}

/** Estimates missed frames from consecutive animation-frame timestamps. */
export function countDroppedFrames(frameTimestamps: readonly number[]): number {
  let droppedFrames = 0;
  for (let index = 1; index < frameTimestamps.length; index += 1) {
    const interval = frameTimestamps[index] - frameTimestamps[index - 1];
    if (interval > DROPPED_FRAME_THRESHOLD_MS) {
      droppedFrames += Math.max(1, Math.round(interval / TARGET_FRAME_MS) - 1);
    }
  }
  return droppedFrames;
}

/** Reads Chromium's non-standard live JavaScript heap counter when available. */
export function readUsedHeapBytes(): number {
  return (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory
    ?.usedJSHeapSize ?? 0;
}

/** Converts an action count and duration into a stable throughput value. */
export function calculateActionsPerSecond(actionCount: number, durationMs: number): number {
  if (durationMs <= 0) return 0;
  return Number((actionCount / (durationMs / 1000)).toFixed(2));
}

/** Waits until the container reports readiness or a generation error. */
export function waitForDatasetReady(containerSelector: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const check = (): void => {
      const element = document.querySelector(containerSelector);
      const generationError = element?.getAttribute('data-error');
      if (generationError) {
        reject(new Error(`Dataset generation failed: ${generationError}`));
        return;
      }
      if (element?.getAttribute('data-ready') === 'true') {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });
}

/** Observes one supported browser long-work entry type. */
export function createLongTaskObserver(
  onLongTask: (durationMs: number) => void,
): PerformanceObserver | undefined {
  const entryType = selectLongTaskEntryType(PerformanceObserver.supportedEntryTypes);
  if (!entryType) return undefined;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > LONG_TASK_THRESHOLD_MS) onLongTask(entry.duration);
    });
  });
  observer.observe({ entryTypes: [entryType] });
  return observer;
}

/** Executes component actions for one timed measurement window. */
export async function executeInteractionWindow(
  options: BenchmarkInteractionOptions,
  waitFrame: WaitForFrame,
): Promise<InteractionWindowResult> {
  const endAt = performance.now() + options.interactionWindowMs;
  let actionCount = 0;
  let peakHeapBytes = readUsedHeapBytes();

  while (performance.now() < endAt) {
    if (options.tick) await options.tick(actionCount, waitFrame);
    await waitFrame();
    peakHeapBytes = Math.max(peakHeapBytes, readUsedHeapBytes());
    actionCount += 1;
  }
  if (options.afterEnd) await options.afterEnd(waitFrame);
  return { actionCount, peakHeapBytes };
}
