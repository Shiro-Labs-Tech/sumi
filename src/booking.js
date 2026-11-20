/* Concept booking flow for Shiro Sumi. Nothing is sent or stored.
   Availability is generated from a seeded hash so the same date always looks the same.
   Pattern research and sources: docs/booking-research.md. All copy EN/ID/JA, ID and JA flagged for native review. */

const S = {
  en: {
    steps: ['Seating', 'Date and guests', 'Time', 'Your evening', 'Review'],
    s1: 'Where would you like to sit?', s2: 'Pick a date and party size', s3: 'Choose a time', s4: 'Tell us about your evening', s5: 'Review and confirm',
    lock1: 'Choose your seating first.', lock2: 'Pick a date first.', lock3: 'Choose a time first.',
    seat: {
      counter: { n: 'The Counter', d: 'Twelve seats facing the binchotan fire. The seven-course Sumi menu, in two seatings.', m: 'Set menu · 1 to 4 guests' },
      table: { n: 'Dining table', d: 'The main room, à la carte. Shared plates grilled to order.', m: 'À la carte · 1 to 6 guests' },
      room: { n: 'Tatami room', d: 'A private room with its own tabletop grill and a short set menu.', m: 'Private · 4 to 8 guests' },
      terrace: { n: 'Garden terrace', d: 'Open-air seats under the frangipani. If it rains we move you inside.', m: 'Outdoor · 1 to 6 guests' },
    },
    from: 'Deposit', pp: 'per guest', menuPp: 'Set menu', alc: 'À la carte',
    guests: 'Guests', guest1: '1 guest', guestN: '{n} guests', less: 'Fewer guests', more: 'More guests', range: 'This seating takes {a} to {b} guests.',
    prev: 'Previous month', next: 'Next month', lOpen: 'Open', lFew: 'Few left', lFull: 'Full', lClosed: 'Closed',
    cal: 'Calendar', calNote: 'Closed on Mondays. Bookings open 60 days ahead. For sooner, message us.',
    dFull: 'full', dFew: 'few seats left', dClosed: 'closed', dOpen: 'available',
    seating1: 'First seating', seating2: 'Second seating', early: 'Early', evening: 'Evening', late: 'Late',
    left: '{n} left', wait: 'Waitlist', timesFor: 'Times for {d}', noSlots: 'Nothing open for {n} guests on this date. Try another date or fewer guests.',
    waitNote: 'This time is full. Join the waitlist and we message you if a seat opens. No deposit until it is confirmed.',
    seatingLegend: 'Seatings start on the minute.',
    occ: 'Occasion', occs: ['Just dinner', 'Birthday', 'Anniversary', 'Business', 'First visit', 'Celebration'],
    diet: 'Dietary needs and allergies', diets: ['Vegetarian', 'No pork', 'Halal', 'Shellfish allergy', 'Nut allergy', 'Gluten free'],
    dietNote: 'Set-menu changes need 48 hours notice. Please always list allergies, even if minor.',
    sn: 'Seating notes', sns: ['Quiet spot', 'Near the fire', 'Step-free access', 'High chair'],
    notes: 'Anything else we should know?', notesPh: 'Arrival time, a surprise, a favourite dish',
    name: 'Full name', email: 'Email', phone: 'Mobile', cc: 'Code',
    add: 'Make it special', addOpt: 'Optional',
    addSake: 'Sake pairing, four pours', addSakeD: 'Chosen by our bartender to follow the menu.', addCake: 'Celebration plate', addCakeD: 'Grilled banana, vanilla and a candle.',
    perGuest: 'per guest', perBooking: 'per booking', only: 'Counter and tatami room only',
    sum: 'Your reservation', empty: 'Not chosen yet', sSeat: 'Seating', sGuests: 'Guests', sDate: 'Date', sTime: 'Time', sOcc: 'Occasion', sDiet: 'Dietary', sAdd: 'Add-ons', sDep: 'Deposit', sEst: 'Estimated spend', sNone: 'None',
    depNow: 'Held on a card, credited to your bill', depWait: 'Only if a seat opens', estNote: 'Before drinks, tax and service', estAlc: 'Depends on what you order',
    pol: 'Before you confirm',
    pol1: 'Free changes and cancellation until 48 hours before. Inside 48 hours we keep 50% of the deposit, inside 24 hours or on a no-show, all of it.',
    pol2: 'The counter starts on time. After 20 minutes late the menu is shortened, after 30 minutes the seat is released.',
    pol3: 'We hold other seatings for 15 minutes. Please tell us if you are running late.',
    agree: 'I have read the policy above.', submit: 'Request this seat', submitWait: 'Join the waitlist', concept: 'Concept site: nothing is sent and no card is needed.',
    missing: 'Choose seating, date and time to continue.',
    eName: 'Please enter your name.', eEmail: 'Please enter a valid email.', ePhone: 'Please enter a mobile number.', eAgree: 'Please confirm the policy.',
    doneT: 'Request received', doneW: 'You are on the waitlist', ref: 'Reference', doneNote: 'Concept only: no real booking was made.',
    next: 'In a real booking you would now get an email and an SMS, a reminder the day before, and a link to change or cancel.',
    ics: 'Add to calendar', print: 'Print', again: 'Start another', thanks: 'Thank you, {name}.', icsTitle: 'Shiro Sumi (concept)', icsDesc: 'Concept reservation, not a real booking.',
    info: 'Good to know',
  },
  id: {
    steps: ['Tempat duduk', 'Tanggal dan tamu', 'Waktu', 'Malam Anda', 'Tinjau'],
    s1: 'Di mana Anda ingin duduk?', s2: 'Pilih tanggal dan jumlah tamu', s3: 'Pilih waktu', s4: 'Ceritakan malam Anda', s5: 'Tinjau dan konfirmasi',
    lock1: 'Pilih tempat duduk dulu.', lock2: 'Pilih tanggal dulu.', lock3: 'Pilih waktu dulu.',
    seat: {
      counter: { n: 'Konter', d: 'Dua belas kursi menghadap api binchotan. Menu Sumi tujuh hidangan, dua sesi.', m: 'Menu set · 1 sampai 4 tamu' },
      table: { n: 'Meja makan', d: 'Ruang utama, à la carte. Hidangan untuk berbagi, dipanggang sesuai pesanan.', m: 'À la carte · 1 sampai 6 tamu' },
      room: { n: 'Ruang tatami', d: 'Ruang privat dengan pemanggang meja sendiri dan menu set singkat.', m: 'Privat · 4 sampai 8 tamu' },
      terrace: { n: 'Teras taman', d: 'Kursi terbuka di bawah pohon kamboja. Jika hujan, kami pindahkan ke dalam.', m: 'Luar ruang · 1 sampai 6 tamu' },
    },
    from: 'Deposit', pp: 'per tamu', menuPp: 'Menu set', alc: 'À la carte',
    guests: 'Tamu', guest1: '1 tamu', guestN: '{n} tamu', less: 'Kurangi tamu', more: 'Tambah tamu', range: 'Tempat ini menerima {a} sampai {b} tamu.',
    prev: 'Bulan sebelumnya', next: 'Bulan berikutnya', lOpen: 'Tersedia', lFew: 'Hampir penuh', lFull: 'Penuh', lClosed: 'Tutup',
    cal: 'Kalender', calNote: 'Tutup hari Senin. Reservasi dibuka 60 hari ke depan. Untuk lebih cepat, hubungi kami.',
    dFull: 'penuh', dFew: 'kursi tinggal sedikit', dClosed: 'tutup', dOpen: 'tersedia',
    seating1: 'Sesi pertama', seating2: 'Sesi kedua', early: 'Awal', evening: 'Malam', late: 'Larut',
    left: 'Sisa {n}', wait: 'Daftar tunggu', timesFor: 'Waktu untuk {d}', noSlots: 'Tidak ada yang kosong untuk {n} tamu pada tanggal ini. Coba tanggal lain atau kurangi tamu.',
    waitNote: 'Waktu ini penuh. Masuk daftar tunggu dan kami kabari jika ada kursi kosong. Tanpa deposit sampai dikonfirmasi.',
    seatingLegend: 'Sesi dimulai tepat waktu.',
    occ: 'Acara', occs: ['Makan malam biasa', 'Ulang tahun', 'Hari jadi', 'Bisnis', 'Kunjungan pertama', 'Perayaan'],
    diet: 'Kebutuhan diet dan alergi', diets: ['Vegetarian', 'Tanpa babi', 'Halal', 'Alergi kerang', 'Alergi kacang', 'Bebas gluten'],
    dietNote: 'Perubahan menu set perlu pemberitahuan 48 jam. Selalu cantumkan alergi, sekecil apa pun.',
    sn: 'Catatan tempat duduk', sns: ['Tempat tenang', 'Dekat api', 'Akses tanpa tangga', 'Kursi bayi'],
    notes: 'Ada hal lain yang perlu kami tahu?', notesPh: 'Jam tiba, kejutan, hidangan favorit',
    name: 'Nama lengkap', email: 'Email', phone: 'Ponsel', cc: 'Kode',
    add: 'Buat lebih istimewa', addOpt: 'Opsional',
    addSake: 'Pairing sake, empat tuangan', addSakeD: 'Dipilih bartender kami mengikuti menu.', addCake: 'Piring perayaan', addCakeD: 'Pisang bakar, vanila, dan sebatang lilin.',
    perGuest: 'per tamu', perBooking: 'per reservasi', only: 'Hanya konter dan ruang tatami',
    sum: 'Reservasi Anda', empty: 'Belum dipilih', sSeat: 'Tempat', sGuests: 'Tamu', sDate: 'Tanggal', sTime: 'Waktu', sOcc: 'Acara', sDiet: 'Diet', sAdd: 'Tambahan', sDep: 'Deposit', sEst: 'Perkiraan biaya', sNone: 'Tidak ada',
    depNow: 'Ditahan di kartu, dikreditkan ke tagihan', depWait: 'Hanya jika kursi tersedia', estNote: 'Belum termasuk minuman, pajak, dan servis', estAlc: 'Tergantung pesanan',
    pol: 'Sebelum Anda konfirmasi',
    pol1: 'Ubah dan batal gratis hingga 48 jam sebelumnya. Dalam 48 jam kami menahan 50% deposit, dalam 24 jam atau tidak datang, seluruhnya.',
    pol2: 'Konter dimulai tepat waktu. Terlambat 20 menit, menu dipersingkat; terlambat 30 menit, kursi dilepas.',
    pol3: 'Untuk sesi lain, kami menahan kursi 15 menit. Beri tahu kami jika terlambat.',
    agree: 'Saya sudah membaca kebijakan di atas.', submit: 'Ajukan kursi ini', submitWait: 'Masuk daftar tunggu', concept: 'Situs konsep: tidak ada yang dikirim dan tidak perlu kartu.',
    missing: 'Pilih tempat, tanggal, dan waktu untuk melanjutkan.',
    eName: 'Silakan isi nama Anda.', eEmail: 'Masukkan email yang valid.', ePhone: 'Masukkan nomor ponsel.', eAgree: 'Mohon setujui kebijakan.',
    doneT: 'Permintaan diterima', doneW: 'Anda masuk daftar tunggu', ref: 'Referensi', doneNote: 'Hanya konsep: tidak ada reservasi sungguhan.',
    next: 'Pada reservasi nyata, Anda akan menerima email dan SMS, pengingat sehari sebelumnya, dan tautan untuk mengubah atau membatalkan.',
    ics: 'Tambah ke kalender', print: 'Cetak', again: 'Mulai lagi', thanks: 'Terima kasih, {name}.', icsTitle: 'Shiro Sumi (konsep)', icsDesc: 'Reservasi konsep, bukan reservasi sungguhan.',
    info: 'Perlu diketahui',
  },
  ja: {
    steps: ['お席', '日付と人数', '時間', 'ご要望', '確認'],
    s1: 'ご希望のお席は?', s2: '日付と人数を選択', s3: '時間を選択', s4: 'ご来店について', s5: '内容の確認',
    lock1: '先にお席を選んでください。', lock2: '先に日付を選んでください。', lock3: '先に時間を選んでください。',
    seat: {
      counter: { n: 'カウンター', d: '備長炭の火に向かう12席。七品のスミコース、二部制です。', m: 'コース · 1〜4名' },
      table: { n: 'テーブル席', d: 'メインルームでアラカルト。注文を受けてから焼く、取り分けの皿。', m: 'アラカルト · 1〜6名' },
      room: { n: '座敷の個室', d: '卓上グリルと短いコースつきの個室です。', m: '個室 · 4〜8名' },
      terrace: { n: 'ガーデンテラス', d: 'プルメリアの木の下の屋外席。雨の場合は店内へご案内します。', m: '屋外 · 1〜6名' },
    },
    from: '予約金', pp: '1名あたり', menuPp: 'コース', alc: 'アラカルト',
    guests: '人数', guest1: '1名', guestN: '{n}名', less: '人数を減らす', more: '人数を増やす', range: 'このお席は{a}〜{b}名様までです。',
    prev: '前の月', next: '次の月', lOpen: '空きあり', lFew: '残りわずか', lFull: '満席', lClosed: '休業',
    cal: 'カレンダー', calNote: '月曜は休業です。ご予約は60日先まで。直近のご希望はメッセージをください。',
    dFull: '満席', dFew: '残りわずか', dClosed: '休業', dOpen: '空きあり',
    seating1: '第一部', seating2: '第二部', early: '早め', evening: '夜', late: '遅め',
    left: '残り{n}', wait: '空き待ち', timesFor: '{d}の時間', noSlots: 'この日は{n}名様の空きがありません。別の日か、人数を変えてお試しください。',
    waitNote: 'この時間は満席です。空き待ちに登録すると、席が空いた際にご連絡します。確定まで予約金はかかりません。',
    seatingLegend: '各部は定刻に始まります。',
    occ: 'ご利用目的', occs: ['お食事のみ', 'お誕生日', '記念日', 'ご接待', '初めての来店', 'お祝い'],
    diet: '食事制限・アレルギー', diets: ['ベジタリアン', '豚肉なし', 'ハラール', '甲殻類アレルギー', 'ナッツアレルギー', 'グルテンフリー'],
    dietNote: 'コース内容の変更は48時間前までにお知らせください。軽いアレルギーでも必ずご記入ください。',
    sn: 'お席のご希望', sns: ['静かな席', '火の近く', '段差なし', 'ベビーチェア'],
    notes: 'その他お伝えしたいこと', notesPh: '到着時間、サプライズ、好きな料理など',
    name: 'お名前', email: 'メールアドレス', phone: '携帯電話', cc: '国番号',
    add: '特別な一夜に', addOpt: '任意',
    addSake: '日本酒ペアリング(4杯)', addSakeD: 'バーテンダーがコースに合わせて選びます。', addCake: 'お祝いプレート', addCakeD: '焼きバナナとバニラ、ろうそく付き。',
    perGuest: '1名あたり', perBooking: '1予約あたり', only: 'カウンターと座敷のみ',
    sum: 'ご予約内容', empty: '未選択', sSeat: 'お席', sGuests: '人数', sDate: '日付', sTime: '時間', sOcc: '目的', sDiet: '食事制限', sAdd: '追加', sDep: '予約金', sEst: 'お支払いの目安', sNone: 'なし',
    depNow: 'カードで確保し、お会計から差し引き', depWait: '席が空いた場合のみ', estNote: 'ドリンク・税・サービス料は別', estAlc: 'ご注文によります',
    pol: 'ご確認ください',
    pol1: '48時間前までは変更・キャンセル無料。48時間以内は予約金の50%、24時間以内または無連絡の場合は全額を頂戴します。',
    pol2: 'カウンターは定刻に開始します。20分の遅れでコースを短縮、30分で席を解放します。',
    pol3: 'その他のお席は15分お取り置きします。遅れる場合はご連絡ください。',
    agree: '上記の内容を確認しました。', submit: 'この席をリクエスト', submitWait: '空き待ちに登録', concept: 'コンセプトサイトのため、何も送信されず、カードも不要です。',
    missing: 'お席・日付・時間を選ぶと進めます。',
    eName: 'お名前を入力してください。', eEmail: '正しいメールアドレスを入力してください。', ePhone: '携帯電話番号を入力してください。', eAgree: '内容への同意が必要です。',
    doneT: 'リクエストを受け付けました', doneW: '空き待ちに登録しました', ref: '予約番号', doneNote: 'コンセプトのため、実際の予約は行われていません。',
    next: '実際の予約では、メールとSMSの確認、前日のリマインド、変更・キャンセル用のリンクが届きます。',
    ics: 'カレンダーに追加', print: '印刷', again: 'もう一度予約する', thanks: '{name}様、ありがとうございます。', icsTitle: 'Shiro Sumi(コンセプト)', icsDesc: 'コンセプトの予約であり、実際の予約ではありません。',
    info: 'ご案内',
  },
};

