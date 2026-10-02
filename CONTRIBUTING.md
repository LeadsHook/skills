# Contributing

This repository is public. Every file in it is read by LeadsHook customers and by the
AI agents those customers run. Nothing here may assume the reader has access to
LeadsHook's private source code, its build tooling, or its internal environments.

---

## The authoring contract for public skills

This contract governs **every file a customer or their agent can read**: skill files,
bundled section templates, the README, and any prose shipped inside the plugin.

It is written as a list of checks, not as advice, because CI enforces it mechanically
(`scripts/content-guard.sh`). If a check matches, the build fails. Treat each `[ ]`
below as something you tick before opening a pull request.

> **One exception, by design:** this file is the only place in the repository where the
> forbidden strings may legitimately appear, and only inside the fenced block in
> §3.2. The content guard must exclude `CONTRIBUTING.md` and the guard script itself,
> or both will trip on their own pattern list.

---

### 1. The permitted interface — this is the whole surface

A public skill may instruct an agent to use exactly two things:

1. **MCP tools**, by their exact **underscored** names, from the inventory in §1.1.
2. **`leadshook://` resources**, from the list in §1.2.

**Nothing else.** No shell commands. No file paths into LeadsHook's own source. No
package installs. No hand-rolled HTTP calls against the product API. If a skill needs
a capability that is not a tool or a resource, that capability does not exist yet —
say so in a pull request rather than inventing a workaround.

#### 1.1 The 25 tools

These names are verified name-for-name against the production MCP server.

| Group | Tools |
| --- | --- |
| Account and shared (6) | `whoami`, `list_accounts`, `select_account`, `list_projects`, `list_leads`, `search_images` |
| Decision tree (11) | `list_decision_trees`, `get_decision_tree`, `create_dt_from_questions`, `get_dt_design_context`, `save_dt_design`, `import_decision_tree`, `export_decision_tree`, `update_decision_tree`, `delete_decision_tree`, `generate_node`, `add_node` |
| Page builder (6) | `list_pages`, `create_page`, `update_page_sections`, `update_page_image`, `delete_page`, `build_page` |
| Vault (2) | `list_vault_segments`, `get_vault_segment_context` |

Checks:

- [ ] Every tool name written anywhere in the repository appears **verbatim** in the
      table above.
- [ ] Every tool name uses **underscores**. A hyphenated variant is not an alias — it
      is a name that does not exist, and the agent's call fails at runtime.
- [ ] No prose states a tool count that was not checked against this table.
- [ ] A skill that calls an account-scoped tool first tells the agent to call
      `select_account`. Account-scoped tools do not work before it.

#### 1.2 The five resources

| URI | What it carries |
| --- | --- |
| `leadshook://references/dt-rendering` | How a decision tree renders to a visitor. |
| `leadshook://references/page-builder-spec` | The page builder's rules: section JSON shape, valid categories, theme system, editor constraints. |
| `leadshook://references/dt-design-json-schema` | The schema for a decision tree's design payload. |
| `leadshook://schemas/node` | The node-type index. Generated from a directory listing at request time. |
| `leadshook://schemas/node/{type}` | One node type's schema. A URI template — substitute the type. |

Checks:

- [ ] Every `leadshook://` URI written anywhere in the repository is one of the five
      above (the `{type}` form being a template, not a literal).
- [ ] No invented resource namespace, no invented resource path.

---

### 2. Division of labour: resources carry truth, skills carry judgement

This boundary is the reason the contract exists, so state it plainly:

- **MCP resources carry schemas and product truth.** They are versioned and deployed
  with the server, so they are always current.
- **Skills carry client-side selection and composition heuristics.** They are installed
  on a customer's machine and change only when the plugin version is bumped, so they go
  stale between releases.

Therefore **a skill must defer schema detail to a resource rather than restate it.**
A restated schema is not a risk of going stale — it is guaranteed to go stale, and the
customer has no way to tell that it has.

