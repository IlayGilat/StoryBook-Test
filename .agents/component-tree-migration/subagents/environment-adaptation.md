# Environment Adaptation Sub-Agent

## 1. Goal

Replace assigned environment, feature-flag, permission, or machine-dependent configuration reads with deterministic typed controlled values.

## 2. When Parent Should Use It

Use when analysis or the file plan identifies environment/configuration coupling in the current node.

## 3. Inputs

- Assigned node files and cited environment/config declarations
- Approved controlled-value contracts and source branch/default semantics
- Template/rendering evidence for each value

## 4. Outputs

- Assigned current-node environment-boundary edits
- Return map of each source configuration read to its controlled typed value and covered branches

## 5. Allowed Scope

Write only assigned current-node TypeScript/template portions; read cited declarations required to identify exact types/branches.

## 6. Forbidden Scope

Machine-dependent reads, secret values, fabricated production defaults, global config/harness/data changes, other nodes, state/logs/handoff.

## 7. Procedure

1. Inventory environment, token, flag, permission, and global reads.
2. Replace each with the approved typed input or node-local controlled value.
3. Preserve enabled/disabled and permission-denied rendering branches.
4. Remove obsolete imports and report any value lacking deterministic treatment.

## 8. Checks & Verification

Search target files for environment/config remnants and verify every planned branch remains expressible through exact typed contracts.

## 9. Return Condition

Return `COMPLETED` with complete source-to-control mapping; otherwise `BLOCKED` on missing type/default/branch evidence.
