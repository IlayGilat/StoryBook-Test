import type {
  BenchmarkInteractionOptions,
  BenchmarkInteractionResult,
  PerformanceMetrics,
  PrepareDatasetOptions,
} from './performance-tracker.types';
import {
  calculateActionsPerSecond,
  countDroppedFrames,
  createLongTaskObserver,
  executeInteractionWindow,
  waitForDatasetReady,
  waitForDoubleRaf,
} from './performance-tracker.utils';

export type {
  BenchmarkInteractionOptions,
  BenchmarkInteractionResult,
  PerformanceMetrics,
  PrepareDatasetOptions,
} from './performance-tracker.types';
export { waitForDoubleRaf } from './performance-tracker.utils';

/**
 * Tracks browser rendering health by sampling animation frame timing and observing
 * long task entries while a UI interaction is running.
 */
export class PerformanceTracker {
  private animationFrameId = 0;
  private frameTimestamps: number[] = [];
  private performanceObserver?: PerformanceObserver;
  private longTaskCount = 0;
  private totalLongTaskDurationMs = 0;
  private monitoringStartedAt = 0;

  /**
   * Starts collecting frame and long-task performance data for the current run.
   */
  startMonitoring(): void {
    this.cancelAnimationFrameLoop();
    this.frameTimestamps = [];
    this.longTaskCount = 0;
    this.totalLongTaskDurationMs = 0;
    this.monitoringStartedAt = performance.now();

    this.performanceObserver = createLongTaskObserver((durationMs) => {
      this.longTaskCount += 1;
      this.totalLongTaskDurationMs += durationMs;
    });

    const sampleFrame = (timestamp: number): void => {
      this.frameTimestamps.push(timestamp);
      this.animationFrameId = requestAnimationFrame(sampleFrame);
    };

    this.animationFrameId = requestAnimationFrame(sampleFrame);
  }

  /**
   * Stops monitoring and returns a summary of the measured performance metrics.
   */
  stopMonitoring(): PerformanceMetrics {
    const durationMs = Math.max(performance.now() - this.monitoringStartedAt, 1);
    this.cancelAnimationFrameLoop();
    this.performanceObserver?.disconnect();
    this.performanceObserver = undefined;

    return {
      durationMs,
      averageFps: this.frameTimestamps.length / (durationMs / 1000),
      droppedFrames: countDroppedFrames(this.frameTimestamps),
      longTasks: this.longTaskCount,
      longTaskDurationMs: this.totalLongTaskDurationMs,
    };
  }

  /**
   * Prepares the dataset for benchmarking by setting container readiness, dispatching the size event,
   * and awaiting double-rAF paint completion before benchmark measurement begins.
   */
  async prepareDataset(options: PrepareDatasetOptions): Promise<void> {
    const { containerSelector, sizeEventName, datasetSize } = options;
    const container = document.querySelector(containerSelector);
    container?.removeAttribute('data-ready');
    window.dispatchEvent(new CustomEvent(sizeEventName, { detail: { size: datasetSize } }));

    await waitForDatasetReady(containerSelector);
    await waitForDoubleRaf();
  }

  /**
   * Executes a standardized performance interaction loop in the browser.
   * Handles container event dispatch, readiness awaiting, tracker lifecycle,
   * frame timing, and peak heap sampling.
   */
  async runInteraction(options: BenchmarkInteractionOptions): Promise<BenchmarkInteractionResult> {
    const {
      containerSelector,
      sizeEventName,
      datasetSize,
      beforeStart,
    } = options;

    const waitFrame = () => waitForDoubleRaf();

    // Ensure dataset is ready if not already prepared
    const isReady = document.querySelector(`${containerSelector}[data-ready="true"]`);
    if (!isReady) {
      await this.prepareDataset({ containerSelector, sizeEventName, datasetSize });
    }

    // Run optional verification before starting benchmark metrics collection
    if (beforeStart) {
      await beforeStart(waitFrame);
    }

    this.startMonitoring();
    const { actionCount, peakHeapBytes } = await executeInteractionWindow(options, waitFrame);
    const metrics = this.stopMonitoring();
    const actionsPerSecond = calculateActionsPerSecond(actionCount, metrics.durationMs);

    return {
      datasetSize,
      durationMs: metrics.durationMs,
      averageFps: metrics.averageFps,
      averageFrameMs: 1000 / Math.max(metrics.averageFps, 0.001),
      droppedFrames: metrics.droppedFrames,
      longTasks: metrics.longTasks,
      longTaskDurationMs: metrics.longTaskDurationMs,
      peakHeapMb:
        peakHeapBytes > 0
          ? Number((peakHeapBytes / (1024 * 1024)).toFixed(2))
          : undefined,
      actionCount,
      actionsPerSecond,
    };
  }

  /**
   * Cancels the animation frame loop used for sampling frame timing.
   */
  private cancelAnimationFrameLoop(): void {
    if (this.animationFrameId !== 0) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }
}

/**
 * Creates a fresh performance tracker instance for monitoring Storybook interactions.
 */
declare global {
  interface Window {
    __storybookPerfTracker?: PerformanceTracker;
  }
}

if (typeof window !== 'undefined') {
  window.__storybookPerfTracker = new PerformanceTracker();
}

