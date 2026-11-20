#!/usr/bin/env python3
"""Generates the four static pages of Shiro Sumi from shared partials."""
import os, datetime

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DISHES = {
    'sate': (68000, ''), 'tsukune': (72000, 's'), 'edamame': (38000, 'v'), 'tahu': (42000, 'v'),
    'wagyu': (185000, 's'), 'snapper': (165000, 's'), 'ayam': (98000, ''), 'jamur': (78000, 'v'),
    'rice': (48000, ''), 'kangkung': (36000, 'v'),
    'banana': (52000, 'v'), 'ice': (48000, 'v'),
    'iced': (32000, 'v'), 'jahe': (85000, ''), 'sake': (195000, ''),
}

CATS = [
    ('starters', ['sate', 'tsukune', 'edamame', 'tahu']),
    ('mains', ['wagyu', 'snapper', 'ayam', 'jamur']),
    ('sides', ['rice', 'kangkung']),
    ('sweets', ['banana', 'ice']),
    ('drinks', ['iced', 'jahe', 'sake']),
]

PAGES = [('index', 'home'), ('menu', 'menu'), ('story', 'story'), ('reserve', 'reserve')]

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='14' fill='%23140f0c'/%3E"
           "%3Ccircle cx='32' cy='32' r='20' fill='none' stroke='%23e4572e' stroke-width='4' stroke-dasharray='110 20'/%3E"
           "%3Ccircle cx='32' cy='32' r='6' fill='%23d6a23f'/%3E%3C/svg%3E")


PHOTOS = {
    # key: (unsplash photo path id, w, h, photographer, username, photo slug id, fallback colour)
    'fire':     ('1526213174737-acd9757c6bf3', 4608, 3456, 'Danny de Jong', 'ghorich', 'Np5GnOfsfo0', '#260c0c'),
    'grill':    ('1789838810583-47fc52f47bb2', 3456, 2304, 'Nino Korkelia', 'nino_korkelia', 'Xzpp2Ah7MWA', '#1c1512'),
    'yakitori': ('1727281970223-d4895fd0872f', 5472, 3648, 'Jay', 'ja024', 'R6Rzujlmdjc', '#3a1c0a'),
    'steam':    ('1763604048392-18f8383a6542', 3861, 5137, 'Pratiksha Singh', 'momentsbyprats', '0Vcxz3-Ncl8', '#260c0c'),
    'chef':     ('1763604048369-a93af06413b0', 4000, 5297, 'Pratiksha Singh', 'momentsbyprats', 'TURS5_0Lq4k', '#260c0c'),
    'kitchen':  ('1777025728663-ff2654bbb72e', 9528, 6328, 'sanghoon kim', 'low_fat_milk', 'mLKQyF8y5UA', '#260c0c'),
    'night':    ('1639716553235-a8275d845fd7', 4000, 6000, 'Jonathan Mark Bacolor', 'tanbacolor', 'LQeavijwPBA', '#260c0c'),
    'ueno':     ('1705803432022-f6145988c5d0', 3974, 5973, 'Ryunosuke Kikuno', 'ryunosuke_kikuno', 'Et5Q49kBYNE', '#260c0c'),
    'spice':    ('1741513599050-487ccfb86275', 5472, 3420, 'Marek Piwnicki', 'marekpiwnicki', 'zALm5VkUBWw', '#3a2008'),
    'chicken':  ('1630564510761-a560db92a09b', 4160, 6240, 'Amanda Lim', 'mandimelanie', 'e_A-SFvqV08', '#262626'),
    'mushroom': ('1676140382464-83cd80afc22b', 2268, 4032, 'Filipp Romanovski', 'filipp_roman_photography', 'B24epTR09To', '#2a2418'),
    'tofu':     ('1762305194201-077e7e23ccf2', 5702, 3803, 'Lee Milo', 'miloleetw', 'N0lnO0gZlW8', '#3a2810'),
    'banana':   ('1507835418932-dfcc1a16d393', 4288, 2848, 'Victor Kwashie', 'victorkg', '4VMr19ljQUA', '#2a2218'),
    'icecream': ('1689076758310-92b693fe6b8b', 5102, 4912, 'BINYOUSSIF mohammad ali', 'binyoussif', 'CdP2h2Or8Pc', '#262626'),
    'market':   ('1576181456177-2b99ac0aa1ef', 3024, 4032, 'Ashley Winkler', 'firlefanzski', 'cz4rC-IRfxw', '#2a2418'),
    'bar':      ('1657593091045-3927d4967afe', 5219, 3348, 'Russell Ferrer', 'russfr', 'FU4Egyl8o2k', '#1a1a1a'),
}
UTM = 'utm_source=shiro_sumi_concept&utm_medium=referral'
# Which photo previews which dish (illustrative stock only).
DISH_PHOTO = {'sate': 'yakitori', 'tsukune': 'grill', 'edamame': 'kitchen', 'tahu': 'tofu', 'wagyu': 'night',
              'snapper': 'ueno', 'ayam': 'chicken', 'jamur': 'mushroom', 'rice': 'kitchen', 'kangkung': 'market',
              'banana': 'banana', 'ice': 'icecream', 'iced': 'spice', 'jahe': 'spice', 'sake': 'bar'}


