import type { Page } from '@playwright/test';
import type { PerformanceScenario } from '../../../performance/run-performance-test';
import type { PerfTrackerSample } from '../../../performance/performance-utils';

const filterValues = ['', 'Engineering', 'Architecture', 'Active', 'Blocked', 'Benchmark', 'Task', 'Security'];

async function runTreeGridInteraction(
  page: Page,
  datasetSize: number,
  interactionWindowMs: number,
): Promise<PerfTrackerSample> {
  return page.evaluate(
    async ({ datasetSize, interactionLengthMs, filterValues }) => {
      const tracker = window.__storybookPerfTracker;
      if (!tracker) {
        throw new Error('The performance tracker was not loaded by the tree grid story.');
      }

      const viewport = document.querySelector<HTMLElement>('.table-viewport');
      const filterInput = document.querySelector<HTMLInputElement>('input[type="search"]');
      const nextButton = document.querySelector<HTMLButtonElement>('button[aria-label="Next page"]');
      const prevButton = document.querySelector<HTMLButtonElement>('button[aria-label="Previous page"]');
      const expandAllBtn = document.querySelector<HTMLButtonElement>('button[aria-label="Expand all nodes"]');
      const collapseAllBtn = document.querySelector<HTMLButtonElement>('button[aria-label="Collapse all nodes"]');

      const endAt = performance.now() + interactionLengthMs;
      let actionIndex = 0;

      const waitFrame = () =>
        new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

      tracker.start();
      window.dispatchEvent(new CustomEvent('storybook-tree-grid-size', { detail: { size: datasetSize } }));
      await waitFrame();

      let peakHeapBytes = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize ?? 0;

      while (performance.now() < endAt) {
        const step = actionIndex % 6;

        switch (step) {
          case 0: {
            // Expand/collapse individual node or global expand/collapse
            if (actionIndex % 12 === 0 && collapseAllBtn) {
              collapseAllBtn.click();
            } else if (actionIndex % 12 === 6 && expandAllBtn) {
              expandAllBtn.click();
            } else {
              const toggleButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.toggle-btn'));
              if (toggleButtons.length > 0) {
                const btn = toggleButtons[actionIndex % toggleButtons.length];
                btn?.click();
              }
            }
            break;
          }

          case 1: {
            // Cascading checkbox selection toggle
            const checkboxes = Array.from(
              document.querySelectorAll<HTMLInputElement>('tbody .col-select input[type="checkbox"]'),
            );
            if (checkboxes.length > 0) {
              const cb = checkboxes[(actionIndex * 3) % checkboxes.length];
              cb?.click();
            }
            break;
          }

          case 2: {
            // Hierarchy search filter input
            if (filterInput) {
              const nextVal = filterValues[(actionIndex >> 1) % filterValues.length];
              filterInput.value = nextVal;
              filterInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            break;
          }

          case 3: {
            // Sort column headers
            const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('th button'));
            if (sortButtons.length > 0) {
              const btn = sortButtons[actionIndex % sortButtons.length];
              btn?.click();
            }
            break;
          }

          case 4: {
            // Root-level pagination navigation
            const button = actionIndex % 4 === 0 ? prevButton : nextButton;
            if (button && !button.disabled) {
              button.click();
            }
            break;
          }

          case 5: {
            // Scroll table viewport
            if (viewport && viewport.scrollHeight > viewport.clientHeight) {
              const scrollRatio = ((actionIndex % 5) + 1) / 5;
              viewport.scrollTop = scrollRatio * (viewport.scrollHeight - viewport.clientHeight);
            }
            break;
          }
        }

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
    },
    { datasetSize, interactionLengthMs: interactionWindowMs, filterValues },
  );
}

export const treeGridPerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-tree-grid--stress&viewMode=story',
  readySelector: 'storybook-tree-grid',
  datasetSizes: [100, 500, 1000, 2500, 5000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 10,
  },
  runInteraction: runTreeGridInteraction,
};

