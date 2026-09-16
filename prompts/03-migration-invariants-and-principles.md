# Prompt Module 03: Migration Invariants & Core Principles

> **Source**: Sections 4, 18 (Traversal Invariants), 19, 20, 21, 22, 23, 24, 25 of `codex_storybook_agent_system_prompt_v3.txt`  
> **Target Implementer**: GPT-5.6 Sol Medium / OpenCode implementer (~100K token context window)  
> **Repository**: `StoryBook-Test`

---

## 1. Top-Level Component Generator Invariant

The repository already provides an automated component generator:
```bash
npm run generate:component <component-name>
```

### The Generator Invariant:
- The generator MUST be executed **ONLY ONCE per migration**, specifically for the **TOP-LEVEL benchmark target**.
- Example: If migrating `CustomerPage` containing `CustomerHeader`, `CustomerTable`, `CustomerRow`, and `StatusBadge`:
  ```bash
  npm run generate:component customer-page
  ```
- **STRICT FORBIDDEN ACTION**:  
  **DO NOT** invoke `npm run generate:component` separately for child components (`customer-header`, `customer-table`, `customer-row`, `status-badge`).
- Child components must be copied and adapted into the UI tree under `src/components/<component-name>/ui/` according to the migration plan. They are not separate benchmark roots.

---

## 2. Mandatory Component Traversal Invariant

> **THE GOLDEN MIGRATION RULE**:  
> **DISCOVER TOP-DOWN. IMPLEMENT BOTTOM-UP.**

```text
Discovery / Scanning Order:         Parent ──► Child ──► Grandchild  (Top-Down)
Creation / Adaptation Order:       Grandchild ──► Child ──► Parent   (Bottom-Up Post-Order)
```

### A. Discovery / Scanning Order (Parent to Child)
- Start from the requested top-level benchmark target and recursively scan rendered descendants and their dependencies.
- Scanning preserves:
  - Parent-child tree hierarchies
  - Depth and conditional rendering branches
  - Shared sub-tree descendants
  - Dependency relationships
- *Rationale*: Only top-down scanning discovers what the parent actually renders in the workload.

### B. Creation / Adaptation Order (Child to Parent)
- Implementation and adaptation MUST proceed using **strict post-order traversal** (deepest leaf nodes first, moving upward to parents).
- For a tree:
  ```text
  Root
  ├── ChildA
  │   └── GrandchildA1
  └── ChildB
  ```
  Implementation order MUST BE:
  ```text
  1. GrandchildA1
  2. ChildA
  3. ChildB
  4. Root (Scaffolded root UI component migrated last)
  ```
- *Rationale*: A parent component cannot have a stable, verifiable template and type contract until all of its child components already expose stable, adapted benchmark contracts.

### C. Adapt During Creation (Never Bulk-Convert)
- **FORBIDDEN PATTERN**:
  ```text
  Copy entire component tree ──► Try to dumbify entire tree later (DANGEROUS)
  ```
- **MANDATORY PATTERN**:
  ```text
  For each node (in post-order):
    1. Copy node faithfully
    2. Adapt template and styles
    3. Ensure required child nodes already exist and compile
    4. Adapt production dependencies (NgRx, services, router, env)
    5. Establish stable @Input()/@Output() contracts
    6. Compile and verify this node
    7. Record any deviations in decisions.md
    8. Only then move upward to its parent
  ```

---

## 3. Fidelity Classification of Dependencies

Classify every dependency encountered in the legacy component into one of four categories:

| Category | Description | Action | Examples |
| :--- | :--- | :--- | :--- |
| **Presentation Dependency** | Visual rendering logic, styling, formatting | **Keep / Copy faithfully** | Child components, pipes, directives, formatters, Less/CSS rules, icons, SVGs |
| **Data Dependency** | Data consumed by the template | **Convert to explicit `@Input()` contract** | Store selectors (`select(...)`), API loaded models, configuration payloads |
| **Application Control Dependency** | Actions that trigger side effects or business mutations | **Move to `@Output()` or harness action** | Store dispatches (`dispatch(...)`), navigation calls, API mutations, global dialogs |
| **Environment Dependency** | Global context or infrastructure state | **Replace with controlled benchmark value / input** | Current user session, permission flags, feature flags, active locale, route params |

---

## 4. Nested Smart Component Rule

Do NOT automatically flatten or turn every nested smart component into an independent public benchmark API.

**Preferred Architecture**:
```text
Story / Playwright
      ↓
Harness Container (`<name>.container.ts`)
      ↓
Top-Level Dumb Boundary (`<name>.component.ts`)
      ↓
Preserved Internal UI Tree (Child components retain structure & relationships)
```

- If an internal child component can remain structurally intact once its services/NgRx calls are converted to internal inputs or mocked providers, keep it intact.
- Do not expose unnecessary internal child contracts up to the top-level Storybook harness if they can be satisfied internally.

---

## 5. Shared Component Reuse

- Before copying a common or shared component, inspect whether a migrated benchmark version already exists in `StoryBook-Test` (e.g., in `src/components/` or a shared UI folder).
- **Rule of Reuse**:
  - Prefer reuse if visual and behavioral fidelity is 100% preserved.
  - Do NOT blindly duplicate shared components.
  - Do NOT force reuse if the existing migrated version differs materially from what the legacy component requires.

---

## 6. Incremental Validation Checkpoints

Validation is not a single end-of-process step. Every stage must validate its work incrementally:

```text
1. After generator scaffold ──────────► Verify folder layout & registry
2. After EACH child node adaptation ──► Compile & type-check node
3. After full UI tree migration ──────► Angular build / type-check of src/components/<name>/ui
4. After data factory creation ───────► Validate datasets against Zod schema
5. After harness container wiring ────► Verify double rAF paint & ready state
6. After Storybook stories wired ─────► Test render in Storybook dev server
7. After Playwright test written ─────► Run single-worker test suite
8. After fidelity validation ─────────► Review parity report & visual capture
```

---

## 7. Decision Logging (`decisions.md`)

Record architectural and behavioral deviations in:
```text
.migrations/<component-name>/logs/decisions.md
```

### Logging Rules:
- Log only **meaningful architectural or behavioral deviations** (e.g., replacing an infinite-scroll service with static list input, removing an unsupported 3rd-party library).
- Do **NOT** bloat logs with trivial import path updates or formatting adjustments.
- Each entry must include:
  1. What changed
  2. Why it changed
  3. Expected impact on visual/benchmark fidelity
  4. Status: Temporary or Accepted

---

## 8. Concurrency & Write Isolation

When a MAIN AGENT delegates to multiple sub-agents:
- Sub-agents may run concurrently **ONLY IF their write scopes are completely disjoint**.
- **Safe**:
  - Subagent A analyzes styles while Subagent B analyzes NgRx store calls (read-only).
  - Subagent A migrates `child-a.component.ts` while Subagent B migrates independent `child-b.component.ts`.
- **FORBIDDEN (Race Condition)**:
  - Two sub-agents editing the same file or modifying `state.json` simultaneously.
- The parent MAIN AGENT is strictly responsible for coordinating writes and integrating outputs.

---

## 9. Source Application Access Rules

- The source legacy Angular application is **external and strictly read-only**.
- If a required source file, asset, or schema is missing:
  - Immediately log a clear missing-input report in `.migrations/<component>/logs/`.
  - **DO NOT hallucinate or guess** business logic or data structures.
  - Stop and flag the blockage in the stage handoff.
