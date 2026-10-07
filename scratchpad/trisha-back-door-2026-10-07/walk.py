"""Trisha's back door (2026-10-07): a secret way out to the street; the wrap lies on the floor while the key waits."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1280, 900)
g = Game(width=W, height=H); res = {}
for case, seed in [("key-waiting", "(set: $inisToldOfPillars to true)(set: $keyCocaine to \"seed\")(set: $sobriety to 60)"), ("no-key", "(set: $sobriety to 60)")]:
    p = g.page("Trisha's", seed); Game.click(p, "BEGIN", 2500); Game.clear_overlays(p)
    def idle():
        for _ in range(150):
            if p.evaluate("() => { const w=document.getElementById('ti-wrap'); return !!(w && w.querySelector('canvas') && w.dataset.cam==='idle'); }"): break
            p.wait_for_timeout(300)
        p.wait_for_timeout(800)
    idle()
    r = {}
    p.evaluate("() => window._dssThreeRegistry['ti-wrap'].look('the door to the back')"); p.wait_for_timeout(400); idle()
    r["card"] = p.evaluate("() => { const c=[...document.querySelectorAll('#ti-wrap *')].find(e=>e.querySelector && e.querySelector('.fi-action, .dss-voices')); return c ? c.innerText : null; }")
    r["actions"] = p.locator("#ti-wrap .fi-action").all_inner_texts()
    p.screenshot(path=os.path.join(OUT, case + ".png"))
    btn = p.locator("#ti-wrap .fi-action", has_text="Through the door")
    if case == "no-key" and btn.count():
        btn.first.click(); p.wait_for_timeout(3000); r["after"] = Game.name(p)
    res[case] = r
print(json.dumps(res, indent=1))
