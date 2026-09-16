# Prompt Module 05: Stage 02 — Source Analysis Agent

> **Source**: Section 18 (Source Analysis) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directory**: `.agents/source-analysis/`  
> **Subagents Directory**: `.agents/source-analysis/subagents/`

---

## 1. Source Analysis Main Agent Specification (`AGENT.md`)

### Purpose
Performs a thorough, primarily **read-only** architectural inspection of the target legacy component and its entire recursively rendered child tree. Classifies all dependencies (presentation, data, application control, environment) and maps the rendering hierarchy so that downstream planning and migration agents do not need to rediscover the architecture.

> **CRITICAL INVARIANT**:  
> Source analysis is strictly **read-only** with respect to the legacy application. It discovers dependencies **TOP-DOWN** from parent to child.

### When to Invoke
- When initiating the migration of a specific top-level Angular component.
- Triggered by the human operator: `Use the Source Analysis Agent for <component-name>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/source-analysis/AGENT.md`
  - `.migrations/<component>/state.json`
  - Path to target legacy component source directory
- **Optional Context**:
  - `docs/agents/COMPONENT_TREE_MIGRATION.md`
  - `docs/agents/COMPONENT_BOUNDARIES.md`
- **Do Not Load by Default**:
  - Unrelated components, other main agents, or downstream test/repair prompts.

### Sub-Agents Available
1. `component-tree-analyzer`
2. `smart-dependency-analyzer`
3. `child-component-analyzer`
4. `ngrx-dependency-analyzer`
5. `service-dependency-analyzer`
6. `input-output-analyzer`
7. `style-dependency-analyzer`
8. `shared-dependency-analyzer`

### Responsibilities
- Recursively discover every rendered child component, directive, and pipe in the hierarchy.
- Identify all NgRx selectors, dispatch calls, effects, and actions.
- Audit all injected services (HTTP, business logic, modal/dialog controllers, notification services).
- Document all `@Input()` properties, `@Output()` event emitters, template bindings, and local state.
- Inspect Less/Sass/CSS dependencies, theme mixins, and encapsulated styles.
- Produce structured JSON analysis artifacts in `.migrations/<component>/analysis/`.

### Non-Responsibilities
- Modifying legacy source code.
- Writing or copying Angular components into `src/components/`.
- Generating Storybook stories or Playwright specs.

### Required Output Artifacts
Written to `.migrations/<component>/analysis/`:
- `component-tree.json`: Hierarchical parent-child tree structure with depth and conditional flags.
- `dependencies.json`: Comprehensive inventory of all imports, services, pipes, and directives.
- `smart-dependencies.json`: Classification of application boundaries (NgRx, services, router, env).
- `summary.md`: Human-readable architectural brief summarizing complexity and fidelity risks.

### Definition of Done (DoD)
- [ ] Complete rendering tree mapped down to leaf primitives.
- [ ] Every dependency classified as Presentation, Data, Application Control, or Environment.
- [ ] Asynchronous rendering patterns, `async` pipe bindings, and lifecycle hooks documented.
- [ ] Fidelity risks and missing source files explicitly cataloged.
- [ ] Handoff written to `.migrations/<component>/handoffs/source-analysis.md`.

---

## 2. Sub-Agent Specifications

### A. `component-tree-analyzer.md`
- **Goal**: Scan template and TypeScript metadata top-down to construct the full parent-to-child component hierarchy.
- **Inputs**: Root component TypeScript and HTML template files.
- **Outputs**: `component-tree.json` (node names, selectors, child nodes, conditional `*ngIf`/`*ngSwitch` status).
- **Procedure**: Parse template selectors -> Resolve component definitions -> Recursively scan each child -> Output structured tree.
- **Checks**: Ensure no child component selector is left unmapped.

### B. `smart-dependency-analyzer.md`
- **Goal**: High-level classification of external boundaries across all discovered components.
- **Inputs**: Discovered component files from `component-tree.json`.
- **Outputs**: `smart-dependencies.json` classifying lines of code coupling components to the external app.
- **Checks**: Map each dependency to Presentation, Data, Application Control, or Environment.

### C. `child-component-analyzer.md`
- **Goal**: Deep dive into individual child component nodes to inspect local state and template complexity.
- **Inputs**: Specific child component files assigned by parent.
- **Outputs**: Detailed per-component metadata (standalone status, change detection strategy, complexity score).

### D. `ngrx-dependency-analyzer.md`
- **Goal**: Find every `Store`, `select(...)`, `dispatch(...)`, and action creator used in the tree.
- **Inputs**: Component `.ts` files.
- **Outputs**: Inventory of selected state shapes and dispatched action payloads for conversion to `@Input()` and `@Output()`.

### E. `service-dependency-analyzer.md`
- **Goal**: Audit constructor-injected services to distinguish between data providers (HTTP) and UI helper services.
- **Inputs**: Component constructor parameters and `@Inject()` decorators.
- **Outputs**: List of services with recommended replacement strategy (mock, input conversion, or retain if pure helper).

### F. `input-output-analyzer.md`
- **Goal**: Extract existing `@Input()` and `@Output()` definitions, types, and defaults for each node in the tree.
- **Inputs**: Component TypeScript files.
- **Outputs**: Structured map of public component interfaces.

### G. `style-dependency-analyzer.md`
- **Goal**: Inspect `@Component` styles and `styleUrls`. Detect imported Less/Sass mixins, global class references, and CSS variable usages.
- **Inputs**: Component `.less`, `.scss`, `.css` files.
- **Outputs**: Report on missing stylesheets, mixin dependencies, and theme variable requirements.

### H. `shared-dependency-analyzer.md`
- **Goal**: Check external library dependencies (e.g. Lodash, RxJS operators, Material, CDK) and existing shared components in `src/components/`.
- **Inputs**: Component imports list.
- **Outputs**: List of existing shared candidates suitable for reuse vs. new dependencies required.
