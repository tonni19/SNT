#!/usr/bin/env node
/**
 * Start a new entry from its template.
 *
 *   npm run new research my-new-paper
 *   npm run new uiux spotify-onboarding
 *   npm run new achievements game-jam-2027
 *
 * Creates src/content/<collection>/<name>.md as a draft. Fill it in, then delete
 * the `draft: true` line to publish it.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const [collection, name] = process.argv.slice(2);
const allowed = ['research', 'uiux', 'achievements'];

if (!allowed.includes(collection) || !name) {
  console.error(`Usage: npm run new <${allowed.join('|')}> <file-name>`);
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('Use lowercase letters, numbers and dashes for the file name, e.g. my-new-paper');
  process.exit(1);
}
const dir = join('src', 'content', collection);
const target = join(dir, `${name}.md`);
if (existsSync(target)) {
  console.error(`${target} already exists.`);
  process.exit(1);
}
copyFileSync(join(dir, '_TEMPLATE.md'), target);
console.log(`Created ${target} (as a draft). Its page will be /${collection}/${name}/ once published.`);
