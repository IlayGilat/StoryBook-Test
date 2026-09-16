#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTemplates } from './generate-component/component-templates.mjs';
import {
  GENERATED_FILE_COUNT,
  GENERATOR_USAGE,
} from './generate-component/generator.constants.mjs';
import {
  addBenchmarkComponent,
  assertGenerationTargetsAvailable,
  normalizeName,
  parseGeneratorArguments,
  writeGeneratedFiles,
} from './generate-component/generator.utils.mjs';

export { generateTemplates, addBenchmarkComponent, normalizeName };

const scriptPath = fileURLToPath(import.meta.url);
const rootDirectory = path.resolve(path.dirname(scriptPath), '..');
const benchmarkComponentPath = path.join(
  rootDirectory,
  'src',
  'benchmark',
  'registry',
  'component-registry.constants.ts',
);

function printGenerationPlan(files, dryRun) {
  const prefix = dryRun ? '[dry-run] Would create' : 'Created';
  files.forEach((file) => console.log(`  ${prefix}: ${file.relativePath.replace(/\\/g, '/')}`));
}

function createGenerationPlan(componentName) {
  const names = normalizeName(componentName);
  assertGenerationTargetsAvailable(rootDirectory, names.kebabName);
  const enumSource = fs.readFileSync(benchmarkComponentPath, 'utf8');
  return {
    names,
    files: generateTemplates(names),
    updatedEnumSource: addBenchmarkComponent(enumSource, names),
  };
}

function applyGenerationPlan(plan) {
  writeGeneratedFiles(rootDirectory, plan.files);
  fs.writeFileSync(benchmarkComponentPath, plan.updatedEnumSource, 'utf8');
}

/** Coordinates argument parsing, preflight checks, generation, and output. */
export function main(args = process.argv.slice(2)) {
  const options = parseGeneratorArguments(args);
  if (options.showHelp) {
    console.log(GENERATOR_USAGE);
    return;
  }
  if (!options.componentName) {
    console.error(`Error: Component name argument is required.\n${GENERATOR_USAGE}`);
    process.exitCode = 1;
    return;
  }

  try {
    const plan = createGenerationPlan(options.componentName);
    console.log(`\nGenerating component suite for "${plan.names.titleName}" (${plan.names.kebabName} / ${plan.names.pascalName}):`);
    if (!options.dryRun) applyGenerationPlan(plan);
    printGenerationPlan(plan.files, options.dryRun);
    const enumAction = options.dryRun ? '[dry-run] Would update' : 'Updated';
    console.log(`  ${enumAction}: ${path.relative(rootDirectory, benchmarkComponentPath).replace(/\\/g, '/')}`);
    console.log(`\nSuccessfully ${options.dryRun ? 'simulated generation of' : 'generated'} ${GENERATED_FILE_COUNT}-file suite for ${plan.names.kebabName}.\n`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) main();
