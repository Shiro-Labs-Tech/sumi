// Restaurant rules. The server is authoritative; src/booking.js keeps a mirror for display only.
export const TZ = 'Asia/Jakarta';
export const HORIZON_DAYS = 60;
export const CLOSED_WEEKDAY = 1; // Monday
export const LEAD_MINUTES = 60;

export const SEATS = {
  counter: { min: 1, max: 4, slots: ['17:30', '20:00'], cap: 12, dep: 200000, menu: 650000 },
  table: { min: 1, max: 6, slots: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'], cap: 26, dep: 100000, menu: 0 },
  room: { min: 4, max: 8, slots: ['18:00', '20:00'], cap: 8, dep: 250000, menu: 450000 },
  terrace: { min: 1, max: 6, slots: ['17:30', '18:30', '19:30', '20:30'], cap: 16, dep: 100000, menu: 0 },
};
export const ADDONS = { sake: { price: 350000, per: 'guest', seats: ['counter', 'room'] }, cake: { price: 75000, per: 'booking', seats: Object.keys(SEATS) } };

export const CATEGORIES = ['starters', 'mains', 'sides', 'sweets', 'drinks'];
export const STATUSES = ['confirmed', 'waitlist', 'arrived', 'seated', 'completed', 'no_show', 'cancelled'];
export const TRANSITIONS = {
  confirmed: ['arrived', 'no_show', 'cancelled'],
  waitlist: ['confirmed', 'cancelled'],
  arrived: ['seated', 'cancelled'],
  seated: ['completed'],
  no_show: ['arrived'],
  completed: [],
  cancelled: [],
};
// Seat codes the host can assign. A real venue would keep this in the database; kept here for the concept.
export const TABLES = {
  counter: Array.from({ length: 12 }, (_, i) => `C${i + 1}`),
  table: Array.from({ length: 9 }, (_, i) => `T${i + 1}`),
  room: ['Private room'],
  terrace: Array.from({ length: 5 }, (_, i) => `P${i + 1}`),
};

export const nowParts = (d = new Date()) => {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: +p.hour * 60 + +p.minute };
};
export const weekday = (iso) => new Date(iso + 'T00:00:00Z').getUTCDay();
export const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z')) && new Date(s + 'T00:00:00Z').toISOString().slice(0, 10) === s;
