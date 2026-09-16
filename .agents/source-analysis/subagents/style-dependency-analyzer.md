# Style Dependency Analyzer Sub-Agent

## 1. Goal

Trace component style files, imports, mixins, global selectors, variables, theme tokens, assets, and encapsulation assumptions.

## 2. When Parent Should Use It

Use for every node with `styles`/`styleUrls` or template classes whose appearance depends on shared styles.

## 3. Inputs

- Assigned component metadata, templates, and style files
- Relevant global/theme entrypoints reached by imports or token definitions

## 4. Outputs

- Structured findings: node, stylesheet graph, mixins/tokens, global classes, assets, encapsulation, missing files, fidelity risks

## 5. Allowed Scope

Read assigned legacy styles and directly resolved imports/assets; return findings only.

## 6. Forbidden Scope

Copying or changing styles/assets, broad legacy scans, component migration, artifacts/state/handoffs.

## 7. Procedure

1. Resolve all component style references and recursive imports.
2. Inventory mixins, variables, CSS custom properties, URLs, fonts, and global-class dependencies.
3. Map template classes to local/global rules and note encapsulation behavior.
4. Report missing imports or ambiguous cascade dependencies exactly.

## 8. Checks & Verification

Ensure every style import and asset URL resolves or is explicitly missing, and every reported token has a definition or gap record.

## 9. Return Condition

Return structured status, dependency graph/findings, missing inputs, files inspected, and verification result.
