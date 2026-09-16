import path from 'node:path';

function createDataTemplate({ camelName, constantName, pascalName }) {
  return `import { z } from 'zod';

export const ${constantName}_STATUSES = ['Active', 'Pending'] as const;

export const ${camelName}ItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  value: z.number(),
  status: z.enum(${constantName}_STATUSES),
});

export type ${pascalName}Item = z.infer<typeof ${camelName}ItemSchema>;
export const ${camelName}DatasetSchema = z.array(${camelName}ItemSchema);
`;
}

function createFactoryTemplate({ kebabName, pascalName }) {
  return `import type { DataFactory } from '../../../benchmark/data-generator/data-generator.types';
import type { ${pascalName}Item } from './${kebabName}.data';

export const create${pascalName}Item: DataFactory<${pascalName}Item> = (index) => ({
  id: index + 1,
  name: \`Item \${index + 1}\`,
  category: \`Category \${(index % 5) + 1}\`,
  value: (index * 17) % 1000,
  status: index % 2 === 0 ? 'Active' : 'Pending',
});
`;
}

function createComponentTemplate({ kebabName, pascalName }) {
  return `import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { ${pascalName}Item } from '../data/${kebabName}.data';

export type { ${pascalName}Item } from '../data/${kebabName}.data';

@Component({
  selector: 'storybook-${kebabName}',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './${kebabName}.component.html',
  styleUrls: ['./${kebabName}.component.less'],
})
export class ${pascalName}Component {
  @Input() items: ${pascalName}Item[] = [];

  trackById(_index: number, item: ${pascalName}Item): number {
    return item.id;
  }
}
`;
}

function createHtmlTemplate({ kebabName, titleName }) {
  return `<section class="${kebabName}-shell" aria-label="${titleName} benchmark">
  <header class="${kebabName}-header">
    <p class="eyebrow">Component benchmark</p>
    <h1>${titleName}</h1>
    <p class="summary">{{ items.length }} items rendered</p>
  </header>
  <ul class="${kebabName}-list" data-${kebabName}-list>
    <li *ngFor="let item of items; trackBy: trackById" class="${kebabName}-item" data-${kebabName}-item>
      <span class="item-name">{{ item.name }}</span>
      <span class="item-category">{{ item.category }}</span>
      <span class="item-value">{{ item.value }}</span>
      <span class="item-status">{{ item.status }}</span>
    </li>
  </ul>
</section>
`;
}

function createStyleTemplate({ kebabName }) {
  return `:host {
  display: block;
  min-width: 560px;
  padding: 32px;
  color: #202a2e;
  background: #f4f0e8;
  font-family: Georgia, 'Times New Roman', serif;
}

.${kebabName}-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #c8d0c5;
  background: #fffdf8;
}

.${kebabName}-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #d5dbd1;

  .eyebrow {
    margin: 0 0 8px;
    color: #b14d32;
    font: 700 12px/1.2 'Trebuchet MS', sans-serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 400;
  }

  .summary {
    margin: 8px 0 0;
    color: #65716d;
    font: 14px/1.4 'Trebuchet MS', sans-serif;
  }
}

.${kebabName}-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #d5dbd1;
  background: #f7f3ea;
  max-height: 600px;
  overflow-y: auto;
  font: 14px/1.4 'Trebuchet MS', sans-serif;
}

.${kebabName}-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 40px;
  padding: 8px 16px;
  border-bottom: 1px solid #e1e4dc;

  &:last-child { border-bottom: 0; }
  .item-name { font-weight: 700; color: #202a2e; }
  .item-category,
  .item-value,
  .item-status { color: #65716d; }
}
`;
}

function createContainerTemplate({ kebabName, camelName, pascalName }) {
  return `import { Component, inject } from '@angular/core';
import { DataGeneratorService } from '../../../benchmark/data-generator/data-generator.service';
import { BaseBenchmarkContainerComponent } from '../../../benchmark/harness/benchmark-container';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import { ${camelName}DatasetSchema, type ${pascalName}Item } from '../data/${kebabName}.data';
import { create${pascalName}Item } from '../data/${kebabName}.factory';
import { ${pascalName}Component } from '../ui/${kebabName}.component';

@Component({
  selector: 'storybook-${kebabName}-container',
  standalone: true,
  imports: [${pascalName}Component],
  template: \`<storybook-${kebabName} [items]="items"></storybook-${kebabName}>\`,
})
export class ${pascalName}ContainerComponent extends BaseBenchmarkContainerComponent<${pascalName}Item> {
  protected override readonly componentName = BenchmarkComponent.${pascalName};
  private readonly dataGenerator = inject(DataGeneratorService);
  items: ${pascalName}Item[] = [];

  protected override generateDataset(size: number): Promise<${pascalName}Item[]> {
    return this.dataGenerator.generate(${camelName}DatasetSchema, size, create${pascalName}Item);
  }

  protected override onDataGenerated(data: ${pascalName}Item[]): void {
    this.items = data;
  }
}
`;
}

function createStoryTemplate({ kebabName, pascalName, titleName }) {
  return `import type { Meta, StoryObj } from '@storybook/angular';
import { ${pascalName}ContainerComponent } from './${kebabName}.container';

const meta: Meta<${pascalName}ContainerComponent> = {
  title: 'Performance/${titleName}',
  component: ${pascalName}ContainerComponent,
  argTypes: {
    datasetSize: { control: { type: 'number', min: 0, max: 100000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<${pascalName}ContainerComponent>;

export const Stress: Story = { args: { datasetSize: 0 } };
`;
}

