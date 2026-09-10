/**
 * Captures a summary of performance during a Storybook interaction,
 * including frame timing, dropped frames, and long task counts.
 */
export interface PerformanceMetrics {
  durationMs: number;
  averageFps: number;
  droppedFrames: number;
  longTasks: number;
  longTaskDurationMs: number;
}

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

    const supportedEntryTypes = PerformanceObserver.supportedEntryTypes;
    const observedTypes = ['longtask', 'long-animation-frame'].filter((type) => supportedEntryTypes.includes(type));

    if (observedTypes.length > 0) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.longTaskCount += 1;
            this.totalLongTaskDurationMs += entry.duration;
          }
        }
      });
      this.performanceObserver.observe({ entryTypes: observedTypes });
    }

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

    let droppedFrames = 0;
    for (let index = 1; index < this.frameTimestamps.length; index += 1) {
      const interval = this.frameTimestamps[index] - this.frameTimestamps[index - 1];
      if (interval > 33.3) {
        droppedFrames += Math.max(1, Math.round(interval / 16.67) - 1);
      }
    }

    return {
      durationMs,
      averageFps: this.frameTimestamps.length / (durationMs / 1000),
      droppedFrames,
      longTasks: this.longTaskCount,
      longTaskDurationMs: this.totalLongTaskDurationMs,
    };
  }

  /**
   * Alias for startMonitoring for compatibility with performance test runner.
   */
  start(): void {
    this.startMonitoring();
  }

  /**
   * Alias for stopMonitoring for compatibility with performance test runner.
   */
  stop(): PerformanceMetrics {
    return this.stopMonitoring();
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
export function createPerformanceTracker(): PerformanceTracker {
  return new PerformanceTracker();
}

declare global {
  interface Window {
    __storybookPerformanceTracker?: PerformanceTracker;
    __storybookPerfTracker?: PerformanceTracker;
  }
}

if (typeof window !== 'undefined') {
  const tracker = createPerformanceTracker();
  window.__storybookPerformanceTracker = tracker;
  window.__storybookPerfTracker = tracker;
}