def purl(key, w):
    return f'https://images.unsplash.com/photo-{PHOTOS[key][0]}?auto=format&fit=crop&w={w}&q=68'


def img(key, sizes='100vw', widths=(640, 1100, 1700), lazy=True, prio=False):
    p = PHOTOS[key]
    srcset = ', '.join(f'{purl(key, w)} {w}w' for w in widths)
    attrs = 'fetchpriority="high"' if prio else ('loading="lazy"' if lazy else '')
    return (f'<img src="{purl(key, widths[1])}" srcset="{srcset}" sizes="{sizes}" alt="" '
            f'width="{p[1]}" height="{p[2]}" decoding="async" {attrs}>')


def ph(key, cls='', sizes='100vw', **kw):
    return f'<div class="ph {cls}" style="--c:{PHOTOS[key][6]}">{img(key, sizes, **kw)}</div>'


FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='14' fill='%230d0a08'/%3E"
           "%3Ccircle cx='32' cy='32' r='20' fill='none' stroke='%23ff5a1f' stroke-width='4' stroke-dasharray='110 20'/%3E"
           "%3Ccircle cx='32' cy='32' r='6' fill='%23ffb347'/%3E%3C/svg%3E")


def head(key, page_file):
    return f'''<!doctype html>
<html lang="en" class="i18n-pending">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>
(function(){{var d=document.documentElement;d.classList.add('js');
try{{var l=localStorage.getItem('sumi-lang');if(l==='id'||l==='ja')d.lang=l;}}catch(e){{}}
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen=false;try{{seen=sessionStorage.getItem('sumi-loaded')==='1';}}catch(e){{}}
if(rm||seen||{'true' if key != 'home' else 'false'})d.classList.add('no-loader');
if(rm)d.classList.add('reduce');
try{{if(!('onpagereveal' in window)&&sessionStorage.getItem('sumi-nav')==='1'){{d.classList.add('nav-in');sessionStorage.removeItem('sumi-nav');}}}}catch(e){{}}
setTimeout(function(){{d.classList.remove('i18n-pending');}},2500);}})();
</script>
<title data-t="meta.{key}.title">Shiro Sumi</title>
<meta name="description" content="" data-t-attrs="content=meta.{key}.desc">
<meta name="theme-color" content="#0d0a08">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Shiro Sumi (concept)">
<link rel="icon" href="{FAVICON}">
<link rel="preload" href="/fonts/bodoni-moda-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/hanken-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com" crossorigin>
<link rel="stylesheet" href="/src/style.css">
<script type="module" src="/src/main.js"></script>
</head>
<body data-page="{key}">
'''


