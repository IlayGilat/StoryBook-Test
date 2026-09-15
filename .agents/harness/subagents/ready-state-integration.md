# Ready State Integration Sub-Agent

## 1. Goal

Verify and, only within the assigned container, preserve shared busy/ready/error, sizing, race-guard, and double-rAF behavior.

## 2. When Parent Should Use It

Use after container data and state wiring is integrated, before stories are finalized.

## 3. Inputs

- Completed container and `BaseBenchmarkContainerComponent` lifecycle
- Registered identity and expected `storybook-<component>-size` event

## 4. Outputs

- Minimal assigned container correction if needed
- Evidence for busy/ready/error transitions, rapid sizes, last-generation-wins, and double-rAF completion

## 5. Allowed Scope

Read shared base/tracker contracts; write only the assigned container file when required by its abstract hooks.

## 6. Forbidden Scope

Editing or duplicating shared base/tracker logic, fixed sleeps, manual ready forcing, stories/tests/UI/data, state/log/handoff.

## 7. Procedure

1. Trace generation through base `regenerateData` and container hooks.
2. Verify host attributes derive from base state and errors never become ready.
3. Dispatch rapid size events and confirm only the latest generation commits.
4. Confirm readiness follows data assignment and inherited double `requestAnimationFrame`.

## 8. Checks & Verification

Require `aria-busy="true"` while not ready, `data-ready="true"` only after stable paint, exact final size, stale rejection, cleanup, and error visibility.

## 9. Return Condition

Return `COMPLETED` with lifecycle evidence when the shared contract is preserved; otherwise `FAILED` or `BLOCKED` without weakening guards.
