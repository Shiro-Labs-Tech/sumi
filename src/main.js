import './i18n.js';
import { initUI } from './ui.js';
import { initBooking } from './booking.js';
import { initMenu } from './menu.js';
import { initMotion } from './motion.js';

initUI();
initBooking();
initMenu();
initMotion().catch((err) => {
  // Never leave the page hidden if motion fails.
  console.error('[sumi] motion disabled:', err);
  const r = document.documentElement;
  r.classList.add('reduce');
  r.classList.remove('is-loading');
  document.querySelectorAll('.split').forEach((el) => el.classList.add('is-plain'));
  document.getElementById('loader')?.remove();
});
