# Prompt Module 11: Helper Documentation & Reusable Skills

> **Source**: Sections 10, 11 of `codex_storybook_agent_system_prompt_v3.txt`  
> **Target Directories**: `docs/agents/` and `.agents/skills/`

---

## 1. Helper Documentation Specifications (`docs/agents/`)

Helper documentation files provide durable reference guides for the migration agent system without requiring agents to load them into context on every turn.

Create the following 6 documents:

### A. `docs/agents/WORKFLOW.md`
- **Purpose**: Master walkthrough for the human operator and implementer model.
- **Contents**:
  - Step-by-step sequence of all 11 Main Agents from Bootstrap to Repair.
  - CLI invocation commands for each stage (e.g. `Use the Source Analysis Agent for <component>`).
  - Expected input and output artifacts per stage.
  - How to resume a interrupted migration using `.migrations/<component>/state.json`.

### B. `docs/agents/MIGRATION_ARTIFACTS.md`
- **Purpose**: Schema and directory layout reference for `.migrations/<component>/`.
- **Contents**:
  - Detailed format of `state.json`, `component-tree.json`, `dependencies.json`, `smart-dependencies.json`.
  - Format of `migration-plan.md`, `dumb-boundary.json`, `data-contract.json`, `file-plan.json`.
  - Conventions for `decisions.md`, `build-report.md`, `parity-report.json`.
  - Standard template for stage handoffs (`handoffs/<stage>.md`).

### C. `docs/agents/FIDELITY.md`
- **Purpose**: Reference manual for measuring and validating visual and behavioral parity.
- **Contents**:
  - Measurement dimensions: visual screenshots, normalized DOM comparison, computed styles, behavioral interactions, theme tokens.
  - Deviation severity criteria: Critical, Major, Minor, Accepted.
  - Thresholds for automated image diffing and tolerance levels.
  - Procedures for capturing baselines from external legacy applications.

### D. `docs/agents/COMPONENT_TREE_MIGRATION.md`
- **Purpose**: Practical implementation guide for child-to-parent post-order component migration.
- **Contents**:
  - Deep-dive into the "Discover Top-Down, Implement Bottom-Up" invariant.
  - Post-order traversal algorithms and visual execution examples.
  - Step-by-step guide for migrating a single node: faithful copy -> template adapt -> style adapt -> dependency stripping -> node compilation check.
  - Isolation and prevention of cascading compiler errors.

### E. `docs/agents/COMPONENT_BOUNDARIES.md`
- **Purpose**: Code transformation catalog for converting enterprise Angular code to pure presentation.
- **Contents**:
  - NgRx Store removal patterns: `select()` to `@Input()`, `dispatch()` to `@Output()`.
  - Service decoupling: HTTP data services to inputs, mutation services to output events.
  - Router decoupling: `ActivatedRoute` params to `@Input()`, `Router.navigate()` to `@Output()`.
  - Environment parameterization and feature flag handling.
  - Preserving local presentation state while removing app-level state stores.

### F. `docs/agents/TROUBLESHOOTING.md`
- **Purpose**: Diagnostic playbook for common build, Storybook, and Playwright failures.
- **Contents**:
  - Resolving common TypeScript and Less compiler errors.
  - Storybook rendering errors (missing dependencies, decorator issues, unhandled rejections).
  - Playwright test issues (locator timeouts, ready-state race conditions, worker concurrency issues).
  - Memory leak diagnosis during 100k item stress tests.

---

## 2. Reusable Skills Specifications (`.agents/skills/`)

### Standard Skill Schema
Every skill must be placed in `.agents/skills/<skill-name>/SKILL.md` and strictly include:
1. **When to use**: Concrete trigger conditions.
2. **Inputs**: Required parameters, file paths, and context.
3. **Outputs**: Concrete file modifications or generated artifacts.
4. **Procedure**: Step-by-step mechanical algorithm.
5. **Constraints**: What the skill is forbidden from doing.
6. **Stop conditions**: Clear criteria for concluding execution.

### The 13 Reusable Migration Skills:

| Skill Name | Purpose | When to Use |
| :--- | :--- | :--- |
| `inspect-angular-component` | Parses a single Angular component's TypeScript, template, and styles to extract metadata | Source Analysis & Component Migration |
| `build-component-tree` | Recursively walks parent-child template references to construct a complete hierarchical tree | Source Analysis |
| `extract-angular-dependencies` | Audits imports, injected services, pipes, directives, and packages | Source Analysis |
| `classify-smart-dependencies` | Categorizes dependencies into Presentation, Data, Application Control, or Environment | Source Analysis & Planning |
| `copy-angular-ui-tree` | Faithfully copies component files from source to destination preserving directory structure | Planning & Tree Migration |
| `convert-smart-to-dumb` | Applies transformation recipes to convert store/service calls to inputs and outputs | Component Tree Migration |
| `derive-data-contract` | Analyzes component template bindings to generate complete TypeScript and Zod data contracts | Migration Planning & Data |
| `generate-benchmark-data` | Implements deterministic pseudo-random data generators using `src/benchmark/data-generator/` | Data Agent |
| `create-benchmark-harness` | Scaffolds and wires the smart container extending `BaseBenchmarkContainerComponent` | Harness Agent |
| `create-storybook-story` | Generates Storybook CSF3 stories targeting the benchmark container | Harness Agent |
| `create-playwright-scenario` | Generates Playwright test specs and interaction scenarios with CDP metrics | Test Agent |
| `validate-component-fidelity` | Runs image diffing, DOM tree comparison, and style audits | Fidelity Validation |
| `repair-migration` | Applies surgical fixes to reported compilation, runtime, or test errors | Repair Agent |
