# Prompt Module 01: System Architecture & File Tree

> **Source**: Sections 3, 9, 10, 11, 12 of `codex_storybook_agent_system_prompt_v3.txt`  
> **Target Implementer**: GPT-5.6 Sol Medium / OpenCode implementer (~100K token context window)  
> **Repository**: `StoryBook-Test`

---

## 1. Existing Repository Structure & Stack

The `StoryBook-Test` repository is an Angular 16 harness for benchmarking UI components under high-stress datasets (up to 100,000 items).

```text
StoryBook-Test/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── docs/
│   ├── BENCHMARKING.md
│   └── COMPONENT_GUIDE.md
├── scripts/
│   ├── generate-component.mjs
│   └── generate-component/
├── src/
│   ├── benchmark/
│   │   ├── browser/
│   │   ├── data-generator/
│   │   ├── harness/
│   │   ├── playwright/
│   │   └── registry/
│   └── components/
│       ├── table/
│       │   ├── data/
│       │   ├── harness/
│       │   ├── test/
│       │   └── ui/
│       └── tree-grid/
│           ├── data/
│           ├── harness/
│           ├── test/
│           └── ui/
├── angular.json
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

### Technical Stack & Characteristics:
- **Framework**: Angular 16.2.12 (standalone components, `ChangeDetectionStrategy.OnPush`, Less styles)
- **Harness**: Storybook 8.6
- **Automation & Benchmarking**: Playwright (single worker, headless or headed)
- **Data Validation & Mocking**: Zod schemas, deterministic data factories
- **Key Metrics Tracked**: FPS, paint cycle latency, heap memory footprint, Chrome DevTools Protocol (CDP) metrics

### Top-Level Benchmark Component Layout:
Every benchmarked component under `src/components/<component-name>/` contains 4 strict directories:
- `ui/`: Pure presentational dumb component (`<name>.component.ts`, `.html`, `.less`). Zero benchmark/test coupling. `OnPush` change detection. Accepts data strictly via `@Input()`, emits via `@Output()`.
- `data/`: Data models, Zod validation schemas, and deterministic generator factories (`<name>.data.ts`).
- `harness/`: Smart benchmark container extending `BaseBenchmarkContainerComponent<T>` (`<name>.container.ts`, `<name>.stories.ts`). Coordinates `[attr.data-ready]`, `[attr.aria-busy]`, double `rAF` paint cycles, sizing events.
- `test/`: Playwright benchmark specs and interaction scenarios (`<name>.spec.ts`, `<name>.scenario.ts`).

---

## 2. Complete Agent System Architecture (`.agents/`)

You must scaffold and generate the complete `.agents/` structure:

```text
.agents/
├── README.md
├── shared/
│   ├── core-rules.md
│   ├── handoff-contract.md
│   └── state-schema.md
├── project-bootstrap/
│   ├── AGENT.md
│   └── subagents/
│       ├── dependency-sync.md
│       ├── theme-migration.md
│       ├── global-styles-migration.md
│       ├── shared-assets-migration.md
│       ├── shared-ui-migration.md
│       └── storybook-build-verification.md
├── source-analysis/
│   ├── AGENT.md
│   └── subagents/
│       ├── component-tree-analyzer.md
│       ├── smart-dependency-analyzer.md
│       ├── child-component-analyzer.md
│       ├── ngrx-dependency-analyzer.md
│       ├── service-dependency-analyzer.md
│       ├── input-output-analyzer.md
│       ├── style-dependency-analyzer.md
│       └── shared-dependency-analyzer.md
├── migration-planning/
│   ├── AGENT.md
│   └── subagents/
│       ├── dumb-boundary-planner.md
│       ├── component-tree-planner.md
│       ├── shared-component-reuse-planner.md
│       ├── data-contract-planner.md
│       └── migration-manifest-generator.md
├── component-scaffold/
│   ├── AGENT.md
│   └── subagents/
│       ├── generator-runner.md
│       ├── folder-structure-verifier.md
│       └── benchmark-registry-verifier.md
├── component-tree-migration/
│   ├── AGENT.md
│   └── subagents/
│       ├── template-migration.md
│       ├── component-logic-migration.md
│       ├── child-component-migration.md
│       ├── input-output-adaptation.md
│       ├── ngrx-adaptation.md
│       ├── service-adaptation.md
│       ├── router-adaptation.md
│       ├── environment-adaptation.md
│       ├── local-state-adaptation.md
│       ├── side-effect-adaptation.md
│       ├── pipe-directive-migration.md
│       ├── style-migration.md
│       └── node-compilation-verification.md
├── data/
│   ├── AGENT.md
│   └── subagents/
│       ├── model-extraction.md
│       ├── zod-schema.md
│       ├── data-factory.md
│       ├── default-dataset.md
│       ├── edge-case-dataset.md
│       └── stress-dataset.md
├── harness/
│   ├── AGENT.md
│   └── subagents/
│       ├── benchmark-container.md
│       ├── component-wiring.md
│       ├── input-state.md
│       ├── interaction-state.md
│       ├── ready-state-integration.md
│       └── storybook-story.md
├── benchmark-integration/
│   ├── AGENT.md
│   └── subagents/
│       ├── benchmark-registry-integration.md
│       ├── performance-tracker-integration.md
│       ├── paint-cycle-integration.md
│       ├── sizing-event-integration.md
│       └── benchmark-configuration-verification.md
├── test/
│   ├── AGENT.md
│   └── subagents/
│       ├── playwright-spec.md
│       ├── interaction-scenario.md
│       ├── stress-scenario.md
│       ├── cdp-metrics.md
│       └── runtime-error.md
├── fidelity-validation/
│   ├── AGENT.md
│   └── subagents/
│       ├── original-component-capture.md
│       ├── storybook-component-capture.md
│       ├── visual-parity.md
│       ├── dom-parity.md
│       ├── behavior-parity.md
│       └── theme-parity.md
└── repair/
    ├── AGENT.md
    └── subagents/
        ├── build-repair.md
        ├── import-repair.md
        ├── ui-repair.md
        ├── styling-repair.md
        ├── data-repair.md
        ├── harness-repair.md
        ├── scenario-repair.md
        └── fidelity-repair.md