The split in one line each:

- A resource answers **"what fields does this node have?"**
- A skill answers **"which node should this question be?"**

Checks:

- [ ] No skill file restates a field list, an enumeration of valid values, or a JSON
      shape that a resource already owns.
- [ ] No skill file hardcodes a count — of node types, of section categories, of fields.
      Those are generated at request time and a written count is wrong the day it ships.
- [ ] Where schema detail is needed, the skill **names the resource URI and instructs
      the agent to read it** instead of reproducing the contents.
- [ ] What a skill keeps for itself is judgement: which node type suits an answer type
      and option count, how to sequence and branch, which page sections a described page
      needs and in what order, and what good output looks like.

---

### 3. Forbidden content

#### 3.1 The categories

Each row is a category the CI guard greps for. "Write instead" is the fix, not a
suggestion.

| # | Forbidden category | Why it is forbidden | Write instead |
| --- | --- | --- | --- |
| 1 | Source-tree directory paths from LeadsHook's private repository — the application directory, the shared-library directory, the internal agent directory, and the working-notes directory | The customer has no such repository. The path is unresolvable and leaks internal structure. | Name the MCP tool or resource that does the job. |
| 2 | Internal package names — anything under the private `@leadshook` npm scope | Those packages are not published. A customer cannot install them. | Nothing. Customers never touch LeadsHook's packages. |
| 3 | Build, test and lint commands — the internal package manager, the monorepo task runner, direct TypeScript compiler invocations | Customers do not build LeadsHook. These commands only make sense inside the private repository. | Nothing. A skill drives tools, not builds. |
| 4 | Internal spec paths — the internal references directory and the design-markdown scratch directory | Same as #1: unresolvable, and it points at material the customer cannot open. | The matching `leadshook://` resource. |
| 5 | Architecture-decision-record citations in **any** form — a numbered identifier, or a path into the decision-record directory | Decision records are internal engineering history. They mean nothing to a customer and cannot be opened. | State the behaviour itself. If the reason matters, explain it in one sentence. |
| 6 | Internal hostnames — the local development domain, the cloud development domain, and the loopback host | These resolve to nothing on a customer's machine, or worse, to something of theirs. | `https://mcp.leadshook.app/mcp` and `https://agents.leadshook.app` are the only hosts customer content should name. `https://leadshook.app` is fine for the product itself. |
| 7 | Internal agent and skill names — the names of LeadsHook's own engineering subagents, and the internal slash-command skill names these public skills were written fresh from | They are internal tooling names, they read as jargon, and a customer has none of them installed. Reusing one as a public skill name also mis-triggers. | Name the public skill for what a customer says they want. |
| 8 | Any host or path belonging to LeadsHook's internal source forge | The internal forge is private. The only repository a customer ever sees is `github.com/LeadsHook/skills`. | `github.com/LeadsHook/skills`, or nothing. |

#### 3.2 Forbidden examples — the only block where these strings may appear

Everything inside this fence is an **example of what not to write**. Nothing in it is
guidance, and nothing in it may be copied into any other file in this repository.

```text
# 1. private source-tree paths
apps/**            packages/**            .agents/**            context/**
apps/api/src/modules/...

# 2. internal package names
@leadshook/types   @leadshook/billing     @leadshook/*

# 3. build / test / lint commands
pnpm install       pnpm test              nx build              npx tsc --noEmit

# 4. internal spec paths
context/references/**                     tmp/design-md/**

# 5. decision-record citations
ADR-0129           docs/adr/2026-01-01-some-slug.md

# 6. internal hostnames
app.leadshook.net  api.leadshook.net      dt.leadshook.net
api.leadshook.dev  dashboard.leadshook.dev
localhost:4200     http://localhost:3000

# 7. internal agent / skill names
generate-decision-tree     generate-page      generate-page-from-design
general-purpose            docs-maintainer    debug-specialist

# 8. internal forge
gitlab.leadshook.com       any gitlab.* host or path
```