const SEATS = {
  counter: { min: 1, max: 4, slots: ['17:30', '20:00'], cap: 12, dep: 200000, menu: 650000 },
  table: { min: 1, max: 6, slots: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'], cap: 26, dep: 100000, menu: 0 },
  room: { min: 4, max: 8, slots: ['18:00', '20:00'], cap: 8, dep: 250000, menu: 450000 },
  terrace: { min: 1, max: 6, slots: ['17:30', '18:30', '19:30', '20:30'], cap: 16, dep: 100000, menu: 0 },
};
const ORDER = ['counter', 'table', 'room', 'terrace'];
const ADDONS = { sake: { price: 350000, per: 'guest', seats: ['counter', 'room'] }, cake: { price: 75000, per: 'booking', seats: ORDER } };
const CODES = ['+62', '+81', '+65', '+60', '+61', '+44', '+1'];
const HORIZON = 60;
const RATES = { usdPerIdr: 16300, idrPerJpy: 108.7 };

const st = { seat: '', guests: 2, date: '', time: '', occ: 0, diet: [], sn: [], notes: '', name: '', email: '', cc: '+62', phone: '', add: { sake: false, cake: false }, agree: false, done: null };
let view = null; // {y, m} month shown
let root;

const I = () => window.SUMI_I18N;
const lang = () => (I() && I().get()) || 'en';
const L = () => S[lang()] || S.en;
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const loc = () => ({ en: 'en-GB', id: 'id-ID', ja: 'ja-JP' }[lang()]);
const money = (n) => {
  const l = lang();
  if (l === 'id') return 'Rp ' + n.toLocaleString('id-ID');
  if (l === 'ja') return '≈ ¥' + (Math.round(n / RATES.idrPerJpy / 10) * 10).toLocaleString('ja-JP');
  return '≈ $' + Math.round(n / RATES.usdPerIdr).toLocaleString('en-US');
};
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = (s) => { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const minDate = () => addDays(today0(), 1);
const maxDate = () => addDays(today0(), HORIZON);
const longDate = (s) => new Intl.DateTimeFormat(loc(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parse(s));

/* seeded availability */
function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^= h >>> 16) >>> 0) / 4294967296;
}
function seatsLeft(date, seat, time) {
  const c = SEATS[seat], d = parse(date), dow = d.getDay();
  const r = hash(`${date}|${seat}|${time}`);
  const hr = +time.slice(0, 2);
  const prime = hr >= 19 && hr <= 20 ? 0.12 : 0;
  const weekend = dow === 5 || dow === 6 ? 0.2 : dow === 0 ? 0.08 : 0;
  const occ = Math.min(1.05, 0.28 + r * 0.62 + prime + weekend);
  return Math.max(0, c.cap - Math.round(c.cap * occ));
}
function dayState(date) {
  const d = parse(date);
  if (d < minDate() || d > maxDate()) return 'out';
  if (d.getDay() === 1) return 'closed';
  if (!st.seat) return 'open';
  const c = SEATS[st.seat];
  const ok = c.slots.filter((t) => seatsLeft(date, st.seat, t) >= st.guests).length;
  return ok === 0 ? 'full' : ok <= Math.max(1, Math.floor(c.slots.length / 3)) ? 'few' : 'open';
}

