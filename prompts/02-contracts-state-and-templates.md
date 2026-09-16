# Prompt Module 02: Contracts, State Schema & Agent Templates

> **Source**: Sections 6, 13, 14, 15, 16, 17 of `codex_storybook_agent_system_prompt_v3.txt`  
> **Target Implementer**: GPT-5.6 Sol Medium / OpenCode implementer (~100K token context window)  
> **Repository**: `StoryBook-Test`

---

## 1. Minimal Root `AGENTS.md`

Keep the root `AGENTS.md` minimal (approximately 500–1,500 tokens maximum). It must NOT contain full stage instructions.

### Required Contents of Root `AGENTS.md`:
1. Pointer to `.agents/shared/core-rules.md`.
2. Instruction to load **only** the currently active migration stage's `AGENT.md`.
3. Instruction to load only migration artifacts explicitly required by that stage.
4. Instruction to delegate strictly via the existing `.agents/skills/subagent-driven-development` skill.
5. Invariant: Production source is strictly read-only.
6. Invariant: Stop immediately once the current stage's Definition of Done (DoD) is satisfied. Do not auto-advance to subsequent stages.

---

## 2. Shared Core Rules (`.agents/shared/core-rules.md`)

Create `.agents/shared/core-rules.md`. Keep it compact and durable. Include these 10 non-negotiable rules:

1. **Production source is read-only**: Never edit the external legacy application repository or source files.
2. **Fidelity over refactoring**: Preserve visual, DOM, and rendering fidelity before introducing architectural cleanups.
3. **Repository standards are law**: Follow Angular 16 standalone, `OnPush`, Less, Storybook 8, and Playwright patterns established in `src/benchmark/`.
4. **Standard delegation**: Subagent delegation must strictly follow the existing `subagent-driven-development` skill.
5. **Lazy context loading**: Load only current-stage context. Never load full prompts of other main stages.
6. **No global prompt bloat**: Never load unreferenced sub-agent instructions or historical conversations.
7. **Explicit deviation tracking**: Record every architectural or behavioral alteration in `.migrations/<component>/logs/decisions.md`.
8. **Incremental validation**: Always compile, test, or verify the current stage before declaring completion.
9. **Strict Definition of Done**: Stop immediately once the stage DoD is satisfied.
10. **No silent execution**: Do not perform work that belongs to a subsequent stage.

---

## 3. Migration State Schema (`state.json`)

Located at `.migrations/<component-name>/state.json`. Must be concise, deterministic, and resumable.

