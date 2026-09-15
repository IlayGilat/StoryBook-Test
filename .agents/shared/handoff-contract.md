# Stage Handoff Contract

Every main stage writes `.migrations/<component>/handoffs/<stage-name>.md` before stopping. A handoff records verified facts and outcomes, not chain-of-thought, scratchpad notes, or a replay of the procedure. The next stage loads only the latest handoff and artifacts its own `AGENT.md` requires.

Use the exact section order below. Use `None` when a section has no entries; do not omit sections. Paths are repository-relative unless the source is external.

```markdown
# Handoff: [Stage Name]

- **Component**: [component-name]
- **Stage**: [stage-name]
- **Status**: [COMPLETED | FAILED | BLOCKED]
- **Timestamp**: [ISO 8601 UTC timestamp]

## Inputs Used
- [Artifacts and source files inspected]

## Work Completed
- [Concise, concrete outcomes]

## Files Changed / Created
- `path/to/created/or/modified/file`

## Important Decisions
- [Decision summary and reference to `logs/decisions.md`]

## Known Deviations
- [Deliberate behavioral or visual deviations from production source]

## Warnings / Open Risks
- [Blockers or risks relevant to later stages]

## Validation Results
- `[command]`: [result]

## Next Stage Requirements
- **Recommended Next Agent**: [next stage name, or `None`]
- **Artifacts Ready for Next Agent**:
  - `path/to/artifact`
```

The handoff status and timestamp must match the final update to `state.json`. `COMPLETED` means the active stage's DoD passed; `FAILED` means attempted validation failed; `BLOCKED` means required input or authority is unavailable. A handoff recommends a next stage but never invokes it.
