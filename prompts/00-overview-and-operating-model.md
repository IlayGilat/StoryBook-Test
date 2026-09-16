# Prompt Module 00: Overview, Operating Model & Context Constraints

> **Source**: Sections 1, 2, 5, 6, 7, 8, 27, 28 of `codex_storybook_agent_system_prompt_v3.txt`  
> **Target Implementer**: GPT-5.6 Sol Medium / OpenCode implementer (~100K token context window)  
> **Repository**: `StoryBook-Test`

---

## 1. High-Level Mission

You are creating a complete, context-efficient agent system for migrating Angular 16 components from a separate legacy Angular application into the `StoryBook-Test` repository for high-fidelity Storybook + Playwright performance/stress testing.

The system will later be executed primarily by an OpenCode implementer model with a context window of approximately 100K tokens.

> **PRIMARY ARCHITECTURAL INVARIANT**:  
> **CONTEXT EFFICIENCY IS A FIRST-CLASS ARCHITECTURAL REQUIREMENT.**  
> The final agent system must be designed so that the implementer model reads only the instructions and artifacts required for the current migration stage.  
> **DO NOT** create a giant globally-loaded agent instruction set.

---

## 2. Core Operating Model

The migration process is **sequential** and **human-driven at the stage level**.

The human operator manually invokes **ONE MAIN AGENT at a time**:

```text
Project Bootstrap Agent
    ↓
Source Analysis Agent
    ↓
Migration Planning Agent
    ↓
Component Scaffold Agent
    ↓
Component Tree Migration Agent
    ↓
Data Agent
    ↓
Harness Agent
    ↓
Benchmark Integration Agent
    ↓
Test Agent
    ↓
Fidelity Validation Agent
    ↓
Repair Agent (when necessary)
```

### Main Agents vs. Sub-Agents
- A **MAIN AGENT** represents a migration stage.
- A **SUB-AGENT** is a narrow implementation worker owned and invoked by the currently running MAIN AGENT.
- The system must **NOT** act like one large autonomous agent that migrates the entire component in a single run.

### Execution Flow Per Stage

```text
Human invokes Main Agent A
    ↓
Main Agent A loads minimum required context
    ↓
Main Agent A delegates selected tasks to sub-agents
    ↓
Main Agent A integrates their work
    ↓
Main Agent A validates its own stage
    ↓
Main Agent A writes compact artifacts + handoff
    ↓
Main Agent A stops

Human invokes Main Agent B
    ↓
Main Agent B loads only what it needs
```

**Key Requirement**: Each stage must be independently resumable.

---

## 3. Mandatory Use of Existing `subagent-driven-development` Skill

This repository already contains a skill located at:
```text
.agents/skills/subagent-driven-development/SKILL.md
```

### Delegation Rules:
1. **Inspect before designing**: You MUST inspect this existing skill.
2. **Standard delegation model**: You MUST use it as the standard delegation model for all MAIN AGENTS that use SUB-AGENTS.
3. **DO NOT**:
   - Recreate this skill
   - Duplicate its instructions
   - Invent a competing delegation framework
4. **DO**:
   - Reference the existing skill from relevant MAIN AGENT instructions.
   - Make MAIN AGENTS follow its workflow when delegating.
   - Keep sub-agent work narrow, bounded, and single-purpose.
   - Have the parent MAIN AGENT remain strictly responsible for integration and final validation.

---

## 4. Migration Philosophy

The migration process is **NOT**:
```text
Legacy Component ──► AI interprets it ──► AI rewrites approximate version
```

The migration process **MUST BE**:
```text
Legacy Component Tree
    ↓
Analyze
    ↓
Plan
    ↓
Scaffold benchmark root (Top-level only via generator)
    ↓
Copy faithfully
    ↓
Remove application boundaries (NgRx, services, router, env)
    ↓
Create explicit data contract
    ↓
Connect to benchmark harness
    ↓
Test
    ↓
Validate fidelity
    ↓
Repair concrete deviations
```

### Guiding Principles:
- Optimize for:
  ```text
  copy ──► inspect ──► mechanically adapt ──► validate
  ```
  rather than:
  ```text
  reimplement from understanding
  ```
- **Fidelity is more important than elegance** during migration. Preserve DOM structure, class names, CSS/Less rules, and rendering behavior.

---

## 5. Context Window Constraint & Lazy Loading

The implementer model has ~100K context. Design the system around this hard constraint.

### Root `AGENTS.md` Policy:
- Prefer a **tiny root `AGENTS.md`** (500–1,500 tokens max).
- It must contain **only** global rules (e.g., load current stage AGENT.md, production source is read-only, stop when DoD is met).
- **NEVER** place full stage instructions or sub-agent prompts in the root `AGENTS.md`.

### Lazy Context Loading Rules:
Every MAIN AGENT must explicitly partition its context requirements into three sections:
1. `REQUIRED CONTEXT`: The absolute minimal set of files to read upon invocation.
2. `OPTIONAL CONTEXT`: Files to read only when specific features/failures are encountered.
3. `DO NOT LOAD BY DEFAULT`: All other main agent prompts, unrelated sub-agent prompts, historical handoffs, and raw notes.

Example for `Component Tree Migration Agent`:
- **Loads**: `.agents/shared/core-rules.md`, `.agents/component-tree-migration/AGENT.md`, `.migrations/<component>/state.json`, `.migrations/<component>/plan/migration-plan.md`, `.migrations/<component>/plan/file-plan.json`, `.migrations/<component>/analysis/component-tree.json`, relevant source files, and specific sub-agent prompts when delegated.
- **Does NOT load**: other main agents, all sub-agents upfront, all docs, historical logs.

### Context Budget Guidance (Rough Allocation per Stage):
```text
Global / Core instructions:    1k – 3k tokens
Current Main Agent prompt:     2k – 5k tokens
Current Sub-Agent prompt:      1k – 3k tokens
Migration artifacts:           5k – 10k tokens
Relevant source code:          30k – 55k tokens
Tool output / working room:    Remaining context (~30k tokens)
```

---

## 6. Operational Prompt Quality & Anti-Explosion

### Prompt Quality Standards:
- **No generic persona prompts**: Do not write flowery character descriptions.
- **Strictly operational instructions**: Prompts must specify:
  - Exact files to read and write
  - Available sub-agents and how to invoke them
  - Exact responsibilities and non-responsibilities
  - Concrete commands for validation
  - Explicit Definition of Done (DoD)
  - Handoff format

### Avoid Agent Explosion:
- Having 50+ sub-agents in the system does **NOT** mean they all run for every component.
- The parent MAIN AGENT selects **only the minimum necessary workers**:
  - No NgRx in component? ➔ Do NOT invoke `ngrx-adaptation`.
  - No custom pipes/directives? ➔ Do NOT invoke `pipe-directive-migration`.
  - No visual regression? ➔ Do NOT invoke `styling-repair`.
