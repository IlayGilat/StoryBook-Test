---
description: "Copy and minimally adapt one node's Less/CSS and referenced visual assets while preserving cascade, layout, classes, tokens, animations, and encapsulation."
mode: subagent
---

# Style Migration Sub-Agent

## 1. Goal

Copy and minimally adapt one node's Less/CSS and referenced visual assets while preserving cascade, layout, classes, tokens, animations, and encapsulation.

## 2. When Parent Should Use It

Use for each queued node with planned styles or asset URL operations, after its target path is fixed.

## 3. Inputs

- Node style/asset operations from `file-plan.json`
- Assigned read-only legacy styles and directly imported mixins/tokens/assets
- Target template classes, planned shared dependencies, and destination paths

## 4. Outputs

- Assigned target Less/CSS and planned node-local asset edits
- Return inventory of selectors/imports/tokens/assets, path changes, and fidelity risks

## 5. Allowed Scope

Write only the exact planned node stylesheet and assigned node-local asset targets; read directly imported style dependencies.

## 6. Forbidden Scope

Global/theme/package changes, selector redesign, visual simplification, unrelated assets/styles, generated data, state/logs/handoff, and speculative token replacement.

## 7. Procedure

1. Copy rules, selector order/specificity, variables, mixins, animations, and transitions faithfully.
2. Reconcile selectors with the preserved target template without renaming classes.
3. Resolve imports and asset URLs deliberately using planned shared or copied targets.
4. Report unavailable tokens/assets or any necessary visual deviation to the parent.

## 8. Checks & Verification

Account for every source import/URL/selector, verify target paths exist and template classes correspond, and perform the smallest available Less syntax check without editing outside scope.

## 9. Return Condition

Return `COMPLETED` with style/asset inventory and check result; otherwise `BLOCKED` on missing dependency or unresolved fidelity change.
