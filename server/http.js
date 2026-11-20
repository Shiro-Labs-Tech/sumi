export class HttpError extends Error { constructor(status, message, code, extra) { super(message); this.status = status; this.code = code; this.extra = extra; } }
export const bad = (m, code = 'invalid', extra) => new HttpError(400, m, code, extra);

export async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') { try { return JSON.parse(req.body || '{}'); } catch { throw bad('Invalid JSON'); } }
    if (Buffer.isBuffer(req.body)) { try { return JSON.parse(req.body.toString() || '{}'); } catch { throw bad('Invalid JSON'); } }
    return req.body;
  }
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > 64 * 1024) throw new HttpError(413, 'Body too large'); chunks.push(c); }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString()); } catch { throw bad('Invalid JSON'); }
}
export function send(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', headers['Cache-Control'] || 'no-store');
  for (const [k, v] of Object.entries(headers)) if (k !== 'Cache-Control') res.setHeader(k, v);
  res.end(JSON.stringify(data));
}
// Cross-site POSTs are refused: the Origin header, when present, must match the host.
export function sameOrigin(req) {
  const o = req.headers.origin; if (!o) return true;
  try { return new URL(o).host === req.headers.host; } catch { return false; }
}
export const clientIp = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim() || 'unknown';
