# Migration State Schema

Each top-level migration owns `.migrations/<component-name>/state.json`. The file is the concise, deterministic resume point for stage agents.

## JSON Schema

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
    "sourcePath": {
      "type": "string",
      "description": "Absolute or relative path to legacy component source"
    },
    "status": {
      "type": "string",
      "enum": ["not_started", "in_progress", "completed", "failed", "blocked"]
    },
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
    "lastUpdatedBy": {
      "type": "string",
      "description": "Name of the stage or subagent updating state"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

## Deterministic Update Rules

- Serialize fields in schema order and format JSON with two-space indentation plus a trailing newline.
- Append a completed stage once, after its DoD and validation pass, and retain entries in canonical stage order.
- Set `currentStage` to the stage being executed. Never advance it on behalf of the next stage.
- Set `status` to `in_progress` when a stage begins; use `failed` for failed validation, `blocked` for missing prerequisites, and `completed` only when the migration itself has completed its required terminal validation.
- Replace `updatedAt` with the update's ISO 8601 UTC timestamp. Set `lastUpdatedBy` to the stage or subagent responsible for the integrated update; the main agent physically applies serialized `state.json` writes so concurrent workers never edit it directly.
- Keep warnings concise, stable, and ordered by first discovery. Remove one only when its cause is verified resolved.

## Example

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
  "lastUpdatedBy": "component-tree-migration",
  "updatedAt": "2026-09-15T10:00:00Z"
}
```
