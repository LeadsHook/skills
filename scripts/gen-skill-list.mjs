#!/usr/bin/env node
//
// gen-skill-list.mjs - keep the skill list advertised in prompt.md honest.
//
// prompt.md tells an agent what the leadshook plugin gives it. That list is
// advertising, and advertising drifts: a skill is added, renamed, or dropped and
// the page still describes the old set. This script removes the opportunity. It
// reads the manifests and the skill directories - the things that actually ship -
// and rewrites one delimited region of prompt.md from them.
//
// What this is NOT: it is not a sync gate. It never fetches, never clones, and
// never reads a path outside this repository. Manifests plus a directory listing,
// nothing else.
//
// Source of truth, in order:
//   1. .claude-plugin/marketplace.json            - the published plugin entry
//   2. plugins/leadshook/.claude-plugin/plugin.json - the plugin manifest
//   3. plugins/leadshook/skills/<name>/SKILL.md   - the skills themselves
//
// Skills are AUTO-DISCOVERED by Claude Code from the filesystem. There is no
// "skills" key in plugin.json to read, and one must never be added: the directory
// listing IS the registry, so this script walks it.
//
// Usage:
//   node scripts/gen-skill-list.mjs           rewrite the region in place
//   node scripts/gen-skill-list.mjs --check   exit non-zero if the region is stale

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');

const PLUGIN_DIR = 'plugins/leadshook';
const MARKETPLACE_MANIFEST = '.claude-plugin/marketplace.json';
const PLUGIN_MANIFEST = `${PLUGIN_DIR}/.claude-plugin/plugin.json`;
const SKILLS_DIR = `${PLUGIN_DIR}/skills`;
const PROMPT_FILE = 'prompt.md';

const BEGIN_SENTINEL = '[//]: # (BEGIN GENERATED SKILL LIST)';
const END_SENTINEL = '[//]: # (END GENERATED SKILL LIST)';

// ---------------------------------------------------------------------------
// Failure is loud. A silent fallback here would defeat the whole point: the
// region would keep whatever stale text it already had and CI would pass.
// ---------------------------------------------------------------------------
function fail(message) {
  console.error(`gen-skill-list: ERROR - ${message}`);
  process.exit(2);
}

// Every read goes through here, so the script cannot reach outside the repo.
function repoPath(relative) {
  const full = resolve(REPO_ROOT, relative);
  if (full !== REPO_ROOT && !full.startsWith(REPO_ROOT + sep)) {
    fail(`refusing to read a path outside the repository: ${relative}`);
  }
  return full;
}

function readRepoFile(relative, what) {
  const full = repoPath(relative);
  if (!existsSync(full)) {
    fail(`${what} is missing: ${relative}`);
  }
  try {
    return readFileSync(full, 'utf8');
  } catch (error) {
    return fail(`${what} could not be read (${relative}): ${error.message}`);
  }
}

function readRepoJson(relative, what) {
  const raw = readRepoFile(relative, what);
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fail(`${what} is not valid JSON (${relative}): ${error.message}`);
  }
}

