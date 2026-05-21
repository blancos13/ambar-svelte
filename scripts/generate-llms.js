#!/usr/bin/env node
/**
 * Generates static/llms-full.txt from all component source files.
 * Run: node scripts/generate-llms.js
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const componentsDir = join(root, 'src', 'lib', 'components');
const outputPath = join(root, 'static', 'llms-full.txt');

// Skip internal / doc-only components
const SKIP = new Set(['CodeBlock.svelte', 'PropsTable.svelte', 'Settings.svelte', 'WorldMap.svelte']);

const files = readdirSync(componentsDir)
  .filter(f => f.endsWith('.svelte') && !SKIP.has(f))
  .sort();

const lines = [
  '# Ambar UI — Full Component Sources for LLMs',
  '# Generated automatically from src/lib/components/',
  '# Every component is a single .svelte file — copy, own, modify.',
  '#',
  '# Quick reference: /llms.txt',
  '# Docs: https://ambarui.vercel.app',
  '',
  '---',
  '',
];

for (const file of files) {
  const src = readFileSync(join(componentsDir, file), 'utf8');
  const name = file.replace('.svelte', '');
  lines.push(`## ${name}`);
  lines.push('');
  lines.push('```svelte');
  lines.push(`<!-- src/lib/components/${file} -->`);
  lines.push(src.trim());
  lines.push('```');
  lines.push('');
  lines.push('---');
  lines.push('');
}

writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`✓ llms-full.txt written (${files.length} components, ${Math.round(lines.join('\n').length / 1024)}KB)`);
