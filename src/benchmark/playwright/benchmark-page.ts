import type { Page } from '@playwright/test';
import { BenchmarkComponent, getBenchmarkIdentity } from '../registry/component-registry';
import { DEFAULT_INTERACTION_WINDOW_MS } from './benchmark.constants';
import type { PerformanceRunContext } from './benchmark.types';

/** Requests a dataset through the browser-side tracker and awaits its paint. */
async function prepareBenchmarkDataset(page: Page, context: PerformanceRunContext): Promise<void> {
  await page.evaluate(
    async ({ containerSelector, sizeEventName, datasetSize }) => {
      const tracker = window.__storybookPerfTracker;
      if (!tracker) throw new Error('The Storybook performance tracker is not available.');
      await tracker.prepareDataset({ containerSelector, sizeEventName, datasetSize });
    },
    context,
  );
}

/** Opens a component story and supplies a fully rendered deterministic dataset. */
export async function loadBenchmarkDataset(
  page: Page,
  componentName: BenchmarkComponent,
  datasetSize: number,
  interactionWindowMs = DEFAULT_INTERACTION_WINDOW_MS,
): Promise<PerformanceRunContext> {
  const context = { ...getBenchmarkIdentity(componentName), datasetSize, interactionWindowMs };
  await page.goto(context.storyUrl);
  await page.locator(context.readySelector).waitFor();
  await prepareBenchmarkDataset(page, context);
  return context;
}
