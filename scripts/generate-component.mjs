#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Normalizes an input component name into kebab-case, PascalCase, camelCase, and Title Case.
 * Handles inputs like `card-list`, `CardList`, `cardList`, `card_list`, etc.
 */
export function normalizeName(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Component name must be a non-empty string.');
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed.startsWith('-')) {
    throw new Error(`Invalid component name: "${input}".`);
  }

  // Split into words by hyphen, underscore, whitespace, or camel/PascalCase boundaries
  const words = trimmed
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .split('-')
    .filter(Boolean);

  if (words.length === 0) {
    throw new Error(`Component name "${input}" contains no valid word characters.`);
  }

  const kebabName = words.join('-');
  const pascalName = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1);
  const titleName = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return { kebabName, pascalName, camelName, titleName };
}

/**
 * Generates file contents for the 8-file component and benchmark suite.
 * Separates dumb component into .ts, .component.html, and .component.less.
 */
export function generateTemplates({ kebabName, pascalName, camelName, titleName }) {
  const schemaContent = `import { z } from 'zod';
import type { GenerateOptions } from '../../services/data-generator.service';

export const ${camelName}ItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: z.string(),
  value: z.number(),
  status: z.string(),
});

export type ${pascalName}Item = z.infer<typeof ${camelName}ItemSchema>;

/** Default field overrides for realistic ${titleName} data generation. */
export const ${camelName}ItemOverrides: GenerateOptions<${pascalName}Item>['overrides'] = {
  id: (index) => index + 1,
  name: (index) => \`Item \${index + 1}\`,
  category: (index) => \`Category \${(index % 5) + 1}\`,
  value: (index) => (index * 17) % 1000,
  status: (index) => (index % 2 === 0 ? 'Active' : 'Pending'),
};
`;

  const dumbComponentContent = `import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { ${pascalName}Item } from './${kebabName}.schema';

export type { ${pascalName}Item } from './${kebabName}.schema';

@Component({
  selector: 'storybook-${kebabName}',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './${kebabName}.component.html',
  styleUrl: './${kebabName}.component.less',
})
export class ${pascalName}Component {
  @Input() items: ${pascalName}Item[] = [];

  trackById(_index: number, item: ${pascalName}Item): number {
    return item.id;
  }
}
`;

  const dumbComponentHtmlContent = `<section class="${kebabName}-shell" aria-label="${titleName} benchmark">
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

  const dumbComponentLessContent = `:host {
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

  &:last-child {
    border-bottom: 0;
  }

  .item-name {
    font-weight: 700;
    color: #202a2e;
  }

  .item-category,
  .item-value,
  .item-status {
    color: #65716d;
  }
}
`;

  const containerComponentContent = `import { Component, inject } from '@angular/core';
import { BaseBenchmarkContainerComponent } from '../common/base-benchmark-container';
import { DataGeneratorService } from '../../services/data-generator.service';
import { ${pascalName}Component } from './${kebabName}.component';
import {
  ${camelName}ItemSchema,
  ${camelName}ItemOverrides,
  type ${pascalName}Item,
} from './${kebabName}.schema';

@Component({
  selector: 'storybook-${kebabName}-container',
  standalone: true,
  imports: [${pascalName}Component],
  template: \`
    <storybook-${kebabName} [items]="items"></storybook-${kebabName}>
  \`,
})
export class ${pascalName}ContainerComponent extends BaseBenchmarkContainerComponent<${pascalName}Item> {
  protected override readonly componentName = '${kebabName}';
  private readonly dataGenerator = inject(DataGeneratorService);

  items: ${pascalName}Item[] = [];

  protected override async generateDataset(size: number): Promise<${pascalName}Item[]> {
    return this.dataGenerator.generate(${camelName}ItemSchema, size, {
      overrides: ${camelName}ItemOverrides,
    });
  }

  protected override onDataGenerated(data: ${pascalName}Item[]): void {
    this.items = data;
  }
}
`;

  const storiesContent = `import type { Meta, StoryObj } from '@storybook/angular';
import { ${pascalName}ContainerComponent } from './${kebabName}-container.component';

const meta: Meta<${pascalName}ContainerComponent> = {
  title: 'Performance/${titleName}',
  component: ${pascalName}ContainerComponent,
  argTypes: {
    datasetSize: { control: { type: 'number', min: 0, max: 100000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<${pascalName}ContainerComponent>;

export const Stress: Story = {
  args: { datasetSize: 0 },
};
`;

  const specContent = `import { test } from '@playwright/test';
import { runPerformanceTest } from '../../performance/run-performance-test';
import { ${camelName}PerformanceScenario } from './utils/${kebabName}-performance';

test.describe('${kebabName} performance stress test', () => {
  test('evaluates ${titleName} performance during interaction window', async ({ page }) => {
    try {
      await runPerformanceTest(page, ${camelName}PerformanceScenario);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Breaking point')) {
        console.log(\`Identified \${err.message}\`);
        return;
      }
      throw err;
    }
  });
});
`;

  const performanceUtilsContent = `import type { Page } from '@playwright/test';
import type { PerformanceScenario } from '../../../performance/run-performance-test';
import type { PerfTrackerSample } from '../../../performance/performance-utils';

async function run${pascalName}Interaction(
  page: Page,
  datasetSize: number,
  interactionWindowMs: number,
): Promise<PerfTrackerSample> {
  return page.evaluate(
    async ({ datasetSize, interactionWindowMs }) => {
      const tracker = window.__storybookPerfTracker;
      if (!tracker) {
        throw new Error('The performance tracker was not loaded by the story.');
      }

      return tracker.runInteraction({
        containerSelector: 'storybook-${kebabName}-container',
        sizeEventName: 'storybook-${kebabName}-size',
        datasetSize,
        interactionWindowMs,
        tick: async (actionIndex) => {
          const list = document.querySelector<HTMLElement>('[data-${kebabName}-list]');
          if (list && list.scrollHeight > list.clientHeight) {
            const scrollRatio = ((actionIndex % 5) + 1) / 5;
            list.scrollTop = scrollRatio * (list.scrollHeight - list.clientHeight);
          }
        },
      });
    },
    { datasetSize, interactionWindowMs },
  );
}

export const ${camelName}PerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-${kebabName}--stress&viewMode=story',
  readySelector: 'storybook-${kebabName}-container[data-ready="true"]',
  datasetSizes: [100, 1000, 5000, 10000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 150,
    fpsLimit: 20,
  },
  runInteraction: run${pascalName}Interaction,
};
`;

  return [
    {
      relativePath: path.join('src', 'stories', kebabName, `${kebabName}.schema.ts`),
      content: schemaContent,
    },
    {
      relativePath: path.join('src', 'stories', kebabName, `${kebabName}.component.ts`),
      content: dumbComponentContent,
    },
    {
      relativePath: path.join('src', 'stories', kebabName, `${kebabName}.component.html`),
      content: dumbComponentHtmlContent,
    },
    {
      relativePath: path.join('src', 'stories', kebabName, `${kebabName}.component.less`),
      content: dumbComponentLessContent,
    },
    {
      relativePath: path.join('src', 'stories', kebabName, `${kebabName}-container.component.ts`),
      content: containerComponentContent,
    },
    {
      relativePath: path.join('src', 'stories', kebabName, `${kebabName}.stories.ts`),
      content: storiesContent,
    },
    {
      relativePath: path.join('tests', 'components', kebabName, `${kebabName}.spec.ts`),
      content: specContent,
    },
    {
      relativePath: path.join('tests', 'components', kebabName, 'utils', `${kebabName}-performance.ts`),
      content: performanceUtilsContent,
    },
  ];
}

function printUsage() {
  console.log(`
Usage: node scripts/generate-component.mjs <component-name> [options]

Arguments:
  <component-name>   Name of the component in kebab-case or PascalCase (e.g. card-list, CardList)

Options:
  --dry-run          Simulate generation and preview created files without writing to disk
  -h, --help         Show this help message
`);
}

export function main(args = process.argv.slice(2)) {
  const flags = new Set(args.filter((arg) => arg.startsWith('-')));
  const nonFlags = args.filter((arg) => !arg.startsWith('-'));

  if (flags.has('-h') || flags.has('--help')) {
    printUsage();
    process.exit(0);
  }

  const isDryRun = flags.has('--dry-run');

  if (nonFlags.length === 0) {
    console.error('Error: Component name argument is required.');
    printUsage();
    process.exit(1);
  }

  const rawName = nonFlags[0];
  let names;
  try {
    names = normalizeName(rawName);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { kebabName, pascalName, titleName } = names;
  const storyDir = path.join(rootDir, 'src', 'stories', kebabName);
  const testDir = path.join(rootDir, 'tests', 'components', kebabName);

  if (fs.existsSync(storyDir)) {
    console.error(`Error: Component directory already exists: ${path.relative(rootDir, storyDir).replace(/\\/g, '/')}`);
    process.exit(1);
  }

  if (fs.existsSync(testDir)) {
    console.error(`Error: Test directory already exists: ${path.relative(rootDir, testDir).replace(/\\/g, '/')}`);
    process.exit(1);
  }

  const files = generateTemplates(names);

  console.log(`\nGenerating component suite for "${titleName}" (${kebabName} / ${pascalName}):`);
  if (isDryRun) {
    console.log('[DRY RUN] No files will be written.\n');
  }

  for (const file of files) {
    const fullPath = path.join(rootDir, file.relativePath);
    const displayPath = file.relativePath.replace(/\\/g, '/');
    if (isDryRun) {
      console.log(`  [dry-run] Would create: ${displayPath}`);
    } else {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, file.content, 'utf8');
      console.log(`  Created: ${displayPath}`);
    }
  }

  console.log(`\nSuccessfully ${isDryRun ? 'simulated generation of' : 'generated'} 8-file suite for ${kebabName}.\n`);
}

// Execute CLI when run directly
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectExecution) {
  main();
}
