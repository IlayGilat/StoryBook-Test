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
    async ({ datasetSize, interactionWindowMs, filterValues }) => {
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

      return tracker.runInteraction({
        containerSelector: 'storybook-tree-grid-container',
        sizeEventName: 'storybook-tree-grid-size',
        datasetSize,
        interactionWindowMs,
        tick: async (actionIndex) => {
          const step = actionIndex % 6;

          switch (step) {
            case 0: {
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
              if (filterInput) {
                const nextVal = filterValues[(actionIndex >> 1) % filterValues.length];
                filterInput.value = nextVal;
                filterInput.dispatchEvent(new Event('input', { bubbles: true }));
              }
              break;
            }

            case 3: {
              const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('th button'));
              if (sortButtons.length > 0) {
                const btn = sortButtons[actionIndex % sortButtons.length];
                btn?.click();
              }
              break;
            }

            case 4: {
              const button = actionIndex % 4 === 0 ? prevButton : nextButton;
              if (button && !button.disabled) {
                button.click();
              }
              break;
            }

            case 5: {
              if (viewport && viewport.scrollHeight > viewport.clientHeight) {
                const scrollRatio = ((actionIndex % 5) + 1) / 5;
                viewport.scrollTop = scrollRatio * (viewport.scrollHeight - viewport.clientHeight);
              }
              break;
            }
          }
        },
      });
    },
    { datasetSize, interactionWindowMs, filterValues },
  );
}

export const treeGridPerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-tree-grid--stress&viewMode=story',
  readySelector: 'storybook-tree-grid-container[data-ready="true"]',
  datasetSizes: [100, 500, 1000, 2500, 5000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 10,
  },
  runInteraction: runTreeGridInteraction,
};
