import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, '.agents');
const outputRoot = path.join(root, '.opencode', 'agents');

const stages = [
  'project-bootstrap',
  'source-analysis',
  'migration-planning',
  'component-scaffold',
  'component-tree-migration',
  'data',
  'harness',
  'benchmark-integration',
  'test',
  'fidelity-validation',
  'repair',
];

function yamlString(value) {
  return JSON.stringify(value.replace(/\s+/g, ' ').trim());
}

function descriptionFromBody(body, fallback) {
  const paragraphs = body
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith('#'));

  const description = paragraphs.find((part) => !part.startsWith('-') && !part.startsWith('```'));
  return description?.replace(/\n/g, ' ') || fallback;
}

async function emitAgent(sourcePath, targetPath, mode, fallbackDescription) {
  const body = await readFile(sourcePath, 'utf8');
  const normalizedBody = body.replace(/\r\n/g, '\n').trimEnd();
  const frontmatter = [
    '---',
    `description: ${yamlString(descriptionFromBody(normalizedBody, fallbackDescription))}`,
    `mode: ${mode}`,
    '---',
    '',
  ].join('\n') + '\n';

  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, `${frontmatter}${normalizedBody}\n`, 'utf8');
}

for (const stage of stages) {
  await emitAgent(
    path.join(sourceRoot, stage, 'AGENT.md'),
    path.join(outputRoot, `${stage}.md`),
    'primary',
    `Runs the ${stage} migration stage.`,
  );

  const catalog = await readFile(path.join(sourceRoot, stage, 'AGENT.md'), 'utf8');
  const catalogSection = catalog.match(/## 7\. Sub-Agents Available\s+([\s\S]*?)\n## 8\./)?.[1] ?? '';
  const subagentNames = [...catalogSection.matchAll(/^\s*(?:[-*]|\d+\.)\s+`([^`]+)`/gm)].map((match) => match[1]);

  for (const subagent of subagentNames) {
    await emitAgent(
      path.join(sourceRoot, stage, 'subagents', `${subagent}.md`),
      path.join(outputRoot, stage, `${subagent}.md`),
      'subagent',
      `Supports ${stage} work for ${subagent}.`,
    );
  }
}

console.log(`Generated ${stages.length} primary agents and project subagents in .opencode/agents.`);
