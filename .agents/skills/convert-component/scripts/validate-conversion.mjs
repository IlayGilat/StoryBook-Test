#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..', '..', '..');

export function validateComponent(kebabName, options = {}) {
  const errors = [];
  const warnings = [];

  const requiredFiles = [
    path.join('src', 'stories', kebabName, `${kebabName}.schema.ts`),
    path.join('src', 'stories', kebabName, `${kebabName}.component.ts`),
    path.join('src', 'stories', kebabName, `${kebabName}.component.html`),
    path.join('src', 'stories', kebabName, `${kebabName}.component.less`),
    path.join('src', 'stories', kebabName, `${kebabName}-container.component.ts`),
    path.join('src', 'stories', kebabName, `${kebabName}.stories.ts`),
    path.join('tests', 'components', kebabName, `${kebabName}.spec.ts`),
    path.join('tests', 'components', kebabName, 'utils', `${kebabName}-performance.ts`),
  ];

  console.log(`\nValidating converted component suite: "${kebabName}"`);

  // 1. File existence checks
  for (const relPath of requiredFiles) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file: ${relPath.replace(/\\/g, '/')}`);
    } else {
      console.log(`  ✓ Found: ${relPath.replace(/\\/g, '/')}`);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors, warnings };
  }

  // 2. Dumb component code inspections
  const compTsPath = path.join(rootDir, 'src', 'stories', kebabName, `${kebabName}.component.ts`);
  const compTsContent = fs.readFileSync(compTsPath, 'utf8');

  if (!compTsContent.includes('ChangeDetectionStrategy.OnPush')) {
    errors.push(`Dumb component must declare 'changeDetection: ChangeDetectionStrategy.OnPush'`);
  }

  if (compTsContent.includes('@ngrx') || compTsContent.includes('Store<') || compTsContent.includes('HttpClient')) {
    errors.push(`Dumb component still contains enterprise dependencies (@ngrx or HttpClient). Must be pure presentational.`);
  }

  if (!compTsContent.includes(`templateUrl: './${kebabName}.component.html'`)) {
    warnings.push(`Dumb component should reference './${kebabName}.component.html' via templateUrl`);
  }

  if (!compTsContent.includes(`styleUrl: './${kebabName}.component.less'`)) {
    warnings.push(`Dumb component should reference './${kebabName}.component.less' via styleUrl`);
  }

  // 3. Container checks
  const containerPath = path.join(rootDir, 'src', 'stories', kebabName, `${kebabName}-container.component.ts`);
  const containerContent = fs.readFileSync(containerPath, 'utf8');

  if (!containerContent.includes('BaseBenchmarkContainerComponent')) {
    errors.push(`Container must extend 'BaseBenchmarkContainerComponent'`);
  }

  if (!containerContent.includes(`componentName = '${kebabName}'`)) {
    warnings.push(`Container should specify componentName = '${kebabName}'`);
  }

  // 4. Schema checks
  const schemaPath = path.join(rootDir, 'src', 'stories', kebabName, `${kebabName}.schema.ts`);
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  if (!schemaContent.includes('z.object(')) {
    errors.push(`Schema file must declare a Zod schema using z.object(...)`);
  }

  if (!schemaContent.includes('Overrides')) {
    warnings.push(`Schema file should export generator overrides for DataGeneratorService`);
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
  };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0].startsWith('-')) {
    console.log('Usage: node validate-conversion.mjs <component-kebab-name>');
    process.exit(1);
  }

  const kebabName = args[0];
  const result = validateComponent(kebabName);

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of result.warnings) {
      console.log(`  ⚠ ${warning}`);
    }
  }

  if (!result.success) {
    console.error('\nValidation Failed:');
    for (const error of result.errors) {
      console.error(`  ✗ ${error}`);
    }
    process.exit(1);
  }

  console.log(`\n✓ Component suite for "${kebabName}" is valid and conforms to benchmark contracts.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}
