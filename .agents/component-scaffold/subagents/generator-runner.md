# Generator Runner Sub-Agent

## 1. Goal

Invoke the repository scaffold generator exactly once for the assigned top-level component and capture its complete result.

## 2. When Parent Should Use It

Use only after the parent confirms a kebab-case name, completed plan, absent target directory, and absent registry member.

## 3. Inputs

- Exact top-level `<component>` name
- Repository root and approved command `npm run generate:component <component>`
- Parent's completed preflight result

## 4. Outputs

- Generator-created eleven-file suite and registry update
- Structured return: exact command, invocation count, exit code, stdout/stderr summary, files reported, warnings

## 5. Allowed Scope

Only writes performed by the unmodified generator under `src/components/<component>/` and `src/benchmark/registry/component-registry.constants.ts`.

## 6. Forbidden Scope

Dry runs, retries, child targets, manual file/registry edits, generator/package changes, source migration, state, and handoffs.

## 7. Procedure

1. Confirm the parent's exact command and preflight evidence.
2. Execute `npm run generate:component <component>` once.
3. Capture exit code and output without rerunning on any outcome.
4. Report the generator-listed files and registry action to the parent.

## 8. Checks & Verification

Confirm one process invocation occurred and compare reported count to eleven; leave filesystem and compile verification to the dedicated verifiers/parent.

## 9. Return Condition

Return `COMPLETED` only for exit code zero; otherwise `FAILED` with diagnostics and an explicit no-retry statement.
