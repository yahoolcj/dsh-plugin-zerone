/**
 * @by oh-my-zerone
 * @date 2026-07-18
 *
 * @vigalai/dsh-plugin-zerone — OMZ built-in plugin for DeepSeek Harness.
 *
 * Registers the 15 OMZ SDD workflow skills plus the `omz-governance` mechanism
 * skill as runtime skills (rank 250) through `ctx.skills.register()`. Skill
 * bodies are embedded resources under `./skills/<name>/SKILL.md`; nothing is
 * written into the user's skills directories.
 *
 * The ZERONE agent preset ships alongside at `config/agent-presets/zerone/`
 * and is exposed by the host composition via `agentPresets.roots`.
 */
import z from '@deepseek-ai/schemastery';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { parseFrontmatter } from './frontmatter.js';

/** Cordis plugin name. Unique against every other mounted row. */
const name = 'dsh-plugin-zerone';

/** The registries this row consumes. `skills` must already be mounted (host plane). */
const inject = ['skills'];

/** Runtime schema for the plugin row. */
const Config = z.object({
  /** Directory containing `<skill>/SKILL.md` bundles. Defaults to the package's own `./skills`. */
  skillsDir: z.string().optional()
});

/** Resolve the default skills directory relative to this module. */
function defaultSkillsDir() {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'skills');
}

/**
 * Load every `<skillDir>/<name>/SKILL.md` bundle into a skill definition list.
 * `name` and `description` come from the frontmatter; the body becomes
 * `content`; the skill's own directory is advertised as the resource base so
 * the model can resolve relative references (CONTEXT-FORMAT.md, agents/*.yaml).
 */
function loadSkillDefinitions(skillsDir) {
  const definitions = [];
  let entries;
  try {
    entries = readdirSync(skillsDir, { withFileTypes: true });
  } catch {
    return definitions;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillDir = join(skillsDir, entry.name);
    const skillFile = join(skillDir, 'SKILL.md');
    if (!statSync(skillFile, { throwIfNoEntry: false })) continue;
    const text = readFileSync(skillFile, 'utf8');
    const parsed = parseFrontmatter(text);
    if (!parsed || typeof parsed.fields.name !== 'string' || typeof parsed.fields.description !== 'string') {
      throw new Error(`skill "${entry.name}" SKILL.md is missing frontmatter name/description`);
    }
    definitions.push({
      name: parsed.fields.name,
      description: parsed.fields.description,
      content: parsed.body,
      resourceBase: { kind: 'directory', path: skillDir },
      invocation: { modelInvocable: true, userInvocable: true }
    });
  }
  return definitions;
}

/**
 * Register the embedded skills for the mounting context's scope. Mounted on
 * the host plane (unscoped context) the contributions land in the GLOBAL
 * layer, so every preset's agents — including `standard` — see the catalog.
 */
function apply(ctx, config) {
  const skillsDir = config.skillsDir ?? defaultSkillsDir();
  ctx.effect(() => {
    const disposers = [];
    for (const definition of loadSkillDefinitions(skillsDir)) {
      disposers.push(ctx.skills.register(definition));
    }
    ctx.logger.info(`[dsh-plugin-zerone] registered ${disposers.length} runtime skills from ${skillsDir}`);
    return () => {
      for (const dispose of disposers) dispose();
    };
  }, 'dsh-plugin-zerone.skills()');
}

export { Config, apply, inject, name };