def header(key):
    items = [('index.html', 'nav.home', 'home'), ('menu.html', 'nav.menu', 'menu'),
             ('story.html', 'nav.story', 'story'), ('reserve.html', 'nav.reserve', 'reserve')]
    lis = ''
    for h, k, p in items:
        cur = ' aria-current="page"' if p == key else ''
        lis += f'<li><a href="{h}" data-t="{k}"{cur}></a></li>'
    return f'''<div class="loader" id="loader" aria-hidden="true">
  <div class="loader__in">
    <svg viewBox="0 0 200 200" width="170" height="170" focusable="false">
      <circle class="loader__ring" cx="100" cy="100" r="78" pathLength="100"/>
      <circle class="loader__core" cx="100" cy="100" r="22"/>
    </svg>
    <span class="loader__word">Shiro Sumi</span>
  </div>
</div>
<div class="curtain" id="curtain" aria-hidden="true"></div>
<div class="cursor" id="cursor" aria-hidden="true"><span></span></div>
<a class="skip" href="#main" data-t="skip">Skip to content</a>
<header class="site-header" id="site-header">
  <div class="wrap bar">
    <a class="brand" href="index.html" data-t-attrs="aria-label=brand.label">
      <span class="brand__mark" aria-hidden="true">炭</span>
      <span class="brand__name">Shiro Sumi</span>
    </a>
    <nav class="nav" id="nav" data-t-attrs="aria-label=nav.label">
      <ul>{lis}</ul>
    </nav>
    <div class="bar__right">
      <div class="lang" role="group" data-t-attrs="aria-label=lang.label">
        <button type="button" data-lang-set="en" aria-pressed="true" lang="en">EN</button>
        <button type="button" data-lang-set="id" aria-pressed="false" lang="id">ID</button>
        <button type="button" data-lang-set="ja" aria-pressed="false" lang="ja">日本語</button>
      </div>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav" data-t-attrs="aria-label=nav.toggle">
        <span></span><span></span>
      </button>
    </div>
  </div>
</header>
'''


def credits():
    out = ''
    for k, p in PHOTOS.items():
        out += (f'<li><a href="https://unsplash.com/@{p[4]}?{UTM}" rel="noopener" target="_blank">{p[3]}</a> '
                f'<span aria-hidden="true">/</span> <a href="https://unsplash.com/photos/{p[5]}?{UTM}" rel="noopener" target="_blank">Unsplash</a></li>')
    return out


FOOTER = f'''<footer class="site-footer">
  <div class="foot__mega" aria-hidden="true">
    <span class="foot__glyph">炭</span><span class="foot__word" data-t="foot.mega">Shiro Sumi</span>
  </div>
  <div class="wrap">
    <div class="foot__top">
      <a class="brand" href="index.html" data-t-attrs="aria-label=brand.label">
        <span class="brand__mark" aria-hidden="true">炭</span>
        <span class="brand__name">Shiro Sumi</span>
      </a>
      <p class="foot__tag" data-t="foot.tag">A fictional charcoal grill. Concept by Shiro Labs.</p>
      <nav class="foot__nav" data-t-attrs="aria-label=foot.nav">
        <a href="index.html" data-t="nav.home">Home</a>
        <a href="menu.html" data-t="nav.menu">Menu</a>
        <a href="story.html" data-t="nav.story">Story</a>
        <a href="reserve.html" data-t="nav.reserve">Reserve</a>
      </nav>
    </div>
    <div class="foot__legal">
      <p data-t="foot.disc">Shiro Sumi is an illustrative concept project.</p>
      <p data-t="foot.rates">Reference rates.</p>
      <p data-t="foot.review">Indonesian and Japanese copy is awaiting native review.</p>
      <details class="foot__credits">
        <summary data-t="credit.t">Photography</summary>
        <p data-t="credit.d"></p>
        <ul>{credits()}</ul>
      </details>
      <p class="foot__by"><span data-t="foot.by">Designed and built by Shiro Labs</span></p>
    </div>
  </div>
</footer>
</body>
</html>
'''


def dish(k, featured=False):
    idr, tags = DISHES[k]
    tg = ''
    if 'v' in tags:
        tg += '<span class="tag" data-t="tag.v">Vegetarian</span>'
    if 's' in tags:
        tg += '<span class="tag tag--hot" data-t="tag.s">Spicy</span>'
    return f'''<li class="dish" data-peek="{purl(DISH_PHOTO[k], 700)}">
  <div class="dish__head">
    <h3 class="dish__name" data-t="d.{k}.n">{k}</h3>
    <span class="dish__leader" aria-hidden="true"></span>
    <span class="dish__price" data-idr="{idr}">{idr}</span>
  </div>
  <p class="dish__desc" data-t="d.{k}.d"></p>
  {'<p class="dish__tags">' + tg + '</p>' if tg else ''}
</li>
'''


