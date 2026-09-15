# Component Boundaries

Convert application coupling at the smallest faithful boundary. UI components remain standalone, presentational, `OnPush`, and communicate through explicit `@Input()`/`@Output()` contracts. Preserve local presentation state such as open panels, focus, hover, current tab, and transient form values when it does not own application data.

## Transformation catalog

| Source coupling | Presentation boundary | Rule |
|---|---|---|
| `store.select(selector)` / selector signals | `@Input() value` or a root view-model input | Preserve loading/empty/error distinctions and template timing. |
| `store.dispatch(action)` | `@Output() actionRequested` | Emit the minimal typed intent; the harness decides effects. |
| HTTP/query service reads | Typed input data/state | Do not make network calls from migrated UI. |
| Mutation/service commands | Typed output event | Keep confirmation and local UI state; external mutation leaves the UI boundary. |
| `ActivatedRoute` params/query/data | Controlled inputs | Provide deterministic route-derived values from the harness. |
| `Router.navigate(...)` | Navigation-request output | Include only the destination intent needed by the consumer. |
| Environment/config token | Typed controlled value | Centralize defaults in the harness/data layer; no machine-dependent reads. |
| Feature flag | Boolean or discriminated input | Cover enabled and disabled branches with deterministic fixtures. |

Do not flatten a nested smart component when its application dependencies can be satisfied internally without expanding the benchmark's public API. Expose root inputs/outputs only when the harness must control or observe them. Preserve presentation-only dependencies (pipes, directives, icon components, formatters) when compatible with the repository.

For each conversion, update `smart-dependencies.json`, `dumb-boundary.json`, TypeScript types, template bindings, and `logs/decisions.md` when behavior or architecture meaningfully changes. Validate compile, render, and event semantics at the node before its parent is finalized.

Forbidden shortcuts include `any` contracts, silent no-op service replacements, hard-coded production state, fabricated defaults, removed accessibility semantics, and broad refactors unrelated to the reported coupling.
