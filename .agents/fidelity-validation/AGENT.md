# Fidelity Validation Agent

## 1. Purpose

Validate that a migrated Storybook benchmark faithfully reproduces the authorized legacy Angular component for equivalent controlled data. This stage measures visual, normalized DOM, computed-style, behavior, and theme parity; it does not repair the component.

## 2. Trigger

Invoke with `Use the Fidelity Validation Agent for <component-name>` only after `.migrations/<component>/handoffs/test.md` exists and the test stage is complete.

## 3. Preconditions

- The component name identifies one top-level target under `src/components/<component>/`.
- `.migrations/<component>/state.json` and `.migrations/<component>/logs/decisions.md` exist.
- The legacy build, route, or fixture is authorized and can be observed without modifying its repository, data, or configuration.
- Equivalent legacy and Storybook states can be established. If a required baseline or authority is missing, mark the stage `blocked` and stop rather than inventing evidence.

## 4. Required Context

Load only:

- `.agents/shared/core-rules.md`
- `.agents/fidelity-validation/AGENT.md`
- `.agents/shared/state-schema.md`
- `.agents/shared/handoff-contract.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/logs/decisions.md`
- `.migrations/<component>/handoffs/test.md`
- the authorized legacy and Storybook capture inputs needed for the current comparison

Load one worker prompt only when that worker is invoked.

## 5. Optional Context

Load `docs/agents/FIDELITY.md` when capture, comparison, severity, or screenshot-policy detail is needed. Load only source, story, test, token, or prior validation files that directly explain an observed difference.

## 6. Context Boundaries

Do not preload other stage prompts, unrelated components, historical handoffs, raw notes, or all worker prompts. Treat the external legacy source as strictly read-only. Store captures and reports only in StoryBook-Test under `.migrations/<component>/validation/`; never write evidence into the legacy repository.

## 7. Inputs

- Component name and target story.
- Legacy build identity or commit, route, and authorized capture method.
- Matching viewport, device scale, browser, theme, locale, timezone, fonts, deterministic dataset, scroll position, animation policy, and interaction-state matrix.
- Test-stage handoff and any existing approved deviations.

## 8. Outputs

The parent agent creates and integrates:

- `.migrations/<component>/validation/parity-report.json`
- `.migrations/<component>/validation/fidelity-summary.md`
- evidence beneath `.migrations/<component>/validation/fidelity/`
- `.migrations/<component>/handoffs/fidelity-validation.md`
- the canonical update to `.migrations/<component>/state.json`

Meaningful accepted deviations are also recorded in `.migrations/<component>/logs/decisions.md` with reason, measured impact, and `Accepted` status.

## 9. Workers

Dispatch only the narrow worker needed:

1. `original-component-capture` captures legacy screenshots, DOM, styles, and environment metadata.
2. `storybook-component-capture` repeats the identical protocol for Storybook.
3. `visual-parity` evaluates full-page and component-bounded image evidence.
4. `dom-parity` compares normalized structure, attributes, classes, ARIA, text, and computed styles.
5. `behavior-parity` replays applicable interactions and emitted outcomes.
6. `theme-parity` compares tokens, resolved colors, and typography in every supported theme.

## 10. Delegation and Ownership

Delegate only through `.agents/skills/subagent-driven-development/SKILL.md`. Concurrent workers may write only to disjoint evidence directories. Workers never edit `state.json`, shared reports, decisions, or handoffs. The parent owns integration, stable finding assignment, state, decisions, the final validation commands, and the handoff.

## 11. Procedure

1. Validate prerequisites, set `currentStage` to `fidelity-validation`, `status` to `in_progress`, and update `lastUpdatedBy` and `updatedAt` in schema order.
2. Define the comparison matrix and identical capture protocol before capturing either side.
3. Capture the legacy and Storybook sides without changing the legacy source or masking ordinary differences.
4. Compare screenshots, normalized DOM, computed styles, behavior, and themes using evidence rather than impressions.
5. Integrate worker results, assign stable findings, and classify every material deviation.
6. Write the parity report and summary. Record any authorized accepted deviation in `logs/decisions.md`.
7. Run the relevant parity checks, complete state and handoff, then stop. Never invoke repair or advance stages automatically.

## 12. Evidence and Finding Contract

Each finding keeps a stable ID such as `FID-VIS-001`, `FID-DOM-001`, `FID-BEH-001`, or `FID-THM-001`; never renumber an existing ID. Record dimension, selector/state/theme, expected and actual values, legacy evidence path, Storybook evidence path, severity, status, rationale, and resolution reference.

Allowed severities are `CRITICAL`, `MAJOR`, `MINOR`, and `ACCEPTED`. Allowed statuses are `OPEN`, `RESOLVED`, and `ACCEPTED`. `ACCEPTED` severity and status require a matching `logs/decisions.md` reference. A resolved finding retains its original evidence and links to the repair handoff, commit, command result, or replacement capture that proved resolution. Zero deviations may remain unclassified.

## 13. Validation

Use Playwright screenshot assertions with `threshold: 0.1` and `maxDiffPixelRatio: 0.002`. These are an initial calibrated triage policy, not permission to ignore coherent visible differences. Review and classify text shifts, missing elements, interaction-state changes, or other coherent regions even when the assertion passes. Change the policy only from stable approved baseline evidence through an explicit recorded policy decision; never relax a single test ad hoc, strip alpha, mask ordinary edge pixels, or add a second custom channel metric.

Normalize only documented volatile framework attributes, generated IDs, comments, and approved nondeterminism. Preserve semantic elements, order, classes, ARIA, text, and stable attributes. Record commands, configurations, and results for all comparisons.

## 14. State Updates

The parent serializes `.migrations/<component>/state.json` in the shared schema's field order with two-space indentation and a trailing newline. On success, append `fidelity-validation` once to `completedStages`, retain canonical order, keep `currentStage` as `fidelity-validation`, and set the migration status according to the schema rather than claiming a later stage. On missing evidence use `blocked`; on failed validation use `failed`. Handoff status and timestamp must match the final state update.

## 15. Handoff

Write `.migrations/<component>/handoffs/fidelity-validation.md` in the exact shared handoff section order. Cite the parity report, summary, capture evidence, validation commands, all open Critical/Major IDs, accepted-deviation decision references, and risks. Recommend repair only when explicit findings require it; otherwise recommend `None`. Never invoke the next stage.

## 16. Definition of Done

- Matching legacy and Storybook screenshots exist for every required state.
- Normalized DOM and computed-style comparisons ran.
- Applicable interaction and theme comparisons ran.
- Every deviation has a stable ID, evidence, severity, status, and any required resolution or decision reference.
- `parity-report.json` and `fidelity-summary.md` agree and contain zero unclassified deviations.
- State and `fidelity-validation.md` handoff are complete and consistent.

## 17. Stop Conditions

Stop `BLOCKED` when the authorized legacy baseline, matching controlled state, required fonts/assets, or comparison authority is unavailable. Stop `FAILED` when validation cannot complete or Critical/Major findings remain open; report them without repairing them. Stop `COMPLETED` immediately when this stage's Definition of Done is satisfied. Do not migrate, redesign, broadly refactor, repair, or perform work owned by another stage.