GALLERY = [('sate', 'yakitori'), ('tsukune', 'grill'), ('tahu', 'tofu'), ('wagyu', 'night'), ('snapper', 'ueno'),
           ('ayam', 'chicken'), ('jamur', 'mushroom'), ('banana', 'banana'), ('ice', 'icecream'), ('jahe', 'spice')]


def card(i, k, photo):
    idr = DISHES[k][0]
    return f'''<li class="card" data-cursor="view">
  {ph(photo, 'card__img', sizes='(min-width: 900px) 30vw, 78vw', widths=(500, 800, 1100))}
  <span class="card__n" aria-hidden="true">{i + 1:02d}</span>
  <h3 class="card__name" data-t="d.{k}.n"></h3>
  <p class="card__desc" data-t="d.{k}.d"></p>
  <span class="card__price" data-idr="{idr}">{idr}</span>
</li>
'''


def home():
    ticks = ''.join(f'<span data-t="tick.{i}"></span>' for i in range(1, 7))
    cards = ''.join(card(i, k, p) for i, (k, p) in enumerate(GALLERY))
    steps = ''.join(f'''<li class="fire__step"><span class="fire__n" aria-hidden="true">0{i}</span>
          <h3 data-t="phil.{i}.t"></h3><p data-t="phil.{i}.d"></p></li>''' for i in (1, 2, 3))
    return head('home', 'index') + header('home') + f'''<main id="main">
  <section class="hero" data-hero>
    <div class="hero__bg" data-hero-bg>{ph('fire', sizes='100vw', widths=(900, 1600, 2400), lazy=False, prio=True)}</div>
    <canvas class="hero__embers" id="embers" aria-hidden="true"></canvas>
    <div class="hero__glyph" aria-hidden="true" data-hero-glyph>炭</div>
    <div class="wrap hero__in">
      <div class="hero__copy">
        <p class="eyebrow" data-in data-t="hero.eyebrow">Concept restaurant</p>
        <h1 class="display split" data-t="hero.title">Fire, salt, and a little sambal.</h1>
        <p class="lede" data-in data-t="hero.sub"></p>
        <div class="actions" data-in>
          <a class="btn btn--ember" data-magnetic href="reserve.html" data-t="hero.cta1">Reserve a seat</a>
          <a class="btn btn--ghost" data-magnetic href="menu.html" data-t="hero.cta2">See the menu</a>
        </div>
        <p class="hero__hours" data-in data-t="hero.hours"></p>
      </div>
    </div>
    <p class="hero__scroll" aria-hidden="true"><span data-t="hero.scroll">Scroll</span><i></i></p>
  </section>

  <div class="marq" aria-hidden="true" data-marq>
    <div class="marq__track">{ticks}{ticks}</div>
  </div>

  <section class="fire" data-fire>
    <div class="fire__stage">
      <div class="fire__img">
        {ph('grill', 'fire__layer', sizes='100vw', widths=(900, 1600, 2400))}
        {ph('spice', 'fire__layer', sizes='100vw', widths=(900, 1600, 2400))}
        {ph('market', 'fire__layer', sizes='100vw', widths=(900, 1600, 2400))}
      </div>
      <div class="fire__shade" aria-hidden="true"></div>
      <div class="wrap fire__in">
        <header class="fire__head">
          <p class="eyebrow" data-t="phil.eyebrow">The idea</p>
          <h2 class="h2 split" data-t="phil.title">One fire. Two kitchens.</h2>
        </header>
        <ol class="fire__steps">{steps}</ol>
      </div>
    </div>
  </section>

  <section class="gal" data-gal>
    <div class="gal__pin">
      <header class="wrap gal__head">
        <div>
          <p class="eyebrow" data-t="gal.eyebrow">On the grill</p>
          <h2 class="h2 split" data-t="gal.title">Five plates, one fire</h2>
        </div>
        <a class="link-arrow" href="menu.html"><span data-t="sig.all">Full menu</span><i aria-hidden="true">→</i></a>
      </header>
      <div class="gal__view"><ul class="gal__track">{cards}</ul></div>
      <div class="wrap gal__foot"><p class="gal__hint" data-t="gal.hint"></p><div class="gal__bar" aria-hidden="true"><i></i></div></div>
    </div>
  </section>

  <section class="visit" data-visit>
    <div class="visit__img">{ph('bar', sizes='100vw', widths=(900, 1600, 2400))}<div class="visit__grid" data-grid aria-hidden="true"></div></div>
    <div class="wrap visit__in">
      <p class="eyebrow" data-t="visit.eyebrow">Visit</p>
      <h2 class="h2 split" data-t="visit.title2">Come when the coals are ready</h2>
      <dl class="facts">
        <div class="fact"><dt data-t="visit.hours.t"></dt><dd data-t="visit.hours.d"></dd></div>
        <div class="fact"><dt data-t="visit.last.t"></dt><dd data-t="visit.last.d"></dd></div>
        <div class="fact"><dt data-t="visit.addr.t"></dt><dd data-t="visit.addr.d"></dd></div>
      </dl>
    </div>
  </section>

  <section class="cta" data-cta>
    <div class="cta__glow" aria-hidden="true"></div>
    <div class="wrap cta__in">
      <h2 class="display split" data-t="cta.title">Hungry yet?</h2>
      <p class="lede" data-in data-t="cta.text"></p>
      <a class="btn btn--ember btn--lg" data-magnetic href="reserve.html" data-t="cta.btn">Reserve a seat</a>
    </div>
  </section>
</main>
''' + FOOTER


