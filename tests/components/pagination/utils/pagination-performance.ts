import type { Page } from '@playwright/test';
import type { PerformanceScenario } from '../../../performance/run-performance-test';
import type { PerfTrackerSample } from '../../../performance/performance-utils';

async function runPaginationInteraction(
  page: Page,
  datasetSize: number,
  interactionWindowMs: number,
): Promise<PerfTrackerSample> {
  return page.evaluate(async ({ datasetSize, interactionWindowMs }) => {
    const tracker = window.__storybookPerfTracker;
    if (!tracker) {
      throw new Error('The performance tracker was not loaded by the pagination story.');
    }

    const nextButton = document.querySelector<HTMLButtonElement>('button[aria-label="Next page"]');
    const previousButton = document.querySelector<HTMLButtonElement>('button[aria-label="Previous page"]');
    if (!nextButton || !previousButton) {
      throw new Error('Pagination controls were not rendered.');
    }

    return tracker.runInteraction({
      containerSelector: 'storybook-pagination-container',
      sizeEventName: 'storybook-pagination-size',
      datasetSize,
      interactionWindowMs,
      beforeStart: async (waitFrame) => {
        const currentFirstItem = document.querySelector<HTMLElement>('[data-pagination-item] strong');
        if (!currentFirstItem) {
          throw new Error('Pagination items were not rendered.');
        }
        const firstPageRecord = currentFirstItem.textContent;
        nextButton.click();
        await waitFrame();
        const nextPageFirstItem = document.querySelector<HTMLElement>('[data-pagination-item] strong');
        if (!nextPageFirstItem || nextPageFirstItem.textContent === firstPageRecord) {
          throw new Error('Visible pagination data did not change after navigating to the next page.');
        }
      },
      tick: async (actionIndex) => {
        const button = actionIndex % 2 === 0 ? nextButton : previousButton;
        button.click();
      },
    });
  }, { datasetSize, interactionWindowMs });
}

export const paginationPerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-pagination--stress&viewMode=story',
  readySelector: 'storybook-pagination-container[data-ready="true"]',
  datasetSizes: [100, 1000, 10000, 100000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 30,
  },
  runInteraction: runPaginationInteraction,
};