// Runs at build time when a database is configured: applies migrations and seeds the menu. Skips quietly otherwise.
import { hasDatabase } from '../server/db.js';
import { migrate } from '../server/schema.js';
import { seedMenu, seedOwner } from '../server/seed.js';
if (!hasDatabase()) { console.log('[migrate] no DATABASE_URL, skipping'); process.exit(0); }
try { await migrate(); const m = await seedMenu(); const o = await seedOwner(); console.log(`[migrate] ok (menu seeded: ${m}, owner created: ${o})`); }
catch (e) { console.error('[migrate] failed:', e.message); process.exit(0); }
