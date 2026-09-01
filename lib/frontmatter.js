/**
 * @by oh-my-zerone
 * @date 2026-07-18
 *
 * Minimal YAML-frontmatter parser shared by the plugin loader and its smoke
 * tests. Pure function, no dependencies.
 */

/**
 * Parse the leading `---` frontmatter block of a SKILL.md file.
 * Handles single-line scalar values and `>`/`|` folded blocks; strips
 * surrounding quotes. Returns `{ fields, body }` where `body` is the content
 * after the closing `---`. Returns `null` when there is no frontmatter block.
 *
 * @param {string} text - full file text.
 * @returns {{ fields: Record<string, string>, body: string } | null}
 */
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return null;
  const fields = {};
  const lines = match[1].split(/\r?\n/);
  let i = 0;
  const keyPattern = /^([a-zA-Z0-9_-]+):\s*(.*)$/;
  while (i < lines.length) {
    const line = lines[i];
    const kv = keyPattern.exec(line);
    if (kv) {
      const [, key, raw] = kv;
      let value = raw.trim();
      if (value === '>' || value === '|') {
        const parts = [];
        i += 1;
        while (i < lines.length && !keyPattern.test(lines[i])) {
          const folded = lines[i].trim();
          if (folded) parts.push(folded);
          i += 1;
        }
        fields[key] = parts.join(' ');
        continue;
      }
      fields[key] = value.replace(/^["']|["']$/g, '');
    }
    i += 1;
  }
  const body = text.slice(match[0].length);
  return { fields, body };
}
