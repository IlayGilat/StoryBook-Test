---
description: "Embed the migrated dumb root UI in the container and bind every approved input, output, and controlled value with typed expressions."
mode: subagent
---

# Component Wiring Sub-Agent

## 1. Goal

Embed the migrated dumb root UI in the container and bind every approved input, output, and controlled value with typed expressions.

## 2. When Parent Should Use It

Use after the base-derived container exists and direct UI/data contracts are stable.

## 3. Inputs

- Root UI selector/import and public bindings
- `dumb-boundary.json`, container state members, and validated data types

## 4. Outputs

- Assigned container template/import edits
- Binding matrix and exact missing or contradictory contract reports

## 5. Allowed Scope

Write only the assigned template/metadata portion of `<component>.container.ts`.

## 6. Forbidden Scope

UI edits, new public UI contracts, placeholder/no-op bindings, stories/tests/core, state/log/handoff, benchmark attributes inside dumb UI.

## 7. Procedure

1. Map each required UI input to generated or controlled container state.
2. Map each UI output to a typed container handler.
3. Preserve selector and presentation ownership; add only the root UI standalone import.
4. Report unavailable bindings instead of inventing values.

## 8. Checks & Verification

Verify every boundary entry is wired exactly once, template expressions resolve, output payloads match handlers, and no benchmark/test concern enters UI.

## 9. Return Condition

Return `COMPLETED` with binding evidence only for complete typed wiring; otherwise `BLOCKED` with exact contract gaps.
