#!/usr/bin/env node
// Stdio → remote bridge for MCP clients that can only launch a local process.
// Usage: aios-mcp [builder]   (default: the skills surface at /mcp)
// AIOS_MCP_HOST overrides the AIOS deployment (self-hosted / staging).
const { spawnSync } = require('node:child_process');
const { createRequire } = require('node:module');

const host = (process.env.AIOS_MCP_HOST || 'https://aios-api.cvlsoft.net').replace(/\/$/, '');
const surface = process.argv[2] === 'builder' ? '/mcp/builder' : '/mcp';
const url = `${host}${surface}`;

// Resolve mcp-remote's declared bin from our own dependency tree — never a
// hardcoded internal path, so its layout can change without breaking us.
const req = createRequire(__filename);
const pkgPath = req.resolve('mcp-remote/package.json');
const pkg = req('mcp-remote/package.json');
const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin['mcp-remote'];
const binPath = require('node:path').join(require('node:path').dirname(pkgPath), binRel);

const result = spawnSync(process.execPath, [binPath, url], { stdio: 'inherit' });
process.exit(result.status ?? 0);
