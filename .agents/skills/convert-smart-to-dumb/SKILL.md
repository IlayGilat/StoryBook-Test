---
name: convert-smart-to-dumb
description: Replace Angular application coupling with explicit typed presentation inputs, outputs, and controlled values.
---

# Convert Smart to Dumb

## When to use

Use during Component Tree Migration for a node whose classified data, control, router, or environment dependency cannot remain internal.

## Inputs

- Node source and target files.
- `smart-dependencies.json`, `dumb-boundary.json`, data contract, and source behavior evidence.

## Outputs

- Standalone `OnPush` presentation component with typed `@Input()`/`@Output()` contracts.
- Updated boundary and decision artifacts when contracts or behavior change.

## Procedure

1. Preserve presentation imports, DOM, styles, accessibility, and local presentation state.
2. Replace store selectors, HTTP reads, and app-owned state with typed inputs that preserve loading/empty/error distinctions.
3. Replace dispatches, mutations, and navigation with typed output intents or planned harness actions.
4. Replace route/environment/feature-flag reads with deterministic controlled inputs.
5. Remove only now-unused injections/imports/providers and keep satisfiable nested smart dependencies internal.
6. Update bindings/types, compile the node, render representative states, and verify event payload semantics.

## Constraints

- No source edits, `any`, hidden network calls, silent no-ops, hard-coded production state, or unrelated refactors.
- Do not expose unnecessary child contracts as root benchmark inputs.
- Fidelity precedes cleanup.

## Stop conditions

Stop when each classified coupling has its planned replacement and node validation passes, or block if faithful behavior cannot be derived from evidence.
