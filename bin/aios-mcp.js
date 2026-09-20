#!/usr/bin/env node
// Stdio → remote bridge for MCP clients that can only launch a local process.
// Usage: aios-mcp [builder]   (default: the skills surface at /mcp)
// AIOS_MCP_HOST overrides the AIOS deployment (self-hosted / staging).
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');

const host = (process.env.AIOS_MCP_HOST || 'https://api.aios.cvlsoft.net').replace(/\/$/, '');
// Exactly one optional positional word. A silent else-branch meant `--builder`,
// `Builder`, or a typo quietly connected to the SKILLS surface instead, and the
// symptom — none of the builder tools appear — is the one the README attributes
// to "your organization hasn't published any workflows yet".
const arg = process.argv[2];
if (arg && arg !== 'builder') {
  console.error(`aios-mcp: unknown argument "${arg}". Usage: aios-mcp [builder]`);
  process.exit(2);
}
const surface = arg === 'builder' ? '/mcp/builder' : '/mcp';
const url = `${host}${surface}`;

// Resolve mcp-remote's declared bin from our own dependency tree — never a
// hardcoded internal path, so its layout can change without breaking us.
const req = createRequire(__filename);
const pkgPath = req.resolve('mcp-remote/package.json');
const pkg = req('mcp-remote/package.json');
const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin['mcp-remote'];
const binPath = require('node:path').join(require('node:path').dirname(pkgPath), binRel);

const result = spawnSync(process.execPath, [binPath, url], { stdio: 'inherit' });
// `status` is null both when the child could not be spawned and when it was
// killed by a signal. Coalescing to 0 reported a clean shutdown for a bridge
// that never carried a byte, so the MCP client showed "server closed" with
// nothing to explain it. A null status is never success.
process.exit(result.status ?? 1);
