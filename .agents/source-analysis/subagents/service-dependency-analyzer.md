# Service Dependency Analyzer Sub-Agent

## 1. Goal

Audit injected services and tokens, their calls, returned data, and side effects across assigned nodes.

## 2. When Parent Should Use It

Use when constructors, `inject()`, `@Inject()`, providers, or method calls reveal service coupling.

## 3. Inputs

- Assigned component files and node identifiers
- Direct service interfaces/implementations needed to classify observed calls
- Known analysis boundaries

## 4. Outputs

- Structured findings: service/token, node, call, data/side effect, category, candidate replacement, evidence, uncertainty

## 5. Allowed Scope

Read assigned legacy components and only directly referenced service declarations; return findings only.

## 6. Forbidden Scope

Running external effects, editing providers/source, mocking or implementing replacements, artifacts, state, and handoffs.

## 7. Procedure

1. Inventory constructor, field, and token injection.
2. Trace each used member and observable/promise result.
3. Distinguish pure UI helpers, data providers, application control, and environment access.
4. Record candidate retain/input/output/mock treatment as analysis, not a final design.

## 8. Checks & Verification

Account for every injection and call site in assigned files; cite evidence and flag unavailable implementations.

## 9. Return Condition

Return structured status, findings, searched files, missing definitions, and verification result without edits.
