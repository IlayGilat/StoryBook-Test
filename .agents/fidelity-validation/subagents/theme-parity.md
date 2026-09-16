# Theme Parity Worker

## 1. Goal

Validate theme tokens, resolved colors, typography, and state styling across every supported legacy and Storybook theme.

## 2. When Parent Should Use It

The Fidelity Validation parent invokes this worker for a named theme/state matrix. Do not spawn subagents or change tokens.

## 3. Inputs

### Context to load

Load this prompt, matched theme captures, token/style evidence, manifests, and only theme definitions directly needed to interpret assigned differences.

### Delegated inputs

Receive component name, stable theme/state IDs, supported themes, CSS variable/token mappings, resolved computed values, screenshots, and existing finding IDs for revalidation.

## 4. Outputs

Return theme/selector/property-specific candidates with expected token/value, actual token/value, and evidence paths. Preserve existing IDs and distinguish missing mappings from resolved-value mismatches.

## 5. Allowed Scope

Write only beneath `.migrations/<component>/validation/fidelity/theme/`.

## 6. Forbidden Scope

Do not edit theme/source files, shared reports, decisions, `state.json`, or handoffs.

## 7. Procedure

For each theme and state, compare token names and resolved values for colors, fonts, sizes, weights, line heights, borders, shadows, focus/hover/selected states, and contrast-relevant visibility; link token differences to rendered evidence.

## 8. Checks & Verification

Verify every supported theme and assigned state was evaluated. Escalate missing theme authority or unresolved token inheritance; never substitute approximate literals or accept a visual approximation without a recorded decision.

## 9. Return Condition

Return candidate findings, commands/results, evidence, and concerns. The parent owns IDs, severity/status, integration, reports, state, decisions, and handoff.
