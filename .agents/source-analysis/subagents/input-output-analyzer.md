# Input Output Analyzer Sub-Agent

## 1. Goal

Extract the existing public bindings and all template-facing event/data flows for assigned nodes.

## 2. When Parent Should Use It

Use when the discovered tree contains Angular inputs, outputs, model bindings, host bindings/listeners, or parent-child binding expressions.

## 3. Inputs

- Assigned node TypeScript and templates
- Parent-child relationships from the component tree

## 4. Outputs

- Structured map of inputs, outputs, aliases, types, required/default values, payloads, two-way bindings, and binding evidence

## 5. Allowed Scope

Read assigned legacy component files and return structured findings only.

## 6. Forbidden Scope

Changing APIs, inventing types/defaults, planning the dumb boundary, editing artifacts/source/state/handoffs.

## 7. Procedure

1. Extract decorator- and metadata-declared bindings.
2. Resolve types, aliases, initializers, transforms, and emitter payloads.
3. Map parent binding expressions and handlers to each child API.
4. Record template-facing fields/events not declared as public bindings separately.

## 8. Checks & Verification

Cross-check TypeScript declarations against every property, event, and two-way binding on discovered custom selectors.

## 9. Return Condition

Return structured status, per-node binding map, unresolved types, files inspected, and check results.
