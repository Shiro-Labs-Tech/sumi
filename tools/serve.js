// Local server: serves dist/ (clean URLs) and the API from the same origin, like Vercel does.
// Defaults to an in-memory Postgres (PGlite) so it runs with no setup:  node tools/serve.js [port]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL && !process.env.SUMI_PGLITE) process.env.SUMI_PGLITE = process.env.SUMI_DB || 'memory';
process.env.ADMIN_EMAIL ||= 'owner@sumi.local';
process.env.ADMIN_PASSWORD ||= 'change-me-please-1';
process.env.SESSION_SECRET ||= 'local-dev-secret-local-dev-secret-0000';
const { handle } = await import('../server/router.js');

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const port = +process.argv[2] || +process.env.PORT || 3000;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) return handle(req, res);
  let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const tries = p.endsWith('/') ? [p + 'index.html'] : [p, p + '.html'];
  for (const t of tries) {
    try { const f = join(root, t); if ((await stat(f)).isFile()) { res.setHeader('Content-Type', TYPES[extname(f)] || 'application/octet-stream'); return res.end(await readFile(f)); } } catch {}
  }
  res.statusCode = 404; res.end('Not found');
}).listen(port, () => console.log(`Shiro Sumi on http://localhost:${port}  (admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD})`));
