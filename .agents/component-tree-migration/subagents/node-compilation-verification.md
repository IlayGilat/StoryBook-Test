# Node Compilation Verification Sub-Agent

## 1. Goal

Verify one migrated node and its completed descendants compile with stable contracts and no unexpected production application dependency before parent progress is allowed.

## 2. When Parent Should Use It

Use after all edits for the current queue node are integrated; use again for the root-last final UI-tree check.

## 3. Inputs

- Current node identifier, exact target files, and position in `file-plan.json.validationOrder`
- Completed descendant/child contract evidence and applicable plan/boundary entries
- Parent-provided smallest compile/type-check command and repository root

## 4. Outputs

- Read-only structured result: command, exit code, concise diagnostics, imports/contracts/dependency checks, child evidence, and `PASSED`/`FAILED`/`BLOCKED`

## 5. Allowed Scope

Read current node, completed descendants, plans, and compiler output; run non-mutating compile/search checks only.

## 6. Forbidden Scope

Any file edit, repair, error suppression, ancestor validation before node success, generator/test/harness work, state/log/handoff writes, and destructive commands.

## 7. Procedure

1. Confirm the node is the next queue entry and every direct child has prior passing evidence and a stable consumed contract.
2. Run the smallest Angular template/TypeScript compile covering the node and completed descendants; capture exact output and exit code.
3. Inspect standalone imports/selectors, `OnPush`, typed inputs/outputs, template members, Less/assets, and planned dependency treatments.
4. Search for unexplained NgRx, backend service, router, environment, HTTP, `any`, placeholders, or suppressed errors.

## 8. Checks & Verification

Require zero compile exit, resolved child imports/selectors, exact contract agreement, complete file-plan disposition, and no unexpected production coupling. Never convert failure into warning.

## 9. Return Condition

Return `PASSED` with reproducible evidence only when every check succeeds; return `FAILED` with diagnostics for compile/check failure or `BLOCKED` for missing child/source/plan evidence. The parent must not proceed upward on either outcome.
