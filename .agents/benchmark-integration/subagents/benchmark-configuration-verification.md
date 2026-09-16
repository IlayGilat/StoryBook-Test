# Benchmark Configuration Verification Sub-Agent

## 1. Goal

Perform a read-only end-to-end dry verification that the target's registry and benchmark configuration satisfy runner expectations.

## 2. When Parent Should Use It

Use last, after all identity, tracker, paint, and sizing integration work is complete.

## 3. Inputs

- Registered identity/configuration, completed harness stories, tracker, and benchmark runner/config/types
- Parent-approved dry-run command and expected scales/viewport/scenarios

## 4. Outputs

- Dry-run command, exit/result, resolved configuration, metrics shape, and runtime errors
- Exact ownership routing for any failure

## 5. Allowed Scope

Read-only verification; temporary outputs must stay outside tracked component files and `.artifacts/` must not be edited or committed.

## 6. Forbidden Scope

Any source/config/story/test/state/log/handoff edit, fixed sleeps, ignored runtime errors, or automatic repair.

## 7. Procedure

1. Resolve component identity and performance configuration through public APIs.
2. Build/load the registered story and prepare a representative dataset.
3. Run one measured interaction through the global tracker and runner path.
4. Capture configuration, readiness, result shape, console, and page errors.

## 8. Checks & Verification

Require configured scales/viewport/scenarios to resolve, identity values to match, metrics to be finite/valid, and zero unhandled runtime errors; inspect git status for artifact/source changes.

## 9. Return Condition

Return `COMPLETED` with reproducible evidence only when the dry run passes; otherwise `FAILED` with command/output and owning contract.
