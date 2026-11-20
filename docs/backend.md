# Backend and staff dashboard

Shiro Sumi is a concept restaurant, but the booking and menu run on a real stack.

## Pieces
| Part | Where | Notes |
| --- | --- | --- |
| API | `api/index.js` -> `server/router.js` | One Vercel Function (all `/api/*` rewritten to it via `vercel.json`), plain Node, no framework |
| Database | Neon Postgres (`DATABASE_URL`) | `server/db.js` adapts Neon in production and PGlite (in-process Postgres) for tests and local work |
| Schema | `server/schema.js` | Idempotent, append-only migrations. Applied at build time (`scripts/migrate.js`) and lazily on the first request |
| Public site | `src/menu.js`, `src/booking.js` | Menu and gallery read `/api/menu`; the wizard reads `/api/availability` and posts `/api/reservations`. The static HTML menu is the fallback if the API is down |
| Staff dashboard | `admin.html`, `src/admin/` | Hash-routed app at `/admin`. Reservations and check-in, menu editor, team |

## Data model
`menu_items`, `reservations`, `reservation_events` (audit log), `staff`, `login_attempts`. Money is whole IDR. Dates are Postgres `date`, restaurant time is `Asia/Jakarta`.

## Check-in, the way real systems do it
The QR on the confirmation holds only a link, `/admin#/r/<REF>`. Nothing about the guest is in it. Staff scan it (camera scan in Chromium, or type the reference) while signed in; the server looks the booking up and a status change is recorded with who and when:

`confirmed -> arrived -> seated (table) -> completed`, plus `no_show`, `cancelled`, and `waitlist -> confirmed` when room appears. Allowed moves live in `TRANSITIONS` (`server/config.js`). A guest who scans it only reaches the sign-in screen.

## Capacity
Each seating has a per-slot seat cap. A booking is inserted inside one transaction that first takes an advisory lock on the slot, then counts seats and decides `confirmed` or `waitlist`. A concurrent test books six parties at once and checks the cap holds.

## Security notes
- Passwords: scrypt. Sessions: HMAC-signed `HttpOnly`, `SameSite=Lax`, `Secure` cookie, 12 h, invalidated when the password changes.
- Sign-in is rate limited per account (8 failures / 15 min) and per IP (30).
- State-changing requests with a foreign `Origin` are refused. Guest text is rendered as text, never HTML.
- Roles: `owner` does everything; `host` handles reservations and can mark dishes sold out.
- The first owner is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and must change the password at first sign-in.

## Honest limits
- No email or SMS is sent. The copy says what a real system would do.
- No payments: the deposit is recorded and shown as "credited to the bill".
- The seating rules exist twice, in `server/config.js` (authoritative) and in `src/booking.js` (display). The server rejects anything that disagrees.
- The dashboard is English only. Indonesian and Japanese menu copy typed in the dashboard is the owner's responsibility.
- Guests are asked to use made-up details; it is a demo, but the data is stored.

## Run it
```
npm install
npm run build && npm run serve     # http://localhost:3000, in-memory Postgres, owner@sumi.local / change-me-please-1
npm test                           # API tests on PGlite
```
