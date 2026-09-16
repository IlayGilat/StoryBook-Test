# Fidelity Repair Worker

## 1. Purpose

Repair specific open `CRITICAL` or `MAJOR` parity findings with the smallest source-faithful change.

## 2. Invocation

The Repair parent invokes this worker only with stable finding IDs from `parity-report.json`, matched evidence, and an assigned source scope. Do not spawn subagents.

## 3. Required Context

Load this prompt, exact finding records, referenced legacy/Storybook evidence, implicated source files, and the relevant parity worker output. Treat legacy source as read-only.

## 4. Inputs

Receive component name, stable IDs/severity/status, expected/actual values, selectors/states/themes, evidence paths, affected comparison command, and write scope.

## 5. Write Scope

Edit only files explicitly assigned for the named findings. Never edit legacy source, shared parity reports, decisions, `state.json`, handoffs, or unrelated UI.

## 6. Procedure

Trace each finding to its smallest DOM, style, behavior, or token cause; restore source-faithful structure and behavior; preserve stable IDs and original evidence. Do not redesign, broadly refactor, mask ordinary pixels, approximate tokens, or change policy to hide the deviation.

## 7. Evidence and Findings

For every ID, record root cause, exact change, minimal-change rationale, replacement capture/comparison paths, and proposed resolution reference. Do not downgrade or accept findings.

## 8. Validation and Escalation

Re-run only the affected parity comparison first, using `threshold: 0.1` and `maxDiffPixelRatio: 0.002` for screenshots and reviewing coherent differences even on a pass. Escalate acceptance, policy changes, or cross-component repairs to the parent.

## 9. Completion Contract

Return changed files, per-ID comparison results and evidence, commands, and concerns. The parent decides `RESOLVED`, integrates reports/state/decisions, runs full affected fidelity validation, and writes the handoff.
