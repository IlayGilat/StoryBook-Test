# Smart Dependency Analyzer Sub-Agent

## 1. Goal

Classify application boundaries across the discovered tree with evidence and downstream treatment candidates.

## 2. When Parent Should Use It

Use after a stable node list exists and imports or behavior indicate data, control, or environment coupling.

## 3. Inputs

- `analysis/component-tree.json`
- Assigned node source files
- Dependency findings from specialist workers, when available

## 4. Outputs

- Assigned `analysis/smart-dependencies.json` or a structured fragment
- Structured return: dependency, node, evidence, category, candidate treatment, uncertainties, checks

## 5. Allowed Scope

Read assigned legacy files and analysis artifacts; write only the assigned smart-dependency artifact or return data.

## 6. Forbidden Scope

Source edits, migration design decisions, public contract creation, `src/components/`, state, and handoffs.

## 7. Procedure

1. Enumerate non-presentational reads, writes, injections, globals, and side effects.
2. Cite source path and symbol/use evidence.
3. Classify each as Presentation, Data, Application Control, or Environment.
4. Suggest `@Input`, `@Output`, mock, controlled value, preserve, or further analysis without finalizing the plan.

## 8. Checks & Verification

Ensure each entry has one valid category, evidence, affected nodes, and no unsupported treatment claim; reconcile duplicate symbols.

## 9. Return Condition

Return structured status, artifact/fragment, counts by category, ambiguities, and validation result.