// ---------------------------------------------------------------------------
// Minimal YAML frontmatter reader. SKILL.md frontmatter is a flat block of
// "key: value" lines, optionally wrapped onto following indented lines. That is
// all this needs to understand, and pulling in a YAML dependency for it would
// make a zero-dependency script installable-only.
// ---------------------------------------------------------------------------
function parseFrontmatter(text, relative) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    fail(`${relative} has no frontmatter block (it must start with "---")`);
  }

  let closing = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      closing = i;
      break;
    }
  }
  if (closing === -1) {
    fail(`${relative} has an unterminated frontmatter block (no closing "---")`);
  }

  const fields = {};
  let currentKey = null;
  for (const line of lines.slice(1, closing)) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (match) {
      currentKey = match[1];
      fields[currentKey] = match[2].trim();
    } else if (currentKey && line.trim()) {
      fields[currentKey] = `${fields[currentKey]} ${line.trim()}`.trim();
    }
  }

  for (const key of Object.keys(fields)) {
    fields[key] = fields[key].replace(/^["'](.*)["']$/s, '$1').trim();
  }

  return fields;
}

// The advertised line is one sentence. Anything longer belongs in the skill.
function firstSentence(text) {
  const collapsed = text.replace(/\s+/g, ' ').trim();
  const match = /^(.*?[.!?])(\s|$)/.exec(collapsed);
  return match ? match[1] : collapsed;
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------
function discoverSkills() {
  const dir = repoPath(SKILLS_DIR);
  if (!existsSync(dir)) {
    fail(`the skills directory is missing: ${SKILLS_DIR}`);
  }

  const entries = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const skills = [];
  for (const directoryName of entries) {
    const relative = `${SKILLS_DIR}/${directoryName}/SKILL.md`;
    if (!existsSync(repoPath(relative))) {
      fail(`${SKILLS_DIR}/${directoryName} is not a skill: it has no SKILL.md`);
    }

    const fields = parseFrontmatter(readRepoFile(relative, 'a skill'), relative);
    if (!fields.name) {
      fail(`${relative} has no frontmatter "name"`);
    }
    if (!fields.description) {
      fail(`${relative} has no frontmatter "description"`);
    }
    if (fields.name !== directoryName) {
      fail(
        `${relative} declares name "${fields.name}" but lives in the directory ` +
          `"${directoryName}"; the two must match`,
      );
    }

    skills.push({ name: fields.name, summary: firstSentence(fields.description) });
  }

  if (skills.length === 0) {
    fail(`no skills found under ${SKILLS_DIR}`);
  }

  skills.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  return skills;
}

function readPluginEntry() {
  const pluginManifest = readRepoJson(PLUGIN_MANIFEST, 'the plugin manifest');
  if (!pluginManifest.name) {
    fail(`${PLUGIN_MANIFEST} has no "name"`);
  }

  const marketplace = readRepoJson(MARKETPLACE_MANIFEST, 'the marketplace manifest');
  if (!Array.isArray(marketplace.plugins)) {
    fail(`${MARKETPLACE_MANIFEST} has no "plugins" array`);
  }

  const entry = marketplace.plugins.find((plugin) => plugin?.name === pluginManifest.name);
  if (!entry) {
    fail(
      `${MARKETPLACE_MANIFEST} has no plugin entry named "${pluginManifest.name}" ` +
        `(the name declared by ${PLUGIN_MANIFEST})`,
    );
  }
  if (!entry.version) {
    fail(`the "${entry.name}" entry in ${MARKETPLACE_MANIFEST} has no "version"`);
  }

  return { name: entry.name, version: entry.version };
}

// ---------------------------------------------------------------------------
// Region rendering
// ---------------------------------------------------------------------------
function renderRegion(plugin, skills) {
  const count = `${skills.length} skill${skills.length === 1 ? '' : 's'}`;
  return [
    BEGIN_SENTINEL,
    '',
    '### What you get',
    '',
    `The \`${plugin.name}\` plugin (version ${plugin.version}) ships ${count}:`,
    '',
    ...skills.map((skill) => `- **${skill.name}** - ${skill.summary}`),
    '',
    END_SENTINEL,
  ].join('\n');
}

function locateRegion(promptText) {
  const lines = promptText.split('\n');
  const begin = lines.findIndex((line) => line.trim() === BEGIN_SENTINEL);
  const end = lines.findIndex((line) => line.trim() === END_SENTINEL);

  if (begin === -1 || end === -1) {
    fail(
      `${PROMPT_FILE} has no generated region. Add these two lines, one blank line ` +
        `apart, where the skill list belongs:\n  ${BEGIN_SENTINEL}\n  ${END_SENTINEL}`,
    );
  }
  if (end < begin) {
    fail(`${PROMPT_FILE} has its generated-region sentinels in the wrong order`);
  }

  return { lines, begin, end };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const checkOnly = process.argv.slice(2).includes('--check');

const plugin = readPluginEntry();
const skills = discoverSkills();
const expectedRegion = renderRegion(plugin, skills);

const promptText = readRepoFile(PROMPT_FILE, 'the setup prompt');
const { lines, begin, end } = locateRegion(promptText);
const currentRegion = lines.slice(begin, end + 1).join('\n');

if (currentRegion === expectedRegion) {
  console.log(
    `gen-skill-list: OK - ${PROMPT_FILE} advertises the ${skills.length} skill(s) that ship.`,
  );
  process.exit(0);
}

if (checkOnly) {
  console.error(`gen-skill-list: FAIL - the generated region in ${PROMPT_FILE} is out of date.`);
  console.error('');
  console.error('--- in prompt.md -------------------------------------------------');
  console.error(currentRegion);
  console.error('--- generated from the manifests and skill directories ------------');
  console.error(expectedRegion);
  console.error('-------------------------------------------------------------------');
  console.error('');
  console.error('Run: node scripts/gen-skill-list.mjs');
  process.exit(1);
}

const updated = [...lines.slice(0, begin), expectedRegion, ...lines.slice(end + 1)].join('\n');
writeFileSync(repoPath(PROMPT_FILE), updated, 'utf8');
console.log(
  `gen-skill-list: updated ${PROMPT_FILE} - now advertising ${skills.length} skill(s): ` +
    `${skills.map((skill) => skill.name).join(', ')}.`,
);