function createSpecTemplate({ kebabName, camelName, pascalName, titleName }) {
  return `import { expect, test } from '@playwright/test';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import { loadBenchmarkDataset, runPerformanceTest } from '../../../benchmark/playwright/benchmark-runner';
import { ${camelName}PerformanceScenario } from './${kebabName}.scenario';

test.describe('${kebabName} performance stress test', () => {
  test('preserves ${titleName} rendering and scrolling behavior', async ({ page }) => {
    await loadBenchmarkDataset(page, BenchmarkComponent.${pascalName}, 100);
    await expect(page.locator('[data-${kebabName}-item]')).toHaveCount(100);

    const list = page.locator('[data-${kebabName}-list]');
    await list.evaluate((element) => { element.scrollTop = element.scrollHeight; });
    await expect.poll(() => list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  });

  test('measures every configured dataset size', async ({ page }) => {
    await runPerformanceTest(page, ${camelName}PerformanceScenario);
  });
});
`;
}

function createPerformanceConstantsTemplate({ constantName }) {
  return `export const ${constantName}_FILTER_VALUES = [
  '',
  'Active',
  'Pending',
  'Category 1',
] as const;
`;
}

function createBrowserInteractionTemplate({ kebabName, pascalName }) {
  return `import type { BenchmarkInteractionResult } from '../../../benchmark/browser/performance-tracker';
import type { PerformanceRunContext } from '../../../benchmark/playwright/benchmark.types';

export interface ${pascalName}BrowserInteractionOptions {
  context: PerformanceRunContext;
  filterValues: readonly string[];
}

/** Executes the ${kebabName} representative interactions inside the story frame. */
export async function run${pascalName}BrowserInteraction(
  options: ${pascalName}BrowserInteractionOptions,
): Promise<BenchmarkInteractionResult> {
  const { context, filterValues } = options;
  const tracker = window.__storybookPerfTracker;
  if (!tracker) throw new Error('The performance tracker was not loaded by the story.');

  return tracker.runInteraction({
    containerSelector: context.containerSelector,
    sizeEventName: context.sizeEventName,
    datasetSize: context.datasetSize,
    interactionWindowMs: context.interactionWindowMs,
    tick: async (actionIndex) => {
      const list = document.querySelector<HTMLElement>('[data-${kebabName}-list]');
      if (list && list.scrollHeight > list.clientHeight) {
        const scrollRatio = ((actionIndex % 5) + 1) / 5;
        list.scrollTop = scrollRatio * (list.scrollHeight - list.clientHeight);
      }
    },
    afterEnd: async () => {
      const list = document.querySelector<HTMLElement>('[data-${kebabName}-list]');
      if (list) list.scrollTop = 0;
    },
  });
}
`;
}

function createPerformanceTemplate({ kebabName, camelName, constantName, pascalName }) {
  return `import type { Page } from '@playwright/test';
import { BenchmarkComponent } from '../../../benchmark/registry/component-registry';
import type { PerformanceRunContext, PerformanceScenario, PerfTrackerSample } from '../../../benchmark/playwright/benchmark.types';
import { run${pascalName}BrowserInteraction } from './${kebabName}.interactions';
import { ${constantName}_FILTER_VALUES } from './${kebabName}.scenario.constants';

/** Runs the component interaction implementation inside the Storybook frame. */
async function run${pascalName}Interaction(page: Page, context: PerformanceRunContext): Promise<PerfTrackerSample> {
  return page.evaluate(run${pascalName}BrowserInteraction, {
    context,
    filterValues: ${constantName}_FILTER_VALUES,
  });
}

export const ${camelName}PerformanceScenario: PerformanceScenario = {
  componentName: BenchmarkComponent.${pascalName},
  runInteraction: run${pascalName}Interaction,
};
`;
}

/** Creates the complete eleven-file benchmark scaffold. */
export function generateTemplates(names) {
  const { kebabName } = names;
  return [
    [`src/components/${kebabName}/data/${kebabName}.data.ts`, createDataTemplate(names)],
    [`src/components/${kebabName}/data/${kebabName}.factory.ts`, createFactoryTemplate(names)],
    [`src/components/${kebabName}/ui/${kebabName}.component.ts`, createComponentTemplate(names)],
    [`src/components/${kebabName}/ui/${kebabName}.component.html`, createHtmlTemplate(names)],
    [`src/components/${kebabName}/ui/${kebabName}.component.less`, createStyleTemplate(names)],
    [`src/components/${kebabName}/harness/${kebabName}.container.ts`, createContainerTemplate(names)],
    [`src/components/${kebabName}/harness/${kebabName}.stories.ts`, createStoryTemplate(names)],
    [`src/components/${kebabName}/test/${kebabName}.spec.ts`, createSpecTemplate(names)],
    [`src/components/${kebabName}/test/${kebabName}.interactions.ts`, createBrowserInteractionTemplate(names)],
    [`src/components/${kebabName}/test/${kebabName}.scenario.constants.ts`, createPerformanceConstantsTemplate(names)],
    [`src/components/${kebabName}/test/${kebabName}.scenario.ts`, createPerformanceTemplate(names)],
  ].map(([relativePath, content]) => ({ relativePath: path.normalize(relativePath), content }));
}
