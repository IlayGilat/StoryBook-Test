---
name: extract-angular-dependencies
description: Audit one or more discovered Angular nodes for imports, services, tokens, pipes, directives, packages, styles, and assets.
---

# Extract Angular Dependencies

## When to use

Use during Source Analysis after a node is discovered and before dependency classification or migration planning.

## Inputs

- Read-only source files for nodes listed in `analysis/component-tree.json`.
- Target `.migrations/<component>/analysis/dependencies.json`.

## Outputs

- Per-node dependency entries containing `kind`, `symbol`, `module`, `usage`, and `sourceFile`.
- Warnings for unresolved or missing dependencies.

## Procedure

1. Parse TypeScript imports, decorator imports/providers, constructor and `inject()` tokens, inheritance, and referenced types.
2. Parse template components, directives, pipes, event/binding helpers, and dynamic component mechanisms.
3. Parse Less imports, URLs, fonts, assets, variables, mixins, and theme tokens.
4. Trace only enough declaration/re-export information to identify the owning local file or package.
5. Record each dependency once per distinct usage and validate every entry has evidence.
6. Serialize stable node and entry ordering.

## Constraints

- Never edit the external legacy source.
- Do not classify or transform dependencies in this skill.
- Do not crawl unrelated modules or package trees.
- Preserve exact module/path casing.

## Stop conditions

Stop when every evidenced dependency for the scoped nodes is recorded, or block on a missing dependency required to understand rendered behavior.
