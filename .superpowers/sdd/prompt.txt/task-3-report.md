# Task 3 Implementation Report

## Status

DONE

## Scope Implemented

Created the complete Phase 3 stage-prompt inventory:

- `.agents/project-bootstrap/AGENT.md` and six specified workers
- `.agents/source-analysis/AGENT.md` and eight specified workers
- `.agents/migration-planning/AGENT.md` and five specified workers
- `.agents/component-scaffold/AGENT.md` and three specified workers

No component migration, source modification, scaffold invocation, or later-stage implementation was performed.

## Main-Agent Contract

Each of the four main agents uses the exact Module 02 17-section heading order. Each prompt:

- separates Required Context, Optional Context, and Do Not Load by Default;
- delegates only through `.agents/skills/subagent-driven-development/SKILL.md`;
- selects the minimum evidence-backed workers and permits concurrent work only for disjoint writes;
- leaves integration, `state.json`, handoff creation, and final validation with the main agent;
- declares allowed/forbidden modifications, concrete outputs, validation, DoD, and failure behavior;
- recommends but never invokes the next stage, and stops after its own DoD.

## Worker Contract

All 22 worker prompts use the exact Module 02 9-section heading order and define:

- a narrow goal and parent selection condition;
- exact input and structured-output contracts;
- allowed and forbidden scope;
- an operational procedure and immediate checks;
- a terminal structured return to the parent without owning shared state or handoff integration.

## Stage-Specific Results

### Project Bootstrap

- Treats production source as read-only and limits writes to shared rendering infrastructure.
- Uses the ruled canonical handoff path `.migrations/<component>/handoffs/project-bootstrap.md`.
- Uses `npm run build-storybook`; the nonexistent `npm run build:storybook` is absent.
- Prevents benchmark-target migration and application-layer dependency import.

### Source Analysis

- Keeps legacy source strictly read-only.
- Requires top-down rendered-tree discovery before specialist analysis.
- Produces the four canonical analysis artifacts and evidence-backed Presentation/Data/Application Control/Environment classifications.
- Explicitly forbids component copying, planning decisions, and scaffold work.

### Migration Planning

- Requires deterministic strict post-order, with stable sibling order and children before parents.
- Requires complete typed root/internal boundary treatment, data contracts, reuse/copy decisions, and source-to-target file operations.
- Cross-checks every analyzed node and dependency so downstream implementation requires no architectural rediscovery.
- Explicitly forbids implementation and scaffold generation.

### Component Scaffold

- Performs a read-only absence/name preflight before one generator invocation.
- Runs `npm run generate:component <component>` exactly once for the top-level target and forbids dry runs, retries, and child roots.
- Verifies the actual eleven-file generator inventory: two data, three UI, two harness, and four test files.
- Verifies the generator-managed `component-registry.constants.ts` member and its public re-export through `component-registry.ts`.
- Forbids manual implementation or repair of generated contents.

## Validation Evidence

1. Inventory and section-order check (PowerShell over the four stage roots):
   - Result: `mains=4 workers=22 total=26`.
   - Result: every main reported 17 sections in the exact `1..17` order.
   - Result: every worker reported 9 sections in the exact `1..9` order.
2. Exact worker-name/reference and static-path check:
   - Result: `PASS: 4 mains, 22 exact workers, ordered 17/9 sections, worker references and static paths valid`.
   - Confirmed the SDD skill, generator, and registry constants paths exist.
3. Command ruling search:
   - `rg -n "build:storybook|generate:component.*generate:component" ...`
   - Result: no forbidden Storybook command or duplicated generator command pattern found.
   - Required searches found `npm run build-storybook` and `npm run generate:component <component>` in their owning stages.
4. Markdown whitespace check:
   - `rg -n "[ \\t]+$" ...`
   - Result: no trailing whitespace found.
5. Scope inspection:
   - Task-target status contained only the four new stage directories before this report.
   - No migration source, `src/components/`, or `.migrations/` implementation was created or modified by Task 3.

## Self-Review

- Compared the stage prompts against Modules 04–06, the exact Module 02 templates, shared core rules, state schema, handoff contract, the existing SDD skill, and the repository's current eleven-file generator implementation.
- Preserved the current registry architecture by checking the generator-managed constants file plus public registry re-export rather than claiming the barrel file itself is directly mutated.
- Kept prompts compact while retaining exact ownership, prerequisites, outputs, failure states, and stop conditions.
- Preserved all unrelated dirty worktree changes.

## Concerns

None.

## Fix Round 1

### Finding Addressed

Made all three Module 04 Project Bootstrap validations mandatory in both the main-agent contract and the Storybook verification worker:

- Angular compile/build: `npm run build` when the script exists, otherwise `npx ng build`.
- Static Storybook build: `npm run build-storybook`.
- Development Storybook health: launch `npm run storybook` as a captured child process, poll `http://localhost:6006` for no more than 60 seconds, require healthy HTTP, inspect server/browser console evidence for missing assets/styles/modules and unhandled errors, and always terminate and verify the spawned process tree in a guaranteed-cleanup path.

The main DoD now explicitly requires all three checks and teardown. Failure, timeout, unavailable console evidence, or an orphaned process cannot be reported as success. The canonical project-bootstrap handoff and `npm run build-storybook` ruling remain unchanged.

### Focused Validation

- Exact-section check: Project Bootstrap main remains in ordered sections `1..17`; its verification worker remains in ordered sections `1..9`.
- Required-command/behavior check found both Angular command branches, `npm run build-storybook`, `npm run storybook`, the fixed health URL, the 60-second bound, server/browser console inspection, and guaranteed process-tree teardown.
- Optionality check confirmed the development-server validation is no longer described as optional.
- `rg -n 'build:storybook|[ \\t]+$'` over the two amended prompts returned no forbidden command or trailing whitespace.
- Markdown heading-spacing check passed for both amended prompts.

### Fix Round Concerns

None.
