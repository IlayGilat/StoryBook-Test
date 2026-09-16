import fs from 'node:fs';
import path from 'node:path';
import { BENCHMARK_COMPONENT_MARKER } from './generator.constants.mjs';

/** Converts a supported component name to every naming form used by templates. */
export function normalizeName(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Component name must be a non-empty string.');
  }

  const trimmed = input.trim();
  if (!trimmed || trimmed.startsWith('-')) {
    throw new Error(`Invalid component name: "${input}".`);
  }

  const words = trimmed
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .split('-')
    .filter(Boolean);

  const invalidWord = words.some((word) => !/^[a-z0-9]+$/.test(word));
  if (words.length === 0 || !/^[a-z][a-z0-9]*$/.test(words[0]) || invalidWord) {
    throw new Error(`Invalid component name: "${input}". Use letters, numbers, spaces, hyphens, or underscores.`);
  }

  const kebabName = words.join('-');
  const pascalName = words.map(capitalize).join('');
  return {
    kebabName,
    pascalName,
    camelName: pascalName.charAt(0).toLowerCase() + pascalName.slice(1),
    constantName: words.map((word) => word.toUpperCase()).join('_'),
    titleName: words.map(capitalize).join(' '),
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Returns enum source with one new benchmark component member. */
export function addBenchmarkComponent(enumSource, { kebabName, pascalName }) {
  if (!enumSource.includes(BENCHMARK_COMPONENT_MARKER)) {
    throw new Error('Benchmark component enum is missing its generator marker.');
  }
  if (enumSource.includes(`= '${kebabName}'`)) {
    throw new Error(`Benchmark component "${kebabName}" already exists in the enum.`);
  }
  return enumSource.replace(
    BENCHMARK_COMPONENT_MARKER,
    `  ${pascalName} = '${kebabName}',\n${BENCHMARK_COMPONENT_MARKER}`,
  );
}

/** Parses the small command-line contract without performing filesystem work. */
export function parseGeneratorArguments(args) {
  const flags = new Set(args.filter((argument) => argument.startsWith('-')));
  const componentNames = args.filter((argument) => !argument.startsWith('-'));
  return {
    showHelp: flags.has('-h') || flags.has('--help'),
    dryRun: flags.has('--dry-run'),
    componentName: componentNames[0],
  };
}

/** Ensures generation cannot overwrite an existing source or test directory. */
export function assertGenerationTargetsAvailable(rootDirectory, kebabName) {
  const targets = [
    path.join(rootDirectory, 'src', 'components', kebabName),
  ];
  const existingTarget = targets.find((target) => fs.existsSync(target));
  if (existingTarget) {
    throw new Error(`Directory already exists: ${path.relative(rootDirectory, existingTarget).replace(/\\/g, '/')}`);
  }
}

/** Writes all generated files after every precondition has been checked. */
export function writeGeneratedFiles(rootDirectory, files) {
  for (const file of files) {
    const fullPath = path.join(rootDirectory, file.relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.content, 'utf8');
  }
}
