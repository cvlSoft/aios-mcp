# AIOS MCP — build and run enterprise workflows from your AI agent

Connect [AIOS](https://www.cvlsoft.com) to Claude Code, Cursor, VS Code, Codex, Claude, or ChatGPT over the [Model Context Protocol](https://modelcontextprotocol.io). AIOS is a remote MCP server — **there is nothing to install**. One URL works for every customer: you sign in with your own AIOS account, and the connection is scoped to exactly what your account can do.

AIOS exposes **two surfaces**:

| Surface | URL | Who it's for |
|---|---|---|
| **Skills** | `https://api.aios.cvlsoft.net/mcp` | Anyone. Run the workflows your organization has published as tools — look up an invoice, file a ticket, close a deal — from any MCP client. |
| **Builder** | `https://api.aios.cvlsoft.net/mcp/builder` | Your developers. The full AIOS builder from a coding agent: create, edit, validate, run, diagnose, and publish workflows without opening the app. Requires approving a "developer access" sign-in. |

---

## Quick start — Builder (for developers)

### Claude Code

```bash
claude mcp add --transport http aios-builder https://api.aios.cvlsoft.net/mcp/builder
```

First use opens your browser: sign in to AIOS and approve **developer access**. Then just prompt:

> Build me a workflow that looks up an invoice in QuickBooks when a Slack message asks about one, and replies in the thread. Validate it and do a test run.

### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=aios-builder&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1jcC1yZW1vdGUiLCJodHRwczovL2FwaS5haW9zLmN2bHNvZnQubmV0L21jcC9idWlsZGVyIl19)

The button runs AIOS through the [`mcp-remote`](#stdio-only-clients) bridge (it needs Node.js), which signs you in through your browser. Cursor's own sign-in for remote servers sends a return address AIOS does not accept, so adding the URL directly in Settings → MCP does not connect.

### VS Code (Copilot)

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_AIOS_Builder-0098FF?logo=visualstudiocode)](vscode:mcp/install?%7B%22name%22%3A%22aios-builder%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.aios.cvlsoft.net%2Fmcp%2Fbuilder%22%7D)

### Codex

```bash
codex mcp add aios-builder --url https://api.aios.cvlsoft.net/mcp/builder
```

### Your whole team at once (`.mcp.json`)

Commit this to the root of any repo — Claude Code auto-discovers it and prompts each developer to connect. Everyone signs in as themselves:

```json
{
  "mcpServers": {
    "aios-builder": {
      "type": "http",
      "url": "https://api.aios.cvlsoft.net/mcp/builder"
    }
  }
}
```

A ready-to-copy file is in [`.mcp.json.example`](./.mcp.json.example).

---

## Quick start — Skills (run published workflows)

Same steps with the `/mcp` URL instead:

- **Claude (web/desktop):** Settings → Connectors → *Add custom connector* → `https://api.aios.cvlsoft.net/mcp`. Keep the settings Claude marks **Detected** (OAuth client: *register one automatically*).
- **ChatGPT:** Settings → Apps & Connectors → enable *Developer mode* → Create → server URL `https://api.aios.cvlsoft.net/mcp`, auth **OAuth**.
- **Claude Code:** `claude mcp add --transport http aios https://api.aios.cvlsoft.net/mcp`
- **Cursor:** [![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=aios&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1jcC1yZW1vdGUiLCJodHRwczovL2FwaS5haW9zLmN2bHNvZnQubmV0L21jcCJdfQ==)

Your organization controls what appears here: only workflows an admin has explicitly published to the External AI Access become tools.

## Stdio-only clients

Older clients that can only launch a local process can reach AIOS through the open-source [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge. It needs Node.js and handles the sign-in in your browser:

```json
{
  "mcpServers": {
    "aios-builder": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.aios.cvlsoft.net/mcp/builder"]
    }
  }
}
```

For skills, use `https://api.aios.cvlsoft.net/mcp` instead.

## What the builder can do

The coding agent sees eight core tools (`find_workflow`, `describe_workflow`, `create_workflow`, `validate_wdf`, `preflight_workflow`, `run_workflow`, `watch_execution` and `read_tool_result`) plus three that reach everything else on the platform (connectors, triggers, knowledge, approvals, users, policies, comms, and more) on demand: `aios_search_tools` finds a tool, `aios_describe_tools` shows its inputs, and `aios_invoke` runs it. If the workflow is open in the AIOS Studio, edits appear on the canvas live.

## Security model

- **Acts as you.** A builder connection carries your exact AIOS permissions and departments, nothing more, re-checked at least every 15 minutes, and at once when your access is reduced. Every action lands in the audit trail under your name.
- **Explicit consent.** Nothing connects without you signing in and approving a consent screen that states what the connection can do. OAuth 2.1 + PKCE; no long-lived secrets in your editor config.
- **Dangerous actions confirm first.** Deleting things, creating live schedules, sending real messages — the agent must show you a confirmation and you must approve before it commits.
- **Revoke.** Profile → Connected applications in AIOS; an admin can revoke anyone's through the AIOS Assistant. Renewal stops at once, but a session already started can keep working for up to 15 minutes. Deactivating a user ends their connections the same way.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `403 … no builder access` | Your credential was authorized for skills only. Reconnect and approve the **developer access** consent, or (for API keys) enable *builder access* on the key. |
| Browser never opens for sign-in | Your client may not support OAuth for remote servers — use the `mcp-remote` bridge above, or an AIOS API key sent as `X-API-Key`. |
| Tools don't appear | The connection succeeded but your account may lack permissions, or (skills surface) your organization hasn't published any workflows yet. |
| `401` loops | The grant was revoked or your account was deactivated — reconnect. |

## For AIOS administrators

Connection management, publishing workflows as skills, and API keys live in **Manage → External AI Access** in your AIOS tenant. Full docs are in the in-app Help Center.
