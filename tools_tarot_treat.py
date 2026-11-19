"""Cut the GPT tarot sheet into game cards and treat them to the game's look.
  ~/.dss-regress/imgvenv/bin/python tools_tarot_treat.py generated_images/<sheet>.png tarot   (names after the outdir redo just those)
  Redrawn single cards (2026-11-19, GPT via Codex, Sam's picks):
  CARD=1 ...python tools_tarot_treat.py generated_images/the-star-adult-gpt-2026-11-19.png tarot "The Star"
  CARD=1 NOBLOOM=1 WIN=0.035,0.045,0.80,0.75 KR=2 SOFT=0.6 BLURMIX=0.2 STROKE=0.05 ...python tools_tarot_treat.py generated_images/the-sun-akhenaten-gpt-2026-11-19.png tarot "The Sun"
  CARD=1 WIN=0.05,0.045,0.95,0.86 ...python tools_tarot_treat.py generated_images/the-magician-crowley-gpt-2026-11-19.png tarot "The Magician"
  (the Sun lighter so Akhenaten's face and crown survive the brush)"""
import json, sys, os
import numpy as np
from PIL import Image, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]; ONLY = sys.argv[3:]
sheet = Image.open(SRC).convert("RGB")
XS = [(x0+5, x1-5) for x0, x1 in [(10,183),(202,366),(391,554),(574,735),(754,905),(925,1075)]]          # art windows, from the gutter scan
ROWS = [(20,323),(373,675),(727,1036),(1089,1409)]
NAMES = ["The Fool","The Magician","The High Priestess","The Empress","The Hierophant","The Lovers",
         "The Chariot","Strength","The Hermit","Wheel of Fortune","Justice","The Hanged Man",
         "Death","Temperance","The Devil","The Tower","The Star","The Moon",
         "The Sun","Judgement","The World","back"]
TAB = 14
TOPBIAS = {"The Hanged Man": 0.75, "The Moon": 0.3, "Wheel of Fortune": 0.35, "Death": 0.2}   # share of the spare height taken off the top                      # the numeral tab bites this far into the top of the art
W, H = 330, 540               # 3x the card's 110 x 180
# faces to bloom away (fractions of the cut card): x, y, radius, strength
BLOOM = {"The Sun": (0.5, 0.165, 0.36, 1.0), "The Moon": (0.5, 0.16, 0.34, 0.95)}

SINGLE = os.environ.get("CARD") == "1"   # SRC is one redrawn card, not the sheet (2026-11-19: the Star, redrawn with an adult figure)
SINGLE_WIN = (0.07, 0.075, 0.93, 0.95)    # its art window inside the cream border, its arched corners and the numeral tab, as fractions of the image
if os.environ.get("WIN"): SINGLE_WIN = tuple(float(v) for v in os.environ["WIN"].split(","))   # a redraw with a title panel at the foot (the Sun) needs its own window
SINGLE_SAT = 0.68                         # GPT's redraw is more saturated than the sheet; bring it to the sheet's watercolour before the treatment

def cut(n):
    i = NAMES.index(n); r, c = divmod(i, 6)
    x0, x1 = XS[c]; y0, y1 = ROWS[r]
    if SINGLE: x0, y0, x1, y1 = (SINGLE_WIN[0] * sheet.width, SINGLE_WIN[1] * sheet.height, SINGLE_WIN[2] * sheet.width, SINGLE_WIN[3] * sheet.height)
    elif n == "back": x0, x1, y0, y1 = 582, 724, 1092, 1428      # inside the back's own cream frame
    else: y0 += TAB
    w = x1 - x0; want = w * 180 / 110 / (1 if n == "back" else ELONG)
    if y1 - y0 > want:
        extra = (y1 - y0) - want; tb = TOPBIAS.get(n, 0.04); y0 += extra * tb; y1 -= extra * (1 - tb)   # keep the heads
    else:
        need = want - (y1 - y0); x_cut = w - (y1 - y0) * 110 / 180; x0 += x_cut / 2; x1 -= x_cut / 2
    im = sheet.crop((int(round(x0)), int(round(y0)), int(round(x1)), int(round(y1)))).resize((W, H), Image.LANCZOS)
    if SINGLE:
        a = np.asarray(im).astype(np.float32) / 255; l = (a @ np.array([0.2126, 0.7152, 0.0722], np.float32))[..., None]
        im = Image.fromarray((np.clip(l + (a - l) * SINGLE_SAT, 0, 1) * 255).astype(np.uint8))
    return im

PRINT = os.environ.get("PRINT", "0") == "1"
GRECO = os.environ.get("GRECO", "1") == "1"
ELONG = float(os.environ.get("ELONG", "1.15")) if GRECO else 1.0
def boxmean(x, r):
    p = np.pad(x, ((r + 1, r), (r + 1, r)) + ((0, 0),) * (x.ndim - 2), mode="edge")
    c = p.cumsum(0).cumsum(1); n = 2 * r + 1
    return (c[n:, n:] - c[:-n, n:] - c[n:, :-n] + c[:-n, :-n]) / (n * n)