/* ---------- helpers for state ---------- */
function clampGuests() {
  if (!st.seat) return;
  const c = SEATS[st.seat];
  st.guests = Math.min(c.max, Math.max(c.min, st.guests));
}
function slotFull() { return !!(st.seat && st.date && st.time && seatsLeft(st.date, st.seat, st.time) < st.guests); }
function invalidateDown(from) {
  if (from <= 1) { /* seat changed */ clampGuests(); }
  if (st.date && dayState(st.date) !== 'open' && dayState(st.date) !== 'few') { /* full dates stay selectable only if open/few */ st.date = ''; st.time = ''; }
  if (st.time && !(st.seat && SEATS[st.seat].slots.includes(st.time))) st.time = '';
  if (!ADDONS.sake.seats.includes(st.seat)) st.add.sake = false;
}
const ready = () => !!(st.seat && st.date && st.time);
const total = () => {
  const c = SEATS[st.seat]; let est = c.menu * st.guests;
  if (st.add.sake) est += ADDONS.sake.price * st.guests;
  if (st.add.cake) est += ADDONS.cake.price;
  return { dep: c.dep * st.guests, est, menu: c.menu > 0 };
};

/* ---------- rendering ---------- */
function stepHead(n, title) {
  return `<header class="bk__h"><span class="bk__n" aria-hidden="true">${String(n).padStart(2, '0')}</span><h2 class="bk__t" id="bk-h${n}">${esc(title)}</h2></header>`;
}

