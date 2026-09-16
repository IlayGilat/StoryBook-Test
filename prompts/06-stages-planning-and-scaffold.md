# Prompt Module 06: Stages 03 & 04 — Migration Planning & Component Scaffold

> **Source**: Sections 4, 18 (Migration Planning, Component Scaffold) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directories**: `.agents/migration-planning/` and `.agents/component-scaffold/`

---

## 1. Migration Planning Main Agent Specification (`AGENT.md`)

### Purpose
Translates the findings from Source Analysis into an actionable, deterministic blueprint. Defines the top-level dumb boundary, calculates the exact child-to-parent post-order implementation sequence, specifies application boundary adaptations, and generates the file-by-file migration plan.

### When to Invoke
- After Source Analysis has successfully completed (`.migrations/<component>/handoffs/source-analysis.md` exists).
- Triggered by: `Use the Migration Planning Agent for <component-name>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/migration-planning/AGENT.md`
  - `.migrations/<component>/analysis/component-tree.json`
  - `.migrations/<component>/analysis/smart-dependencies.json`
- **Optional Context**:
  - `docs/agents/COMPONENT_BOUNDARIES.md`
- **Do Not Load by Default**:
  - Source code files not directly relevant to planning decisions.

### Sub-Agents Available
1. `dumb-boundary-planner`
2. `component-tree-planner`
3. `shared-component-reuse-planner`
4. `data-contract-planner`
5. `migration-manifest-generator`

### Required Output Artifacts
Written to `.migrations/<component>/plan/`:
- `migration-plan.md`: Human-readable architecture guide explaining boundary decisions and rationale.
- `dumb-boundary.json`: Explicit contract of the root presentational boundary (`@Input()` and `@Output()` specifications).
- `data-contract.json`: Data shape schemas required by the root component and internal nodes.
- `file-plan.json`: Exact ordered list of files to copy, adapt, or create, including post-order implementation sequence.

### Definition of Done (DoD)
- [ ] Explicit dumb boundary established for top-level component.
- [ ] Child components scheduled in strict post-order traversal (leaf nodes first).
- [ ] All smart dependencies mapped to concrete adaptation strategies (`@Input`, `@Output`, or mock).
- [ ] Shared components to reuse vs. copy explicitly declared.
- [ ] Implementation plan is sufficiently detailed that downstream agents require zero architectural rediscovery.
- [ ] Handoff written to `.migrations/<component>/handoffs/migration-planning.md`.

---

## 2. Migration Planning Sub-Agents

### A. `dumb-boundary-planner.md`
- **Goal**: Establish the external public boundary for the top-level benchmark component.
- **Procedure**: Convert all top-level store selectors to `@Input()` properties -> Convert dispatches/side-effects to `@Output()` event emitters -> Document payload types.

### B. `component-tree-planner.md`
- **Goal**: Compute the strict **bottom-up post-order execution order** for the component tree.
- **Procedure**: Traverse `component-tree.json` -> Produce an ordered array of nodes where every child node strictly precedes its parent.

### C. `shared-component-reuse-planner.md`
- **Goal**: Evaluate which shared components already exist in `StoryBook-Test` and decide whether to reuse them or copy fresh.
- **Procedure**: Match legacy shared dependencies against `src/components/` -> Check compatibility -> Produce reuse decision matrix.

### D. `data-contract-planner.md`
- **Goal**: Design the TypeScript interfaces and Zod schemas needed to generate realistic mock data for the UI tree.
- **Procedure**: Extract model types from legacy state selectors -> Formulate complete data contracts in `data-contract.json`.

### E. `migration-manifest-generator.md`
- **Goal**: Synthesize all planning sub-agent outputs into `file-plan.json` and `migration-plan.md`.
- **Procedure**: Combine file lists, source-to-target path mappings, and ordered tasks into machine-readable JSON and Markdown.

---

## 3. Component Scaffold Main Agent Specification (`AGENT.md`)

### Purpose
Executes repository scaffolding for the top-level benchmark component using the repository's built-in generator script. Validates that the standard 4-folder structure (`ui/`, `data/`, `harness/`, `test/`) is established and registered in the benchmark registry.

> **CRITICAL INVARIANT**:  
> The generator `npm run generate:component <component-name>` MUST be run **ONLY ONCE** for the **TOP-LEVEL BENCHMARK TARGET**.  
> **NEVER** run the generator for child components under that target.

### When to Invoke
- After Migration Planning has completed (`.migrations/<component>/handoffs/migration-planning.md` exists).
- Triggered by: `Use the Component Scaffold Agent for <component-name>`.

### Execution Flow
1. Verify component name format (kebab-case).
2. Execute generator command:
   ```bash
   npm run generate:component <component-name>
   ```
3. Verify created files in `src/components/<component-name>/`:
   - `ui/<component-name>.component.ts`, `.html`, `.less`
   - `data/<component-name>.data.ts`
   - `harness/<component-name>.container.ts`, `<component-name>.stories.ts`
   - `test/<component-name>.spec.ts`, `<component-name>.scenario.ts`
4. Verify registry update in `src/benchmark/registry/component-registry.ts`.
5. Update `.migrations/<component>/state.json`.

### Sub-Agents Available
1. `generator-runner`
2. `folder-structure-verifier`
3. `benchmark-registry-verifier`

### Responsibilities
- Execute the scaffold generator cleanly.
- Verify generated directory layout and benchmark registration.

### Non-Responsibilities
- Copying child components into `ui/`.
- Implementing component logic or adapting templates.
- Writing data generators or test specs.

### Definition of Done (DoD)
- [ ] Top-level benchmark folder `src/components/<component-name>/` created with all 11 scaffold files.
- [ ] Component registered in `component-registry.ts`.
- [ ] No child components scaffolded as separate benchmark roots.
- [ ] Initial scaffold compiles (`npx tsc --noEmit` or Angular check).
- [ ] Handoff written to `.migrations/<component>/handoffs/component-scaffold.md`.

---

## 4. Component Scaffold Sub-Agents

### A. `generator-runner.md`
- **Goal**: Invoke `npm run generate:component <name>` via child process and capture CLI output.
- **Checks**: Ensure process exits with code 0 and no error logs.

### B. `folder-structure-verifier.md`
- **Goal**: Confirm all 11 required files exist under `ui/`, `data/`, `harness/`, and `test/`.
- **Checks**: Verify file names match `<component-name>` conventions.

### C. `benchmark-registry-verifier.md`
- **Goal**: Ensure the new component is correctly imported and registered in the benchmark registry file.
- **Checks**: Inspect `src/benchmark/registry/component-registry.ts` to confirm registration entry.
