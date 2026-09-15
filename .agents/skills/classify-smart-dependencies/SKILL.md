---
name: classify-smart-dependencies
description: Classify Angular dependencies and define evidence-based migration treatment at component boundaries.
---

# Classify Smart Dependencies

## When to use

Use after dependency extraction during Source Analysis or Planning, and when a node reveals previously unclassified coupling.

## Inputs

- `dependencies.json`, `component-tree.json`, and relevant read-only usage sites.
- Existing `dumb-boundary.json`, if planning has begun.

## Outputs

- `smart-dependencies.json` entries with category, usage, conversion, and owner.
- Boundary questions or blockers for planning.

## Procedure

1. Classify each dependency as `presentation`, `data`, `application-control`, or `environment` from actual usage.
2. Preserve presentation dependencies when compatible with the target.
3. Map data reads to typed inputs or an internal nested dependency.
4. Map control effects to typed outputs or explicit harness actions.
5. Map environment/router/config state to controlled deterministic values or navigation intents.
6. Keep nested smart components internal when their dependencies can be satisfied without widening the root public contract.
7. Cross-check that every dependency has exactly one justified treatment.

## Constraints

- Do not flatten nested components by default.
- Do not replace behavior with no-ops, `any`, fabricated data, or global providers.
- Do not edit source or implement conversions.
- Log ambiguity; never guess category from a symbol name alone.

## Stop conditions

Stop when all scoped dependencies have an evidenced category and treatment, or block when missing usage evidence makes a load-bearing classification unknowable.
