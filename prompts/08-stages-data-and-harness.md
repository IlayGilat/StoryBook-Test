# Prompt Module 08: Stages 06 & 07 — Data & Harness Agents

> **Source**: Section 18 (Data, Harness) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directories**: `.agents/data/` and `.agents/harness/`

---

## 1. Data Main Agent Specification (`AGENT.md`)

### Purpose
Builds deterministic data models, Zod validation schemas, and high-performance synthetic data generator factories under `src/components/<component>/data/<component>.data.ts`. Reuses core utilities from `src/benchmark/data-generator/` to produce default, edge-case, and high-volume stress datasets (up to 100,000 items) for benchmarking.

### When to Invoke
- After Component Tree Migration has completed (`.migrations/<component>/handoffs/component-tree-migration.md` exists).
- Triggered by: `Use the Data Agent for <component-name>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/data/AGENT.md`
  - `.migrations/<component>/plan/data-contract.json`
  - `src/components/<component>/ui/<component>.component.ts`
- **Optional Context**:
  - `src/benchmark/data-generator/` utilities and existing components under `src/components/` for reference

### Sub-Agents Available (6 Workers)
1. `model-extraction`
2. `zod-schema`
3. `data-factory`
4. `default-dataset`
5. `edge-case-dataset`
6. `stress-dataset`

### Responsibilities
- Define TypeScript domain models in `<component>.data.ts`.
- Implement runtime validation using Zod (`z.object({...})`).
- Create deterministic pseudo-random data generators (using seeded RNG) ensuring identical runs across benchmark executions.
- Provide data variants: small (default), edge cases (empty, long strings, nullables), and stress volumes (1k, 10k, 100k items).

### Non-Responsibilities
- Wiring data into Storybook stories or benchmark containers.
- Modifying UI component templates or styles.

### Definition of Done (DoD)
- [ ] TypeScript interfaces and Zod schemas fully cover the UI component's `@Input()` contract.
- [ ] Synthetic data generator functions implemented and tested.
- [ ] Generates stress datasets up to 100k items in memory within reasonable generation time (< 1s per 10k items).
- [ ] File `src/components/<component>/data/<component>.data.ts` compiles cleanly.
- [ ] Handoff written to `.migrations/<component>/handoffs/data.md`.

---

## 2. Data Sub-Agents

- **`model-extraction.md`**: Translates data contract JSON into clean TypeScript interfaces.
- **`zod-schema.md`**: Implements Zod schemas mirroring the TypeScript models for runtime boundary safety.
- **`data-factory.md`**: Implements factory functions (`create<Entity>(seed, index)`) using `src/benchmark/data-generator/`.
- **`default-dataset.md`**: Produces standard dataset (~10–50 items) for baseline visual validation.
- **`edge-case-dataset.md`**: Produces datasets with special characters, maximum string lengths, empty states, and missing optional fields.
- **`stress-dataset.md`**: Implements parameterized volume generator (`generateItems(count)`) capable of scaling to 100k items.

---

## 3. Harness Main Agent Specification (`AGENT.md`)

### Purpose
Implements the smart benchmark container (`src/components/<component>/harness/<component>.container.ts`) and Storybook story definitions (`<component>.stories.ts`). Coordinates lifecycle states (`data-ready`, `aria-busy`), double `requestAnimationFrame` (rAF) paint synchronization, sizing events, and interaction state management while keeping the underlying UI component completely benchmark-unaware.

### When to Invoke
- After Data Agent has completed (`.migrations/<component>/handoffs/data.md` exists).
- Triggered by: `Use the Harness Agent for <component-name>`.

### Key Container Architecture:
- The container MUST extend `BaseBenchmarkContainerComponent<T>` from `src/benchmark/harness/benchmark-container`.
- It hosts the dumb UI component inside its template:
  ```html
  <storybook-<component>-ui
    [items]="data()"
    (actionEvent)="onAction($event)"
  ></storybook-<component>-ui>
  ```
- Coordinates double `rAF` paint cycles before setting `[attr.data-ready]="true"` and removing `[attr.aria-busy]`.
- Dispatches `storybook-<component>-size` CustomEvent when dataset sizing changes.
- Stories in `<component>.stories.ts` target the container and configure `parameters: { layout: 'fullscreen' }`.

### Sub-Agents Available (6 Workers)
1. `benchmark-container`
2. `component-wiring`
3. `input-state`
4. `interaction-state`
5. `ready-state-integration`
6. `storybook-story`

### Responsibilities
- Implement `<component>.container.ts` extending `BaseBenchmarkContainerComponent`.
- Wire data sources from `<component>.data.ts` into container signals/properties.
- Handle `@Output()` events emitted by the dumb UI component.
- Configure Storybook story variants (Default, Medium, Stress-10k, Stress-100k).
- Verify container renders in Storybook without runtime console errors.

### Non-Responsibilities
- Modifying UI presentational logic or templates.
- Writing Playwright test scripts.

### Definition of Done (DoD)
- [ ] Container class extends `BaseBenchmarkContainerComponent` and compiles.
- [ ] Storybook dev server renders the component cleanly without errors.
- [ ] `[attr.data-ready]` and `[attr.aria-busy]` synchronize with double rAF paint cycles.
- [ ] Sizing event (`storybook-<component>-size`) dispatches correctly.
- [ ] UI component remains 100% pure and unaware of benchmark infrastructure.
- [ ] Handoff written to `.migrations/<component>/handoffs/harness.md`.

---

## 4. Harness Sub-Agents

- **`benchmark-container.md`**: Writes the container TypeScript class extending `BaseBenchmarkContainerComponent`.
- **`component-wiring.md`**: Embeds the dumb UI component selector into container template and binds inputs/outputs.
- **`input-state.md`**: Connects dataset generation functions to container input signals/properties.
- **`interaction-state.md`**: Implements mock handlers for UI output actions (capturing clicks, selections, edits).
- **`ready-state-integration.md`**: Enforces race-guard protection, DOM stability checks, and double rAF paint dispatch.
- **`storybook-story.md`**: Creates Storybook CSF3 stories in `<component>.stories.ts` for each data volume.
