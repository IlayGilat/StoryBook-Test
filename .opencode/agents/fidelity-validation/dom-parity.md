---
description: "Compare normalized DOM and computed presentation between matched legacy and Storybook states."
mode: subagent
---

# DOM Parity Worker

## 1. Goal

Compare normalized DOM and computed presentation between matched legacy and Storybook states.

## 2. When Parent Should Use It

The Fidelity Validation parent invokes this worker for explicit state pairs. Do not spawn subagents or edit templates/styles.

## 3. Inputs

### Context to load

Load this prompt, matched DOM/style artifacts, capture manifests, documented normalization rules, and existing finding IDs relevant to revalidation.

### Delegated inputs

Receive component name, stable state IDs, DOM snapshots, computed-style records, root selectors, and the approved list of volatile framework attributes or nondeterminism.

## 4. Outputs

Return selector/state-specific candidate records with expected and actual values plus normalized snapshot/style evidence paths. Preserve existing IDs and distinguish structural, attribute, text, count, and style differences.

## 5. Allowed Scope

Write only beneath `.migrations/<component>/validation/fidelity/dom/`.

## 6. Forbidden Scope

Do not alter captures, source, shared reports, decisions, `state.json`, or handoffs.

## 7. Procedure

Remove only documented generated IDs, volatile framework attributes, comments, and approved nondeterminism; compare tags, nesting, order, classes, ARIA, text, stable attributes, counts, and computed layout, geometry, typography, color, border, overflow, visibility, and stacking values.

## 8. Checks & Verification

Verify normalized outputs remain parseable and evidence points to both sides. Escalate ambiguous volatility rules; never normalize away semantic elements, stable attributes, classes, ARIA, text, or a mismatch merely to obtain parity.

## 9. Return Condition

Return candidate findings, normalization record, commands/results, artifacts, and concerns. The parent owns IDs, classification, integration, reports, state, decisions, and handoff.
