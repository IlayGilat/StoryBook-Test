# Template Migration Sub-Agent

## 1. Goal

Copy and minimally adapt the assigned node's Angular template while preserving its rendered DOM, semantics, accessibility, classes, bindings, and child composition.

## 2. When Parent Should Use It

Use for one queued node after every planned child contract is compiled and before node verification.

## 3. Inputs

- Node entry and template operation from `file-plan.json`
- Assigned read-only legacy template and directly referenced presentation declarations
- Planned target template, `dumb-boundary.json`, and verified direct-child selectors/contracts

## 4. Outputs

- The assigned target HTML/template edit
- Return summary of preserved structure, necessary binding/path changes, child contracts consumed, and unresolved fidelity risks

## 5. Allowed Scope

Read only assigned source/context; write only the node's exact planned target template.

## 6. Forbidden Scope

Other nodes, TypeScript/styles/state/logs/handoff, markup redesign, placeholder children, accessibility removal, fabricated values, and bulk tree copying.

## 7. Procedure

1. Compare source and planned contracts element by element.
2. Copy semantic structure, ordering, attributes, classes, bindings, and accessibility unchanged where valid.
3. Change only imports/selectors/bindings required by verified migrated child or boundary contracts.
4. Account for every source child selector and report any unavailable child instead of stubbing it.

## 8. Checks & Verification

Diff source versus target structure; verify every expression names an available member and every child selector maps to an already-compiled contract. Do not run or claim node compilation.

## 9. Return Condition

Return `COMPLETED` with files/evidence only when the template is faithful and internally accounted for; otherwise `BLOCKED` with the exact missing contract/source.
