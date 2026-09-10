import type { Page } from '@playwright/test';
import type { PerformanceScenario } from '../../../performance/run-performance-test';
import type { PerfTrackerSample } from '../../../performance/performance-utils';

async function runPaginationInteraction(
  page: Page,
  datasetSize: number,
  interactionWindowMs: number,
): Promise<PerfTrackerSample> {
  return page.evaluate(async ({ datasetSize, interactionLengthMs }) => {
    const tracker = window.__storybookPerfTracker;
    if (!tracker) {
      throw new Error('The performance tracker was not loaded by the pagination story.');
    }

    const nextButton = document.querySelector<HTMLButtonElement>('button[aria-label="Next page"]');
    const previousButton = document.querySelector<HTMLButtonElement>('button[aria-label="Previous page"]');
    const firstItem = document.querySelector<HTMLElement>('[data-pagination-item] strong');
    if (!nextButton || !previousButton || !firstItem) {
      throw new Error('Pagination controls were not rendered.');
    }

    const endAt = performance.now() + interactionLengthMs;
    let actionIndex = 0;
    const waitFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    tracker.start();
    window.dispatchEvent(new CustomEvent('storybook-pagination-size', { detail: { size: datasetSize } }));
    await waitFrame();

    const firstPageRecord = firstItem.textContent;
    nextButton.click();
    await waitFrame();
    const nextPageFirstItem = document.querySelector<HTMLElement>('[data-pagination-item] strong');
    if (!nextPageFirstItem || nextPageFirstItem.textContent === firstPageRecord) {
      throw new Error('Visible pagination data did not change after navigating to the next page.');
    }

    let peakHeapBytes = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;

    while (performance.now() < endAt) {
      const button = actionIndex % 2 === 0 ? nextButton : previousButton;
      button.click();
      await waitFrame();
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
  }, { datasetSize, interactionLengthMs: interactionWindowMs });
}

export const paginationPerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-pagination--stress&viewMode=story',
  readySelector: 'storybook-pagination',
  datasetSizes: [100, 1000, 10000, 100000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 30,
  },
  runInteraction: runPaginationInteraction,
};