def menu():
    jump = ''.join(f'<a href="#{c}" data-t="cat.{c}">{c}</a>' for c, _ in CATS)
    blocks = ''
    for c, ks in CATS:
        blocks += f'''    <section class="cat" id="{c}" aria-labelledby="h-{c}">
      <h2 class="cat__title" id="h-{c}" data-t="cat.{c}">{c}</h2>
      <ul class="dishes">
{''.join(dish(k) for k in ks)}      </ul>
    </section>
'''
    return head('menu', 'menu') + header('menu') + f'''<main id="main" class="paper-page">
  <section class="page-head page-head--paper">
    <div class="wrap">
      <p class="eyebrow eyebrow--ink reveal" data-t="menu.eyebrow">The menu</p>
      <h1 class="display display--sm split" data-t="menu.title">Short, seasonal, over fire</h1>
      <p class="lede lede--ink reveal" style="--d:.16s" data-t="menu.intro"></p>
      <p class="note reveal" style="--d:.2s" data-t="menu.note"></p>
    </div>
  </section>
  <div class="banner" data-banner>{ph('kitchen', sizes='100vw', widths=(900, 1600, 2400))}</div>
  <nav class="jump" data-t-attrs="aria-label=menu.jump"><div class="wrap jump__in">{jump}</div></nav>
  <div class="wrap menu">
{blocks}  </div>
</main>
''' + FOOTER


def story():
    return head('story', 'story') + header('story') + f'''<main id="main">
  <section class="page-head">
    <div class="wrap">
      <p class="eyebrow reveal" data-t="story.eyebrow">Story</p>
      <h1 class="display display--sm split" data-t="story.title">A small fire with a long reach</h1>
    </div>
  </section>
  <div class="banner" data-banner>{ph('chef', sizes='100vw', widths=(900, 1600, 2400))}</div>

  <section class="section section--tight">
    <div class="wrap prose-grid">
      <article class="prose reveal"><h2 class="h3" data-t="story.s1.t"></h2><p data-t="story.s1.d"></p></article>
      <article class="prose reveal" style="--d:.1s"><h2 class="h3" data-t="story.s2.t"></h2><p data-t="story.s2.d"></p></article>
    </div>
  </section>

  <section class="section section--tight">
    <div class="wrap">
      <ul class="stats">
        <li class="stat reveal"><b data-count="12">12</b><span data-t="stat.1"></span></li>
        <li class="stat reveal" style="--d:.1s"><b data-count="1">1</b><span data-t="stat.2"></span></li>
        <li class="stat reveal" style="--d:.2s"><b data-count="6">6</b><span data-t="stat.3"></span></li>
      </ul>
    </div>
  </section>

  <section class="section section--paper">
    <div class="wrap">
      <h2 class="h2 reveal" data-t="story.s3.t">The house rules</h2>
      <ol class="rules">
        <li class="reveal"><span>01</span><p data-t="story.r1"></p></li>
        <li class="reveal" style="--d:.1s"><span>02</span><p data-t="story.r2"></p></li>
        <li class="reveal" style="--d:.2s"><span>03</span><p data-t="story.r3"></p></li>
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <aside class="about reveal">
        <h2 class="h3" data-t="about.t">About this concept</h2>
        <p data-t="about.d"></p>
      </aside>
    </div>
  </section>
</main>
''' + FOOTER


