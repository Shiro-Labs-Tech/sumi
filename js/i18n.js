/* Shiro Sumi i18n. Keys are applied through data-t (text) and data-t-attrs
   ("attr=key|attr=key"). Switcher buttons use data-lang-set, so nothing here
   collides with any other data attribute. ID and JA copy: flag for native review. */
(function () {
  'use strict';

  var RATES = { usdPerIdr: 16300, idrPerJpy: 108.7 }; // approximate, illustrative
  var STORE = 'sumi-lang';
  var LANGS = ['en', 'id', 'ja'];

  var D = {
    en: {
      skip: 'Skip to content',
      'nav.label': 'Main navigation', 'nav.toggle': 'Open menu', 'nav.close': 'Close menu',
      'nav.home': 'Home', 'nav.menu': 'Menu', 'nav.story': 'Story', 'nav.reserve': 'Reserve',
      'lang.label': 'Language', 'brand.label': 'Shiro Sumi, home',
      'meta.home.title': 'Shiro Sumi | Concept charcoal grill, Surabaya',
      'meta.home.desc': 'A concept Japanese-Indonesian binchotan grill. Fictional restaurant, designed by Shiro Labs.',
      'meta.menu.title': 'Menu | Shiro Sumi',
      'meta.menu.desc': 'The short, changing menu at Shiro Sumi. Illustrative dishes and prices.',
      'meta.story.title': 'Story | Shiro Sumi',
      'meta.story.desc': 'The idea behind Shiro Sumi, a fictional charcoal grill concept by Shiro Labs.',
      'meta.reserve.title': 'Reserve | Shiro Sumi',
      'meta.reserve.desc': 'Concept booking flow for Shiro Sumi. Nothing is actually sent.',

      'hero.eyebrow': 'Concept restaurant · Surabaya',
      'hero.title': 'Fire, salt, and a little sambal.',
      'hero.sub': 'A binchotan grill where Japanese technique meets Indonesian spice. Twelve seats at the counter, one fire, no shortcuts.',
      'hero.cta1': 'Reserve a seat', 'hero.cta2': 'See the menu',
      'hero.hours': 'Tue to Sun · 17:00 to 23:00',
      'hero.scroll': 'Scroll',

      'tick.1': 'Binchotan', 'tick.2': 'Sambal matah', 'tick.3': 'Yuzu kosho', 'tick.4': 'Kecap manis', 'tick.5': 'Hojicha', 'tick.6': 'Pandan',

      'phil.eyebrow': 'The idea',
      'phil.title': 'One fire. Two kitchens.',
      'phil.1.t': 'Fire', 'phil.1.d': 'Binchotan burns hot and clean, so food tastes of itself plus a whisper of smoke.',
      'phil.2.t': 'Spice', 'phil.2.d': 'Lemongrass, galangal, turmeric and chili, ground by hand and used with a light touch.',
      'phil.3.t': 'Season', 'phil.3.d': 'The short menu follows what local farms and fishers bring in, not a fixed calendar.',

      'sig.eyebrow': 'Signatures', 'sig.title': 'Three plates to start with', 'sig.all': 'Full menu',

      'visit.eyebrow': 'Visit', 'visit.title': 'Open six nights a week',
      'visit.hours.t': 'Hours', 'visit.hours.d': 'Tuesday to Sunday, 17:00 to 23:00. Closed Monday.',
      'visit.last.t': 'Last order', 'visit.last.d': '22:15 at the counter.',
      'visit.addr.t': 'Address', 'visit.addr.d': 'Jl. Contoh No. 12, Surabaya (illustrative)',

      'cta.title': 'Hungry yet?', 'cta.text': 'The counter seats twelve. Book ahead on weekends.', 'cta.btn': 'Reserve a seat',

      'menu.eyebrow': 'The menu', 'menu.title': 'Short, seasonal, over fire',
      'menu.intro': 'A short, changing menu. Every dish touches the fire at least once.',
      'menu.note': 'Illustrative prices in the language currency. Converted amounts are approximate.',
      'menu.jump': 'Menu sections',
      'cat.starters': 'Starters', 'cat.mains': 'Mains', 'cat.sides': 'Rice and sides', 'cat.sweets': 'Sweets', 'cat.drinks': 'Drinks',
      'tag.v': 'Vegetarian', 'tag.s': 'Spicy',

      'd.sate.n': 'Sate lilit, binchotan', 'd.sate.d': 'Minced Spanish mackerel with lemongrass and coconut, wrapped on a lemongrass stick.',
      'd.tsukune.n': 'Tsukune, sambal matah glaze', 'd.tsukune.d': 'Chicken thigh meatball glazed with tare and topped with raw shallot sambal.',
      'd.edamame.n': 'Smoked edamame', 'd.edamame.d': 'Grilled in the pod with kaffir lime leaf and sea salt.',
      'd.tahu.n': 'Charred tofu, miso kecap', 'd.tahu.d': 'Firm tofu glazed with white miso and kecap manis, scattered with fried shallot.',
      'd.wagyu.n': 'Wagyu skewers, rica-rica butter', 'd.wagyu.d': 'Local wagyu rump over high heat, brushed with chili-lime butter.',
      'd.snapper.n': 'Whole snapper, bumbu kuning', 'd.snapper.d': 'Day-boat red snapper rubbed with turmeric paste, served with yuzu kosho.',
      'd.ayam.n': 'Ayam bakar, shio koji', 'd.ayam.d': 'Thigh marinated in shio koji, finished with calamansi and charred scallion.',
      'd.jamur.n': 'King oyster, rendang glaze', 'd.jamur.d': 'Scored mushroom brushed with a slow-cooked coconut and spice glaze.',
      'd.rice.n': 'Smoked nasi bakar', 'd.rice.d': 'Rice grilled in banana leaf with dashi and a soft egg yolk.',
      'd.kangkung.n': 'Kangkung, garlic, ponzu', 'd.kangkung.d': 'Water spinach flashed over the fire with garlic and house ponzu.',
      'd.banana.n': 'Grilled banana, hojicha caramel', 'd.banana.d': 'Pisang kepok with hojicha caramel and toasted coconut.',
      'd.ice.n': 'Black sesame and pandan ice cream', 'd.ice.d': 'Two scoops with a salted rice cracker.',
      'd.iced.n': 'Iced hojicha', 'd.iced.d': 'Roasted green tea, palm sugar, lime.',
      'd.jahe.n': 'Jahe highball', 'd.jahe.d': 'Japanese whisky, ginger, lime, soda.',
      'd.sake.n': 'Sake flight', 'd.sake.d': 'Three pours, chosen to match the menu.',

      'story.eyebrow': 'Story', 'story.title': 'A small fire with a long reach',
      'story.s1.t': 'The idea',
      'story.s1.d': 'Shiro Sumi imagines a counter where a Japanese yakitori habit meets the grills of Java and Bali. Both cultures cook over embers. They just season differently.',
      'story.s2.t': 'The charcoal',
      'story.s2.d': 'Binchotan is dense, nearly smokeless and holds a steady heat for hours. It lets spice paste caramelise instead of burn.',
      'story.s3.t': 'The house rules',
      'story.r1': 'A short menu, so every dish gets full attention.',
      'story.r2': 'Cook to order, at the counter, in front of you.',
      'story.r3': 'Use the whole ingredient: bones for stock, trimmings for tare.',
      'stat.1': 'counter seats', 'stat.2': 'fire', 'stat.3': 'nights a week',
      'about.t': 'About this concept',
      'about.d': 'Shiro Sumi is a fictional restaurant created by Shiro Labs as a portfolio case study. It does not exist. The menu, prices, hours, address and every name are illustrative.',

      'res.eyebrow': 'Reserve', 'res.title': 'Save a seat at the fire',
      'res.intro': 'This is a concept, so nothing is actually sent. Fill in the form to see how the booking flow would feel.',
      'res.name': 'Your name', 'res.date': 'Date', 'res.time': 'Seating', 'res.guests': 'Guests', 'res.notes': 'Notes (allergies, occasions)',
      'res.t1': '17:30', 'res.t2': '19:00', 'res.t3': '20:30',
      'res.g': 'guests', 'res.g1': '1 guest',
      'res.submit': 'Request a seat',
      'res.err.name': 'Please enter your name.',
      'res.err.date': 'Pick a date from Tuesday to Sunday.',
      'res.ok': 'Thank you, {name}. This is a concept, so no booking was made.',
      'res.limit': 'Up to six guests per booking at the counter.',
      'res.info.t': 'Good to know',
      'res.contact': 'reservations@sumi.example (illustrative)',
      'map.alt': 'Stylized illustration of streets and a river with a marker for the restaurant',
      'map.cap': 'Stylized map, not to scale. The location is illustrative.',

      'foot.tag': 'A fictional charcoal grill. Concept by Shiro Labs.',
      'foot.disc': 'Shiro Sumi is an illustrative concept project. Prices, hours, menu, address and names are not real. Converted currency amounts are approximate.',
      'foot.rates': 'Reference rates: 1 USD ≈ Rp 16,300 ≈ ¥150.',
      'foot.review': 'Indonesian and Japanese copy is awaiting native review.',
      'foot.nav': 'Footer navigation',
      'foot.by': 'Designed and built by Shiro Labs'
    },

    id: {
      skip: 'Lewati ke konten',
      'nav.label': 'Navigasi utama', 'nav.toggle': 'Buka menu', 'nav.close': 'Tutup menu',
      'nav.home': 'Beranda', 'nav.menu': 'Menu', 'nav.story': 'Cerita', 'nav.reserve': 'Reservasi',
      'lang.label': 'Bahasa', 'brand.label': 'Shiro Sumi, beranda',
      'meta.home.title': 'Shiro Sumi | Konsep panggangan arang, Surabaya',
      'meta.home.desc': 'Konsep panggangan binchotan Jepang-Indonesia. Restoran fiktif, dirancang oleh Shiro Labs.',
      'meta.menu.title': 'Menu | Shiro Sumi',
      'meta.menu.desc': 'Menu pendek yang berganti di Shiro Sumi. Hidangan dan harga hanya ilustrasi.',
      'meta.story.title': 'Cerita | Shiro Sumi',
      'meta.story.desc': 'Gagasan di balik Shiro Sumi, konsep panggangan arang fiktif dari Shiro Labs.',
      'meta.reserve.title': 'Reservasi | Shiro Sumi',
      'meta.reserve.desc': 'Alur reservasi konsep untuk Shiro Sumi. Tidak ada data yang dikirim.',

      'hero.eyebrow': 'Restoran konsep · Surabaya',
      'hero.title': 'Api, garam, dan sedikit sambal.',
      'hero.sub': 'Panggangan binchotan tempat teknik Jepang bertemu bumbu Nusantara. Dua belas kursi di konter, satu api, tanpa jalan pintas.',
      'hero.cta1': 'Pesan kursi', 'hero.cta2': 'Lihat menu',
      'hero.hours': 'Sel sampai Min · 17.00 sampai 23.00',
      'hero.scroll': 'Gulir',

      'tick.1': 'Binchotan', 'tick.2': 'Sambal matah', 'tick.3': 'Yuzu kosho', 'tick.4': 'Kecap manis', 'tick.5': 'Hojicha', 'tick.6': 'Pandan',

      'phil.eyebrow': 'Gagasan',
      'phil.title': 'Satu api. Dua dapur.',
      'phil.1.t': 'Api', 'phil.1.d': 'Binchotan membara panas dan bersih, sehingga rasa bahan tetap utuh dengan sentuhan asap tipis.',
      'phil.2.t': 'Bumbu', 'phil.2.d': 'Serai, lengkuas, kunyit, dan cabai, diulek manual dan dipakai secukupnya.',
      'phil.3.t': 'Musim', 'phil.3.d': 'Menu singkat mengikuti hasil petani dan nelayan lokal, bukan kalender tetap.',

      'sig.eyebrow': 'Andalan', 'sig.title': 'Tiga hidangan untuk memulai', 'sig.all': 'Menu lengkap',

      'visit.eyebrow': 'Kunjungi', 'visit.title': 'Buka enam malam seminggu',
      'visit.hours.t': 'Jam buka', 'visit.hours.d': 'Selasa sampai Minggu, 17.00 sampai 23.00. Senin tutup.',
      'visit.last.t': 'Pesanan terakhir', 'visit.last.d': '22.15 di konter.',
      'visit.addr.t': 'Alamat', 'visit.addr.d': 'Jl. Contoh No. 12, Surabaya (ilustrasi)',

      'cta.title': 'Sudah lapar?', 'cta.text': 'Konter berkapasitas dua belas kursi. Pesan lebih awal untuk akhir pekan.', 'cta.btn': 'Pesan kursi',

      'menu.eyebrow': 'Menu', 'menu.title': 'Singkat, musiman, di atas api',
      'menu.intro': 'Menu pendek yang berganti-ganti. Setiap hidangan menyentuh api setidaknya sekali.',
      'menu.note': 'Harga ilustrasi dalam mata uang bahasa ini. Nilai konversi hanya perkiraan.',
      'menu.jump': 'Bagian menu',
      'cat.starters': 'Pembuka', 'cat.mains': 'Hidangan utama', 'cat.sides': 'Nasi dan pendamping', 'cat.sweets': 'Penutup', 'cat.drinks': 'Minuman',
      'tag.v': 'Vegetarian', 'tag.s': 'Pedas',

      'd.sate.n': 'Sate lilit, binchotan', 'd.sate.d': 'Ikan tenggiri cincang dengan serai dan kelapa, dililitkan pada batang serai.',
      'd.tsukune.n': 'Tsukune, glasir sambal matah', 'd.tsukune.d': 'Bola daging paha ayam berglasir tare, dengan sambal matah bawang merah mentah.',
      'd.edamame.n': 'Edamame asap', 'd.edamame.d': 'Dipanggang dalam polongnya dengan daun jeruk purut dan garam laut.',
      'd.tahu.n': 'Tahu bakar, miso kecap', 'd.tahu.d': 'Tahu padat berglasir miso putih dan kecap manis, ditaburi bawang goreng.',
      'd.wagyu.n': 'Sate wagyu, mentega rica-rica', 'd.wagyu.d': 'Wagyu lokal dipanggang api besar, diolesi mentega cabai dan jeruk nipis.',
      'd.snapper.n': 'Kakap utuh, bumbu kuning', 'd.snapper.d': 'Kakap merah segar dilumuri pasta kunyit, disajikan dengan yuzu kosho.',
      'd.ayam.n': 'Ayam bakar, shio koji', 'd.ayam.d': 'Paha ayam dimarinasi shio koji, disajikan dengan jeruk kalamansi dan daun bawang bakar.',
      'd.jamur.n': 'Jamur king oyster, glasir rendang', 'd.jamur.d': 'Jamur yang digores, diolesi glasir santan dan rempah yang dimasak lama.',
      'd.rice.n': 'Nasi bakar asap', 'd.rice.d': 'Nasi dibakar dalam daun pisang dengan dashi dan kuning telur setengah matang.',
      'd.kangkung.n': 'Kangkung, bawang putih, ponzu', 'd.kangkung.d': 'Kangkung disambar api bersama bawang putih dan ponzu buatan sendiri.',
      'd.banana.n': 'Pisang bakar, karamel hojicha', 'd.banana.d': 'Pisang kepok dengan karamel hojicha dan kelapa sangrai.',
      'd.ice.n': 'Es krim wijen hitam dan pandan', 'd.ice.d': 'Dua scoop dengan kerupuk beras asin.',
      'd.iced.n': 'Es hojicha', 'd.iced.d': 'Teh hijau sangrai, gula aren, jeruk nipis.',
      'd.jahe.n': 'Highball jahe', 'd.jahe.d': 'Wiski Jepang, jahe, jeruk nipis, soda.',
      'd.sake.n': 'Sake flight', 'd.sake.d': 'Tiga tuangan, dipilih agar serasi dengan menu.',

      'story.eyebrow': 'Cerita', 'story.title': 'Api kecil yang jangkauannya jauh',
      'story.s1.t': 'Gagasannya',
      'story.s1.d': 'Shiro Sumi membayangkan sebuah konter tempat kebiasaan yakitori Jepang bertemu panggangan Jawa dan Bali. Kedua budaya memasak di atas bara. Hanya bumbunya yang berbeda.',
      'story.s2.t': 'Arangnya',
      'story.s2.d': 'Binchotan padat, hampir tanpa asap, dan menjaga panas stabil berjam-jam. Pasta bumbu pun berkaramel, bukan gosong.',
      'story.s3.t': 'Aturan dapur',
      'story.r1': 'Menu singkat, agar setiap hidangan mendapat perhatian penuh.',
      'story.r2': 'Dimasak sesuai pesanan, di konter, di depan Anda.',
      'story.r3': 'Memakai seluruh bahan: tulang untuk kaldu, sisa potongan untuk tare.',
      'stat.1': 'kursi konter', 'stat.2': 'api', 'stat.3': 'malam seminggu',
      'about.t': 'Tentang konsep ini',
      'about.d': 'Shiro Sumi adalah restoran fiktif yang dibuat oleh Shiro Labs sebagai studi kasus portofolio. Restoran ini tidak nyata. Menu, harga, jam buka, alamat, dan semua nama hanyalah ilustrasi.',

      'res.eyebrow': 'Reservasi', 'res.title': 'Amankan kursi di dekat api',
      'res.intro': 'Ini hanya konsep, jadi tidak ada yang benar-benar dikirim. Isi formulir untuk merasakan alur reservasinya.',
      'res.name': 'Nama Anda', 'res.date': 'Tanggal', 'res.time': 'Sesi', 'res.guests': 'Tamu', 'res.notes': 'Catatan (alergi, acara khusus)',
      'res.t1': '17.30', 'res.t2': '19.00', 'res.t3': '20.30',
      'res.g': 'tamu', 'res.g1': '1 tamu',
      'res.submit': 'Ajukan kursi',
      'res.err.name': 'Silakan isi nama Anda.',
      'res.err.date': 'Pilih tanggal dari Selasa sampai Minggu.',
      'res.ok': 'Terima kasih, {name}. Ini hanya konsep, jadi tidak ada reservasi yang dibuat.',
      'res.limit': 'Maksimal enam tamu per reservasi di konter.',
      'res.info.t': 'Perlu diketahui',
      'res.contact': 'reservations@sumi.example (ilustrasi)',
      'map.alt': 'Ilustrasi bergaya berisi jalan dan sungai dengan penanda lokasi restoran',
      'map.cap': 'Peta bergaya, tidak sesuai skala. Lokasinya hanya ilustrasi.',

      'foot.tag': 'Panggangan arang fiktif. Konsep dari Shiro Labs.',
      'foot.disc': 'Shiro Sumi adalah proyek konsep ilustratif. Harga, jam buka, menu, alamat, dan nama tidak nyata. Nilai konversi mata uang hanya perkiraan.',
      'foot.rates': 'Kurs acuan: 1 USD ≈ Rp 16.300 ≈ ¥150.',
      'foot.review': 'Teks bahasa Indonesia dan Jepang masih menunggu tinjauan penutur asli.',
      'foot.nav': 'Navigasi footer',
      'foot.by': 'Dirancang dan dibangun oleh Shiro Labs'
    },

    ja: {
      skip: '本文へスキップ',
      'nav.label': 'メインナビゲーション', 'nav.toggle': 'メニューを開く', 'nav.close': 'メニューを閉じる',
      'nav.home': 'ホーム', 'nav.menu': 'メニュー', 'nav.story': '物語', 'nav.reserve': '予約',
      'lang.label': '言語', 'brand.label': 'Shiro Sumi、ホーム',
      'meta.home.title': 'Shiro Sumi | コンセプト炭火焼き、スラバヤ',
      'meta.home.desc': '日本とインドネシアが出会う備長炭焼きのコンセプト。架空のレストランで、Shiro Labsがデザインしました。',
      'meta.menu.title': 'メニュー | Shiro Sumi',
      'meta.menu.desc': 'Shiro Sumiの短く変わるメニュー。料理と価格は例示です。',
      'meta.story.title': '物語 | Shiro Sumi',
      'meta.story.desc': 'Shiro Labsによる架空の炭火焼きコンセプト、Shiro Sumiの背景にある考え方。',
      'meta.reserve.title': '予約 | Shiro Sumi',
      'meta.reserve.desc': 'Shiro Sumiのコンセプト予約フロー。実際には何も送信されません。',

      'hero.eyebrow': 'コンセプトレストラン · スラバヤ',
      'hero.title': '炎と塩、ほんの少しのサンバル。',
      'hero.sub': '備長炭の炉端で、日本の技とインドネシアのスパイスが出会う。カウンター12席、ひとつの火、近道はなし。',
      'hero.cta1': '席を予約', 'hero.cta2': 'メニューを見る',
      'hero.hours': '火〜日 · 17:00〜23:00',
      'hero.scroll': 'スクロール',

      'tick.1': '備長炭', 'tick.2': 'サンバルマター', 'tick.3': '柚子胡椒', 'tick.4': 'ケチャップマニス', 'tick.5': 'ほうじ茶', 'tick.6': 'パンダン',

      'phil.eyebrow': 'コンセプト',
      'phil.title': 'ひとつの火、ふたつの台所。',
      'phil.1.t': '火', 'phil.1.d': '備長炭は高温でクリーンに燃え、素材の味に淡い煙の香りだけを添えます。',
      'phil.2.t': '香辛料', 'phil.2.d': 'レモングラス、ガランガル、ターメリック、唐辛子。手でつぶして、控えめに使います。',
      'phil.3.t': '季節', 'phil.3.d': '短いメニューは、決まった暦ではなく、地元の農家と漁師が届けるものに合わせて変わります。',

      'sig.eyebrow': '看板料理', 'sig.title': 'まず味わいたい三皿', 'sig.all': 'メニュー全体',

      'visit.eyebrow': '来店', 'visit.title': '週6日、夜に営業',
      'visit.hours.t': '営業時間', 'visit.hours.d': '火曜から日曜、17:00〜23:00。月曜定休。',
      'visit.last.t': 'ラストオーダー', 'visit.last.d': 'カウンターで22:15。',
      'visit.addr.t': '住所', 'visit.addr.d': 'Jl. Contoh No. 12、スラバヤ(例示)',

      'cta.title': 'お腹は空きましたか?', 'cta.text': 'カウンターは12席です。週末は早めにご予約ください。', 'cta.btn': '席を予約',

      'menu.eyebrow': 'メニュー', 'menu.title': '短く、季節で、炎のうえで',
      'menu.intro': '短く、季節で変わるメニュー。すべての料理が一度は火に触れます。',
      'menu.note': '価格はこの言語の通貨による例示です。換算額はおおよその目安です。',
      'menu.jump': 'メニューの項目',
      'cat.starters': '前菜', 'cat.mains': '主菜', 'cat.sides': 'ご飯と副菜', 'cat.sweets': 'デザート', 'cat.drinks': 'ドリンク',
      'tag.v': 'ベジタリアン', 'tag.s': '辛い',

      'd.sate.n': 'サテ・リリット 炭火焼き', 'd.sate.d': 'サワラのすり身にレモングラスとココナッツを合わせ、レモングラスの串に巻いて焼きます。',
      'd.tsukune.n': 'つくね サンバルマター仕立て', 'd.tsukune.d': '鶏ももの肉団子にタレを塗り、生のエシャロットのサンバルをのせて。',
      'd.edamame.n': '燻製枝豆', 'd.edamame.d': 'さやごと炭火で焼き、コブミカンの葉と海塩を添えて。',
      'd.tahu.n': '焼き豆腐 味噌ケチャップマニス', 'd.tahu.d': '固めの豆腐に白味噌とケチャップマニスを塗り、揚げ玉ねぎを散らして。',
      'd.wagyu.n': '和牛串 リカリカバター', 'd.wagyu.d': '地元産の和牛ももを強火で焼き、唐辛子とライムのバターを塗って。',
      'd.snapper.n': 'フエダイの丸焼き 黄色いスパイス', 'd.snapper.d': 'その日に揚がった赤いフエダイにターメリックのペーストを塗り、柚子胡椒を添えて。',
      'd.ayam.n': '焼き鶏 塩麹', 'd.ayam.d': '塩麹に漬けた鶏ももに、カラマンシーと焼きねぎを添えて。',
      'd.jamur.n': 'エリンギ レンダン仕立て', 'd.jamur.d': '切り込みを入れたエリンギに、ココナッツとスパイスをじっくり煮詰めたタレを塗って。',
      'd.rice.n': '燻製ナシ・バカール', 'd.rice.d': 'バナナの葉で包んで焼いたご飯に、出汁と半熟の卵黄を添えて。',
      'd.kangkung.n': '空心菜 ニンニクとポン酢', 'd.kangkung.d': '空心菜を強火でさっと炙り、ニンニクと自家製ポン酢で。',
      'd.banana.n': '焼きバナナ ほうじ茶キャラメル', 'd.banana.d': 'ピサン・ケポックにほうじ茶のキャラメルと香ばしいココナッツ。',
      'd.ice.n': '黒ごまとパンダンのアイス', 'd.ice.d': '2スクープに、塩味の米せんべいを添えて。',
      'd.iced.n': 'アイスほうじ茶', 'd.iced.d': '焙じ茶にヤシ糖とライムを。',
      'd.jahe.n': 'ジンジャーハイボール', 'd.jahe.d': '日本のウイスキー、生姜、ライム、ソーダ。',
      'd.sake.n': '日本酒フライト', 'd.sake.d': 'メニューに合わせて選んだ3種。',

      'story.eyebrow': '物語', 'story.title': '小さな火が、遠くまで届く',
      'story.s1.t': '着想',
      'story.s1.d': 'Shiro Sumiが思い描くのは、日本の焼き鳥の習慣と、ジャワ・バリの炭火焼きが出会うカウンター。どちらの文化も熾火で調理し、違うのは味付けだけです。',
      'story.s2.t': '炭',
      'story.s2.d': '備長炭は密度が高く、ほとんど煙が出ず、何時間も安定した火力を保ちます。スパイスのペーストが焦げずにキャラメル化します。',
      'story.s3.t': '厨房の決まり',
      'story.r1': 'メニューは短く、一皿ずつに全力を注ぎます。',
      'story.r2': '注文を受けてから、目の前のカウンターで焼きます。',
      'story.r3': '素材は余さず使う。骨は出汁に、端材はタレに。',
      'stat.1': 'カウンター席', 'stat.2': 'ひとつの火', 'stat.3': '週の営業日数',
      'about.t': 'このコンセプトについて',
      'about.d': 'Shiro Sumiは、Shiro Labsがポートフォリオのケーススタディとして作った架空のレストランです。実在しません。メニュー、価格、営業時間、住所、名称はすべて例示です。',

      'res.eyebrow': '予約', 'res.title': '火のそばの席を確保',
      'res.intro': 'これはコンセプトなので、実際には何も送信されません。フォームに入力して、予約の流れを体験してください。',
      'res.name': 'お名前', 'res.date': '日付', 'res.time': '時間帯', 'res.guests': '人数', 'res.notes': '備考(アレルギー、記念日など)',
      'res.t1': '17:30', 'res.t2': '19:00', 'res.t3': '20:30',
      'res.g': '名', 'res.g1': '1名',
      'res.submit': '席をリクエスト',
      'res.err.name': 'お名前を入力してください。',
      'res.err.date': '火曜から日曜の日付を選んでください。',
      'res.ok': '{name}様、ありがとうございます。これはコンセプトのため、実際の予約は行われていません。',
      'res.limit': 'カウンター席は1回のご予約につき最大6名までです。',
      'res.info.t': 'ご案内',
      'res.contact': 'reservations@sumi.example(例示)',
      'map.alt': '通りと川、レストランの位置を示すマーカーを描いた様式化されたイラスト',
      'map.cap': '様式化した地図で、縮尺は正確ではありません。場所は例示です。',

      'foot.tag': '架空の炭火焼き。Shiro Labsによるコンセプト。',
      'foot.disc': 'Shiro Sumiは例示のコンセプトプロジェクトです。価格、営業時間、メニュー、住所、名称は実在しません。通貨の換算額はおおよその目安です。',
      'foot.rates': '参考レート:1 USD ≈ Rp 16,300 ≈ ¥150。',
      'foot.review': 'インドネシア語と日本語の文章は、ネイティブによる確認待ちです。',
      'foot.nav': 'フッターナビゲーション',
      'foot.by': 'Shiro Labsがデザイン・制作'
    }
  };

  function detect() {
    try { var s = localStorage.getItem(STORE); if (LANGS.indexOf(s) > -1) return s; } catch (e) {}
    var n = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) > -1 ? n : 'en';
  }

  function money(idr, lang) {
    if (lang === 'id') return 'Rp ' + idr.toLocaleString('id-ID');
    if (lang === 'ja') return '≈ ¥' + (Math.round(idr / RATES.idrPerJpy / 10) * 10).toLocaleString('ja-JP');
    return '≈ $' + Math.round(idr / RATES.usdPerIdr).toLocaleString('en-US');
  }

  function t(key, lang) {
    var l = lang || current;
    return (D[l] && D[l][key] != null) ? D[l][key] : (D.en[key] != null ? D.en[key] : key);
  }

  var current = 'en';

  function apply(lang) {
    current = lang;
    var root = document.documentElement;
    root.lang = lang;

    document.querySelectorAll('[data-t]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-t'));
    });
    document.querySelectorAll('[data-t-attrs]').forEach(function (el) {
      el.getAttribute('data-t-attrs').split('|').forEach(function (pair) {
        var i = pair.indexOf('=');
        if (i > 0) el.setAttribute(pair.slice(0, i), t(pair.slice(i + 1)));
      });
    });
    document.querySelectorAll('[data-idr]').forEach(function (el) {
      el.textContent = money(parseInt(el.getAttribute('data-idr'), 10), lang);
    });
    document.querySelectorAll('[data-lang-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-set') === lang ? 'true' : 'false');
    });
    var tt = document.querySelector('title[data-t]');
    if (tt) document.title = tt.textContent;

    document.dispatchEvent(new CustomEvent('sumi:lang', { detail: { lang: lang } }));
  }

  function set(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    try { localStorage.setItem(STORE, lang); } catch (e) {}
    apply(lang);
  }

  window.SUMI_I18N = { t: t, set: set, get: function () { return current; }, dict: D };

  function init() {
    document.querySelectorAll('[data-lang-set]').forEach(function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-lang-set')); });
    });
    apply(detect());
    document.documentElement.classList.remove('i18n-pending');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
