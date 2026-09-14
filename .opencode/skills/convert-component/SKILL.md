---
name: convert-component
description: Converts an enterprise/client Angular component (stripping NgRx, stores, and services) into a standalone dumb benchmarked Storybook component with Zod schema and Playwright performance test suite. Use when porting existing Angular components into the Storybook benchmark harness.
---

# Convert Component Skill

This skill guides agents through porting complex, enterprise-coupled Angular client components into pure presentational ("dumb") standalone components inside this Storybook benchmark project.

## Workflow Overview

When porting a component, follow this 5-phase procedure:

```
[Client Component (.ts, .html, .less/.scss)]
                    │
                    ▼
          1. Analyze & Strip
 (Identify data fields vs. NgRx/services)
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
2. Generate Schema    3. Generate Dumb Component
 (.schema.ts with      (.component.ts, .html, .less
  Zod & overrides)      with OnPush, pure @Input)
         └──────────┬──────────┘
                    ▼
          4. Generate Benchmark Suite
   (-container.component.ts, .stories.ts,
     .spec.ts, and *-performance.ts)
                    │
                    ▼
          5. Validate Conversion
   (Run validate-conversion.mjs & tsc)
```

---

## Step 1: Component Analysis & Dependency Stripping

1. Read the target component source files (`.ts`, `.html`, styles).
2. Consult the [Dependency Stripping Reference](./references/stripping-rules.md).
3. Identify and plan the removal of:
   - NgRx Store (`Store`, `select()`, `dispatch()`, actions, selectors, `@ngrx/effects`).
   - Injected business services (`HttpClient`, API facades, router, translation).
   - Observable subscriptions and `| async` pipes.
4. Extract the visual data contract:
   - What fields does the HTML template actually render? (e.g. `id`, `name`, `status`, `amount`).
   - What events does the user trigger? (e.g. row clicks, button clicks, pagination).
5. Determine naming tokens:
   - `kebabName`: e.g. `card-list`
   - `pascalName`: e.g. `CardList`
   - `camelName`: e.g. `cardList`
   - `titleName`: e.g. `Card List`

---

## Step 2: Generate Schema (`src/stories/<kebabName>/<kebabName>.schema.ts`)

1. Define a Zod schema matching the extracted visual data model:
   ```typescript
   import { z } from 'zod';
   import type { GenerateOptions } from '../../services/data-generator.service';

   export const cardListItemSchema = z.object({
     id: z.number().int(),
     name: z.string(),
     category: z.string(),
     value: z.number(),
     status: z.string(),
   });

   export type CardListItem = z.infer<typeof cardListItemSchema>;
   ```
2. Define generator overrides providing realistic deterministic data factories:
   ```typescript
   export const cardListItemOverrides: GenerateOptions<CardListItem>['overrides'] = {
     id: (index) => index + 1,
     name: (index) => `Item ${index + 1}`,
     category: (index) => `Category ${(index % 5) + 1}`,
     value: (index) => (index * 17) % 1000,
     status: (index) => (index % 2 === 0 ? 'Active' : 'Pending'),
   };
   ```

---

## Step 3: Generate Dumb Presentational Component

Create 3 separated files in `src/stories/<kebabName>/`:

1. **Logic (`<kebabName>.component.ts`)**:
   - `standalone: true`
   - `changeDetection: ChangeDetectionStrategy.OnPush`
   - `templateUrl: './<kebabName>.component.html'`
   - `styleUrl: './<kebabName>.component.less'`
   - Accepts data strictly via `@Input()`: `@Input() items: CardListItem[] = [];`
   - Exposes `@Output()` for events if needed.
   - Implements `trackById(index: number, item: CardListItem): number { return item.id; }`.
   - Zero services or store imports.

2. **Template (`<kebabName>.component.html`)**:
   - Stripped of `| async` pipes, directly referencing `@Input()` items.
   - Includes test hooks: `data-<kebabName>-list` on scrollable/list elements and `data-<kebabName>-item` on items.

3. **Styles (`<kebabName>.component.less`)**:
   - Scoped Less styling with `:host { display: block; }`.
   - Constrained scrollable container dimensions (e.g. `max-height: 600px; overflow-y: auto;`).

---

## Step 4: Generate Benchmark Container & Performance Suite

Consult the [Benchmark Harness Contract](./references/harness-contract.md) to generate:

1. **Container (`src/stories/<kebabName>/<kebabName>-container.component.ts`)**:
   - Extends `BaseBenchmarkContainerComponent<CardListItem>`.
   - Injects `DataGeneratorService`.
   - Implements `generateDataset` and `onDataGenerated`.
   - Template: `<storybook-<kebabName> [items]="items"></storybook-<kebabName>>`.

2. **Storybook Story (`src/stories/<kebabName>/<kebabName>.stories.ts`)**:
   - Targets container under `title: 'Performance/<titleName>'`.
   - Exposes `datasetSize` control and `Stress` story.

3. **Playwright Spec (`tests/components/<kebabName>/<kebabName>.spec.ts`)**:
   - Runs `runPerformanceTest` and handles breaking point exceptions.

4. **Performance Scenario (`tests/components/<kebabName>/utils/<kebabName>-performance.ts`)**:
   - Runs inside `window.__storybookPerfTracker.runInteraction(...)`.
   - Emits resize event and polls for `data-ready="true"`.
   - Drives relevant DOM interactions (scrolling, clicking).

---

## Step 5: Verification & Quality Gates

Run the automated verification script:
```powershell
node .opencode/skills/convert-component/scripts/validate-conversion.mjs <kebabName>
```

Then check TypeScript compilation:
```powershell
npx tsc --noEmit
```
