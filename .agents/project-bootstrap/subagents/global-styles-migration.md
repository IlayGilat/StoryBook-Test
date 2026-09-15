# Global Styles Migration Sub-Agent

## 1. Goal

Migrate required resets, typography, utilities, and global layout styles without importing legacy app-shell behavior.

## 2. When Parent Should Use It

Use when target fidelity depends on shared legacy styles absent from the harness.

## 3. Inputs

- Identified legacy global style entrypoints and imports
- Relevant harness style configuration
- Assigned target files

## 4. Outputs

- Minimal global style changes
- Structured return: retained rules, excluded app-shell rules, files changed, checks, deviations

## 5. Allowed Scope

Assigned `src/styles/` files and, if explicitly assigned, `.storybook/preview.ts` or the `angular.json` styles array.

## 6. Forbidden Scope

Component-specific styles, legacy writes, dependency installation, state, handoffs, and unassigned configuration.

## 7. Procedure

1. Follow the legacy import graph for required shared rules.
2. Separate visual primitives from router and app-shell layout.
3. Copy or adapt only required rules while preserving selectors and values.
4. Wire the entrypoint once and record exclusions.

## 8. Checks & Verification

Run the assigned style/Storybook compilation and check for duplicate imports, unresolved Less references, and global regressions.

## 9. Return Condition

Return structured status, changed files, retained/excluded rule summary, validation, and risks; leave integration to the parent.