def kuwahara(a, r):
    """Each pixel takes the mean of its calmest quadrant: the classic oil-paint filter."""
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    h = r // 2 + 1
    m = boxmean(a, h // 1 if h > 0 else 1); v = boxmean(lum * lum, h) - boxmean(lum, h) ** 2
    best = None; bv = None; H_, W_ = lum.shape
    for dy in (-h, h):
        for dx in (-h, h):
            mm = np.roll(np.roll(m, dy, 0), dx, 1); vv = np.roll(np.roll(v, dy, 0), dx, 1)
            if best is None: best, bv = mm.copy(), vv.copy()
            else:
                t = vv < bv; best[t] = mm[t]; bv[t] = vv[t]
    return best

def strokes(a, amp, L):
    """Bristle texture: noise dragged along the local form (edge tangent), or upward where the form is quiet."""
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    g = np.asarray(Image.fromarray((np.clip(lum, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
    gx = np.zeros_like(g); gy = np.zeros_like(g); gx[:, 1:-1] = g[:, 2:] - g[:, :-2]; gy[1:-1, :] = g[2:, :] - g[:-2, :]
    mag = np.sqrt(gx * gx + gy * gy)
    ang = np.arctan2(gy, gx) + np.pi / 2                      # along the edge
    w = np.clip(mag / 6, 0, 1)
    ang = np.where(w > 0.3, ang, np.pi / 2 + (np.random.default_rng(3).random(ang.shape) - 0.5) * 0.5)   # quiet areas: upward flicker
    rng = np.random.default_rng(11)
    noise = rng.random(lum.shape).astype(np.float32)
    pass   # full-resolution bristles
    NB = 12; out = np.zeros_like(noise); q = (np.round((ang % np.pi) / np.pi * NB).astype(int)) % NB
    for b in range(NB):
        th = b * np.pi / NB; dx, dy = np.cos(th), np.sin(th); acc = np.zeros_like(noise)
        for t in range(-L, L + 1):
            acc += np.roll(np.roll(noise, int(round(t * dy)), 0), int(round(t * dx)), 1)
        out[q == b] = (acc / (2 * L + 1))[q == b]
    out = (out - out.mean()) / (out.std() + 1e-4)
    return np.clip(a * (1 + amp * out[..., None] * 0.5) + amp * 0.15 * out[..., None], 0, 1)

def greco(im, n):
    """After El Greco: ashen green-grey flesh, cold flickering lights drawn upward, storm-dark grounds, harder chiaroscuro."""
    sm = im
    for k in range(2): sm = sm.filter(ImageFilter.MedianFilter(5))      # loosen the airbrushed finish
    a = np.asarray(sm).astype(np.float32) / 255
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    mx = a.max(-1); mn = a.min(-1); sat = (mx - mn) / (mx + 1e-4)
    skin = np.clip((r - b) * 3, 0, 1) * np.clip((r - g) * 4 + 0.3, 0, 1) * np.clip(1 - np.abs(sat - 0.3) * 3.6, 0, 1) * np.clip((0.5 - (r - g)) * 4, 0, 1)   # flesh only: robes are redder and richer
    skin = np.asarray(Image.fromarray((skin * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32) / 255
    ash = (lum[..., None] ** 1.25) * np.array([0.86, 0.92, 0.78], np.float32) + np.array([0.0, 0.015, 0.02], np.float32)   # bone and verdigris, not cream
    k = float(os.environ.get("ASH", "0.85"))
    a = a * (1 - skin[..., None] * k) + ash * skin[..., None] * k
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    # chiaroscuro: an S-curve, the darks pushed toward storm green-black
    c = np.clip(lum, 0, 1); s_ = c * c * (3 - 2 * c)
    a = a * np.clip(s_ / (c + 1e-3), 0, 1.0)[..., None]   # darks down, lights left
    storm = np.array([0.07, 0.10, 0.11], np.float32); d = np.clip(1 - lum / 0.4, 0, 1)[..., None] * 0.6
    a = a * (1 - d) + storm * d
    # flicker: the lights smeared upward in thin flames
    hi = np.clip((lum - 0.55) / 0.35, 0, 1)
    hl = Image.fromarray((hi * 255).astype(np.uint8))
    kern = ImageFilter.Kernel((5, 5), [0, 0, 1, 0, 0] * 5, 5)
    fl = hl
    for k2 in range(3): fl = fl.filter(kern)
    fl = np.asarray(fl).astype(np.float32) / 255
    cold = np.array([0.88, 0.93, 0.86], np.float32)
    a = 1 - (1 - a) * (1 - fl[..., None] * cold * float(os.environ.get('FLICK', '0.22')))
    # El Greco's brush: oil-paint patches (Kuwahara), then strokes laid along the forms and lifting upward
    a = kuwahara(a, int(os.environ.get("KR", "3")))
    a = strokes(a, float(os.environ.get("STROKE", "0.07")), int(os.environ.get("SLEN", "9")))
    soft = np.asarray(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(float(os.environ.get("SOFT", "1.0"))))).astype(np.float32) / 255
    bm = float(os.environ.get("BLURMIX", "0.35")); a = a * (1 - bm) + soft * bm
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

def litho(im):
    """Old printed deck: flat ink planes instead of airbrushed modelling, a fine key line, paper tooth."""
    big = im.resize((W * 2, H * 2), Image.LANCZOS)
    sm = big
    for k in range(int(os.environ.get("PASSES", "3"))): sm = sm.filter(ImageFilter.MedianFilter(9))
    flat = sm.quantize(colors=int(os.environ.get("INKS", "28")), method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    flat = flat.filter(ImageFilter.ModeFilter(7)).resize((W, H), Image.LANCZOS)
    smw = np.asarray(sm.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
    mix = float(os.environ.get("FLAT", "0.65"))
    a = (np.asarray(flat).astype(np.float32) / 255) * mix + smw * (1 - mix)
    g = np.asarray(sm.resize((W, H), Image.LANCZOS).convert("L").filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32)
    gx = np.zeros_like(g); gy = np.zeros_like(g)
    gx[:, 1:-1] = g[:, 2:] - g[:, :-2]; gy[1:-1, :] = g[2:, :] - g[:-2, :]
    e = np.sqrt(gx * gx + gy * gy)
    ink = np.clip((e - float(os.environ.get("EDGE", "34"))) / 40, 0, 1) * 0.6
    inkc = np.array([0.16, 0.08, 0.12], np.float32)
    a = a * (1 - ink[..., None]) + inkc * ink[..., None]
    rng = np.random.default_rng(7)
    t = np.asarray(Image.fromarray((rng.random((H, W)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
    a = a * (0.94 + 0.06 * t[..., None])
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

def treat(im, n):
    if PRINT: im = litho(im)
    if GRECO and n != "back": im = greco(im, n)
    a = np.asarray(im).astype(np.float32) / 255
    lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    if n in BLOOM and os.environ.get("NOBLOOM") != "1":   # NOBLOOM=1: a redraw whose sun has no face to soften (the Aten)   # a soft light over the face, so it reads as glow, not a portrait
        bx, by, br, bs = BLOOM[n]; yy, xx = np.mgrid[0:H, 0:W]
        d = np.sqrt(((xx - bx * W) / W) ** 2 + ((yy - by * H) / W) ** 2) / br
        g = np.clip((1 - d) / 0.45, 0, 1) ** 1.3 * bs   # a flat plateau over the face, then a soft fall
        glow = np.array([1.0, 0.93, 0.78], np.float32)
        haze = np.asarray(im.filter(ImageFilter.GaussianBlur(16))).astype(np.float32) / 255   # light, not a blank disc
        lit = haze * 0.45 + glow * 0.55
        a = a * (1 - g[..., None]) + lit * g[..., None]
        lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    # deepen: pastels toward jewel tones (a gamma on the mid-tones, the lights kept)
    a = a ** 1.75
    lum2 = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    # saturation back up after the darkening
    a = lum2[..., None] + (a - lum2[..., None]) * 1.22
    # split tone: plum in the shadows, candle-gold in the lights
    sh = np.array([0.30, 0.16, 0.36], np.float32); hi = np.array([1.0, 0.86, 0.62], np.float32)
    t = np.clip(lum2, 0, 1)[..., None]
    a = a * (0.82 + 0.18 * (sh * (1 - t) + hi * t) / np.array([0.55, 0.5, 0.5], np.float32) * 0.55)
    # vignette into the card back's ground (#150e18)
    yy, xx = np.mgrid[0:H, 0:W]; d = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 1.414
    v = np.clip((d - 0.35) / 0.65, 0, 1) ** 1.5 * 0.78
    ground = np.array([0x15, 0x0e, 0x18], np.float32) / 255
    a = a * (1 - v[..., None]) + ground * v[..., None]
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=(25 if GRECO else 60), threshold=2))

os.makedirs(OUT, exist_ok=True)
REDRAWN = {"The Star", "The Sun", "The Magician"}   # come from their own redraws (see the top); a whole-sheet run leaves them alone
for n in (ONLY or [x for x in NAMES if SINGLE or x not in REDRAWN]):
    raw = cut(n); raw.save(os.path.join(OUT, "untreated-%s.png" % n.lower().replace(" ", "-")))
    treat(raw, n).save(os.path.join(OUT, "%s.jpg" % n.lower().replace(" ", "-")), quality=88)
print("ok")
