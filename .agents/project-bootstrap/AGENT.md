# Project Bootstrap Main Agent

## 1. Purpose

Prepare shared Storybook rendering infrastructure—presentational dependencies, themes, global Less/CSS, assets, and reusable UI primitives—without migrating the requested benchmark component.

## 2. When to Invoke

Invoke once when onboarding a legacy Angular application, or when its shared visual environment changes. The operator must provide the top-level component name and legacy application root.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/project-bootstrap/AGENT.md`
- Legacy `package.json`, Angular workspace configuration, and global style entrypoints
- `.migrations/<component>/state.json`, if already initialized

## 4. Optional Context

- `.storybook/main.ts` and `.storybook/preview.ts` when styles or static assets must be wired
- Existing `src/styles/`, `public/`, `src/assets/`, and `src/components/shared/` files relevant to a discovered dependency
- `docs/agents/WORKFLOW.md` when an operational edge case requires it

## 5. Do Not Load by Default

- Component-specific legacy templates, component trees, or migration plans
- Other stage `AGENT.md` files or unselected worker prompts
- Historical handoffs, raw notes, unrelated documentation, and `.artifacts/`

## 6. Required Prior Artifacts

None. If state does not exist, initialize `.migrations/<component>/state.json` from the shared schema before work; do not invent a source path.

## 7. Sub-Agents Available

- `dependency-sync`
- `theme-migration`
- `global-styles-migration`
- `shared-assets-migration`
- `shared-ui-migration`
- `storybook-build-verification`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. Select the minimum workers needed from evidence in the required context, load a worker prompt only when dispatching it, and give it exact inputs and a disjoint write scope. Workers may run concurrently only when their writes cannot overlap. The main agent owns integration, all `state.json` updates, the handoff, and final validation.

## 9. Responsibilities

- Identify and synchronize only presentation-layer packages compatible with Angular 16.2.12.
- Reproduce shared theme tokens, resets, typography, global styles, and required static assets.
- Add only foundational presentational primitives reused by the target tree.
- Integrate worker results and record meaningful deviations in `.migrations/<component>/logs/decisions.md`.

## 10. Non-Responsibilities

- Migrating the benchmark target or any of its component-specific children.
- Adding stores, routing, business services, data factories, stories, scenarios, or Playwright specs.
- Invoking a later migration stage.

## 11. Execution Flow

1. Load required context; validate the component name, legacy root, and state.
2. Inventory shared visual requirements and select only necessary workers.
3. Delegate with isolated inputs and disjoint scopes; serialize any overlapping work.
4. Integrate results, update state through the main agent, and document deviations.
5. Run repository and Storybook validation, write the canonical handoff, and stop.

## 12. Allowed Modifications

- `package.json` and `package-lock.json` for approved presentational packages
- `angular.json`, `.storybook/main.ts`, and `.storybook/preview.ts` for global style or asset wiring
- `src/styles/`, `public/`, `src/assets/`, and `src/components/shared/`
- `.migrations/<component>/state.json`, `logs/decisions.md`, and `handoffs/project-bootstrap.md`

## 13. Forbidden Modifications

- Any external production or legacy source
- `src/components/<component>/` and component-specific migration implementation files
- Angular version changes; NgRx, router, or legacy application monolith dependencies
- `.artifacts/` and artifacts owned by later stages

## 14. Required Outputs

- Verified shared rendering infrastructure needed by the legacy visual environment
- Updated `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/project-bootstrap.md` using the shared handoff contract
- Decision entries for every meaningful alteration from production behavior or architecture

## 15. Validation

- Run the Angular compile/build check for every bootstrap: use `npm run build` when that script is defined, otherwise run `npx ng build`; require a zero exit code and no TypeScript or Less errors.
- Run `npm run build-storybook`; require a zero exit code and no missing module, style, font, or asset errors.
- Run a bounded Storybook development health check: launch `npm run storybook` as a captured child process, poll `http://localhost:6006` for at most 60 seconds, require a successful HTTP response, and inspect server/browser console output for missing assets, styles, modules, or unhandled errors. Always terminate the spawned process tree in a `finally`/guaranteed-cleanup path on success, failure, or timeout; never leave an indefinite server running.

## 16. Definition of Done (DoD)

- [ ] Required presentational dependencies are compatible and installed; no forbidden application coupling was added.
- [ ] Required global tokens, styles, fonts, and assets resolve in Storybook.
- [ ] The mandatory Angular compile/build check (`npm run build` when defined, otherwise `npx ng build`) passes.
- [ ] `npm run build-storybook` passes.
- [ ] The bounded `npm run storybook` startup reaches healthy HTTP within 60 seconds, console inspection finds no missing asset/style/module or unhandled errors, and the spawned process tree is terminated.
- [ ] State, decisions, and `.migrations/<component>/handoffs/project-bootstrap.md` are complete and mutually consistent.
- [ ] No benchmark component was migrated.

## 17. Handoff & Failure Behavior

Write the handoff in the exact section order from `.agents/shared/handoff-contract.md`; its status and timestamp must match state. Recommend `source-analysis` but never invoke it. On missing inputs, write `BLOCKED`; on failed validation, write `FAILED`, preserve concise warnings, and stop without advancing stages. Stop immediately once this DoD is satisfied.
