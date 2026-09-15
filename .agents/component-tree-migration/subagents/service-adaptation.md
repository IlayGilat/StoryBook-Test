# Service Adaptation Sub-Agent

## 1. Goal

Replace assigned application service reads with typed inputs and commands with typed outputs while preserving presentation behavior.

## 2. When Parent Should Use It

Use when the current node depends on backend, query, mutation, auth, permission, or other application services.

## 3. Inputs

- Assigned node files and directly cited service methods/types
- Planned dependency treatment and approved contract definitions
- Source timing, loading/error behavior, and command payload evidence

## 4. Outputs

- Assigned current-node service-boundary edits
- Return map of injections/calls/subscriptions/commands to typed contracts and retained local behavior

## 5. Allowed Scope

Write only assigned current-node files; read only directly referenced services/models necessary to establish exact behavior.

## 6. Forbidden Scope

HTTP/backend calls, service mocks with fabricated behavior, silent no-ops, harness/data work, unrelated services/nodes, state/logs/handoff.

## 7. Procedure

1. Account for service injection, read streams/promises, mutation calls, and template-visible state.
2. Convert data/state reads to approved typed inputs, retaining state distinctions and timing semantics.
3. Convert commands to minimal typed outputs while retaining confirmations and local presentation state.
4. Remove unused service imports and report any unplanned side effect.

## 8. Checks & Verification

Search target files for assigned service/import remnants, verify each call has a planned replacement, and validate payload/type agreement without `any`.

## 9. Return Condition

Return `COMPLETED` with complete replacement evidence; otherwise `BLOCKED` on missing response/payload/timing evidence.
