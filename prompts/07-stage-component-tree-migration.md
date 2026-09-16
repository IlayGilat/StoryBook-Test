# Prompt Module 07: Stage 05 — Component Tree Migration Agent

> **Source**: Section 18 (Component Tree Migration) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directory**: `.agents/component-tree-migration/`  
> **Subagents Directory**: `.agents/component-tree-migration/subagents/`

---

## 1. Component Tree Migration Main Agent Specification (`AGENT.md`)

### Purpose
Migrates the planned component tree in strict **CHILD-TO-PARENT (bottom-up post-order)** sequence. Converts legacy Angular code coupled to enterprise state/services into standalone, benchmark-compatible presentational components (`ChangeDetectionStrategy.OnPush`, Less styles). Combines faithful structural and visual copying with surgical application-boundary adaptation.

> **CRITICAL INVARIANT**:  
> **DISCOVER TOP-DOWN. IMPLEMENT BOTTOM-UP.**  
> Deepest leaf children are migrated, adapted, and compiled FIRST.  
> The scaffolded top-level root component UI (`src/components/<component>/ui/<component>.component.ts`) is migrated LAST.

### When to Invoke
- After Component Scaffold has completed (`.migrations/<component>/handoffs/component-scaffold.md` exists).
- Triggered by: `Use the Component Tree Migration Agent for <component-name>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/component-tree-migration/AGENT.md`
  - `.migrations/<component>/state.json`
  - `.migrations/<component>/plan/migration-plan.md`
  - `.migrations/<component>/plan/file-plan.json`
  - `.migrations/<component>/analysis/component-tree.json`
  - Legacy source files of current target node being migrated
- **Optional Context**:
  - `docs/agents/COMPONENT_TREE_MIGRATION.md`
  - `docs/agents/COMPONENT_BOUNDARIES.md`
- **Do Not Load by Default**:
  - Other main agents, future stage prompts, or raw legacy files outside current node sub-tree.

### Sub-Agents Available (13 Specialized Workers)
1. `template-migration`
2. `component-logic-migration`
3. `child-component-migration`
4. `input-output-adaptation`
5. `ngrx-adaptation`
6. `service-adaptation`
7. `router-adaptation`
8. `environment-adaptation`
9. `local-state-adaptation`
10. `side-effect-adaptation`
11. `pipe-directive-migration`
12. `style-migration`
13. `node-compilation-verification`

---

## 2. The Mandatory Node Migration Loop

For **EACH component node** in the post-order sequence (from deepest leaf child to root):

```text
1. Copy the source implementation faithfully into target UI directory
2. Copy / adapt its HTML template
3. Copy / adapt its Less/CSS styles
4. Ensure all required child components of this node already exist and compile
5. Adapt production dependencies according to file-plan.json
6. Establish stable @Input() / @Output() / local-state contracts
7. Compile and type-check this specific node
8. Record any deviations in .migrations/<component>/logs/decisions.md
9. Only when this node passes compilation, proceed upward to its parent
```

> **RULE**: A parent component MUST NOT be finalized until all of its required child components expose stable, compiled contracts.

---

## 3. Application Boundary Adaptation Patterns

Replace enterprise production boundaries with pure presentational patterns:

| Production Pattern in Legacy Component | Target Benchmark Pattern in Migrated Component |
| :--- | :--- |
| `this.store.select(selector)` | `@Input() propertyName: Type;` |
| `this.store.dispatch(new Action(...))` | `@Output() actionEvent = new EventEmitter<Payload>();` |
| `this.dataService.fetchItems()` | `@Input() items: ItemType[] = [];` |
| `this.mutationService.update(id, data)` | `@Output() updateItem = new EventEmitter<{id, data}>();` |
| `this.route.paramMap.subscribe(...)` | `@Input() routeId: string;` |
| `this.featureFlagService.isEnabled('foo')` | `@Input() featureFooEnabled = true;` |
| `this.authService.currentUser$` | `@Input() currentUser: UserProfile;` |
| `environment.apiUrl` | Config `@Input()` or local benchmark default |

---

## 4. What to Preserve vs. What NOT to Do

### What to Preserve Faithfully:
- HTML and DOM structure, nesting, and attributes.
- CSS/Less class names, selectors, animations, and transitions.
- Component composition hierarchy.
- Pipes, directives, formatters, and pure helper functions.
- Rendering calculations, getter properties, and local presentation state.
- Component-level interactions (hover states, expansion/collapsing, tab selections).

### What NOT to Do:
- **DO NOT** redesign markup or templates to simplify migration.
- **DO NOT** flatten the component tree unnecessarily.
- **DO NOT** replace real child components with dummy placeholders when the real child can be migrated.
- **DO NOT** rewrite working rendering algorithms from scratch.
- **DO NOT** migrate the root component before all child components are verified.
- **DO NOT** leave unresolved production imports (`@ngrx`, enterprise services) in migrated files.
- **DO NOT** scaffold child components as separate benchmark roots.

---

## 5. Node-Level Validation Checklist

After completing each component node:
1. [ ] Check TypeScript compilation: No unresolved imports or missing type definitions.
2. [ ] Check Standalone imports: Standalone component imports array contains all required child components, pipes, and directives.
3. [ ] Check Change Detection: `changeDetection: ChangeDetectionStrategy.OnPush` configured.
4. [ ] Check Boundary removal: Zero references to legacy store, effects, or HTTP services.
5. [ ] Check Less compilation: Stylesheet compiles without unresolved variables or mixins.

---

## 6. Definition of Done (DoD)
- [ ] Every planned child component migrated in post-order before its parent.
- [ ] Top-level root UI component (`src/components/<component>/ui/<component>.component.ts`) migrated last.
- [ ] All components in `src/components/<component>/ui/` compile cleanly under Angular TypeScript compiler.
- [ ] All enterprise production dependencies stripped and converted to `@Input()` / `@Output()`.
- [ ] Architectural and behavioral deviations documented in `decisions.md`.
- [ ] Handoff written to `.migrations/<component>/handoffs/component-tree-migration.md`.

---

## 7. Sub-Agent Detailed Roles

- **`template-migration.md`**: Copies HTML template faithfully, adjusts binding syntax if necessary, ensures child selectors match.
- **`component-logic-migration.md`**: Adapts TypeScript class, lifecycles (`ngOnInit`, `ngOnChanges`), and local rendering state.
- **`child-component-migration.md`**: Manages the placement and wiring of child components under the parent's directory.
- **`input-output-adaptation.md`**: Wires explicit `@Input()` and `@Output()` properties.
- **`ngrx-adaptation.md`**: Strips NgRx `Store`, actions, selectors, and dispatchers.
- **`service-adaptation.md`**: Replaces backend services with explicit inputs or lightweight UI mocks.
- **`router-adaptation.md`**: Replaces `ActivatedRoute` and `Router` with input parameters and output navigation events.
- **`environment-adaptation.md`**: Inlines or parameterizes `environment.*` variables.
- **`local-state-adaptation.md`**: Preserves local UI state (open/closed accordion, selected row) without app store dependencies.
- **`side-effect-adaptation.md`**: Converts side effects (alerts, analytics) into emitted events.
- **`pipe-directive-migration.md`**: Migrates custom pipes and directives used by this node.
- **`style-migration.md`**: Copies Less/CSS, converts relative asset URLs, checks theme token mappings.
- **`node-compilation-verification.md`**: Runs isolated TypeScript and Angular template compiler check on the node.
