# Theme Migration Sub-Agent

## 1. Goal

Reproduce required legacy palettes, typography, elevation, and light/dark theme tokens in the harness.

## 2. When Parent Should Use It

Use when legacy components consume theme variables or CSS custom properties not already available globally.

## 3. Inputs

- Legacy theme sources and token usages
- Existing harness theme files
- Exact assigned target files

## 4. Outputs

- Theme token files and wiring within scope
- Structured return: mapped tokens, unresolved tokens, files changed, checks, deviations

## 5. Allowed Scope

Assigned files under `src/styles/themes/` and, only if assigned, `.storybook/preview.ts` or a global style entrypoint.

## 6. Forbidden Scope

Legacy writes, component migration, dependencies, state, handoffs, and files outside the assignment.

## 7. Procedure

1. Trace every required token to its legacy definition.
2. Preserve names and values where the harness supports them.
3. Add minimal Less/CSS-variable definitions and assigned global wiring.
4. Report any necessary deviation rather than silently substituting values.

## 8. Checks & Verification

Compile Less, search for unresolved required tokens, and verify both applicable theme modes.

## 9. Return Condition

Return status plus mapped/unresolved token lists, changed files, validation evidence, and deviations for parent integration.
