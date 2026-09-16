# Prompt Module 10: Stages 10 & 11 — Fidelity Validation & Repair Agents

> **Source**: Section 18 (Fidelity Validation, Repair) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directories**: `.agents/fidelity-validation/` and `.agents/repair/`

---

## 1. Fidelity Validation Main Agent Specification (`AGENT.md`)

### Purpose
Validates that the migrated component in Storybook represents a faithful, high-fidelity replica of the original legacy Angular component. Performs structured comparison across screenshots, DOM structure, element counts, dimensions, typography, color palettes, and interaction behaviors. Classifies any observed differences and produces a comprehensive parity audit.

### When to Invoke
- After Test Agent has completed (`.migrations/<component>/handoffs/test.md` exists).
- Triggered by: `Use the Fidelity Validation Agent for <component-name>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/fidelity-validation/AGENT.md`
  - `.migrations/<component>/state.json`
  - `.migrations/<component>/logs/decisions.md`
  - Capture artifacts of the legacy component (if available)
- **Optional Context**:
  - `docs/agents/FIDELITY.md`

### Sub-Agents Available (6 Workers)
1. `original-component-capture`
2. `storybook-component-capture`
3. `visual-parity`
4. `dom-parity`
5. `behavior-parity`
6. `theme-parity`

### Parity Audit Dimensions:
- **Visual Capture**: Full-page and component-level screenshot diffing.
- **DOM Parity**: Comparison of rendered HTML hierarchy, tag types, attributes, and class names.
- **Computed Styles**: Font family, font size, line height, colors, padding, margin, borders.
- **Behavioral Parity**: Hover effects, selection states, transitions, click handling.
- **Theme Consistency**: Verification against light/dark mode variables and global CSS tokens.

### Deviation Classification:
Every detected discrepancy is categorized into one of four severity levels:
- `CRITICAL`: Broken layout, missing critical UI elements, unhandled exceptions, rendering crash. Must be repaired.
- `MAJOR`: Noticeable styling or behavioral deviation (e.g. incorrect font size, misaligned column, missing hover style). Must be repaired or formally justified.
- `MINOR`: Sub-pixel alignment differences, slight padding variance (< 2px), subtle color token shift.
- `ACCEPTED`: Intentional deviation necessitated by stripping enterprise boundaries (e.g. static data replacing live WebSocket, mocked dialog). Must be documented in `decisions.md`.

### Required Output Artifacts
Written to `.migrations/<component>/validation/`:
- `parity-report.json`: Machine-readable classification of all visual, DOM, and behavioral checks.
- `fidelity-summary.md`: Executive summary of fidelity score, deviations, and repair recommendations.

### Definition of Done (DoD)
- [ ] Visual screenshots captured and compared against reference baselines.
- [ ] DOM and computed style parity analysis executed.
- [ ] All deviations classified (Critical, Major, Minor, Accepted).
- [ ] Zero unclassified deviations.
- [ ] Handoff written to `.migrations/<component>/handoffs/fidelity-validation.md`.

---

## 2. Fidelity Validation Sub-Agents

- **`original-component-capture.md`**: Captures screenshots, DOM snapshot, and computed styles of the legacy reference component (via headless browser or static fixture).
- **`storybook-component-capture.md`**: Captures identical snapshot artifacts from the migrated Storybook component story.
- **`visual-parity.md`**: Performs pixel-by-pixel visual diff analysis using automated image diffing.
- **`dom-parity.md`**: Compares normalized DOM trees (element tags, nesting, CSS classes, attributes).
- **`behavior-parity.md`**: Tests that standard interactions (expanding nodes, clicking rows) match legacy behavior.
- **`theme-parity.md`**: Validates theme tokens, color palettes, and typography metrics.

---

## 3. Repair Main Agent Specification (`AGENT.md`)

### Purpose
Applies targeted, surgical corrections to address concrete reported failures from any prior stage (TypeScript compilation errors, Storybook build issues, Playwright test timeouts, CDP metric failures, or fidelity regressions).

> **CRITICAL INVARIANT**:  
> The Repair Agent repairs **ONLY concrete reported failures**.  
> Every repair action MUST directly reference an explicit error in a build log, test report, or parity audit.  
> **NEVER** perform speculative refactoring or broad rewrites.

### When to Invoke
- Whenever an earlier stage fails validation or Fidelity Validation flags Critical/Major deviations.
- Triggered by: `Use the Repair Agent for <component-name> to resolve <issue-description>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/repair/AGENT.md`
  - `.migrations/<component>/state.json`
  - Exact error log, test failure trace, or `parity-report.json` indicating the failure
  - Source file(s) identified as the failure root cause
- **Do Not Load by Default**:
  - Unrelated components or stages not touched by the failure.

### Sub-Agents Available (8 Workers)
1. `build-repair`
2. `import-repair`
3. `ui-repair`
4. `styling-repair`
5. `data-repair`
6. `harness-repair`
7. `scenario-repair`
8. `fidelity-repair`

### Responsibilities
- Diagnose the exact root cause of the reported failure.
- Dispatch the narrowest applicable sub-agent to fix the issue.
- Re-run the specific validation command that originally failed to prove the issue is resolved.
- Record the fix in `.migrations/<component>/logs/decisions.md`.

### Non-Responsibilities
- Refactoring code unrelated to the reported failure.
- Redesigning working components.

### Definition of Done (DoD)
- [ ] Root cause identified and documented.
- [ ] Targeted fix applied with minimal surgical code changes.
- [ ] The previously failing build, test, or fidelity check is re-run and passes cleanly.
- [ ] No regression introduced in existing tests.
- [ ] Handoff written to `.migrations/<component>/handoffs/repair-<timestamp>.md`.

---

## 4. Repair Sub-Agents

- **`build-repair.md`**: Resolves Angular compiler (`ngc`), TypeScript (`tsc`), or Less compilation errors.
- **`import-repair.md`**: Fixes broken relative import paths, circular dependencies, or missing module imports.
- **`ui-repair.md`**: Corrects template binding bugs, broken `@Input()`/@Output() wiring, or OnPush change detection glitches.
- **`styling-repair.md`**: Fixes Less compilation errors, broken CSS classes, or missing flexbox/grid layout rules.
- **`data-repair.md`**: Resolves Zod validation failures, generator crashes, or incorrect data types.
- **`harness-repair.md`**: Fixes container ready-state timing, double rAF paint synchronization, or story rendering errors.
- **`scenario-repair.md`**: Repairs brittle Playwright locators, race conditions, or benchmark interaction timeouts.
- **`fidelity-repair.md`**: Adjusts specific CSS rules or DOM attributes to eliminate Critical/Major fidelity deviations.
