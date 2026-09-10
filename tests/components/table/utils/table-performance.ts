import type { Page } from '@playwright/test';
import type { PerformanceScenario } from '../../../performance/run-performance-test';
import type { PerfTrackerSample } from '../../../performance/performance-utils';

const filterValues = ['', 'Active', 'Paused', 'Category 1', 'Category 4', 'Category 9', 'Record 12'];

async function runTableInteraction(page: Page, datasetSize: number, interactionWindowMs: number): Promise<PerfTrackerSample> {
  return page.evaluate(async ({ datasetSize, interactionLengthMs, filterValues }) => {
    const tracker = window.__storybookPerfTracker;
    if (!tracker) {
      throw new Error('The performance tracker was not loaded by the table story.');
    }

    const viewport = document.querySelector<HTMLElement>('.table-viewport');
    const filterInput = document.querySelector<HTMLInputElement>('input[type="search"]');
    const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('th button'));
    const endAt = performance.now() + interactionLengthMs;
    let actionIndex = 0;

    const waitFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    tracker.start();
    window.dispatchEvent(new CustomEvent('storybook-table-size', { detail: { size: datasetSize } }));
    await waitFrame();

    let peakHeapBytes = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;

    while (performance.now() < endAt) {
      const button = sortButtons[actionIndex % sortButtons.length];
      button?.click();
      await waitFrame();

      if (filterInput) {
        const nextValue = filterValues[(actionIndex + 1) % filterValues.length];
        filterInput.value = nextValue;
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        await waitFrame();
      }

      if (viewport) {
        const scrollRatio = ((actionIndex % 5) + 1) / 5;
        viewport.scrollTop = scrollRatio * Math.max(0, viewport.scrollHeight - viewport.clientHeight);
        await waitFrame();
      }

      const currentHeap = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;
      if (currentHeap > peakHeapBytes) {
        peakHeapBytes = currentHeap;
      }

      actionIndex += 1;
    }

    const metrics = tracker.stop();
    return {
      datasetSize,
      durationMs: metrics.durationMs,
      averageFps: metrics.averageFps,
      averageFrameMs: 1000 / Math.max(metrics.averageFps, 0.001),
      droppedFrames: metrics.droppedFrames,
      longTasks: metrics.longTasks,
      longTaskDurationMs: metrics.longTaskDurationMs,
      peakHeapMb: peakHeapBytes > 0 ? Number((peakHeapBytes / (1024 * 1024)).toFixed(2)) : undefined,
    };
  }, { datasetSize, interactionLengthMs: interactionWindowMs, filterValues });
}

export const tablePerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-table--stress&viewMode=story',
  readySelector: 'storybook-table',
  datasetSizes: [100, 500, 1000, 2500, 5000, 10000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 10,
  },
  runInteraction: runTableInteraction,
};
