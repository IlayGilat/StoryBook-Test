---
description: "Capture Storybook evidence using the exact protocol and controlled states defined for the authorized legacy baseline."
mode: subagent
---

# Storybook Component Capture Worker

## 1. Goal

Capture Storybook evidence using the exact protocol and controlled states defined for the authorized legacy baseline.

## 2. When Parent Should Use It

The Fidelity Validation parent invokes this worker after the capture matrix is fixed. Do not spawn subagents or compare results.

## 3. Inputs

### Context to load

Load this prompt, the assigned matrix, legacy capture manifest, target story, and only the story/harness selectors or fixtures needed for the assigned states.

### Delegated inputs

Receive component name, story URL/ID, state IDs, matching environment values, deterministic dataset, readiness contract, scroll position, animation policy, and interaction steps.

## 4. Outputs

Use the same stable state IDs and artifact types as the legacy manifest. Record story identity, readiness evidence, selectors, steps, timestamps, console/runtime errors, and any unmatched state. Do not assign parity severity.

## 5. Allowed Scope

Write only beneath `.migrations/<component>/validation/fidelity/storybook/`.

## 6. Forbidden Scope

Do not edit component code, legacy files, shared reports, decisions, `state.json`, or handoffs.

## 7. Procedure

Apply the baseline's viewport, device scale, browser, theme, locale, timezone, fonts, dataset, animation rule, and state steps; wait for the harness readiness contract and stable assets; capture matching full-page and bounded screenshots, DOM, targeted computed styles, and outcomes.

## 8. Checks & Verification

Verify one-to-one artifact coverage and non-empty outputs. Escalate a permanent busy/error state, missing story state, or protocol mismatch; do not mask it, extend arbitrary waits, or fabricate evidence.

## 9. Return Condition

Return artifact paths, executed commands/steps, validation results, and concerns. The parent owns integration, findings, reports, state, decisions, and handoff.
