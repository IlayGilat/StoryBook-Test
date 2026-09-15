# Data Contract Planner Sub-Agent

## 1. Goal

Define complete TypeScript- and Zod-ready data shapes for every planned UI state without inventing source semantics.

## 2. When Parent Should Use It

Use when analyzed inputs, selectors, service results, nested models, loading/error states, or interactions require generated benchmark data.

## 3. Inputs

- Dependency and smart-dependency analysis
- Dumb-boundary draft
- Cited legacy model/type definitions and UI states

## 4. Outputs

- Assigned `plan/data-contract.json` or structured contract fragment
- Structured return: types, fields, constraints, relationships, state variants, evidence, unresolved items, checks

## 5. Allowed Scope

Read required analysis and cited type definitions; write only the assigned data-contract artifact or return data.

## 6. Forbidden Scope

Implementing TypeScript/Zod/factories, fabricating constraints or sample values, component edits, state, and handoffs.

## 7. Procedure

1. Enumerate data consumed by every planned node and interaction.
2. Resolve exact field types, nullability, defaults, identity, relationships, and collections from evidence.
3. Encode loading, empty, populated, error, selection, and other observed states.
4. Express validation-ready constraints and flag unresolved source facts as blockers.

## 8. Checks & Verification

Cross-check every boundary input and internal template field against the contract; detect orphan fields, missing states, and unsupported constraints.

## 9. Return Condition

Return structured status, contract artifact/fragment, coverage report, blockers, and validation result.