function renderSeat() {
  const t = L();
  const el = root.querySelector('#bk-seat');
  el.innerHTML = stepHead(1, t.s1) + `<div class="bk__opts" role="radiogroup" aria-labelledby="bk-h1">` + ORDER.map((k) => {
    const c = SEATS[k], x = t.seat[k], sel = st.seat === k;
    const price = c.menu ? `${t.menuPp} ${money(c.menu)}` : t.alc;
    return `<button type="button" class="opt${sel ? ' is-sel' : ''}" role="radio" aria-checked="${sel}" data-seat="${k}">
      <span class="opt__n">${esc(x.n)}</span><span class="opt__d">${esc(x.d)}</span>
      <span class="opt__m">${esc(x.m)}</span><span class="opt__p">${esc(price)} · ${esc(t.from)} ${money(c.dep)} ${esc(t.pp)}</span></button>`;
  }).join('') + '</div>';
}

function stepperHTML() {
  const t = L(), c = st.seat ? SEATS[st.seat] : { min: 1, max: 8 };
  return `<div class="stp" role="group" aria-label="${esc(t.guests)}">
    <button type="button" class="stp__b" data-g="-1" aria-label="${esc(t.less)}" ${st.guests <= c.min ? 'disabled' : ''}>−</button>
    <output class="stp__v" aria-live="polite">${esc(st.guests === 1 ? t.guest1 : fmt(t.guestN, { n: st.guests }))}</output>
    <button type="button" class="stp__b" data-g="1" aria-label="${esc(t.more)}" ${st.guests >= c.max ? 'disabled' : ''}>+</button>
  </div>${st.seat ? `<p class="bk__hint">${esc(fmt(t.range, { a: c.min, b: c.max }))}</p>` : ''}`;
}

