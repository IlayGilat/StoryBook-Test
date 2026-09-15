# Storybook Build Verification Sub-Agent

## 1. Goal

Perform read-only verification that shared bootstrap infrastructure builds and resolves styles and assets.

## 2. When Parent Should Use It

Use after all selected bootstrap changes are integrated and no writer is still active.

## 3. Inputs

- Integrated worktree revision
- Expected style, token, font, asset, and dependency changes
- Parent-selected validation commands

## 4. Outputs

- Structured return: commands, exit codes, concise diagnostics, missing resources, final verdict

## 5. Allowed Scope

Read-only repository inspection and ephemeral command output.

## 6. Forbidden Scope

Any source, configuration, state, handoff, dependency, or artifact modification; no attempted fixes.

## 7. Procedure

1. Run `npm run build-storybook`.
2. Inspect output for missing modules, Less failures, and asset/font resolution warnings.
3. Run only additional read-only checks assigned by the parent.
4. Isolate actionable diagnostics by file and command.

## 8. Checks & Verification

Require zero exit code and report whether every expected shared resource was covered; do not treat suppressed errors as success.

## 9. Return Condition

Return `COMPLETED` only for a clean build; otherwise return `FAILED` with exact diagnostics and make no edits.
