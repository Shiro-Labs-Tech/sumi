import re, shutil, os, glob
import os
SRC='/home/claude/fontsrc/node_modules/@fontsource'
SRCV='/home/claude/fontsrc/node_modules/@fontsource-variable'
OUT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
text=''.join(open(p,encoding='utf-8').read() for p in [OUT+'/src/i18n.js', OUT+'/src/booking.js']+glob.glob(OUT+'/*.html')+[OUT+'/tools/build.py'])
chars={ord(c) for c in text if ord(c)>127}
chars|={ord(c) for c in '炭日本語'}
def parse(css):
    blocks=re.findall(r'@font-face\s*\{(.*?)\}',css,re.S)
    res=[]
    for b in blocks:
        f=re.search(r'files/([^)]+?\.woff2)',b).group(1)
        ur=re.search(r'unicode-range:\s*([^;]+);',b).group(1)
        rng=[]
        for part in ur.split(','):
            part=part.strip()[2:]
            if '-' in part: a,z=part.split('-'); rng.append((int(a,16),int(z,16)))
            else: rng.append((int(part,16),int(part,16)))
        res.append((f,ur,rng))
    return res
out=[]
def fam(pkg,name,weight,css_file):
    css=open(f'{SRC}/{pkg}/{css_file}',encoding='utf-8').read()
    used=0
    for f,ur,rng in parse(css):
        if any(a<=c<=z for c in chars for a,z in rng):
            shutil.copy(f'{SRC}/{pkg}/files/{f}', f'{OUT}/public/fonts/{f}')
            out.append(f"@font-face{{font-family:'{name}';font-style:normal;font-weight:{weight};font-display:swap;src:url(/fonts/{f}) format('woff2');unicode-range:{ur};}}")
            used+=1
    print(name,weight,'slices',used)
fam('shippori-mincho','Shippori Mincho',500,'500.css')
fam('zen-kaku-gothic-new','Zen Kaku Gothic New',400,'400.css')
fam('zen-kaku-gothic-new','Zen Kaku Gothic New',500,'500.css')
import shutil as _sh
for f,pk in [('bodoni-moda-latin-opsz-normal.woff2','bodoni-moda'),('bodoni-moda-latin-opsz-italic.woff2','bodoni-moda'),('hanken-grotesk-latin-wght-normal.woff2','hanken-grotesk')]:
    _sh.copy(f'{SRCV}/{pk}/files/{f}', f'{OUT}/public/fonts/{f}')
latin = """@font-face{font-family:'Bodoni Moda';font-style:normal;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda-latin-opsz-normal.woff2) format('woff2');}
@font-face{font-family:'Bodoni Moda';font-style:italic;font-weight:400 900;font-display:swap;src:url(/fonts/bodoni-moda-latin-opsz-italic.woff2) format('woff2');}
@font-face{font-family:'Hanken Grotesk';font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/hanken-grotesk-latin-wght-normal.woff2) format('woff2');}
"""
open(OUT+'/src/fonts.css','w').write('/* Self-hosted subsets from Fontsource (SIL OFL). JA slices limited to glyphs used. */\n'+latin+'\n'.join(out)+'\n')
