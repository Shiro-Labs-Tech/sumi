import { q } from './db.js';
import { SEATS, HORIZON_DAYS, CLOSED_WEEKDAY, LEAD_MINUTES, nowParts, weekday, addDays } from './config.js';

export const HOLDING = ['confirmed', 'arrived', 'seated', 'completed']; // statuses that occupy seats

const mins = (t) => +t.slice(0, 2) * 60 + +t.slice(3);
export const slotBookable = (date, time) => {
  const n = nowParts();
  if (date < n.date) return false;
  if (date === n.date) return mins(time) >= n.minutes + LEAD_MINUTES;
  return true;
};
export const dateBookable = (date) => {
  const n = nowParts();
  return date >= n.date && date <= addDays(n.date, HORIZON_DAYS) && weekday(date) !== CLOSED_WEEKDAY;
};

export async function usedSeats(seat, from, to) {
  const rows = await q(
    `select to_char(date,'YYYY-MM-DD') as d, time, sum(guests)::int as n from reservations
     where seat = $1 and date between $2 and $3 and status = any($4) group by 1, 2`, [seat, from, to, HOLDING]);
  const m = {}; for (const r of rows) (m[r.d] ||= {})[r.time] = r.n; return m;
}

export async function availability(seat) {
  const c = SEATS[seat], n = nowParts(), to = addDays(n.date, HORIZON_DAYS);
  const used = await usedSeats(seat, n.date, to), days = {};
  for (let i = 0; i <= HORIZON_DAYS; i++) {
    const d = addDays(n.date, i);
    if (weekday(d) === CLOSED_WEEKDAY) { days[d] = { state: 'closed', slots: {} }; continue; }
    const slots = {}; let best = 0;
    for (const t of c.slots) { if (!slotBookable(d, t)) continue; const left = Math.max(0, c.cap - ((used[d] || {})[t] || 0)); slots[t] = left; best = Math.max(best, left); }
    const state = !Object.keys(slots).length ? 'closed' : best < c.min ? 'full' : best <= Math.ceil(c.cap * 0.25) ? 'few' : 'open';
    days[d] = { state, slots };
  }
  return { seat, today: n.date, days };
}
