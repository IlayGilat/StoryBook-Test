# Prompt Module 04: Stage 01 — Project Bootstrap Agent

> **Source**: Section 18 (Project Bootstrap) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directory**: `.agents/project-bootstrap/`  
> **Subagents Directory**: `.agents/project-bootstrap/subagents/`

---

## 1. Project Bootstrap Main Agent Specification (`AGENT.md`)

### Purpose
Prepares the shared rendering infrastructure in `StoryBook-Test`. Ensures global styles, CSS variables, Less mixins, theme tokens, assets (fonts, icons, images), and third-party UI libraries match the legacy application environment so that migrated components render identically to production.

> **CRITICAL INVARIANT**:  
> This agent prepares the **shared global infrastructure**. It **DOES NOT** migrate a specific benchmark component target.

### When to Invoke
- At the start of a migration initiative when setting up the repository to support components from a new legacy Angular application.
- When global styles, fonts, or theme variables in the legacy application are updated.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/project-bootstrap/AGENT.md`
  - Legacy application global configuration (e.g. `angular.json`, `package.json`, global style sheets)
- **Optional Context**:
  - `docs/agents/WORKFLOW.md`
  - `.storybook/preview.ts`
- **Do Not Load by Default**:
  - Component-specific migration artifacts or any subsequent stage agent instructions.

### Sub-Agents Available
1. `dependency-sync`
2. `theme-migration`
3. `global-styles-migration`
4. `shared-assets-migration`
5. `shared-ui-migration`
6. `storybook-build-verification`

### Responsibilities
- Synchronize essential runtime UI dependencies (e.g., component libraries, icon fonts) without polluting the benchmark harness with legacy application store/router dependencies.
- Replicate theme variables, Less variables, CSS custom properties, and reset stylesheets.
- Copy shared visual assets (SVGs, font files, images) into `public/` or `src/assets/`.
- Verify that Storybook boots and builds cleanly with the updated styles and dependencies.

### Non-Responsibilities
- Migrating business components or top-level benchmark targets.
- Creating data factories or Playwright test specs.

### Definition of Done (DoD)
- [ ] Angular project builds without TypeScript or Less compilation errors (`npm run build` or `npx ng build`).
- [ ] Storybook dev server runs without missing asset or style warnings (`npm run storybook`).
- [ ] Shared CSS/Less tokens, variables, and fonts are accessible globally across Storybook stories.
- [ ] Handoff written to `.migrations/bootstrap/handoff.md`.

---

## 2. Sub-Agent Specifications

### A. `dependency-sync.md`
- **Goal**: Compare legacy `package.json` with `StoryBook-Test/package.json` and install only missing presentational packages (e.g. `@angular/cdk`, UI primitives, icon sets, date utilities).
- **Allowed Scope**: `package.json`, `package-lock.json`.
- **Forbidden Scope**: Modifying Angular version (must stay 16.2.12), installing NgRx, state stores, or full legacy app monolith dependencies.
- **Procedure**: Identify pure presentational dependencies -> Verify compatibility with Angular 16 -> Propose/install packages -> Test build.
- **Return Condition**: Dependencies installed cleanly or reported as incompatible.

### B. `theme-migration.md`
- **Goal**: Replicate legacy color palettes, typography tokens, elevation scales, and dark/light mode themes.
- **Allowed Scope**: `src/styles/themes/`, Less theme variables, CSS custom properties.
- **Procedure**: Extract theme definitions from legacy source -> Convert to standalone Less variables or CSS variables -> Wire into `.storybook/preview.ts` or global styles -> Verify variables resolve.
- **Return Condition**: All theme tokens mapped and documented.

### C. `global-styles-migration.md`
- **Goal**: Migrate global stylesheets, reset CSS, utility classes, and typography definitions from the legacy app.
- **Allowed Scope**: `src/styles/`, `.storybook/preview.ts`, `angular.json` styles array.
- **Procedure**: Copy global styles -> Strip legacy router/app-shell specific layout rules -> Retain core component layout and typography classes -> Verify compilation.
- **Return Condition**: Styles compile cleanly with Less compiler.

### D. `shared-assets-migration.md`
- **Goal**: Copy required static assets (icons, SVGs, custom fonts, brand logos) used across components.
- **Allowed Scope**: `public/`, `src/assets/`, font face definitions.
- **Procedure**: Identify shared asset directory in legacy project -> Copy to `src/assets/` -> Ensure path mappings match Storybook static directories in `.storybook/main.ts`.
- **Return Condition**: Assets copied and accessible via Storybook HTTP server.

### E. `shared-ui-migration.md`
- **Goal**: Identify and migrate foundational dumb UI primitives (buttons, tooltips, icon components) that multiple complex components depend on.
- **Allowed Scope**: `src/components/shared/` or common UI library path.
- **Procedure**: Check if primitive already exists in `StoryBook-Test` -> If not, copy standalone dumb component -> Adapt to standalone `OnPush` -> Verify compilation.
- **Return Condition**: Shared primitives compiled and ready for downstream consumption.

### F. `storybook-build-verification.md`
- **Goal**: Execute Storybook build and dev server health check to guarantee the environment is fully operational.
- **Allowed Scope**: Read-only verification and diagnostic logs.
- **Procedure**: Run `npm run build:storybook` (or dry-run build) -> Inspect console logs for missing fonts, Less errors, or missing module imports -> Report pass/fail.
- **Return Condition**: Confirmed clean Storybook build report.
