# AGENTS.md

## Project Overview
Angular 18 Storybook harness for benchmarking UI component scalability, frame rates, and memory footprints under high-stress datasets (up to 100,000 items) using Playwright browser automation.

- **Stack**: Angular 18 (standalone, Less), Storybook 8.6, Playwright, Zod.
- **Package Manager**: `npm`.

## Core Commands
- `npm run storybook`: Start Storybook dev server (`http://localhost:6006`).
- `npm run test:fast`: Run Playwright tests headed against running Storybook dev server.
- `npm run test:perf`: Build static Storybook and run full headless benchmark suite.
- `npx playwright test tests/components/<name>/<name>.spec.ts --headed`: Run targeted component test.
- `npm run generate:component <name>`: Scaffold a new 8-file benchmarked component and test suite (e.g. `npm run generate:component card-list`).

## Key Architecture & Guardrails
- **Dumb Components (`<name>.component.ts`, `<name>.component.html`, `<name>.component.less`)**: Pure presentational UI separated into logic, template, and styles with `changeDetection: ChangeDetectionStrategy.OnPush`. Accepts data strictly via `@Input()`. Zero test or generator coupling.
- **Smart Containers (`<name>-container.component.ts`)**: Wraps dumb component. Extends `BaseBenchmarkContainerComponent<T>` from `../common/base-benchmark-container`. Automatically handles `[attr.data-ready]`, `[attr.aria-busy]`, `storybook-<name>-size` event dispatch, race guards, and double `rAF` paint cycles.
- **Storybook Stories (`<name>.stories.ts`)**: Targets the container. Performance tracker (`window.__storybookPerfTracker`) and `parameters: { layout: 'fullscreen' }` are configured globally in `.storybook/preview.ts`.
- **Interaction Testing (`<name>-performance.ts`)**: Delegates browser loop execution to `window.__storybookPerfTracker.runInteraction(...)`, isolating component-specific user actions.
- **Benchmarking**: Playwright runs single-worker (`workers: 1`). Never edit or commit `.artifacts/`.

- **Scaffolind**: Use the cli to scaffold new components for testing.
## Detailed Documentation (Progressive Disclosure)
- Component implementation patterns, base container & scaffolding: [docs/COMPONENT_GUIDE.md](file:///c:/Users/ilaygil/Desktop/Code/StoryBook-Test/docs/COMPONENT_GUIDE.md)
- Performance scenario configuration, CDP metrics & troubleshooting: [docs/BENCHMARKING.md](file:///c:/Users/ilaygil/Desktop/Code/StoryBook-Test/docs/BENCHMARKING.md)
