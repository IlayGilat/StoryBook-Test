import type { BenchmarkInteractionResult } from '../../../benchmark/browser/performance-tracker';
import type { PerformanceRunContext } from '../../../benchmark/playwright/benchmark.types';

export interface TableBrowserInteractionOptions {
  context: PerformanceRunContext;
  filterValues: readonly string[];
}

/** Executes the table's representative interactions inside the story frame. */
export async function runTableBrowserInteraction(
  options: TableBrowserInteractionOptions,
): Promise<BenchmarkInteractionResult> {
  const { context, filterValues } = options;
  const tracker = window.__storybookPerfTracker;
  if (!tracker) throw new Error('The performance tracker was not loaded by the table story.');

  const viewport = document.querySelector<HTMLElement>('.table-viewport');
  const filterInput = document.querySelector<HTMLInputElement>('input[type="search"]');
  const sortButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('th button'));

  return tracker.runInteraction({
    containerSelector: context.containerSelector,
    sizeEventName: context.sizeEventName,
    datasetSize: context.datasetSize,
    interactionWindowMs: context.interactionWindowMs,
    tick: async (actionIndex, waitFrame) => {
      sortButtons[actionIndex % sortButtons.length]?.click();
      await waitFrame();

      if (filterInput) {
        filterInput.value = filterValues[(actionIndex + 1) % filterValues.length];
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        await waitFrame();
      }
      if (viewport) {
        const scrollRatio = ((actionIndex % 5) + 1) / 5;
        viewport.scrollTop = scrollRatio * Math.max(0, viewport.scrollHeight - viewport.clientHeight);
        await waitFrame();
      }
    },
    afterEnd: async (waitFrame) => {
      if (filterInput && filterInput.value !== '') {
        filterInput.value = '';
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        await waitFrame();
      }
      if (viewport) {
        viewport.scrollTop = 0;
        await waitFrame();
      }
    },
  });
}
