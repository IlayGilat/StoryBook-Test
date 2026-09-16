---
description: "Ensure the target has one unique registry identity and repository-owned benchmark metadata matching its actual container and story."
mode: subagent
---

# Benchmark Registry Integration Sub-Agent

## 1. Goal

Ensure the target has one unique registry identity and repository-owned benchmark metadata matching its actual container and story.

## 2. When Parent Should Use It

Use after Harness completion, before tracker and runner verification.

## 3. Inputs

- Registry constants/types/utils, completed container/story, and existing benchmark configuration model
- Exact component name, selector, ready state, size event, story ID, scales, and viewport requirements

## 4. Outputs

- Minimal assigned registry/config edits when required
- Identity trace from enum/descriptor through derived selector, event, and URL

## 5. Allowed Scope

Write only the exact assigned component entry in existing registry/config files; read completed harness identity usage.

## 6. Forbidden Scope

Parallel registries, unrelated entries, stories/tests/components, broad core redesign, state/log/handoff, and invented metadata fields.

## 7. Procedure

1. Find the single target registry identity created by scaffold.
2. Derive and compare selector, ready selector, size event, story URL, and supported config.
3. Add only missing repository-owned metadata with existing types/patterns.
4. Reject duplicates and mismatched naming.

## 8. Checks & Verification

Assert uniqueness, type-check the registry, and compare every derived identity value to rendered harness/story values and runner expectations.

## 9. Return Condition

Return `COMPLETED` with exact values/evidence when identity is unique and consistent; otherwise `FAILED` or `BLOCKED` precisely.