Checks:

- [ ] No file other than this one contains any string from the block above.
- [ ] Within this file, every such string is inside that fence.
- [ ] Nothing in the block is presented anywhere as real guidance.

---

### 4. Two verified return shapes worth writing down

These two trip up skill authors who guess from the tool name. Both are verified against
the production server. Do not document them any other way.

| Tool | Actual return | The wrong assumption |
| --- | --- | --- |
| `whoami` | `{ email }` — **email only** | That it also returns an `id`. It does not. Never document an `id` on `whoami`. |
| `list_accounts` | A **bare JSON array** of `{ id, name }` | That it is wrapped in an object with an `accounts` key. It is not. |

Checks:

- [ ] No skill documents an `id` field on `whoami`.
- [ ] No skill instructs an agent to read an `accounts` key off `list_accounts`.
- [ ] Any other return shape a skill describes was observed against the live server, not
      inferred from the tool's name.

---

### 5. Skill file structure

Skills are auto-discovered from the `skills/` directory at the plugin root. There is no
registration array to maintain, and adding one is redundant drift.

```
plugins/leadshook/
  .claude-plugin/
    plugin.json          <- only plugin.json lives in here
  skills/
    <skill-name>/
      SKILL.md           <- required
      references/        <- optional longer guidance, read on demand
      templates/         <- optional bundled assets
```

Checks:

- [ ] One directory per skill, under `skills/` at the plugin root.
- [ ] Each skill directory contains a `SKILL.md`.
- [ ] `SKILL.md` opens with YAML frontmatter containing `name` and `description`, and
      the frontmatter parses.
- [ ] `name` matches the directory name, is customer-facing, and is not reused from any
      internal tooling name (category 7).
- [ ] `description` is written in the words a **customer** uses ("build a lead capture
      form", "make a landing page"), not the words an engineer uses ("generate node
      JSON", "emit section objects"). It is the only thing a client matches against the
      customer's request.
- [ ] Two skills' `description` values do not overlap in trigger surface — a single
      request must not fire both.
- [ ] No `argument-hint` and no slash-command framing. These are model-invoked skills,
      not commands a customer types.
- [ ] Bundled assets are self-contained: no internal path, no internal host, no
      placeholder a customer cannot resolve.
- [ ] `SKILL.md` stays the entry point: it names each file in `references/` and says
      when to read it. Detail lives in references, not in an ever-growing `SKILL.md`.
- [ ] After adding, renaming or removing a skill or any file inside one, run
      `node scripts/gen-skill-list.mjs`. It regenerates the skill list in
      `prompt.md` and `skills.json`, the index agents on other clients use to copy
      every file of every skill. CI fails if either is stale.
- [ ] A reference several skills need is copied into each of them, and the copies are
      **identical**. Skills cannot reliably read each other's files on every client.
      `scripts/check-shared-references.sh` lists the shared files and fails if any copy
      drifts — edit one, then copy it to the others.

---

### 6. Pre-submit checklist

Run through this before opening a pull request. It is the same list CI applies.

- [ ] §1.1 — every tool name is in the 25-tool table and underscored.
- [ ] §1.2 — every `leadshook://` URI is one of the five resources.
- [ ] §2 — no schema, field list, category enumeration or count is restated; schema
      detail is deferred to a resource by URI.
- [ ] §3 — no file contains any of the eight forbidden categories.
- [ ] §4 — `whoami` and `list_accounts` return shapes are documented correctly, or not
      at all.
- [ ] §5 — skill layout, frontmatter, and customer-facing naming all hold.
- [ ] The only hosts named are `mcp.leadshook.app`, `agents.leadshook.app`,
      `leadshook.app`, and `github.com/LeadsHook/skills`.
- [ ] `scripts/content-guard.sh` exits 0 on the whole tree.

---

## Support

- LeadsHook: https://leadshook.app
- This marketplace: https://github.com/LeadsHook/skills
