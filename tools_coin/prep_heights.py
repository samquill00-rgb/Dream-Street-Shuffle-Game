# Height maps for the Donkey coin relief (2026-11-11, Sam note 1). Run with the venv python (Pillow).
import math, re, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = "/Users/samquill/Claude work/Dream Street Shuffle - Game Files"
N = 1024; C = N / 2; K = N / 400.0          # the SVGs are drawn on a 400 box
FONT = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", int(19 * K))

def base():
    im = Image.new("L", (N, N), 0); d = ImageDraw.Draw(im)
    d.ellipse([C - 198 * K, C - 198 * K, C + 198 * K, C + 198 * K], fill=150)        # the raised rim
    d.ellipse([C - 177 * K, C - 177 * K, C + 177 * K, C + 177 * K], fill=70)         # the legend band, struck lower
    for i in range(72):                                                               # beads round the rim
        a = 2 * math.pi * i / 72; x, y = C + 187 * K * math.cos(a), C + 187 * K * math.sin(a)
        d.ellipse([x - 2.6 * K, y - 2.6 * K, x + 2.6 * K, y + 2.6 * K], fill=205)
    d.ellipse([C - 141 * K, C - 141 * K, C + 141 * K, C + 141 * K], fill=150)        # a fine raised ring round the field
    d.ellipse([C - 137 * K, C - 137 * K, C + 137 * K, C + 137 * K], fill=60)         # the field
    return im

def legend(im, text):
    # letters stand on a circle of radius 156, tops outward, read clockwise from the left (as the old SVG's #ring path)
    total = 0; widths = []
    for ch in text:
        w = FONT.getlength(ch) + 3 * K; widths.append(w); total += w
    circ = 2 * math.pi * 156 * K; scale = circ / total
    a = math.pi                                   # start at 9 o'clock, run over the top
    for ch, w in zip(text, widths):
        step = w * scale / (156 * K)
        mid = a + step / 2
        g = Image.new("L", (int(60 * K), int(60 * K)), 0); gd = ImageDraw.Draw(g)
        gd.text((g.width / 2, g.height / 2), ch, font=FONT, fill=255, anchor="mm")
        g = g.rotate(-math.degrees(mid) - 90, resample=Image.BICUBIC)
        x, y = C + 156 * K * math.cos(mid), C + 156 * K * math.sin(mid)
        im.paste(Image.new("L", g.size, 175), (int(x - g.width / 2), int(y - g.height / 2)), g)
        a += step
    return im

def heads():
    im = legend(base(), "SEX · ANTONIUS · ADAMUS · NUMBEX · ")
    face = Image.open(os.path.join(HERE, "face0.png")).convert("L")
    # the portrait sits in the old face's inner disc (radius ~150 of 200); take it to the new field (radius 137)
    fc = face.crop((52, 52, 348, 348)).resize((int(274 * K), int(274 * K)), Image.LANCZOS)
    fc = ImageOps.autocontrast(fc, cutoff=1).filter(ImageFilter.GaussianBlur(2.2 * K))
    fc = fc.filter(ImageFilter.GaussianBlur(2.5 * K)).point(lambda v: int(72 + v * 0.40))
    m = Image.new("L", fc.size, 0); ImageDraw.Draw(m).ellipse([3 * K, 3 * K, fc.width - 3 * K, fc.height - 3 * K], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(5 * K))
    im.paste(fc, (int(C - fc.width / 2), int(C - fc.height / 2)), m)
    return im

def tails():
    im = legend(base(), "PENNA · SIGNAT · TRES · POSTES · CAERULEOS · ")
    svg = open(os.path.join(ROOT, "coin-tails.svg")).read()
    g = re.search(r"<g transform='translate\(200,200\) scale\(0\.62\) translate\(-195,-221\)'>.*?</g>(?=[^<]*(<text|<circle|</svg>|<g))", svg, re.S)
    dev = g.group(0) if g else ""
    out = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='1024' height='1024'><style>g * { fill-opacity: 1 !important; stroke-opacity: 1 !important; }"
           " [fill]:not([fill='none']) { fill: #fff !important; } [stroke]:not([stroke='none']) { stroke: #3a3a3a !important; }</style><rect width='400' height='400' style='fill:#000'/>" + dev + "</svg>")
    p = os.path.join(HERE, "tails_dev.svg"); open(p, "w").write(out)
    subprocess.run(["qlmanage", "-t", "-s", "1024", "-o", HERE, p], capture_output=True)
    dv = Image.open(p + ".png").convert("L").resize((N, N))
    dv = dv.filter(ImageFilter.GaussianBlur(1.6 * K)).point(lambda v: int(v * 0.78))
    return _lift(im, dv)

def _lift(im, dv):
    from PIL import ImageChops
    field = Image.new("L", (N, N), 0); ImageDraw.Draw(field).ellipse([C - 136 * K, C - 136 * K, C + 136 * K, C + 136 * K], fill=255)
    return Image.composite(ImageChops.add(im, dv), im, field)

for name, fn in (("heads", heads), ("tails", tails)):
    h = fn().filter(ImageFilter.GaussianBlur(0.8 * K))
    h.save(os.path.join(HERE, "height_%s.png" % name)); print("wrote", name)
