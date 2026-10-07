"""Morning review shots: the chippy, desktop then phone. The room; a card of plain voices; the warmed trail card (the menu,
Inis's globe seen); the key card (the ticket); the id (the range, sobriety 20). Then one contact sheet. Args: OUT"""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
from PIL import Image, ImageDraw, ImageFont
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
SHOTS = [("room", None, "The chippy, at rest"), ("voices", "the window", "Voices on a card"), ("trail", "the menu", "A trail step, card edge warmed"),
         ("key", "the ticket", "The key on its object"), ("id", "the range", "The id, at low sobriety")]
files = {}
for size, (W, H) in (("desktop", (1440, 900)), ("phone", (390, 844))):
    g = Game(width=W, height=H)
    p = g.page("Chinese Fish and Chips", "(set: $inisToldOfPillars to true)(set: $hadChippy to false)(set: $enteredVenue to true)(set: $sobriety to 20)")
    p.evaluate("() => localStorage.setItem('dssVoicesSeen', JSON.stringify(['oi/the globe']))")
    Game.click(p, "BEGIN", 1200)
    for _ in range(200):
        if p.evaluate("() => !!document.querySelector('#cf-wrap canvas') && document.getElementById('cf-wrap').dataset.cam === 'idle' && !!document.getElementById('cf-wrap').dataset.words"): break
        p.wait_for_timeout(300)
    p.wait_for_timeout(1200)
    try: p.click('tw-story > .dss-room-fixed .dss-room-dismiss', timeout=2500)
    except Exception: pass
    p.wait_for_timeout(2500); Game.clear_overlays(p)
    p.evaluate("() => { const w=document.getElementById('cf-wrap'); w.scrollIntoView({block:'center'}); }"); p.wait_for_timeout(500)
    box = p.evaluate("() => { const r=document.getElementById('cf-wrap').getBoundingClientRect(); return {x:r.left, y:Math.max(0,r.top), width:r.width, height:Math.min(r.height, innerHeight-Math.max(0,r.top))}; }")
    for key, obj, _ in SHOTS:
        if obj:
            for _ in range(60):
                if p.evaluate("() => document.getElementById('cf-wrap').dataset.cam") == 'idle': break
                p.wait_for_timeout(150)
            p.wait_for_timeout(400)
            ok = p.evaluate("(n) => window._dssThreeRegistry['cf-wrap'].look(n)", obj)
            if not ok: print("look failed", size, obj, p.evaluate("() => document.getElementById('cf-wrap').dataset.cam"))
            p.wait_for_timeout(1000 if key == "trail" else 2200)
        f = os.path.join(OUT, "%s-%s.png" % (size, key)); p.screenshot(path=f, clip=box) if size == "phone" else p.screenshot(path=f, clip={"x": 0, "y": max(0, box["y"] - 40), "width": W, "height": min(H - max(0, box["y"] - 40), 520)}); files[(size, key)] = f
        if obj: p.keyboard.press("Escape"); p.wait_for_timeout(300)
    print(size, "errors:", [e[:60] for e in p._errs if 'decode' not in e])
    g.close()
# the contact sheet: desktop row over phone row
def font(s):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",):
        if os.path.exists(f): return ImageFont.truetype(f, s)
    return ImageFont.load_default()
DW, PW, pad, capH = 900, 260, 18, 28
cells = []
for key, _, cap in SHOTS:
    d_ = Image.open(files[("desktop", key)]).convert("RGB"); d_ = d_.resize((DW, int(d_.height * DW / d_.width)))
    p_ = Image.open(files[("phone", key)]).convert("RGB"); p_ = p_.resize((PW, int(p_.height * PW / p_.width)))
    cells.append((cap, d_, p_))
width = pad * 3 + DW + PW
height = pad + sum(capH + max(d_.height, p_.height) + pad for _, d_, p_ in cells)
sheet = Image.new("RGB", (width, height), (16, 13, 11)); dr = ImageDraw.Draw(sheet); y = pad
for cap, d_, p_ in cells:
    dr.text((pad, y), cap + "  (desktop, phone)", fill=(220, 200, 160), font=font(17))
    sheet.paste(d_, (pad, y + capH)); sheet.paste(p_, (pad * 2 + DW, y + capH))
    y += capH + max(d_.height, p_.height) + pad
sheet.save(os.path.join(OUT, "..", "Morning review sheet.png")); print("sheet", sheet.size)