### Schema Specification:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MigrationState",
  "type": "object",
  "required": [
    "component",
    "status",
    "currentStage",
    "completedStages",
    "targetLocation",
    "warnings",
    "lastUpdatedBy",
    "updatedAt"
  ],
  "properties": {
    "component": { "type": "string", "description": "Kebab-case name of top-level component" },
    "sourcePath": { "type": "string", "description": "Absolute or relative path to legacy component source" },
    "status": { "type": "string", "enum": ["not_started", "in_progress", "completed", "failed", "blocked"] },
    "currentStage": { 
      "type": "string",
      "enum": [
        "project-bootstrap",
        "source-analysis",
        "migration-planning",
        "component-scaffold",
        "component-tree-migration",
        "data",
        "harness",
        "benchmark-integration",
        "test",
        "fidelity-validation",
        "repair"
      ]
    },
    "completedStages": {
      "type": "array",
      "items": { "type": "string" }
    },
    "targetLocation": { "type": "string", "description": "e.g. src/components/<component>" },
    "warnings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "lastUpdatedBy": { "type": "string", "description": "Name of the stage or subagent updating state" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

### Example:
```json
{
  "component": "customer-page",
  "sourcePath": "../legacy-app/src/app/pages/customer-page",
  "status": "in_progress",
  "currentStage": "component-tree-migration",
  "completedStages": [
    "project-bootstrap",
    "source-analysis",
    "migration-planning",
    "component-scaffold"
  ],
  "targetLocation": "src/components/customer-page",
  "warnings": [],
  "lastUpdatedBy": "component-scaffold",
  "updatedAt": "2026-09-15T10:00:00Z"
}
```

---

## 4. Handoff Contract (`handoffs/<stage-name>.md`)

Every MAIN AGENT must generate a concise handoff document in `.migrations/<component>/handoffs/<stage-name>.md`.

> **CRITICAL**: Handoffs **summarize facts and outcomes**; they must **NOT** reproduce step-by-step reasoning or internal scratchpad logs. The next stage reads only the latest handoff and its own required artifacts.

### Required Handoff Template:
```markdown
# Handoff: [Stage Name]

- **Component**: [component-name]
- **Stage**: [stage-name]
- **Status**: [COMPLETED | FAILED | BLOCKED]
- **Timestamp**: [ISO timestamp]

## Inputs Used
- [List artifacts and source files inspected]

## Work Completed
- [Concise bullet points of concrete changes made]

## Files Changed / Created
- `path/to/created/or/modified/file`

## Important Decisions
- [Decisions made, references to decisions.md]

## Known Deviations
- [Any deliberate behavioral/visual deviations from legacy source]

## Warnings / Open Risks
- [Potential blockers or risks for subsequent stages]

## Validation Results
- [Summary of compiler, linter, or test commands executed and outputs]

## Next Stage Requirements
- **Recommended Next Agent**: [Name of next Main Agent]
- **Artifacts Ready for Next Agent**:
  - `path/to/artifact1`
  - `path/to/artifact2`
```

---

## 5. Main-Agent File Requirements & Standard Structure

Every `.agents/<stage>/AGENT.md` must strictly follow this 17-section structure:

```markdown
# [Stage Name] Main Agent

## 1. Purpose
[High-level role and objective of this migration stage]

## 2. When to Invoke
[Conditions and prior stage prerequisites for triggering this agent]

## 3. Required Context
[Minimal set of files this agent MUST load upon start]

## 4. Optional Context
[Files loaded ONLY on demand or when encountering specific edge cases]

## 5. Do Not Load by Default
[Explicit list of files/directories forbidden from initial load to protect context window]

## 6. Required Prior Artifacts
[Artifacts from previous stages that must exist before starting]

## 7. Sub-Agents Available
[List of sub-agents under this stage's `subagents/` directory]

## 8. Subagent Delegation Workflow
[Step-by-step instructions referencing `subagent-driven-development`]

## 9. Responsibilities
[Exact scope of work this agent owns]

## 10. Non-Responsibilities
[Explicit boundaries: what this agent must NOT do]

## 11. Execution Flow
[Sequential execution stages: Load -> Delegate -> Integrate -> Validate -> Handoff]

## 12. Allowed Modifications
[Directories and files this agent is permitted to write or edit]

## 13. Forbidden Modifications
[Directories and files this agent must NEVER modify]

## 14. Required Outputs
[Concrete files and artifacts that must be produced]

## 15. Validation
[Concrete verification commands and compile checks]

## 16. Definition of Done (DoD)
[Strict checklist required before handoff]

## 17. Handoff & Failure Behavior
[Format of handoff artifact, recovery actions if stage fails]
```

---

## 6. Sub-Agent File Requirements & Standard Structure

Every `.agents/<stage>/subagents/<worker>.md` must follow this 9-section structure:

```markdown
# [Worker Name] Sub-Agent

## 1. Goal
[Specific, narrow implementation objective]

## 2. When Parent Should Use It
[Exact condition triggering parent delegation]

## 3. Inputs
[Files and parameters provided by the parent agent]

## 4. Outputs
[Specific files or structured data returned to parent]

## 5. Allowed Scope
[Strict file/directory boundaries for this worker]

## 6. Forbidden Scope
[Actions or files strictly out of bounds]

## 7. Procedure
[Step-by-step mechanical implementation procedure]

## 8. Checks & Verification
[Immediate verification checks run by the sub-agent]

## 9. Return Condition
[How the sub-agent reports back to the parent and finishes]
```