function calHTML() {
  const t = L();
  if (!view) { const b = st.date ? parse(st.date) : minDate(); view = { y: b.getFullYear(), m: b.getMonth() }; }
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday first
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const fm = new Intl.DateTimeFormat(loc(), { month: 'long', year: 'numeric' });
  const wd = new Intl.DateTimeFormat(loc(), { weekday: 'short' });
  const monday = new Date(2024, 0, 1); // a Monday
  const dows = [...Array(7)].map((_, i) => `<span>${esc(wd.format(addDays(monday, i)))}</span>`).join('');
  const canPrev = new Date(view.y, view.m, 1) > new Date(minDate().getFullYear(), minDate().getMonth(), 1);
  const canNext = new Date(view.y, view.m + 1, 1) <= maxDate();
  let focusIso = st.date && parse(st.date).getMonth() === view.m && parse(st.date).getFullYear() === view.y ? st.date : '';
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push('<i class="cal__x" aria-hidden="true"></i>');
  const states = [];
  for (let d = 1; d <= days; d++) { const s = iso(new Date(view.y, view.m, d)); states.push([d, s, dayState(s)]); }
  if (!focusIso) { const f = states.find((x) => x[2] === 'open' || x[2] === 'few'); focusIso = f ? f[1] : states[0][1]; }
  states.forEach(([d, s, state]) => {
    const dis = state === 'out' || state === 'closed' || state === 'full';
    const label = `${longDate(s)}, ${t[{ out: 'dClosed', closed: 'dClosed', full: 'dFull', few: 'dFew', open: 'dOpen' }[state]]}`;
    const cls = ['cal__d', `is-${state}`, st.date === s ? 'is-sel' : '', iso(today0()) === s ? 'is-today' : ''].filter(Boolean).join(' ');
    cells.push(`<button type="button" class="${cls}" data-d="${s}" tabindex="${s === focusIso ? 0 : -1}" aria-label="${esc(label)}" ${dis ? 'aria-disabled="true"' : ''} ${st.date === s ? 'aria-pressed="true"' : ''}><span>${d}</span></button>`);
  });
  return `<div class="cal" data-view="${view.y}-${view.m}">
    <div class="cal__top"><button type="button" class="cal__nav" data-nav="-1" aria-label="${esc(t.prev)}" ${canPrev ? '' : 'disabled'}>←</button>
      <h3 class="cal__m" aria-live="polite">${esc(fm.format(first))}</h3>
      <button type="button" class="cal__nav" data-nav="1" aria-label="${esc(t.next)}" ${canNext ? '' : 'disabled'}>→</button></div>
    <div class="cal__dow" aria-hidden="true">${dows}</div>
    <div class="cal__grid" role="group" aria-label="${esc(t.cal)}">${cells.join('')}</div>
    <ul class="cal__leg"><li><i class="k k--open"></i>${esc(t.lOpen)}</li><li><i class="k k--few"></i>${esc(t.lFew)}</li><li><i class="k k--full"></i>${esc(t.lFull)}</li><li><i class="k k--closed"></i>${esc(t.lClosed)}</li></ul>
    <p class="bk__hint">${esc(t.calNote)}</p></div>`;
}

function renderDate() {
  const t = L(), el = root.querySelector('#bk-date');
  const locked = !st.seat;
  el.classList.toggle('is-locked', locked);
  el.innerHTML = stepHead(2, t.s2) + (locked ? `<p class="bk__lock">${esc(t.lock1)}</p>` : '') +
    `<div class="bk__two"><div>${stepperHTML()}</div><div>${calHTML()}</div></div>`;
}

