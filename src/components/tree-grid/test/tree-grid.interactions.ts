import type { BenchmarkInteractionResult } from '../../../benchmark/browser/performance-tracker';
import type { PerformanceRunContext } from '../../../benchmark/playwright/benchmark.types';

export interface TreeGridBrowserInteractionOptions {
  context: PerformanceRunContext;
  filterValues: readonly string[];
}

/** Executes the tree-grid's representative interactions inside the story frame. */
export async function runTreeGridBrowserInteraction(
  options: TreeGridBrowserInteractionOptions,
): Promise<BenchmarkInteractionResult> {
  const { context, filterValues } = options;
  const tracker = window.__storybookPerfTracker;
  if (!tracker) throw new Error('The performance tracker was not loaded by the tree grid story.');

  const viewport = document.querySelector<HTMLElement>('.table-viewport');
  const filterInput = document.querySelector<HTMLInputElement>('input[type="search"]');
  const nextButton = document.querySelector<HTMLButtonElement>('button[aria-label="Next page"]');
  const previousButton = document.querySelector<HTMLButtonElement>('button[aria-label="Previous page"]');
  const expandAllButton = document.querySelector<HTMLButtonElement>('button[aria-label="Expand all nodes"]');
  const collapseAllButton = document.querySelector<HTMLButtonElement>('button[aria-label="Collapse all nodes"]');

  return tracker.runInteraction({
    containerSelector: context.containerSelector,
    sizeEventName: context.sizeEventName,
    datasetSize: context.datasetSize,
    interactionWindowMs: context.interactionWindowMs,
    tick: async (actionIndex) => {
      const step = actionIndex % 6;
      if (step === 0) {
        if (actionIndex % 12 === 0 && collapseAllButton) collapseAllButton.click();
        else if (actionIndex % 12 === 6 && expandAllButton) expandAllButton.click();
        else {
          const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>('.toggle-btn'));
          toggles[actionIndex % toggles.length]?.click();
        }
      }
      if (step === 1) {
        const checkboxes = Array.from(
          document.querySelectorAll<HTMLInputElement>('tbody .col-select input[type="checkbox"]'),
        );
        checkboxes[(actionIndex * 3) % checkboxes.length]?.click();
      }
      if (step === 2 && filterInput) {
        filterInput.value = filterValues[(actionIndex >> 1) % filterValues.length];
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (step === 3) {
        const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('th button'));
        sortButtons[actionIndex % sortButtons.length]?.click();
      }
      if (step === 4) {
        const pageButton = actionIndex % 4 === 0 ? previousButton : nextButton;
        if (pageButton && !pageButton.disabled) pageButton.click();
      }
      if (step === 5 && viewport && viewport.scrollHeight > viewport.clientHeight) {
        const scrollRatio = ((actionIndex % 5) + 1) / 5;
        viewport.scrollTop = scrollRatio * (viewport.scrollHeight - viewport.clientHeight);
      }
    },
    afterEnd: async (waitFrame) => {
      if (filterInput && filterInput.value !== '') {
        filterInput.value = '';
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        await waitFrame();
      }
      if (expandAllButton) {
        expandAllButton.click();
        await waitFrame();
      }
      if (viewport) {
        viewport.scrollTop = 0;
        await waitFrame();
      }
    },
  });
}
