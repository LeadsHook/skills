# LeadsHook for Claude Code

Build, edit, and publish LeadsHook decision trees and landing pages by chatting with Claude, connected to your own LeadsHook account.

This repository is the official LeadsHook plugin marketplace for Claude Code.

## Installing

Run these two commands inside Claude Code:

```
/plugin marketplace add LeadsHook/skills
/plugin install leadshook@leadshook
```

The first command adds this marketplace to Claude Code. The second installs the
`leadshook` plugin from it. Restart Claude Code, or run `/reload-plugins`, and the
LeadsHook tools are available in your session.

**Use the `owner/repo` shorthand shown above.** Adding the marketplace by a direct
URL to the manifest file does **not** work: Claude Code cannot resolve the plugin's
relative source path that way, and the install will fail. Only the `owner/repo`
shorthand, a full git clone URL, or a local directory path are supported.

The `owner/repo` shorthand clones over SSH by default. If you do not have SSH keys
set up with GitHub, set `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` in your environment
before running the commands, and Claude Code will clone over HTTPS instead.

## Versioning

### The contract: a pinned version

The plugin entry in this marketplace carries an explicit `version` field
(currently `0.1.0`). That pin is the contract:

- **You receive an update only when we bump that number.** Nothing else changes
  what you have installed.
- **Your install is stable and reproducible.** The version you installed is the
  version you keep running until you deliberately update.
- **Shipping to you is a deliberate act on our side.** A release is something we
  decide and mark, not something that happens as a side effect of us saving a file.

### The cost, stated plainly

A pinned version has a real downside and we are not going to soften it: **if we
forget to bump the version, product changes never reach you.** We can improve the
plugin every day, and your installed copy will sit unchanged and stale for as long
as the pin is not moved. A stale pin is silent — nothing warns you that you are
behind.

### The alternative we rejected

The other option was **commit-SHA resolution**: leave `version` out entirely, and
Claude Code falls back to the resolved commit SHA of this repository as the update
signal. Every commit we make would then look like a new version to every customer.

We **rejected** this. It is not deferred and not under review. With SHA resolution
there is no gate between a commit and your machine: one bad commit would reach
every customer immediately, and a broken plugin would be in the hands of people
mid-campaign before we noticed. The pinned version buys us that gate, and we accept
the staleness risk in exchange.

### How to update

Updating is two commands, and both are yours to run when you want them:

```
/plugin marketplace update
/plugin update
```

- `/plugin marketplace update` refreshes the catalog, so Claude Code sees the
  latest published version.
- `/plugin update` updates the installed plugin to that version.

`/reload-plugins` applies the change in your current session without restarting
Claude Code.

### Rule for maintainers

> **Bump `version` on the plugin entry for every single release.**

This is the failure mode the pinned contract creates, so it is the one rule that
cannot slip. Merging a change without bumping `version` ships nothing: every
customer stays frozen on whatever they already have, and no amount of correct code
in this repository reaches them. If the change is worth releasing, the version
number moves with it — in the same change, not later.

## Support

- LeadsHook: https://leadshook.app
- This marketplace: https://github.com/LeadsHook/skills
