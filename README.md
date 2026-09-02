# AIOS MCP — build and run enterprise workflows from your AI agent

> **⚠️ Pre-launch placeholder:** every URL below uses `aios-api.cvlsoft.net`, which is not live yet. Swap in the production host before publishing this repo or submitting to any registry.

Connect [AIOS](https://www.cvlsoft.com) to Claude Code, Cursor, VS Code, Codex, Claude, or ChatGPT over the [Model Context Protocol](https://modelcontextprotocol.io). AIOS is a remote MCP server — **there is nothing to install**. One URL works for every customer: you sign in with your own AIOS account, and the connection is scoped to exactly what your account can do.

AIOS exposes **two surfaces**:

| Surface | URL | Who it's for |
|---|---|---|
| **Skills** | `https://aios-api.cvlsoft.net/mcp` | Anyone. Run the workflows your organization has published as tools — look up an invoice, file a ticket, close a deal — from any MCP client. |
| **Builder** | `https://aios-api.cvlsoft.net/mcp/builder` | Your developers. The full AIOS builder from a coding agent: create, edit, validate, run, diagnose, and publish workflows without opening the app. Requires approving a "developer access" sign-in. |

---

## Quick start — Builder (for developers)

### Claude Code

```bash
claude mcp add --transport http aios-builder https://aios-api.cvlsoft.net/mcp/builder
```

First use opens your browser: sign in to AIOS and approve **developer access**. Then just prompt:

> Build me a workflow that looks up an invoice in QuickBooks when a Slack message asks about one, and replies in the thread. Validate it and do a test run.

### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=aios-builder&config=eyJ1cmwiOiJodHRwczovL2Fpb3MtYXBpLmN2bHNvZnQubmV0L21jcC9idWlsZGVyIn0=)

Or Settings → MCP → Add server → URL `https://aios-api.cvlsoft.net/mcp/builder`.

### VS Code (Copilot)

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_AIOS_Builder-0098FF?logo=visualstudiocode)](vscode:mcp/install?%7B%22name%22%3A%22aios-builder%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Faios-api.cvlsoft.net%2Fmcp%2Fbuilder%22%7D)

### Codex

```bash
codex mcp add aios-builder --url https://aios-api.cvlsoft.net/mcp/builder
```

### Your whole team at once (`.mcp.json`)

Commit this to the root of any repo — Claude Code auto-discovers it and prompts each developer to connect. Everyone signs in as themselves:

```json
{
  "mcpServers": {
    "aios-builder": {
      "type": "http",
      "url": "https://aios-api.cvlsoft.net/mcp/builder"
    }
  }
}
```

A ready-to-copy file is in [`.mcp.json.example`](./.mcp.json.example).

---

## Quick start — Skills (run published workflows)

Same steps with the `/mcp` URL instead:

- **Claude (web/desktop):** Settings → Connectors → *Add custom connector* → `https://aios-api.cvlsoft.net/mcp`. Keep the settings Claude marks **Detected** (OAuth client: *register one automatically*).
- **ChatGPT:** Settings → Apps & Connectors → enable *Developer mode* → Create → server URL `https://aios-api.cvlsoft.net/mcp`, auth **OAuth**.
- **Claude Code:** `claude mcp add --transport http aios https://aios-api.cvlsoft.net/mcp`
- **Cursor:** [![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=aios&config=eyJ1cmwiOiJodHRwczovL2Fpb3MtYXBpLmN2bHNvZnQubmV0L21jcCJ9)

Your organization controls what appears here: only workflows an admin has explicitly published to the Agentic Surface become tools.

## Stdio-only clients

Older clients that can only launch a local process can bridge to the remote server:

```json
{
  "mcpServers": {
    "aios-builder": {
      "command": "npx",
      "args": ["-y", "@cvlsoft/aios-mcp", "builder"]
    }
  }
}
```

`@cvlsoft/aios-mcp` is a thin wrapper around [`mcp-remote`](https://www.npmjs.com/package/mcp-remote); pass `builder` for the builder surface or nothing for skills. Set `AIOS_MCP_HOST` to point at a different AIOS deployment.

## What the builder can do

The coding agent sees a small set of core tools — `create_workflow`, `validate_wdf`, `run_workflow`, `watch_execution`, `find_workflow` — plus `aios_search_tools`, which finds everything else on the platform (connectors, schedules, knowledge, approvals, users, policies, comms, and more) on demand. If the workflow is open in the AIOS Studio, edits appear on the canvas live.

## Security model

- **Acts as you.** A builder connection carries your exact AIOS permissions — nothing more — re-checked continuously. Every action lands in the audit trail under your name.
- **Explicit consent.** Nothing connects without you signing in and approving a consent screen that states what the connection can do. OAuth 2.1 + PKCE; no long-lived secrets in your editor config.
- **Dangerous actions confirm first.** Deleting things, creating live schedules, sending real messages — the agent must show you a confirmation and you must approve before it commits.
- **Instant revoke.** Profile → Connected applications in AIOS, or admin-wide revocation. Deactivating a user kills their connections automatically.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `403 … no builder access` | Your credential was authorized for skills only. Reconnect and approve the **developer access** consent, or (for API keys) enable *builder access* on the key. |
| Browser never opens for sign-in | Your client may not support OAuth for remote servers — use the stdio bridge above, or an AIOS API key sent as `X-API-Key`. |
| Tools don't appear | The connection succeeded but your account may lack permissions, or (skills surface) your organization hasn't published any workflows yet. |
| `401` loops | The grant was revoked or your account was deactivated — reconnect. |

## For AIOS administrators

Connection management, publishing workflows as skills, and API keys live in **Settings → Agentic Surface** in your AIOS tenant. Full docs are in the in-app Help Center.
