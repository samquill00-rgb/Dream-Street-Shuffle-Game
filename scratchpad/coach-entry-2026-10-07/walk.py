"""Coach entry (2026-10-07): front door -> bar, no gents door; blackout -> gents -> bar, gents door offered."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1280, 900)
TOLD = "(set: $inisToldOfPillars to true)(set: $sobriety to 60)"
g = Game(width=W, height=H); res = {}
def spots(p):
    for _ in range(120):
        ok = p.evaluate("() => { const w=document.getElementById('cb-wrap'); return !!(w && w.querySelector('canvas') && w.dataset.cam==='idle'); }")
        if ok: break
        p.wait_for_timeout(300)
    p.wait_for_timeout(800)
    return p.evaluate("() => { const e=(window._dssThreeRegistry||{})['cb-wrap']; return e ? e.hotspots.map(h=>h.name) : null; }")
def state(p, tag):
    t = p.evaluate("() => (document.querySelector('tw-passage')||{}).innerText || ''")
    return {"name": Game.name(p), "cubicle": "come to in a cubicle" in t, "bernard": "Jeffrey Bernard" in t}
for case, start, seeds, steps in [
    ("front-door", "Approach The Coach", TOLD, ["·"]),
    ("urgent", "Approach The Coach", TOLD + "(set: $coachUrgent to true)", ["·", "You gather your limbs to the bar."]),
    ("blackout", "Coach and Horses lock", TOLD + "(set: $blackedOut to true)(set: $blackouts to 1)", ["You gather your limbs to the bar."]),
    ("front-after-blackout", "Coach and Horses lock", TOLD + "(set: $blackedOut to true)(set: $blackouts to 1)", ["You gather your limbs to the bar."]),
]:
    p = g.page(start, seeds); Game.click(p, "BEGIN", 2500); Game.clear_overlays(p)
    r = {"start": state(p, case)}
    for s in steps:
        r.setdefault("clicked", []).append(Game.click(p, s, 2500)); Game.clear_overlays(p)
        r.setdefault("after", []).append(state(p, case))
    if case == "front-after-blackout":
        # leave by the street and come back in by the front door: the gents door must be gone again
        p.evaluate("() => { const l=[...document.querySelectorAll('tw-link')].find(e=>/Dean Street|Back/.test(e.textContent)); }")
        p.evaluate("() => { window.Engine ? 0 : 0 }")
        Game.click(p, "← Back to Dean Street", 1500)
    r["spots"] = spots(p) if r.get("after", [r["start"]])[-1]["name"] == "Coach and Horses bar" else None
    p.screenshot(path=os.path.join(OUT, case + ".png"))
    res[case] = r
print(json.dumps(res, indent=1))
