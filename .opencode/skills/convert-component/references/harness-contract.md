# Benchmark Harness Contract Reference

This document defines the interface contract between the Angular components, the Storybook container, and the Playwright performance test runner.

---

## 1. Smart Benchmark Container

Every dumb component has a corresponding container extending `BaseBenchmarkContainerComponent<T>` from `src/stories/common/base-benchmark-container.ts`.

### Container Structure:
```typescript
import { Component, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../common/base-benchmark-container';
import { DataGeneratorService } from '../../services/data-generator.service';
import { MyCompComponent } from './my-comp.component';
import {
  myCompItemSchema,
  myCompItemOverrides,
  type MyCompItem,
} from './my-comp.schema';

@Component({
  selector: 'storybook-my-comp-container',
  standalone: true,
  imports: [MyCompComponent],
  template: `
    <storybook-my-comp [items]="items"></storybook-my-comp>
  `,
})
export class MyCompContainerComponent extends BaseBenchmarkContainerComponent<MyCompItem> {
  protected override readonly componentName = 'my-comp';
  private readonly dataGenerator = inject(DataGeneratorService);

  items: MyCompItem[] = [];

  protected override async generateDataset(size: number): Promise<MyCompItem[]> {
    return this.dataGenerator.generate(myCompItemSchema, size, {
      overrides: myCompItemOverrides,
    });
  }

  protected override onDataGenerated(data: MyCompItem[]): void {
    this.items = data;
  }
}
```

### Automatic Container Behaviors:
- **`[attr.data-ready]`**: Set to `"true"` after data generation finishes and a double `requestAnimationFrame` completes (ensuring the browser has fully painted the DOM).
- **`[attr.aria-busy]`**: Set to `"true"` while generating data or rendering, and `"false"` when ready.
- **Window Event Listener**: Automatically listens to `window:storybook-<componentName>-size` (e.g. `storybook-my-comp-size`) with custom event `detail = { size: number }`.
- **Generation ID Guard**: Prevents race conditions if dataset resize events arrive faster than rendering completes.

---

## 2. Storybook Story Contract

Storybook configuration is globally setup in `.storybook/preview.ts`. Individual stories must:
1. Target the container component.
2. Set `title: 'Performance/<TitleName>'`.
3. Provide `argTypes: { datasetSize: { control: { type: 'number', min: 0, max: 100000, step: 100 } } }`.
4. Export baseline `Stress: Story = { args: { datasetSize: 0 } };`.

---

## 3. Performance Test Scenario Contract

The test scenario in `tests/components/<name>/utils/<name>-performance.ts` delegates to `window.__storybookPerfTracker.runInteraction(...)`:

```typescript
export const myCompPerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-my-comp--stress&viewMode=story',
  readySelector: 'storybook-my-comp-container[data-ready="true"]',
  datasetSizes: [100, 1000, 5000, 10000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 20,
  },
  runInteraction: async (page, datasetSize, interactionWindowMs) => {
    return page.evaluate(async ({ datasetSize, interactionWindowMs }) => {
      const tracker = window.__storybookPerfTracker;
      if (!tracker) throw new Error('Tracker not found');

      return tracker.runInteraction({
        containerSelector: 'storybook-my-comp-container',
        sizeEventName: 'storybook-my-comp-size',
        datasetSize,
        interactionWindowMs,
        tick: async (actionIndex) => {
          // Perform UI actions (e.g. scroll, click)
        },
      });
    }, { datasetSize, interactionWindowMs });
  },
};
```
