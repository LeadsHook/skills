# LeadsHook for AI agents

Build, edit, and publish LeadsHook decision trees and landing pages by chatting with
your AI agent, connected to your own LeadsHook account.

## Set up

Paste this message into your AI agent:

```
Fetch and follow the appropriate instructions to set me up for LeadsHook from https://leadshook.github.io/skills/prompt.md
```

It works in Claude Code, Codex, Cursor, GitHub Copilot, Windsurf, Grok, and any other
agent that supports MCP. Your agent works out which client it is running in, connects
to the LeadsHook MCP server, installs the LeadsHook skills, and checks that the
connection works.

The only thing it needs from you is one sign-in. The first time your agent calls a
LeadsHook tool, a browser opens: log in to LeadsHook and approve access. You do this
once, so set up from a machine that has a browser.

## What you get

- **LeadsHook tools** from the hosted MCP server at `https://mcp.leadshook.app/mcp`:
  your agent can list and open your decision trees and landing pages, build and edit
  them, publish them, and read the leads they capture.
- **LeadsHook skills** that teach your agent how to do this work well: building and
  reviewing decision trees, styling them to match a brand, building landing pages, and
  moving a funnel over from LeadsHook 2. They live in
  [`plugins/leadshook/skills`](plugins/leadshook/skills).

## Updating

Your install changes only when we publish a new version. To update, ask your agent to
update LeadsHook: the setup instructions include the update command for each client.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules every public skill follows and for
how releases are versioned.

## Support

- LeadsHook: https://leadshook.app
- This repository: https://github.com/LeadsHook/skills
