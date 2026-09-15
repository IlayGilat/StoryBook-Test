# Task 4 Report: Component Tree Migration Core Engine

## Status

DONE

## Summary

Created the Stage 05 Component Tree Migration prompt set: one main agent with the repository-standard 17-section contract and exactly thirteen specialized workers with the repository-standard 9-section contract. The prompts make `plan/file-plan.json.validationOrder` the executable strict post-order queue, require every child contract to compile before its parent, reserve the scaffolded root UI for last, and prohibit generator and later-stage work.

## Files Created

- `.agents/component-tree-migration/AGENT.md`
- `.agents/component-tree-migration/subagents/template-migration.md`
- `.agents/component-tree-migration/subagents/component-logic-migration.md`
- `.agents/component-tree-migration/subagents/child-component-migration.md`
- `.agents/component-tree-migration/subagents/input-output-adaptation.md`
- `.agents/component-tree-migration/subagents/ngrx-adaptation.md`
- `.agents/component-tree-migration/subagents/service-adaptation.md`
- `.agents/component-tree-migration/subagents/router-adaptation.md`
- `.agents/component-tree-migration/subagents/environment-adaptation.md`
- `.agents/component-tree-migration/subagents/local-state-adaptation.md`
- `.agents/component-tree-migration/subagents/side-effect-adaptation.md`
- `.agents/component-tree-migration/subagents/pipe-directive-migration.md`
- `.agents/component-tree-migration/subagents/style-migration.md`
- `.agents/component-tree-migration/subagents/node-compilation-verification.md`
- `.superpowers/sdd/prompt.txt/task-4-report.md`

## Requirements Implemented

- Defined exact required, optional, and do-not-load-by-default stage context.
- Required completed Component Scaffold handoff, valid analysis/planning artifacts, parseable file plan, complete unique validation order, child-before-parent ordering, and root-last ordering.
- Defined the thirteen required worker names and limited delegation to `.agents/skills/subagent-driven-development/SKILL.md`.
- Assigned parent ownership of integration, queue/order, shared state, decisions, validation records, handoff, and worker scope isolation.
- Required one-node-at-a-time copy-and-adapt behavior; explicitly forbade raw bulk tree copying.
- Preserved DOM, attributes, accessibility, classes, Less/CSS, composition, rendering logic, local presentation state, and visual interactions.
- Defined typed boundary recipes for NgRx, services, routing, environment/configuration, application side effects, inputs/outputs, local state, pipes/directives, and styles/assets.
- Required shared UI reuse to be reverified at 100% visual and behavioral fidelity.
- Required the smallest covering Angular compile/type-check after every node and prohibited upward progress after failure.
- Required per-node evidence in `validation/build-report.md`, meaningful deviations in `logs/decisions.md`, exact state ownership, and canonical `handoffs/component-tree-migration.md` output.
- Explicitly prohibited `npm run generate:component`, component data/harness/test/benchmark work, production-source edits, placeholders, `any` contracts, silent no-ops, and actual component migration during this task.

## Validation Performed

### Inventory and template validation

Command: PowerShell inventory/template assertion over `.agents/component-tree-migration/`.

Result:

```text
exactInventory=True
exactWorkers=True
exactMainTemplate=True
everyWorkerNineSections=True
headingWhitespace=True
strictQueue=True
nodeGate=True
boundaryRecipes=True
stageLimits=True
canonicalHandoff=True
```

This verified one main file plus exactly thirteen specified worker files, the exact ordered 17 main headings, exactly nine numbered headings per worker, blank lines after headings, strict queue invariants, compile gating, boundary recipes, stage limits, and the canonical handoff path.

### Whitespace validation

Command:

```text
git diff --check -- .agents/component-tree-migration
```

Result: passed with no whitespace errors.

### Scope validation

Inspected the scoped status/diff for Task 4. Task 4 creates only the component-tree migration prompt directory and this report; it does not edit any Angular component, production source, generator, data, harness, test, benchmark, or unrelated dirty file.

## Self-Review

- The main file follows the same exact section names and order used by the existing stage-agent contract.
- Every worker follows the same exact nine-section names and order used by existing worker prompts.
- Worker scopes are node-specific and disjoint; no worker may edit shared migration state, decisions, build report, or handoff.
- Failed compilation cannot be downgraded to a warning, and both failure and missing/contradictory evidence halt ancestor progress.
- The root is explicitly migrated last, not merely validated last.
- The prompts stop at Stage 05 DoD and recommend, but do not invoke, the Data stage.

## Concerns

None.

## Fix Round 1

### Finding Addressed

Replaced the permissive plain-`tsc` per-node gate with mandatory Angular template-aware compilation. The main agent and `node-compilation-verification` worker now require `npx ng build` or a repository Angular compiler target/configuration with equivalent template checking after every node. Plain `tsc` is explicitly supplementary and never sufficient. Upward progress remains blocked on any failed node gate.

### Files Changed

- `.agents/component-tree-migration/AGENT.md`
- `.agents/component-tree-migration/subagents/node-compilation-verification.md`
- `.superpowers/sdd/prompt.txt/task-4-report.md`

### Validation Command

Ran a focused PowerShell assertion over `.agents/component-tree-migration/` to verify the mandatory Angular build command/equivalent template compiler, rejection of plain `tsc` as a sufficient gate, upward blocking, exact 17/9 section counts, canonical paths, and Markdown heading spacing; the command also ran:

```text
git diff --check -- .agents/component-tree-migration
```

### Validation Result

```text
angularBuildMain=True
equivalentTemplateCompiler=True
plainTscSupplementaryOnly=True
verifierAngularBuild=True
verifierRejectsPlainTsc=True
upwardBlock=True
mainSections=True
workerSections=True
exactPaths=True
markdownHeadingSpacing=True
```

`git diff --check` passed with no whitespace errors. The only emitted messages were Git's informational LF-to-CRLF working-copy warnings.

### Concerns

None.
