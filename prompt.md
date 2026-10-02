# Connect your agent to LeadsHook

## 1. What this does

You are an AI coding agent reading your own setup instructions. Follow this page from
top to bottom. When you are done, you will be able to build, edit, and publish
LeadsHook decision trees and landing pages against a real LeadsHook account, by
calling LeadsHook tools directly from your session.

LeadsHook runs a hosted MCP server at `https://mcp.leadshook.app/mcp`. Connecting to
it is the whole job. How you connect depends on which client you are running in, so
find your client below and follow only that section.

**How to read every instruction on this page:**

- Every step is addressed to you. You run it. You read the output. You report the
  result.
- Do not hand a command back to the person you are working with, and do not wait for
  them to paste something for you. If a step can be run, run it.
- There is exactly **one** human action in this entire procedure: a single browser
  login, where a person signs in to LeadsHook and approves your access. It happens
  once, and this page tells you exactly when it happens. Nothing else requires a
  human.
- If a step fails, do not improvise a workaround. Go to the Troubleshooting section.

## 2. Claude Code

Run these two commands, in this order, in your Claude Code session:

```
/plugin marketplace add LeadsHook/skills
/plugin install leadshook@leadshook
```

The first command registers the LeadsHook marketplace. The second installs the
`leadshook` plugin from it.

Use the `LeadsHook/skills` shorthand exactly as written. Adding the marketplace by a
direct URL to its manifest file does **not** work: a manifest fetched that way cannot
resolve the plugin's relative source path, so the install fails. The `owner/repo`
shorthand is the supported path, and it is the only one this page advertises.

After the install completes, restart Claude Code or run `/reload-plugins` so the new
plugin is active in your session.

