# Router Adaptation Sub-Agent

## 1. Goal

Replace route-derived state with controlled typed inputs and navigation commands with typed intent outputs.

## 2. When Parent Should Use It

Use when the current node reads `ActivatedRoute`, router state, params/query/data, or calls navigation APIs.

## 3. Inputs

- Assigned node files and cited route/navigation source
- Approved route input and navigation output contracts
- Evidence for defaults, parsing, destination shape, and timing

## 4. Outputs

- Assigned current-node router-boundary edits
- Return mapping of every route read/subscription/navigation to its controlled contract

## 5. Allowed Scope

Write only parent-assigned current-node TypeScript/template portions; read directly referenced route types/constants.

## 6. Forbidden Scope

Angular Router/ActivatedRoute retention, real navigation, fabricated route defaults, harness/story work, other nodes, state/logs/handoff.

## 7. Procedure

1. Inventory params, query, data, subscriptions, snapshots, URL-derived computations, and navigations.
2. Replace reads with approved typed inputs while preserving parsing and presentation timing.
3. Emit approved minimal navigation intents instead of calling the router.
4. Remove unused router imports and preserve local UI state around navigation requests.

## 8. Checks & Verification

Search assigned targets for router APIs; account for each source occurrence and verify contract types, destination payloads, and template bindings.

## 9. Return Condition

Return `COMPLETED` with zero unexplained router coupling; otherwise `BLOCKED` with the missing route or destination evidence.
