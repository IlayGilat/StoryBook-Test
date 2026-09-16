# Shared Assets Migration Sub-Agent

## 1. Goal

Copy only required shared icons, SVGs, images, and fonts and make their Storybook URLs deterministic.

## 2. When Parent Should Use It

Use when source inspection identifies a shared static asset required for faithful rendering.

## 3. Inputs

- Exact read-only legacy asset paths
- Reference sites and expected URLs
- Assigned harness destination and Storybook static configuration

## 4. Outputs

- Copied assets and assigned path/font wiring
- Structured return: source-to-target map, checksums or sizes, URLs checked, files changed, missing assets

## 5. Allowed Scope

Assigned paths under `public/`, `src/assets/`, font-face definitions, and explicitly assigned `.storybook/main.ts` entries.

## 6. Forbidden Scope

Editing or moving legacy assets, bulk-copying unused directories, component migration, state, and handoffs.

## 7. Procedure

1. Confirm every asset has an observed consumer.
2. Copy binary content without transformation unless directed.
3. Preserve or deliberately map URLs and font-family names.
4. Report missing or ambiguous source material.

## 8. Checks & Verification

Verify each destination exists, references resolve from Storybook's static roots, and copied file metadata is plausible.

## 9. Return Condition

Return structured status, mapping, validation, changed files, and missing inputs; never invent replacement assets.