def reserve():
    today = datetime.date.today().isoformat()
    return head('reserve', 'reserve') + header('reserve') + f'''<main id="main">
  <section class="page-head">
    <div class="wrap">
      <p class="eyebrow reveal" data-t="res.eyebrow">Reserve</p>
      <h1 class="display display--sm split" data-t="res.title">Save a seat at the fire</h1>
      <p class="lede reveal" style="--d:.16s" data-t="res.intro"></p>
    </div>
  </section>

  <section class="section section--tight">
    <div class="wrap bk" id="booking">
      <div class="bk__main">
        <div id="bk-steps">
          <section class="bk__s" id="bk-seat"></section>
          <section class="bk__s" id="bk-date"></section>
          <section class="bk__s" id="bk-time"></section>
          <section class="bk__s" id="bk-details"></section>
        </div>
        <section class="bk__done" id="bk-done" hidden></section>
      </div>

      <aside class="side">
        <div class="sm" id="bk-sum" aria-live="polite"></div>
        <h2 class="h3" data-t="res.info.t">Good to know</h2>
        <dl class="facts facts--stack">
          <div class="fact"><dt data-t="visit.hours.t"></dt><dd data-t="visit.hours.d"></dd></div>
          <div class="fact"><dt data-t="visit.addr.t"></dt><dd data-t="visit.addr.d"></dd></div>
          <div class="fact"><dt>@</dt><dd data-t="res.contact"></dd></div>
        </dl>
        <figure class="map">
          <svg viewBox="0 0 320 220" role="img" data-t-attrs="aria-label=map.alt" focusable="false">
            <rect width="320" height="220" fill="#17110d"/>
            <path d="M-10 150 C60 120 90 190 170 150 S280 90 340 120" fill="none" stroke="#2e3a3f" stroke-width="22" stroke-linecap="round"/>
            <g stroke="#3a2f28" stroke-width="6" fill="none" stroke-linecap="round">
              <path d="M0 40 H320"/><path d="M0 100 H320"/><path d="M0 190 H320"/>
              <path d="M60 0 V220"/><path d="M150 0 V220"/><path d="M240 0 V220"/>
            </g>
            <g stroke="#2a211b" stroke-width="2" fill="none"><path d="M0 70 H320"/><path d="M105 0 V220"/><path d="M195 0 V220"/><path d="M285 0 V220"/></g>
            <path class="map__route" d="M12 200 C 60 196 84 140 112 130 S 140 108 150 100" pathLength="1" fill="none" stroke="#ff5a1f" stroke-width="3" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="0"/>
            <circle class="map__pulse" cx="150" cy="100" r="16" fill="#ff5a1f" opacity=".25"/>
            <circle cx="150" cy="100" r="7" fill="#ff5a1f"/><circle cx="150" cy="100" r="2.5" fill="#efe4d0"/>
          </svg>
          <figcaption data-t="map.cap">Stylized map, not to scale.</figcaption>
        </figure>
      </aside>
    </div>
  </section>
</main>
''' + FOOTER


for name, fn in [('index', home), ('menu', menu), ('story', story), ('reserve', reserve)]:
    with open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8') as f:
        f.write(fn())
print('built')