[//]: # (BEGIN GENERATED SKILL LIST)

### What you get

The `leadshook` plugin (version 0.2.1) ships 4 skills:

- **build-decision-tree** - Build a LeadsHook quiz, survey, lead capture form or qualification funnel, or add a question or step to one you already have.
- **build-landing-page** - Build, restyle, or extend a LeadsHook landing page.
- **review-decision-tree** - Review or audit an existing LeadsHook decision tree, quiz or funnel and report what is wrong with it.
- **style-decision-tree** - Change how a LeadsHook decision tree, quiz or form looks — colours, fonts, buttons, corner style, spacing — or make it match a brand, a website or a design system.

[//]: # (END GENERATED SKILL LIST)

### Do not register the MCP server yourself

> **STOP. Do NOT add, register, or configure the LeadsHook MCP server manually.**
>
> The plugin already declares the LeadsHook MCP server. Installing the plugin is the
> complete connection step. There is nothing left for you to wire up.
>
> Adding the server by hand creates a **second, duplicate, competing server entry**.
> Two entries for the same server produce duplicated tool names, ambiguous routing,
> and an authentication state that is attached to one entry while your calls go to
> the other. It is harder to diagnose than it is to avoid.
>
> This warning exists because the instinct to be helpful points the wrong way here.
> If you find yourself reasoning that adding the server config would be safer, more
> explicit, more robust, or a harmless double-check, that reasoning is wrong and this
> line is the answer to it. Do not edit an MCP config file. Do not run a command that
> adds an MCP server. Do not "make sure" the server is registered by registering it.
> Install the plugin and stop.

### When the login happens

Installing the plugin does **not** open a browser and does **not** ask anyone to log
in. No prompt appears at install time, and that is correct behaviour.

The browser consent prompt appears on the **first LeadsHook tool call**. At that
moment, a browser opens, a person signs in to their LeadsHook account, and approves
your access. That single approval is the one human action in this whole procedure.

Do not treat a quiet install as a failure. Do not re-run the install commands looking
for a login prompt. Do not go hunting for a separate authentication step. Install,
then make your first tool call, and the login will come to you.

### If the clone fails on SSH

The `owner/repo` shorthand clones over SSH by default. On a machine with no GitHub
SSH keys configured, the marketplace add will fail at the clone step.

If that happens, set this environment variable and run the two commands again:

```
export CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1
```

With that variable set, the clone goes over HTTPS instead.

## 3. Clients that install the plugin: Codex, Copilot CLI, Grok Build

These three clients install the same `leadshook` plugin as Claude Code, from
the same marketplace. One install gives you the MCP server **and** the skills,
and the client's own update command keeps both current. Use this section if
you are one of them; it replaces sections 4 and 5 for you.

**Do not register the MCP server yourself in these clients either.** The
plugin declares it, exactly as in Claude Code, and section 2's warning applies
word for word: a second registration is a duplicate, competing entry. Do not
run `codex mcp add`, `copilot mcp add` or `grok mcp add` for LeadsHook.

If the `plugin` command does not exist in the client you are running, it is an
older release. Use section 4 for it instead, then section 5.

### Codex

```
codex plugin marketplace add LeadsHook/skills
codex plugin add leadshook@leadshook
```

Then sign in, which opens the browser for the single human login described in
section 1:

```
codex mcp login leadshook
```

To update later:

```
codex plugin marketplace upgrade leadshook
codex plugin add leadshook@leadshook
```

The first command refreshes the marketplace; the second reinstalls the plugin
from it.

### Copilot CLI

This is the `copilot` command-line agent. Copilot in VS Code is a different
client: it is in section 4.

```
copilot plugin marketplace add LeadsHook/skills
copilot plugin install leadshook@leadshook
```

The browser sign-in happens when Copilot first connects to the server. If it
asks for a client ID or a client secret instead, stop and report it, as the
Cursor warning in section 4 says.

To update later:

```
copilot plugin update leadshook@leadshook
```

### Grok Build

This is the `grok` command-line agent. Grok in the browser and the Grok apps
are a different client: they get the skills through section 5, Route B.

```
grok plugin marketplace add LeadsHook/skills
grok plugin install leadshook@skills --trust
```

Note **`@skills`**, not `@leadshook`. Grok names a marketplace after its
repository, so `leadshook@leadshook` fails with "Unknown marketplace". `--trust`
answers Grok's trust prompt, which you cannot answer interactively; the person
asking you to set up LeadsHook is the one who trusts it.

`grok mcp doctor` lists the server under "plugin: leadshook". The browser
sign-in happens on the first connection. If it asks for a client ID or a client
secret instead, stop and report it.

To update later:

```
grok plugin marketplace update
grok plugin update leadshook
```

## 4. Other clients: Cursor, Copilot in VS Code, Windsurf, and the rest

These clients do not install the plugin, so you register the MCP server here
and then install the skills in section 5. Codex is here too, for releases older
than its `plugin` command.

All of them register the same endpoint: `https://mcp.leadshook.app/mcp`.

**Read only your own client's subsection, and copy only from it.** These four
clients use four incompatible config shapes: different file formats, different
top-level keys, different names for the URL key. Only VS Code uses the same form
as Claude Code. Copying one client's block into another client's config fails
**silently** — the file still parses, the client still starts, and the server
simply never appears. Do not pattern-match across these subsections.

### Codex (older releases without `codex plugin`)

Config file: `~/.codex/config.toml` for every project, or `.codex/config.toml`
inside a project for that project only. This file is **TOML, not JSON**.

The direct route is the CLI, which writes the TOML for you. Run it:

```
codex mcp add leadshook --url https://mcp.leadshook.app/mcp
```

If you edit the file by hand instead, add this table:

```toml
[mcp_servers.leadshook]
url = "https://mcp.leadshook.app/mcp"
```

Note `mcp_servers` with an underscore, and note that there is **no `type` key**.
Codex has no transport field at all: supplying a `url` *is* the transport
selector — a remote server given a `url` uses the Streamable HTTP transport
automatically. `auth` defaults to `oauth`, so you do not set that either.

Then sign in:

```
codex mcp login leadshook
```

That opens the browser for the single human login described in section 1. Codex
supports OAuth fully, including Dynamic Client Registration, so nobody is asked
for a client ID or a client secret.

The official Codex documentation does not state a Windows config path. If you
are on Windows, do not invent one — run the `codex mcp add` command above and let
Codex write the file wherever it keeps it.

Then install the skills: section 5.

### Cursor

Config file: `~/.cursor/mcp.json` for every project, or `.cursor/mcp.json` inside
a project for that project only. Cursor can also install it from its Customize
panel.

```json
{
  "mcpServers": {
    "leadshook": {
      "url": "https://mcp.leadshook.app/mcp"
    }
  }
}
```

The top-level key is `mcpServers`, and the URL key is `url`. **Omit `type`.** In
Cursor, `type` is only for stdio servers (`"type": "stdio"`); remote servers do
not carry it. Do not copy the `"type": "http"` line from the VS Code subsection
or from a Claude Code config into this file.

> ⚠️ **UNVERIFIED: the browser sign-in flow on Cursor.**
>
> LeadsHook has not verified this login path on Cursor. Cursor's official
> documentation describes only static OAuth client credentials and never
> mentions Dynamic Client Registration, so we cannot promise the browser prompt
> behaves the way it does in Claude Code.
>
> **If Cursor asks you for a client ID or a client secret, STOP.** Do not paste
> any credential. Do not invent one, and do not go looking for one anywhere on
> the machine. LeadsHook never requires a pasted credential, so a prompt asking
> for one means something is wrong. Report exactly what Cursor asked for, and go
> no further.

Then install the skills: section 5.

### Copilot (VS Code)

Config file for a single workspace: `.vscode/mcp.json` in that workspace.

For the user profile there is **no published file path**. Do not invent one and
do not search the filesystem for it. Open the Command Palette and run the command
**`MCP: Open User Configuration`**, which opens the correct file directly.

```json
{
  "servers": {
    "leadshook": {
      "type": "http",
      "url": "https://mcp.leadshook.app/mcp"
    }
  }
}
```

Two things differ from the other three clients: the top-level key is **`servers`**,
not `mcpServers`; and **both `type` and `url` are required**, with
`"type": "http"`. This is the one client of the four whose shape matches Claude
Code's.

OAuth is first class here. VS Code handles it for you: a browser window opens on
the first connection to the server, and that is the single human login described
in section 1. It registers dynamically, so no one is asked for a client ID or a
client secret. If a re-authentication is ever needed, VS Code shows an `Auth`
CodeLens directly above the server entry in the config file.

Then install the skills: section 5.

### Windsurf (now Cognition "Devin Desktop")

Config file: `~/.codeium/windsurf/mcp_config.json`. The `codeium` and `windsurf`
directory names survived the rebrand to Devin Desktop, so that path is still the
correct one.

```json
{
  "mcpServers": {
    "leadshook": {
      "serverUrl": "https://mcp.leadshook.app/mcp"
    }
  }
}
```

⚠️ The URL key here is **`serverUrl`**, not `url`. This is unique to Windsurf.
A plain `url` key will **not** work: Windsurf does not read it, and the server
never connects. No `type` field is documented for this client — do not add one.

> ⚠️ **UNVERIFIED: the browser sign-in flow on Windsurf.**
>
> Windsurf's documentation claims OAuth support in a single sentence and
> publishes no mechanics for it. LeadsHook has not verified this login path.
>
> **If Windsurf asks you for a client ID or a client secret, STOP.** Do not paste
> any credential. Do not invent one, and do not go looking for one anywhere on
> the machine. LeadsHook never requires a pasted credential, so a prompt asking
> for one means something is wrong. Report exactly what Windsurf asked for, and
> go no further.

Then install the skills: section 5.

### Any other client

If your client is not one of the four above, nor in section 3 (Grok in the
browser, Gemini CLI, or anything else), register `https://mcp.leadshook.app/mcp` as a remote MCP server using
that client's own documented method, then sign in when the first tool call
asks you to. Do not copy a config block from the subsections above: they are
not your client's shape. If the client asks for a client ID or a client
secret, stop and report it, exactly as the Cursor and Windsurf warnings say.

Then install the skills: section 5.

## 5. Install the skills (clients without the plugin)

Claude Code and the section 3 clients get the skills from the plugin. **Skip
this section in those clients.** Every other client gets them here.

The MCP server gives you the tools. The skills tell you how to use them well:
which question type fits an answer, how to order a landing page, what a
review should check. Without them you will build things that work and convert
badly. Installing them is part of the setup, not an extra.

### The index

Every skill and every file it ships is listed in one index:

```
https://leadshook.github.io/skills/skills.json
```

Fetch it. For each entry in `skills`, the files to install are
`https://leadshook.github.io/skills/` + `path` + each name in `files`. The
index is generated from the skills that ship, so it is always complete. Do
not guess file names, and do not skip a file because its name suggests you
will not need it.

### Copy them verbatim. Do not adapt them.

Save every file byte for byte. Do not rewrite a skill for your client, do not
summarise it, do not merge several into one, and do not "adapt it to your
tools". The skills are written for any client already. They name tools by
their bare MCP names (`whoami`, `add_node`); if your client shows those tools
with a prefix, it is the same tool and the skill is still correct. An adapted
copy stops matching what LeadsHook ships the moment it is saved, and nothing
will ever tell the person it has drifted.

If you created your own LeadsHook skills earlier, from this page or from
memory, replace them with the verbatim copies now.

### Where to put them: pick the first route that fits

**Route A — your client loads skill folders from disk.** Cursor, Copilot in
VS Code, Windsurf (Devin Desktop), Gemini CLI and older Codex releases all read
the shared user-level skills directory:

```
~/.agents/skills/<name>/
```

Write each file to `~/.agents/skills/<name>/<file>`, keeping its subfolders
(`references/`, `templates/`). The skill reads those files by their relative
path, so a flattened copy breaks it. Use the user-level directory, not a
project one: the person will want LeadsHook in every project, not just this
one.

Before you write, check each `~/.agents/skills/<name>/` you are about to fill.
If it exists and its `SKILL.md` is not a LeadsHook skill, it belongs to
someone else: do not overwrite it, and report the clash.

Most clients pick up new skills on the next session. If your client needs a
reload or a restart to see them, say so.

**Route B — your client saves skills through its own feature, not a folder.**
Grok in the browser and the Grok apps work this way, and so may others. Save
one skill per index entry, named exactly as `name`, with the full `SKILL.md`
as its instructions and `description` as its description.

If the feature accepts extra files, attach every other file under its own
relative path. If it accepts only one body of text, add this one line
directly after the closing `---` of the `SKILL.md` frontmatter, and change
nothing else:

```
Files this skill refers to are at https://leadshook.github.io/skills/<path> — fetch them from there when the skill says to read one.
```

with `<path>` replaced by the entry's `path`.

**Route C — your client has no skills at all.** Install nothing. The fallback
line in the section 6 stanza tells you to read the index and fetch the
matching skill whenever a LeadsHook task comes up. That works, but only if
you can fetch web pages; if you cannot, say that the skills are unavailable in
this client.

### Report what you installed

Name the skills you installed, the route, the location, and the `version`
from the index. If you could not install them, say which route failed and why.
Do not report the setup as complete while skipping this section silently.

### Updating

Every `SKILL.md` records the release it came from, in its frontmatter:

```yaml
metadata:
  version: "X.Y.Z"
```

The index's `version` is the latest release. When they differ, the installed
skills are out of date. Do not update on your own initiative: tell the person
a newer LeadsHook release is available and update when they agree. To update,
run this section again with the same route, overwriting the same skills with
the new files, and delete files that are no longer listed, inside the LeadsHook
skill folders only. A `SKILL.md` with no `metadata.version` predates the stamp
and is out of date.

Plugin installs update with the plugin instead: section 3 gives the command for
each client, and Claude Code uses `/plugin marketplace update` then
`/plugin update`.

## 6. AGENTS.md stanza

Every client that went through section 5 gets this stanza, whether or not the
skills installed. Claude Code and the section 3 clients do not need it: the
plugin's skills carry everything in it. It carries the minimum an agent cannot
work out from the tool names, plus the fallback that Route C in section 5
relies on. It is not a port of the skills, and it must not grow into one.

**Append it to the customer's `AGENTS.md`. Never overwrite that file.** If an
`AGENTS.md` already exists it holds the customer's own instructions, and
replacing it destroys them. Read the file first, add this block at the end, and
leave everything already there intact. If no file exists, create it with this
block as its contents.

Where each client reads `AGENTS.md` from:

- **Codex** — `~/.codex/AGENTS.md`, then the git root, then each directory in
  between, then the working directory. They are concatenated root-down, and the
  nearest file wins where they conflict.
- **Cursor** — `AGENTS.md` at the project root.
- **VS Code** — `AGENTS.md` at the workspace root, gated by the setting
  `chat.useAgentsMdFile`. Its default state is not documented, so check that
  setting if the file appears to be ignored.
- **Windsurf** — `AGENTS.md` at the repository root.

Keep it as short as it is below. It is loaded on **every turn** in these clients,
so each line you add costs the customer tokens for the life of the project.

```md
## LeadsHook

LeadsHook decision trees and landing pages are built through the `leadshook` MCP
tools. Use those tools rather than editing files by hand.

Orientation, in this order, before calling any account-scoped tool:
`whoami`, then `list_accounts`, then `select_account`.

Node schemas: the index is `leadshook://schemas/node`, each type is
`leadshook://schemas/node/{type}`, and the fields shared by every type are
`leadshook://schemas/node/_base`. Read the schema before you build a node.
Never guess a field.

Landing pages: the spec is `leadshook://references/page-builder-spec`. Defer to
it rather than restating or second-guessing it.

`add_node` creates the node floating and unconnected. Wiring it into the tree is
a separate step, done in the LeadsHook canvas editor.

`generate_node` may return `status: 'clarify'`. When it does, call it again with
an explicit `nodeType` instead of guessing which type was meant.

If no LeadsHook skill is installed, read
`https://leadshook.github.io/skills/skills.json` before a LeadsHook task,
fetch the `SKILL.md` of the skill whose description matches, and follow it.
```

## 7. Verification

The connection is not proven until you have called a tool and seen real data come
back. Do that now, yourself. It is two calls, in this order, and they are two
different tools — neither one stands in for the other.

### Step 1 — call `whoami`

`whoami` takes no parameters. Call it.

It returns exactly one field, the signed-in email address:

```json
{ "email": "person@example.com" }
```

That is the entire response.

Two things to hold on to, because both of them make agents declare a working
install broken:

- **There is no user identifier in this response.** The field is not empty — it is
  absent. Do not look for one, do not wait for one, and do not report a failure
  because you could not find one. The email address alone is the success signal.
- **`whoami` tells you nothing about accounts.** It does not name the account or
  the tenant you are working in. That is not a fault, and it is the whole reason
  there is a second call.

### Step 2 — call `list_accounts`

`list_accounts` is a **separate tool**. Call it after `whoami`. Do not collapse the
two steps into one, and do not skip it because `whoami` already succeeded —
`whoami` cannot answer what this answers.

It returns a **bare JSON array**. Each element is one account, carrying an
identifier and a name:

```json
[
  { "id": "acct_1", "name": "Acme Marketing" },
  { "id": "acct_2", "name": "Acme Partners" }
]
```

The array **is** the response. It is not wrapped in an object, so there is no
accounts property to reach through first. Index the top-level value directly: the
first account is element zero.

### Step 3 — report the account name

Now tell the person which LeadsHook account you are connected to, by name, in plain
words. For example: "Connected to LeadsHook, signed in as person@example.com, in the
account Acme Marketing."

This is the point of the whole section. The email address and the array are how
*you* know the connection works. The account name is how *they* know it — a person
can confirm or correct an account name at a glance, and cannot confirm anything from
"connection successful". State the name.

If more than one account came back, name the one you will be working in.

### If a tool says an account must be selected

Some tools are account-scoped and refuse to run until an account has been chosen. If
a call comes back saying an account must be selected, that is not an error and not
something to route around: call `select_account` for the account you want, then retry
the original call and carry on.

## 8. Troubleshooting

### A browser is required, and some environments do not have one

The one human action in this procedure is a browser sign-in. An environment with no
browser cannot complete it. That covers automated build runners, a shell on a remote
machine reached over SSH, and containers with no desktop session.

**This is a prerequisite, not a transient failure. Do not retry it.** Retrying a
sign-in that has no browser to open will loop until the customer's tokens are spent,
and nothing will have changed. Instead:

1. Detect it — the sign-in cannot open a browser, or opens nothing at all.
2. Stop. Make no further attempts.
3. Report plainly that LeadsHook needs a one-time browser sign-in and that this
   environment has no browser available.
4. Say what the person must do: make one LeadsHook tool call from an environment
   that does have a browser, sign in there once, and approve access.

Once that single approval has been given the connection is established, and the
sign-in never needs repeating.

### A call fails after a successful connection — session, not authentication

Once you are connected, a tool call can still fail in a way that reads like an
authentication problem and is not one. Read the response before you conclude
anything.

| What you see | What it means |
| --- | --- |
| HTTP `400`, JSON-RPC error code `-32000`, message "Mcp-Session-Id header is required" | The session header is missing. A **session** problem. |
| HTTP `404`, JSON-RPC error code `-32001`, message "Session not found" | The session id is unknown or stale. A **session** problem. |
| HTTP `401`, a plain error body with **no** `jsonrpc` field | A genuine **authentication** failure. |

The tell is the envelope. A `-3200x` code arriving inside a JSON-RPC error is the
server telling you about the session, not about who you are. A real authentication
failure does not come back as JSON-RPC at all.

What to do with each:

- **Session problem (`400` or `404`)** — re-establish the connection to the server so
  a fresh session is negotiated, then retry the call. Re-authenticating does nothing
  here, because the credentials were never the problem. **Do not send anyone back
  through the browser sign-in for a `400` or a `404`.**
- **Authentication failure (`401`)** — this one really is about credentials. Sign in
  again.

### The plugin's MCP server did not appear (Claude Code and section 3 clients)

You installed the plugin, but the LeadsHook tools are not listed in your session.

**Do not register the server yourself.** Sections 2 and 3 forbid it, and it is the wrong
fix here for a concrete reason: adding it by hand creates a second, duplicate,
competing entry for the same server, and you will then be untangling two
half-working registrations instead of one missing one. Do not edit an MCP config
file. Do not run a command that adds an MCP server.

Work through this instead:

1. Confirm the plugin actually installed. Check your installed plugins — if
   `leadshook` is not among them, the install did not complete, and the fix is to run
   the install commands for your client (section 2 or 3) again.
2. Reload it. Run `/reload-plugins`, or restart the client entirely. A plugin
   installed mid-session is very often simply not active yet.
3. If it still does not appear, **report it rather than working around it.** Say what
   you ran, what the install reported, and that the server is still absent. A clear
   report is the correct outcome here. An invented workaround is not.

### Still stuck

Point the person at the two links at the foot of this page: the LeadsHook site, and
the marketplace repository where issues are raised.

---

- LeadsHook: https://leadshook.app
- This marketplace: https://github.com/LeadsHook/skills
