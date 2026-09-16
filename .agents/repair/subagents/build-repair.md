# Build Repair Worker

## 1. Goal

Repair a reported Angular compiler, TypeScript, or Less compilation failure with the smallest type-safe change.

## 2. When Parent Should Use It

The Repair parent invokes this worker only with an exact report entry, its compiler diagnostic/command evidence, a parent-assigned repair reference, and a bounded file scope. Do not spawn subagents.

## 3. Inputs

### Context to load

Load this prompt, the exact compiler output, original command, and only implicated source/configuration files. Load troubleshooting guidance only when needed.

### Delegated inputs

Receive component name, repair reference, exact report path/entry, diagnostic text and locations, expected contract, original command, affected stage, and allowed write scope.

## 4. Outputs

Keep every change linked to its repair reference. Record root cause, changed lines/files, minimal-change rationale, and original-command output as the proposed resolution evidence.

## 5. Allowed Scope

Edit only files explicitly assigned by the parent.

## 6. Forbidden Scope

Never edit legacy source, `state.json`, shared reports, decisions, handoffs, or unrelated configuration.

## 7. Procedure

Reproduce or confirm the diagnostic; identify its root cause; correct the narrow declaration, strict type/template contract, or Less reference; preserve standalone/OnPush and repository patterns. Do not use `any`, disable strictness/checks, approximate tokens, or upgrade unrelated dependencies.

## 8. Checks & Verification

Re-run the original failing compile/build command. Escalate if it still fails, the root cause lies outside scope, or a broader architectural change appears necessary; do not expand scope silently.

## 9. Return Condition

Return changed files, repair-reference-to-change mapping, command/result, and concerns. The parent integrates, runs full affected-stage validation, updates reports/state/decisions, and writes the handoff.
