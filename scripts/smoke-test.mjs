/**
 * @by oh-my-zerone
 * @date 2026-07-18
 *
 * Smoke test: verify every embedded SKILL.md under `./skills` parses through
 * the production frontmatter loader and yields a non-empty name, description
 * and body. Run with: `node scripts/smoke-test.mjs`
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '../lib/frontmatter.js';

const skillsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills');

let ok = 0;
let fail = 0;
const failures = [];

for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillFile = join(skillsDir, entry.name, 'SKILL.md');
  if (!statSync(skillFile, { throwIfNoEntry: false })) continue;
  const parsed = parseFrontmatter(readFileSync(skillFile, 'utf8'));
  const name = parsed?.fields.name;
  const description = parsed?.fields.description;
  const bodyLength = parsed?.body?.length ?? 0;
  const pass =
    typeof name === 'string' && name.length > 0 &&
    typeof description === 'string' && description.length > 0 &&
    bodyLength > 0;
  console.log(`${pass ? 'OK  ' : 'FAIL'} ${entry.name} name=${name} descLen=${description?.length ?? 0} bodyLen=${bodyLength}`);
  if (pass) ok += 1;
  else { fail += 1; failures.push(entry.name); }
}

console.log(`\n${ok} skills OK, ${fail} failed`);
if (failures.length > 0) console.log(`failed: ${failures.join(', ')}`);
process.exit(fail === 0 ? 0 : 1);
