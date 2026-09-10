import type { Page } from '@playwright/test';
import type { PerformanceScenario } from '../../../performance/run-performance-test';
import type { PerfTrackerSample } from '../../../performance/performance-utils';

const filterValues = ['', 'Active', 'Paused', 'Category 1', 'Category 4', 'Category 9', 'Record 12'];

async function runTableInteraction(page: Page, datasetSize: number, interactionWindowMs: number): Promise<PerfTrackerSample> {
  return page.evaluate(async ({ datasetSize, interactionWindowMs, filterValues }) => {
    const tracker = window.__storybookPerfTracker;
    if (!tracker) {
      throw new Error('The performance tracker was not loaded by the table story.');
    }

    const viewport = document.querySelector<HTMLElement>('.table-viewport');
    const filterInput = document.querySelector<HTMLInputElement>('input[type="search"]');
    const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('th button'));

    return tracker.runInteraction({
      containerSelector: 'storybook-table-container',
      sizeEventName: 'storybook-table-size',
      datasetSize,
      interactionWindowMs,
      tick: async (actionIndex, waitFrame) => {
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
      },
    });
  }, { datasetSize, interactionWindowMs, filterValues });
}

export const tablePerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-table--stress&viewMode=story',
  readySelector: 'storybook-table-container[data-ready="true"]',
  datasetSizes: [100, 500, 1000, 2500, 5000, 10000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 10,
  },
  runInteraction: runTableInteraction,
};
