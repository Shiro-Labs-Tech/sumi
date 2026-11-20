// One tiny adapter: Neon Postgres in production (DATABASE_URL), PGlite (in-process Postgres) for tests and local work.
let impl;
async function init() {
  if (impl) return impl;
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (url) {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(url);
    impl = { kind: 'neon', query: async (text, params = []) => await sql.query(text, params),
      tx: async (stmts) => await sql.transaction(stmts.map((s) => sql.query(s.text, s.params || []))) };
  } else if (process.env.SUMI_PGLITE) {
    const { PGlite } = await import('@electric-sql/pglite');
    const db = new PGlite(process.env.SUMI_PGLITE === 'memory' ? undefined : process.env.SUMI_PGLITE);
    await db.waitReady;
    impl = { kind: 'pglite', query: async (text, params = []) => (await db.query(text, params)).rows, exec: (t) => db.exec(t),
      tx: async (stmts) => db.transaction(async (t) => { const out = []; for (const s of stmts) out.push((await t.query(s.text, s.params || [])).rows); return out; }) };
  } else {
    const e = new Error('Database is not configured'); e.status = 503; e.code = 'no_database'; throw e;
  }
  return impl;
}
export const hasDatabase = () => !!(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUMI_PGLITE);
export async function q(text, params) { return (await init()).query(text, params); }
export async function one(text, params) { return (await q(text, params))[0] || null; }
export const dbKind = async () => (await init()).kind;
// Run statements in one transaction; each statement sees the effects of the previous ones (used for the capacity lock).
export async function tx(stmts) { return (await init()).tx(stmts); }