```

---

## 3. Helper Documentation (`docs/agents/`)

Create compact helper documentation files that explain cross-cutting concepts without requiring agents to load them into context by default:

```text
docs/agents/
├── WORKFLOW.md                    # End-to-end stage walkthrough and human operator guide
├── MIGRATION_ARTIFACTS.md         # Schema and conventions for artifacts in .migrations/
├── FIDELITY.md                    # Parity comparison metrics, visual testing, deviation thresholds
├── COMPONENT_TREE_MIGRATION.md    # Child-to-parent post-order implementation manual
├── COMPONENT_BOUNDARIES.md        # Recipes for stripping NgRx, services, router, and env
└── TROUBLESHOOTING.md             # Common compilation, Storybook, and Playwright failure resolutions
```

---

## 4. Reusable Migration Skills

In addition to referencing the existing `subagent-driven-development` skill, define the following migration-specific skills under `.agents/skills/` (only where they materially reduce repetition across stages):

1. `inspect-angular-component`
2. `build-component-tree`
3. `extract-angular-dependencies`
4. `classify-smart-dependencies`
5. `copy-angular-ui-tree`
6. `convert-smart-to-dumb`
7. `derive-data-contract`
8. `generate-benchmark-data`
9. `create-benchmark-harness`
10. `create-storybook-story`
11. `create-playwright-scenario`
12. `validate-component-fidelity`
13. `repair-migration`

---

## 5. Migration Workspace (`.migrations/<component-name>/`)

For every top-level benchmark target migrated, a dedicated migration workspace directory is maintained. Files are created incrementally as stages execute:

```text
.migrations/<component-name>/
├── state.json
├── source/
│   └── source-files.json
├── analysis/
│   ├── component-tree.json
│   ├── dependencies.json
│   ├── smart-dependencies.json
│   └── summary.md
├── plan/
│   ├── migration-plan.md
│   ├── dumb-boundary.json
│   ├── data-contract.json
│   └── file-plan.json
├── logs/
│   ├── copied-files.json
│   └── decisions.md
├── validation/
│   ├── build-report.md
│   ├── parity-report.json
│   └── fidelity-summary.md
└── handoffs/
    └── <stage-name>.md
```