function renderTime() {
  const t = L(), el = root.querySelector('#bk-time');
  const locked = !(st.seat && st.date);
  el.classList.toggle('is-locked', locked);
  let body = '';
  if (locked) body = `<p class="bk__lock">${esc(st.seat ? t.lock2 : t.lock1)}</p>`;
  else {
    const c = SEATS[st.seat];
    const btn = (tm, label) => {
      const left = seatsLeft(st.date, st.seat, tm), full = left < st.guests, sel = st.time === tm;
      const sub = full ? t.wait : left <= 6 ? fmt(t.left, { n: left }) : '';
      return `<button type="button" class="slot${sel ? ' is-sel' : ''}${full ? ' is-full' : ''}" data-t="${tm}" aria-pressed="${sel}"><b>${tm}</b>${label ? `<span>${esc(label)}</span>` : ''}${sub ? `<em>${esc(sub)}</em>` : ''}</button>`;
    };
    const openCount = c.slots.filter((tm) => seatsLeft(st.date, st.seat, tm) >= st.guests).length;
    if (st.seat === 'counter' || st.seat === 'room') {
      body = `<div class="slots slots--big">${c.slots.map((tm, i) => btn(tm, i ? t.seating2 : t.seating1)).join('')}</div><p class="bk__hint">${esc(t.seatingLegend)}</p>`;
    } else {
      const grp = (name, f) => { const a = c.slots.filter(f); return a.length ? `<div class="slots__g"><h4>${esc(name)}</h4><div class="slots">${a.map((tm) => btn(tm)).join('')}</div></div>` : ''; };
      body = grp(t.early, (tm) => +tm.slice(0, 2) < 19) + grp(t.evening, (tm) => +tm.slice(0, 2) >= 19 && +tm.slice(0, 2) < 21) + grp(t.late, (tm) => +tm.slice(0, 2) >= 21 || (+tm.slice(0, 2) === 21));
    }
    if (openCount === 0) body += `<p class="bk__note">${esc(fmt(t.noSlots, { n: st.guests }))}</p>`;
    if (slotFull()) body += `<p class="bk__note bk__note--w">${esc(t.waitNote)}</p>`;
  }
  el.classList.toggle('is-locked', locked);
  el.innerHTML = stepHead(3, locked ? t.s3 : fmt(t.timesFor, { d: longDate(st.date) })) + body;
}

function chips(group, items, selected, multi) {
  return items.map((x, i) => `<button type="button" class="chip${(multi ? selected.includes(i) : selected === i) ? ' is-on' : ''}" data-chip="${group}" data-i="${i}" aria-pressed="${multi ? selected.includes(i) : selected === i}">${esc(x)}</button>`).join('');
}

