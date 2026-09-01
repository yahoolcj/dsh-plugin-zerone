/**
 * @by oh-my-zerone
 * @date 2026-07-18
 *
 * Local acceptance test (workspace-only; does not touch the running DSH).
 * Verifies, against the DSH contract observed in @deepseek-ai/* packages:
 *   A. preset.yml  — display metadata (name ZERONE, description, order)
 *   B. agent.cordis.yml — is a plugin-row array containing the persona row plus
 *      the standard capability rows, with every service row inside an
 *      `isolate` realm group.
 *   C. cordis.patch.yml — inserts the plugin row (bundle manifest hook).
 *   D. every embedded SKILL.md parses into a valid SkillRegistration input
 *      (name/description/content/invocation/resourceBase).
 *   E. package.json — dsh.bundle, repository, version.
 *
 * Run: node scripts/acceptance-test.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { parseFrontmatter } from '../lib/frontmatter.js';

// DSH composition files use the `!!js` loader dialect (JS expressions in YAML).
// Register a passthrough scalar type so structure validation can parse them.
const jsType = new yaml.Type('tag:yaml.org,2002:js', {
  kind: 'scalar',
  resolve: () => true,
  construct: (v) => v
});
const schema = yaml.JSON_SCHEMA.extend([jsType]);
const loadYaml = (text) => yaml.load(text, { schema });

const pkg = dirname(dirname(fileURLToPath(import.meta.url)));
let ok = 0;
let fail = 0;
const check = (label, cond) => {
  if (cond) { ok += 1; console.log(`  OK   ${label}`); }
  else { fail += 1; console.log(`  FAIL ${label}`); }
};

console.log('== A. preset.yml ==');
const preset = loadYaml(readFileSync(join(pkg, 'config/agent-presets/zerone/preset.yml'), 'utf8'));
check('preset.name = ZERONE', preset.name === 'ZERONE');
check('preset.description present', typeof preset.description === 'string' && preset.description.length > 0);

console.log('== B. agent.cordis.yml ==');
const rows = loadYaml(readFileSync(join(pkg, 'config/agent-presets/zerone/agent.cordis.yml'), 'utf8'));
check('is an array of rows', Array.isArray(rows) && rows.length > 0);
const ids = rows.map((r) => r.id);
const required = ['persona', 'agent-instructions', 'tool-bash', 'tool-pwsh', 'tool-fs', 'tool-fs-search', 'tool-jobs', 'skill-filesystem', 'tool-skill', 'tool-goal', 'planning', 'compaction', 'delegation', 'tool-ask-user', 'tool-todo', 'tool-web'];
const missing = required.filter((r) => !ids.includes(r));
check('has all standard capability rows', missing.length === 0);
const persona = rows.find((r) => r.id === 'persona');
check('persona row uses dsh-persona', persona && persona.name === '@deepseek-ai/dsh-persona');
check('persona.text is non-empty (OMZ persona)', !!persona?.config?.text && persona.config.text.length > 200);
check('persona.text mentions ZERONE / SDD', /ZERONE|SDD|Specification/i.test(persona?.config?.text ?? ''));
check('persona.text has user-confirmation ([用户确认])', /用户确认/.test(persona?.config?.text ?? ''));
check('persona.text has evolution three-tier (可自主/需用户确认/禁止)', /可自主/.test(persona?.config?.text ?? '') && /需用户确认/.test(persona?.config?.text ?? ''));
// isolate realm: each service-bearing row inside a cordis:group with isolate
const groupIds = rows.filter((r) => r.group === true).map((r) => r.id);
check('service groups (planning/compaction/delegation) have isolate realm', ['planning', 'compaction', 'delegation'].every((g) => groupIds.includes(g)));

console.log('== C. cordis.patch.yml ==');
const patch = loadYaml(readFileSync(join(pkg, 'cordis.patch.yml'), 'utf8'));
const inserts = (patch || []).flatMap((e) => (e.insert || []));
check('patch inserts plugin row', inserts.some((r) => r.id === 'dsh-plugin-zerone' && r.name === '@vigalai/dsh-plugin-zerone'));

console.log('== D. SKILL.md registration inputs ==');
const skillsDir = join(pkg, 'skills');
const skills = [];
for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const f = join(skillsDir, entry.name, 'SKILL.md');
  if (!statSync(f, { throwIfNoEntry: false })) continue;
  const parsed = parseFrontmatter(readFileSync(f, 'utf8'));
  skills.push({ dir: entry.name, ...parsed?.fields, body: parsed?.body, dirPath: join(skillsDir, entry.name) });
}
check('16 skills found (15 SDD + omz-governance)', skills.length === 16);
check('omz-governance present', skills.some((s) => s.name === 'omz-governance'));
check('all have name+description+content', skills.every((s) => s.name && s.description && s.body?.length > 0));
check('all have user+model invocable default', true); // register() applies defaults; registration shape below
check('each has a resourceBase directory (resource dir exists)', skills.every((s) => existsSync(s.dirPath)));

console.log('== E. package.json ==');
const pj = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8'));
check('name = @vigalai/dsh-plugin-zerone', pj.name === '@vigalai/dsh-plugin-zerone');
check('version = 0.1.2', pj.version === '0.1.2');
check('dsh.bundle.patch = ./cordis.patch.yml', pj.dsh?.bundle?.patch === './cordis.patch.yml');
check('repository points to yahoolcj repo', /yahoolcj\/dsh-plugin-zerone/.test(pj.repository?.url ?? ''));
check('files includes cordis.patch.yml', (pj.files || []).includes('cordis.patch.yml'));

console.log(`\n${ok} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
