---
description: "Adapt one node's TypeScript class and rendering logic into a standalone `OnPush` presentation component without changing working visual behavior."
mode: subagent
---

# Component Logic Migration Sub-Agent

## 1. Goal

Adapt one node's TypeScript class and rendering logic into a standalone `OnPush` presentation component without changing working visual behavior.

## 2. When Parent Should Use It

Use when the current node has class, lifecycle, computed rendering, or event-handler logic to migrate.

## 3. Inputs

- Current node's file-plan entry and read-only legacy TypeScript
- Planned target TypeScript, template contract, direct model/helper definitions, and verified child contracts
- Applicable boundary treatment results supplied by the parent

## 4. Outputs

- The assigned target component TypeScript edit
- Return summary of metadata, lifecycle/rendering logic preserved, dependencies applied, and risks

## 5. Allowed Scope

Write only the assigned node TypeScript file and node-local presentation helper explicitly assigned by the parent.

## 6. Forbidden Scope

Templates/styles/other nodes/shared state/logs/handoff, business-data invention, broad refactors, network/store access, and `any` contracts.

## 7. Procedure

1. Preserve selectors, rendering calculations, lifecycle timing, and presentation handlers.
2. Make the component standalone and set `ChangeDetectionStrategy.OnPush` using exact verified imports.
3. Apply parent-approved typed boundaries; retain pure helpers and rendering-relevant local state.
4. Remove only application coupling replaced by those boundaries and report anything unclassified.

## 8. Checks & Verification

Check metadata/import completeness, member-template agreement, lifecycle semantics, strict types, and zero unexplained production imports; leave integrated compilation to the verifier.

## 9. Return Condition

Return `COMPLETED` with changed files and contract summary, or `BLOCKED` when required type/behavior evidence is absent.
