# Data Main Agent

## 1. Purpose

Implement the benchmark target's typed data contract, Zod schemas, deterministic factories, and validated default, edge-case, and stress datasets, including 100,000 items, without changing UI or wiring stories.

## 2. When to Invoke

Invoke only after Component Tree Migration completed for the same component and the migrated root UI contract is stable.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`
- `.agents/data/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/component-tree-migration.md`
- `.migrations/<component>/plan/data-contract.json`
- `src/components/<component>/ui/<component>.component.ts`
- Existing generated `src/components/<component>/data/<component>.{data,factory}.ts`

## 4. Optional Context

- `src/benchmark/data-generator/` files directly needed to use `DataGeneratorService`, `DataFactory`, seeded randomness, or generation constants
- One existing component data/factory pair when repository conventions remain unclear

## 5. Do Not Load by Default

- Legacy source beyond types explicitly referenced by the data contract, unrelated components, old handoffs, unselected worker prompts, or other stage agents
- Harness, stories, benchmark integration, Playwright, fidelity, repair, and `.artifacts/` context

## 6. Required Prior Artifacts

- A `COMPLETED` `.migrations/<component>/handoffs/component-tree-migration.md`
- A parseable `plan/data-contract.json` covering every root UI input, state variant, nested entity, and optional/null field; dataset volume is owned by this stage unless the contract provides a compatible constraint
- Compiling migrated root UI files with explicit typed input contracts

## 7. Sub-Agents Available

- `model-extraction`
- `zod-schema`
- `data-factory`
- `default-dataset`
- `edge-case-dataset`
- `stress-dataset`

## 8. Subagent Delegation Workflow

Delegate only through `.agents/skills/subagent-driven-development/SKILL.md`. Select the minimum workers, assign exact inputs and disjoint file or review scopes, and never allow concurrent edits to the same data file. The main agent integrates worker results and alone edits state, decisions, validation records, and handoff. Workers do not invoke other stages or workers.

## 9. Responsibilities

- Translate the complete UI input contract into TypeScript models and structurally equivalent Zod schemas.
- Implement deterministic factories through repository data-generator types/utilities; the same seed, count, and options must yield deeply equal data.
- Provide a deterministic default baseline of 10–50 items, using an explicit contract-specific count only when it falls within that range; otherwise choose and document a stable count in the range. Also provide edge-case and parameterized stress variants for empty, optional/null, Unicode/special-character, long-string, and 1k/10k/100k states that the contract supports.
- Parse every exported dataset through its Zod schema before it reaches rendering and reject invalid data rather than coercing or suppressing errors.
- Keep factories linear, bounded, index-stable, and practical for 100,000-item generation; record measured validation evidence.

## 10. Non-Responsibilities

- Modifying UI TypeScript/templates/styles, harness containers, stories, benchmark registry/tracker, Playwright files, or core data-generator infrastructure.
- Inventing business fields absent from the data contract, adding application services, or advancing to Harness.

## 11. Execution Flow

1. Verify prerequisites and contract-to-UI coverage; mark `data` active in state.
2. Extract models, then schemas, then factories; resolve all discrepancies before dataset work.
3. Implement default and edge variants and validate each exported value.
4. Implement parameterized stress generation at 1,000, 10,000, and 100,000 items with a fixed documented seed and validate complete results.
5. Run type/Angular compilation plus deterministic, schema, count, uniqueness/order, and generation-time checks.
6. Inspect scope, update validation evidence/state, write the canonical handoff, and stop.

## 12. Allowed Modifications

- `src/components/<component>/data/<component>.data.ts`
- `src/components/<component>/data/<component>.factory.ts`
- `.migrations/<component>/logs/decisions.md`, `validation/data-report.md`, `state.json`, and `handoffs/data.md`

## 13. Forbidden Modifications

- External legacy source; UI, harness, story, test, benchmark-core, generator, configuration, package, or unrelated component files
- `.artifacts/`, later-stage handoffs, unvalidated exports, `Math.random()`, time/locale-dependent values, hidden mutable generator state, `any`, or bypassed Zod parsing
- Worker edits to shared state/log/handoff files or overlapping concurrent writes

## 14. Required Outputs

- Complete TypeScript models and matching Zod schemas in `<component>.data.ts`
- Deterministic record/nested factories and default, edge-case, and stress dataset APIs in the component data files
- A validated deterministic default dataset of 10–50 items, plus validated datasets for required states and exact 1k, 10k, and 100k volumes
- `.migrations/<component>/validation/data-report.md`, updated state, and `.migrations/<component>/handoffs/data.md`

## 15. Validation

- Parse `data-contract.json`; map every UI input and nested field to a TypeScript type, Zod rule, factory value, and relevant variant with no unexplained extras.
- Run `npx tsc --noEmit` or the repository's equivalent compile check and require exit zero.
- Execute the smallest repository-supported data check proving schema success for all variants, a default count within 10–50 items, exact requested stress counts including 100,000, stable index/order/IDs, and deep equality across two runs with the same seed; prove a different seed changes seeded fields where applicable.
- Measure generation and full-schema parsing at 1k/10k/100k, record command/results, and investigate grossly non-linear scaling or failure to meet the repository target of under one second per 10k items in the validation environment.
- Inspect the diff to confirm only allowed files changed and no consumer wiring or component migration occurred.

## 16. Definition of Done (DoD)

- [ ] TypeScript and Zod contracts fully and equivalently cover all migrated root UI data inputs.
- [ ] The default dataset contains 10–50 items, and every default, edge, and stress dataset is deterministic and fully schema-validated before use.
- [ ] Exact 1k, 10k, and 100k datasets generate with stable order/identity and recorded practical timing evidence.
- [ ] Component data files compile cleanly and contain no time-, locale-, or unseeded-random behavior.
- [ ] State, data validation report, and canonical handoff agree; no Harness or later-stage work occurred.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/data.md` in the exact shared handoff order and recommend `harness` without invoking it. Match status/timestamp to state. Missing or contradictory UI/data contracts are `BLOCKED`; name the exact field or artifact and do not fabricate it. Compile, schema, determinism, count, or required 100k generation failures are `FAILED`; capture command/output and do not advance. Stop immediately after this DoD.
