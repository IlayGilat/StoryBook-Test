# Migration Workflow

Run one stage at a time. Replace `<component>` with the kebab-case benchmark root. Each stage reads `.agents/shared/core-rules.md`, its own `.agents/<stage>/AGENT.md`, and only the latest handoff and artifacts named there. A stage writes its handoff, updates `state.json`, and stops when its Definition of Done is met.

| # | Human invocation | Required input | Expected output |
|---|---|---|---|
| 1 | `Use the Project Bootstrap Agent for <component>.` | Repository and legacy source location | `.migrations/<component>/state.json`, workspace checks, `handoffs/project-bootstrap.md` |
| 2 | `Use the Source Analysis Agent for <component>.` | Bootstrap handoff; read-only legacy root component | `component-tree.json`, `dependencies.json`, `smart-dependencies.json`, source-analysis handoff |
| 3 | `Use the Migration Planning Agent for <component>.` | Analysis artifacts | `migration-plan.md`, `dumb-boundary.json`, `data-contract.json`, `file-plan.json`, planning handoff |
| 4 | `Use the Component Scaffold Agent for <component>.` | Approved plan and file plan | One `npm run generate:component <component>` invocation for the root only; scaffold handoff |
| 5 | `Use the Component Tree Migration Agent for <component>.` | Scaffold plus tree and plan | UI nodes adapted in strict post-order, node validation evidence, tree-migration handoff |
| 6 | `Use the Data Agent for <component>.` | Data contract and migrated UI bindings | TypeScript types, Zod schema, deterministic data factory, data handoff |
| 7 | `Use the Harness Agent for <component>.` | Validated UI and data layer | Container extending `BaseBenchmarkContainerComponent<T>`, harness handoff |
| 8 | `Use the Benchmark Integration Agent for <component>.` | Harness and registry conventions | CSF3 story, registry/tracker integration, benchmark-integration handoff |
| 9 | `Use the Test Agent for <component>.` | Runnable Storybook target | Interaction/scenario helpers, Playwright spec, test handoff |
| 10 | `Use the Fidelity Validation Agent for <component>.` | Legacy baseline and migrated story | `parity-report.json`, evidence paths, fidelity handoff |
| 11 | `Use the Repair Agent for <component> to resolve <reported issue>.` | A concrete failed validation or Critical/Major parity finding | Targeted repair, revalidation evidence, repair handoff |

Discovery is top-down; implementation is bottom-up in strict post-order. The legacy source is read-only. Child components are copied and adapted manually into the root UI tree; never invoke the generator for a child.

## Resume

Open `.migrations/<component>/state.json`. Verify `component`, `targetLocation`, `status`, `currentStage`, warnings, and the latest matching handoff. If status is `in_progress` or `failed`, re-run that same stage. If it is `blocked`, supply the missing prerequisite recorded in warnings and the handoff, then re-run the same stage. Never infer completion from files alone, skip a stage, or auto-start the recommended next agent.

See [Migration Artifacts](MIGRATION_ARTIFACTS.md) for schemas and `.agents/shared/state-schema.md` for update rules.