function renderDetails() {
  const t = L(), el = root.querySelector('#bk-details');
  const locked = !ready();
  el.classList.toggle('is-locked', locked);
  if (locked) { el.innerHTML = stepHead(4, t.s4) + `<p class="bk__lock">${esc(!st.seat ? t.lock1 : !st.date ? t.lock2 : t.lock3)}</p>`; return; }
  const addons = Object.keys(ADDONS).filter((k) => ADDONS[k].seats.includes(st.seat)).map((k) => {
    const a = ADDONS[k], nm = k === 'sake' ? t.addSake : t.addCake, ds = k === 'sake' ? t.addSakeD : t.addCakeD;
    return `<label class="add"><input type="checkbox" data-add="${k}" ${st.add[k] ? 'checked' : ''}><span class="add__b"><b>${esc(nm)}</b><small>${esc(ds)}</small></span><span class="add__p">${money(a.price)}<small>${esc(a.per === 'guest' ? t.perGuest : t.perBooking)}</small></span></label>`;
  }).join('');
  el.innerHTML = stepHead(4, t.s4) + `<form id="bk-form" novalidate>
    <fieldset class="bk__fs"><legend>${esc(t.occ)}</legend><div class="chips">${chips('occ', t.occs, st.occ, false)}</div></fieldset>
    <fieldset class="bk__fs"><legend>${esc(t.diet)}</legend><div class="chips">${chips('diet', t.diets, st.diet, true)}</div><p class="bk__hint">${esc(t.dietNote)}</p></fieldset>
    <fieldset class="bk__fs"><legend>${esc(t.sn)}</legend><div class="chips">${chips('sn', t.sns, st.sn, true)}</div></fieldset>
    <div class="field"><label for="b-notes">${esc(t.notes)}</label><textarea id="b-notes" rows="3" placeholder="${esc(t.notesPh)}">${esc(st.notes)}</textarea></div>
    <fieldset class="bk__fs"><legend>${esc(t.add)} <small>${esc(t.addOpt)}</small></legend><div class="adds">${addons}</div></fieldset>
    <div class="field-row">
      <div class="field"><label for="b-name">${esc(t.name)}</label><input id="b-name" autocomplete="name" value="${esc(st.name)}" aria-describedby="b-e-name"><p class="field__err" id="b-e-name" role="alert" hidden></p></div>
      <div class="field"><label for="b-email">${esc(t.email)}</label><input id="b-email" type="email" autocomplete="email" value="${esc(st.email)}" aria-describedby="b-e-email"><p class="field__err" id="b-e-email" role="alert" hidden></p></div>
    </div>
    <div class="field-row field-row--phone">
      <div class="field"><label for="b-cc">${esc(t.cc)}</label><select id="b-cc">${CODES.map((c) => `<option${c === st.cc ? ' selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label for="b-phone">${esc(t.phone)}</label><input id="b-phone" type="tel" inputmode="tel" autocomplete="tel-national" value="${esc(st.phone)}" aria-describedby="b-e-phone"><p class="field__err" id="b-e-phone" role="alert" hidden></p></div>
    </div>
    <div class="bk__pol"><h3>${esc(t.pol)}</h3><ul><li>${esc(t.pol1)}</li><li>${esc(t.pol2)}</li><li>${esc(t.pol3)}</li></ul>
      <label class="agree"><input type="checkbox" id="b-agree" ${st.agree ? 'checked' : ''} aria-describedby="b-e-agree"><span>${esc(t.agree)}</span></label><p class="field__err" id="b-e-agree" role="alert" hidden></p></div>
    <div class="bk__go"><button class="btn btn--ember" type="submit">${esc(slotFull() ? t.submitWait : t.submit)}</button><p class="bk__hint">${esc(t.concept)}</p></div>
  </form>`;
}

function row(label, val) { return `<div class="sm__r"><dt>${esc(label)}</dt><dd>${val}</dd></div>`; }
function renderSummary() {
  const t = L(), el = root.querySelector('#bk-sum');
  const e = `<span class="sm__e">${esc(t.empty)}</span>`;
  let h = `<h2 class="sm__t">${esc(t.sum)}</h2><dl class="sm__l">`;
  h += row(t.sSeat, st.seat ? esc(t.seat[st.seat].n) : e);
  h += row(t.sGuests, esc(st.guests === 1 ? t.guest1 : fmt(t.guestN, { n: st.guests })));
  h += row(t.sDate, st.date ? esc(longDate(st.date)) : e);
  h += row(t.sTime, st.time ? esc(st.time) + (slotFull() ? ` · ${esc(t.wait)}` : '') : e);
  if (ready()) {
    h += row(t.sOcc, esc(t.occs[st.occ]));
    h += row(t.sDiet, st.diet.length ? esc(st.diet.map((i) => t.diets[i]).join(', ')) : esc(t.sNone));
    const ad = [st.add.sake && t.addSake, st.add.cake && t.addCake].filter(Boolean);
    h += row(t.sAdd, ad.length ? esc(ad.join(', ')) : esc(t.sNone));
    const tt = total(), w = slotFull();
    h += row(t.sDep, `${w ? '' : money(tt.dep)}<small>${esc(w ? t.depWait : t.depNow)}</small>`);
    h += row(t.sEst, tt.menu ? `${money(tt.est)}<small>${esc(t.estNote)}</small>` : `<span class="sm__e">${esc(t.estAlc)}</span>`);
  }
  el.innerHTML = h + '</dl>' + (ready() ? '' : `<p class="bk__hint">${esc(t.missing)}</p>`);
}

function refCode() {
  const n = Math.floor(hash(`${st.name}|${st.date}|${st.time}|${st.seat}`) * 36 ** 5);
  return 'SUMI-' + n.toString(36).toUpperCase().padStart(5, '0');
}
function icsFile() {
  const d = st.date.replace(/-/g, ''), [h, m] = st.time.split(':').map(Number);
  const end = `${String((h + 2) % 24).padStart(2, '0')}${String(m).padStart(2, '0')}00`;
  const t = L();
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Shiro Labs//Shiro Sumi concept//EN', 'BEGIN:VEVENT', `UID:${refCode()}@sumi.example`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART;TZID=Asia/Jakarta:${d}T${st.time.replace(':', '')}00`, `DTEND;TZID=Asia/Jakarta:${d}T${end}`,
    `SUMMARY:${t.icsTitle}`, `DESCRIPTION:${t.icsDesc}`, 'LOCATION:Jl. Contoh No. 12\\, Surabaya (illustrative)', 'END:VEVENT', 'END:VCALENDAR'];
  return new Blob([lines.join('\r\n')], { type: 'text/calendar' });
}

function renderDone() {
  const t = L(), el = root.querySelector('#bk-done'), w = st.done.wait;
  el.hidden = false;
  el.innerHTML = `<div class="seal" aria-hidden="true"><span>炭</span></div>
    <h2 class="bk__ok" id="bk-ok" tabindex="-1">${esc(w ? t.doneW : t.doneT)}</h2>
    <p class="lede">${esc(fmt(t.thanks, { name: st.name.trim().split(' ')[0] }))} ${esc(t.next)}</p>
    <dl class="done__l">${row(t.ref, `<b class="done__ref">${esc(st.done.ref)}</b>`)}${row(t.sSeat, esc(t.seat[st.seat].n))}${row(t.sGuests, esc(st.guests === 1 ? t.guest1 : fmt(t.guestN, { n: st.guests })))}${row(t.sDate, esc(longDate(st.date)))}${row(t.sTime, esc(st.time))}</dl>
    <p class="bk__note">${esc(t.doneNote)}</p>
    <div class="done__a"><button type="button" class="btn btn--ember" data-act="ics">${esc(t.ics)}</button><button type="button" class="btn btn--ghost" data-act="print">${esc(t.print)}</button><button type="button" class="btn btn--ghost" data-act="again">${esc(t.again)}</button></div>`;
}

function renderAll() {
  const steps = root.querySelector('#bk-steps');
  const done = !!st.done;
  steps.hidden = done;
  if (done) { renderDone(); renderSummary(); return; }
  root.querySelector('#bk-done').hidden = true;
  renderSeat(); renderDate(); renderTime(); renderDetails(); renderSummary();
}

