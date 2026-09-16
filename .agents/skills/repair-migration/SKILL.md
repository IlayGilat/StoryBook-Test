---
name: repair-migration
description: Apply the smallest evidence-backed fix for a concrete migration compilation, runtime, test, or fidelity failure.
---

# Repair Migration

## When to use

Use only when a prior stage reports a reproducible failure or Fidelity Validation records an open Critical/Major deviation.

## Inputs

- Exact failure, reproduction command/steps, evidence, owning files/node, latest handoff, and relevant migration artifacts.

## Outputs

- Surgical changes limited to the failure's ownership scope.
- Updated build/parity/decision evidence and a repair handoff.

## Procedure

1. Reproduce the reported failure unchanged and identify the smallest owning node or harness/test path.
2. Trace the failure to source evidence, approved contracts, and repository mechanics.
3. Change the minimum files needed; preserve DOM, styles, behavior, deterministic data, and benchmark contracts outside the defect.
4. Re-run the narrow failed check, then the nearest regression check required by the changed boundary.
5. Update the originating report and record meaningful deviations with reason, fidelity impact, and status.
6. Stop; do not advance to another stage or opportunistically clean adjacent code.

## Constraints

- Never edit the external legacy source.
- No speculative rewrites, broad refactors, disabled checks, widened tolerances, deleted assertions, `any`, or generator reruns.
- Preserve single-worker Playwright and `BaseBenchmarkContainerComponent` readiness/race/double-rAF behavior.
- Delegate only through `.agents/skills/subagent-driven-development/SKILL.md` when delegation is explicitly part of the active stage.

## Stop conditions

Stop when the exact failure and required regressions pass with evidence. Block when required evidence or a prerequisite is missing, or when no safe targeted repair can be identified from the available evidence; record the unresolved cause.
