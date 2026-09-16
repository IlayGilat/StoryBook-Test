# NgRx Dependency Analyzer Sub-Agent

## 1. Goal

Find and describe every NgRx store read, selector, dispatch, action, and observable state dependency in assigned nodes.

## 2. When Parent Should Use It

Use when imports, injections, decorators, or templates indicate NgRx coupling.

## 3. Inputs

- Assigned component TypeScript/templates
- Directly referenced selectors, actions, and model definitions needed to determine shapes
- Node identifiers

## 4. Outputs

- Structured findings: node, selector/state shape, dispatch/action payload, async/template consumption, evidence, uncertainty

## 5. Allowed Scope

Read assigned legacy components and directly referenced NgRx declarations; return findings only.

## 6. Forbidden Scope

Executing the legacy app, editing source, choosing final input/output APIs, installing NgRx, writing artifacts/state/handoffs.

## 7. Procedure

1. Locate `Store` injection and all `select`, `dispatch`, selector, and action references.
2. Trace types/defaults and template consumption as far as available source permits.
3. Record timing, subscriptions, `async` use, and payload construction.
4. Flag unresolved inferred shapes instead of fabricating them.

## 8. Checks & Verification

Search assigned files for NgRx imports and common store operations; account for every match in findings or an explicit non-runtime exclusion.

## 9. Return Condition

Return structured status, complete inventory, files searched, unresolved types, and verification result.
