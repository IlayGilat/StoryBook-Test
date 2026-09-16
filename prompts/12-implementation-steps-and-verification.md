# Prompt Module 12: Implementation Roadmap & Final Verification Checklist

> **Source**: Sections 26, 29, 30 of `codex_storybook_agent_system_prompt_v3.txt`  
> **Target Implementer**: GPT-5.6 Sol Medium / OpenCode implementer (~100K token context window)  
> **Repository**: `StoryBook-Test`

---

## 1. Repository Inspection Before Generation

Before creating the agent system files, the implementer model MUST inspect the actual repository implementation as the ultimate source of truth:

```text
docs/BENCHMARKING.md
docs/COMPONENT_GUIDE.md
scripts/generate-component.mjs
scripts/generate-component/
src/benchmark/
existing components under src/components/ (e.g. table, tree-grid)
existing project skills under .agents/skills/
.agents/skills/subagent-driven-development/SKILL.md
existing AGENTS.md or agent conventions
```

### Reconciliation Policy:
If any instruction in the prompt conflicts with working repository mechanics:
1. Preserve the core architectural intent.
2. Follow working repository conventions and code patterns.
3. Document any meaningful differences in the final implementation summary.

---

## 2. Final Deliverables Catalog

The completed agent system must contain all of the following:

1. **System Architecture Root**: `.agents/README.md`
2. **Minimal Root Rules**: Root `AGENTS.md` (tiny, 500–1,500 tokens max)
3. **Shared Contracts & Rules**:
   - `.agents/shared/core-rules.md`
   - `.agents/shared/handoff-contract.md`
   - `.agents/shared/state-schema.md`
4. **Helper Documentation (`docs/agents/`)**:
   - `WORKFLOW.md`
   - `MIGRATION_ARTIFACTS.md`
   - `FIDELITY.md`
   - `COMPONENT_TREE_MIGRATION.md`
   - `COMPONENT_BOUNDARIES.md`
   - `TROUBLESHOOTING.md`
5. **Reusable Migration Skills (`.agents/skills/`)**:
   - 13 migration skills following standard SKILL schema
6. **11 Main Migration Stages (`.agents/<stage>/AGENT.md`)**:
   - `project-bootstrap`
   - `source-analysis`
   - `migration-planning`
   - `component-scaffold`
   - `component-tree-migration`
   - `data`
   - `harness`
   - `benchmark-integration`
   - `test`
   - `fidelity-validation`
   - `repair`
7. **53 Specialized Sub-Agents (`.agents/<stage>/subagents/<worker>.md`)**

> **NOTE**: Do NOT migrate an actual component during system build. The deliverable is the agent system itself.

---

## 3. Phased Implementation Roadmap for the LLM Implementer

To avoid context exhaustion and token limits, implement the agent system in the following disciplined sequence:

### Phase 1: Foundations & Shared Contracts
- Create `.agents/shared/core-rules.md`.
- Create `.agents/shared/handoff-contract.md`.
- Create `.agents/shared/state-schema.md`.
- Create minimal root `AGENTS.md`.
- Create `.agents/README.md`.

### Phase 2: Helper Documentation (`docs/agents/`)
- Create `docs/agents/WORKFLOW.md`.
- Create `docs/agents/MIGRATION_ARTIFACTS.md`.
- Create `docs/agents/FIDELITY.md`.
- Create `docs/agents/COMPONENT_TREE_MIGRATION.md`.
- Create `docs/agents/COMPONENT_BOUNDARIES.md`.
- Create `docs/agents/TROUBLESHOOTING.md`.

### Phase 3: Reusable Skills (`.agents/skills/`)
- Implement the 13 migration skills (`inspect-angular-component`, `convert-smart-to-dumb`, etc.) with standard `SKILL.md` structure.

### Phase 4: Pipeline Stages 01 to 04 (Preparation & Scaffolding)
- Implement `project-bootstrap` Main Agent + 6 sub-agents.
- Implement `source-analysis` Main Agent + 8 sub-agents.
- Implement `migration-planning` Main Agent + 5 sub-agents.
- Implement `component-scaffold` Main Agent + 3 sub-agents.

### Phase 5: Pipeline Stage 05 (Core Component Tree Migration Engine)
- Implement `component-tree-migration` Main Agent.
- Implement all 13 sub-agents enforcing post-order child-to-parent execution and node-level validation.

### Phase 6: Pipeline Stages 06 to 09 (Data, Harness, Benchmark & Test)
- Implement `data` Main Agent + 6 sub-agents.
- Implement `harness` Main Agent + 6 sub-agents.
- Implement `benchmark-integration` Main Agent + 5 sub-agents.
- Implement `test` Main Agent + 5 sub-agents.

### Phase 7: Pipeline Stages 10 & 11 (Fidelity Validation & Repair)
- Implement `fidelity-validation` Main Agent + 6 sub-agents.
- Implement `repair` Main Agent + 8 sub-agents.

---

## 4. Final 19-Point Verification Checklist

Before declaring the task complete, systematically verify each of these 19 criteria:

- [ ] **1. Global instructions are small**: Root `AGENTS.md` and shared core rules are concise (~500–1,500 tokens).
- [ ] **2. Root `AGENTS.md` is minimal**: Contains only universal rules; no full stage prompts.
- [ ] **3. No cross-agent prompt bloat**: No MAIN AGENT requires loading all other agents.
- [ ] **4. Explicit context partitions**: Every MAIN AGENT includes Required / Optional / Do Not Load context sections.
- [ ] **5. Explicit Definition of Done (DoD)**: Every MAIN AGENT specifies measurable DoD criteria.
- [ ] **6. Explicit non-responsibilities**: Every MAIN AGENT clearly states what it does NOT own.
- [ ] **7. Standard delegation**: Relevant MAIN AGENTS explicitly delegate via the existing `subagent-driven-development` skill.
- [ ] **8. No delegation duplication**: The existing skill was referenced, not recreated or duplicated.
- [ ] **9. Top-level generator rule**: Component Scaffold Agent uses `npm run generate:component <component-name>`.
- [ ] **10. Top-level only constraint**: The generator is restricted to the top-level benchmark target only.
- [ ] **11. Child components handled correctly**: Child components are copied/adapted into the UI tree, NOT separately scaffolded as benchmark roots.
- [ ] **12. Concise migration artifacts**: Workspace schemas prioritize machine-readable JSON and brief Markdown summaries.
- [ ] **13. Clean handoffs**: Handoff documents summarize outcomes without internal scratchpad logs.
- [ ] **14. Repository conventions respected**: Angular 16 standalone, Less, OnPush, and Storybook 8 patterns followed.
- [ ] **15. Naming consistency**: All agent, sub-agent, and artifact filenames follow exact specified kebab-case names.
- [ ] **16. Scanning is top-down**: Component tree scanning explicitly proceeds parent-to-child.
- [ ] **17. Implementation is bottom-up**: Component creation and adaptation explicitly proceeds child-to-parent (post-order).
- [ ] **18. Node-level validation**: Each child node is fully adapted, compiled, and verified before its parent is finalized.
- [ ] **19. Context-window feasibility**: All prompts and subagent definitions are compact and practical for a ~100K implementer model.

---

## 5. Final Summary Requirements

When complete, produce a concise summary report detailing:
- Files and directories created.
- Repository conventions discovered and incorporated.
- Integration mechanics with `subagent-driven-development`.
- Confirmation of top-level generator usage rules.
- Documented assumptions or approved deviations.
