# Migration State Schema

Each top-level migration owns `.migrations/<component-name>/state.json`. The file is the concise, deterministic resume point for stage agents.

## JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MigrationState",
  "type": "object",
  "additionalProperties": false,
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
    "component": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      "description": "Kebab-case name of the top-level component"
    },
    "sourcePath": {
      "type": "string",
      "description": "Absolute or relative path to the read-only legacy component source"
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
      "uniqueItems": true,
      "items": {
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
      }
    },
    "targetLocation": {
      "type": "string",
      "pattern": "^src/components/[a-z0-9]+(?:-[a-z0-9]+)*$",
      "description": "Benchmark root, for example src/components/customer-page"
    },
    "warnings": {
      "type": "array",
      "items": { "type": "string" }
    },
    "lastUpdatedBy": {
      "type": "string",
      "description": "Name of the stage or worker updating state"
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
- Keep `completedStages` in canonical stage order, without duplicates. Add a stage only after its DoD and validation pass.
- Set `currentStage` to the stage being executed. Never advance it on behalf of the next stage.
- Set `status` to `in_progress` when a stage begins; use `failed` for failed validation, `blocked` for missing prerequisites, and `completed` only when the migration itself has completed its required terminal validation.
- Replace `updatedAt` with the update's ISO 8601 UTC timestamp and set `lastUpdatedBy` to the sole writer. Only the main agent writes `state.json`; concurrently delegated workers must not edit it.
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
  "lastUpdatedBy": "component-scaffold",
  "updatedAt": "2026-09-15T10:00:00Z"
}
```