/* ---------- events ---------- */
function keepFocus(fn) {
  const a = document.activeElement;
  const sel = a && root.contains(a) ? (a.dataset.d ? `[data-d="${a.dataset.d}"]` : a.dataset.seat ? `[data-seat="${a.dataset.seat}"]` : a.dataset.t ? `[data-t="${a.dataset.t}"]` : a.dataset.nav ? `[data-nav="${a.dataset.nav}"]` : a.dataset.g ? `[data-g="${a.dataset.g}"]` : null) : null;
  fn();
  if (sel) { const n = root.querySelector(sel); if (n && !n.disabled) n.focus({ preventScroll: true }); }
}

function showErr(id, input, msg) {
  const e = root.querySelector('#' + id); if (!e) return;
  e.hidden = !msg; e.textContent = msg || '';
  if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
}

function submit(e) {
  e.preventDefault();
  const t = L(), f = root.querySelector('#bk-form');
  const n = f.querySelector('#b-name'), m = f.querySelector('#b-email'), p = f.querySelector('#b-phone'), a = f.querySelector('#b-agree');
  const bad = [];
  const okName = n.value.trim().length > 1, okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m.value.trim()), okPh = p.value.replace(/\D/g, '').length >= 6, okAg = a.checked;
  showErr('b-e-name', n, okName ? '' : t.eName); if (!okName) bad.push(n);
  showErr('b-e-email', m, okMail ? '' : t.eEmail); if (!okMail) bad.push(m);
  showErr('b-e-phone', p, okPh ? '' : t.ePhone); if (!okPh) bad.push(p);
  showErr('b-e-agree', a, okAg ? '' : t.eAgree); if (!okAg) bad.push(a);
  if (bad.length) { bad[0].focus(); return; }
  st.name = n.value.trim(); st.email = m.value.trim(); st.phone = p.value.trim();
  st.done = { ref: refCode(), wait: slotFull() };
  renderAll();
  const h = root.querySelector('#bk-ok'); if (h) { h.focus({ preventScroll: true }); h.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
}

function onClick(e) {
  const t = e.target.closest('button, input[type=checkbox]');
  if (!t || !root.contains(t)) return;
  if (t.dataset.seat) { st.seat = t.dataset.seat; invalidateDown(1); keepFocus(renderAll); return; }
  if (t.dataset.g) { st.guests += +t.dataset.g; clampGuests(); invalidateDown(2); if (st.time && !st.seat) st.time = ''; keepFocus(renderAll); return; }
  if (t.dataset.nav) {
    let m = view.m + +t.dataset.nav, y = view.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    view = { y, m }; keepFocus(renderDate); return;
  }
  if (t.dataset.d) { if (t.getAttribute('aria-disabled') === 'true') return; st.date = t.dataset.d; st.time = ''; keepFocus(renderAll); return; }
  if (t.dataset.t) { st.time = t.dataset.t; keepFocus(renderAll); return; }
  if (t.dataset.chip) {
    const g = t.dataset.chip, i = +t.dataset.i;
    if (g === 'occ') { st.occ = i; root.querySelectorAll('[data-chip="occ"]').forEach((c) => { const on = +c.dataset.i === i; c.classList.toggle('is-on', on); c.setAttribute('aria-pressed', on); }); }
    else { const arr = st[g], k = arr.indexOf(i); if (k > -1) arr.splice(k, 1); else arr.push(i); t.classList.toggle('is-on', k < 0); t.setAttribute('aria-pressed', k < 0); }
    renderSummary(); return;
  }
  if (t.dataset.add) { st.add[t.dataset.add] = t.checked; renderSummary(); return; }
  if (t.dataset.act === 'ics') { const u = URL.createObjectURL(icsFile()), a = document.createElement('a'); a.href = u; a.download = 'shiro-sumi-concept.ics'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1500); return; }
  if (t.dataset.act === 'print') { window.print(); return; }
  if (t.dataset.act === 'again') { Object.assign(st, { seat: '', guests: 2, date: '', time: '', occ: 0, diet: [], sn: [], notes: '', add: { sake: false, cake: false }, agree: false, done: null }); view = null; renderAll(); root.scrollIntoView({ block: 'start' }); return; }
}

function onInput(e) {
  const i = e.target;
  if (i.id === 'b-notes') st.notes = i.value;
  else if (i.id === 'b-name') st.name = i.value;
  else if (i.id === 'b-email') st.email = i.value;
  else if (i.id === 'b-phone') st.phone = i.value;
  else if (i.id === 'b-cc') st.cc = i.value;
  else if (i.id === 'b-agree') st.agree = i.checked;
}

function onKey(e) {
  const b = e.target.closest('.cal__d'); if (!b) return;
  const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  if (!(e.key in map)) return;
  e.preventDefault();
  const target = addDays(parse(b.dataset.d), map[e.key]);
  if (target < minDate() || target > maxDate()) return;
  if (target.getMonth() !== view.m || target.getFullYear() !== view.y) { view = { y: target.getFullYear(), m: target.getMonth() }; renderDate(); }
  const n = root.querySelector(`[data-d="${iso(target)}"]`);
  if (n) { root.querySelectorAll('.cal__d').forEach((x) => x.setAttribute('tabindex', '-1')); n.setAttribute('tabindex', '0'); n.focus(); }
}

export function initBooking() {
  root = document.getElementById('booking');
  if (!root) return;
  root.addEventListener('click', onClick);
  root.addEventListener('input', onInput);
  root.addEventListener('change', onInput);
  root.addEventListener('keydown', onKey);
  root.addEventListener('submit', (e) => { if (e.target.id === 'bk-form') submit(e); });
  document.addEventListener('sumi:lang', () => keepFocus(renderAll));
  renderAll();
}
