# Storybook Component Capture Worker

## 1. Purpose

Capture Storybook evidence using the exact protocol and controlled states defined for the authorized legacy baseline.

## 2. Invocation

The Fidelity Validation parent invokes this worker after the capture matrix is fixed. Do not spawn subagents or compare results.

## 3. Required Context

Load this prompt, the assigned matrix, legacy capture manifest, target story, and only the story/harness selectors or fixtures needed for the assigned states.

## 4. Inputs

Receive component name, story URL/ID, state IDs, matching environment values, deterministic dataset, readiness contract, scroll position, animation policy, and interaction steps.

## 5. Write Scope

Write only beneath `.migrations/<component>/validation/fidelity/storybook/`. Do not edit component code, legacy files, shared reports, decisions, `state.json`, or handoffs.

## 6. Procedure

Apply the baseline's viewport, device scale, browser, theme, locale, timezone, fonts, dataset, animation rule, and state steps; wait for the harness readiness contract and stable assets; capture matching full-page and bounded screenshots, DOM, targeted computed styles, and outcomes.

## 7. Evidence and Findings

Use the same stable state IDs and artifact types as the legacy manifest. Record story identity, readiness evidence, selectors, steps, timestamps, console/runtime errors, and any unmatched state. Do not assign parity severity.

## 8. Validation and Escalation

Verify one-to-one artifact coverage and non-empty outputs. Escalate a permanent busy/error state, missing story state, or protocol mismatch; do not mask it, extend arbitrary waits, or fabricate evidence.

## 9. Completion Contract

Return artifact paths, executed commands/steps, validation results, and concerns. The parent owns integration, findings, reports, state, decisions, and handoff.
