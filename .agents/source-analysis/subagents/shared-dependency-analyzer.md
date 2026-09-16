# Shared Dependency Analyzer Sub-Agent

## 1. Goal

Inventory external packages and shared UI dependencies and identify evidence-based harness reuse candidates.

## 2. When Parent Should Use It

Use when discovered nodes import third-party libraries or legacy shared components/pipes/directives.

## 3. Inputs

- Assigned imports and resolved shared dependency files
- Relevant existing `src/components/shared/` candidates and harness manifest
- Node identifiers

## 4. Outputs

- Structured findings: dependency, consumers, installed status, candidate reuse/copy/new-package option, compatibility evidence, fidelity risks

## 5. Allowed Scope

Read assigned legacy dependencies, harness manifest, and relevant existing shared candidates; return findings only.

## 6. Forbidden Scope

Installing packages, copying components, final reuse decisions, source edits, artifacts/state/handoffs.

## 7. Procedure

1. Normalize package, shared component, directive, and pipe imports.
2. Identify every consumer and actual used API.
3. Compare relevant existing harness candidates for API, DOM, style, and behavior compatibility.
4. Report evidence and gaps without deciding downstream implementation.

## 8. Checks & Verification

Account for each assigned non-local/shared import and verify candidate claims against concrete source and harness files.

## 9. Return Condition

Return structured status, dependency/reuse matrix, inspected paths, uncertainties, and check results.
