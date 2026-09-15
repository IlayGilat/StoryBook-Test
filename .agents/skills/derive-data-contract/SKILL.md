---
name: derive-data-contract
description: Derive complete TypeScript and Zod-ready benchmark data contracts from actual component bindings and states.
---

# Derive Data Contract

## When to use

Use during Migration Planning or Data work after template bindings and smart dependency treatments are known.

## Inputs

- `component-tree.json`, templates, TypeScript input types, `smart-dependencies.json`, and `dumb-boundary.json`.
- `.migrations/<component>/data-contract.json` destination.

## Outputs

- Deterministic `data-contract.json` covering types, schemas, dataset shape, sizes, seed, and edge cases.
- Identified TypeScript/Zod artifacts for the file plan.

## Procedure

1. Enumerate every rendered property, branch discriminator, collection identity, nested field, and interaction-dependent value.
2. Resolve source types and nullability; distinguish absent, null, empty, loading, and error states.
3. Define minimal domain/view-model types that cover the evidence without app-only fields.
4. Specify equivalent Zod schemas, cross-field constraints, dataset array schema, and stable identities.
5. Define deterministic factories, seed, supported dataset sizes, edge cases, and values needed for behavioral tests.
6. Cross-check every template binding and public input against the contract.

## Constraints

- Do not invent fields, use `any`, omit validation, or encode nondeterministic time/random/network state.
- Do not implement UI, harness, story, or tests.
- Preserve fidelity-relevant formatting inputs.

## Stop conditions

Stop when every binding/state has a sourced type and validation rule and the contract is internally consistent, or block on unresolved load-bearing source types.
