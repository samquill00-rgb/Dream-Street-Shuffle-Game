"""Slip trail step 2 on the gents cistern (2026-10-07): the cistern shows in the gents, its card speaks, step 3 opens."""
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'audit-2026-09-16'))
from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1280, 900)
SEED = "(set: $inisToldOfPillars to true)(set: $sobriety to 60)(set: $blackedOut to true)(set: $blackouts to 1)"
g = Game(width=W, height=H); res = {}
for case, seen in [("fresh", []), ("after-chesterfield", ["cu/the chesterfield"])]:
    p = g.page("Coach and Horses lock", SEED); Game.click(p, "BEGIN", 2500); Game.clear_overlays(p)
    p.wait_for_timeout(6500)
    p.evaluate("(s) => { localStorage.setItem('dssVoicesSeen', JSON.stringify(s)); }", seen)
    r = {"name": Game.name(p), "cistern": p.evaluate("() => !!document.querySelector('.gents-cistern-btn')"),
         "glass_before": p.evaluate("() => window.dssVoices.lines('cb','his glass')")}
    p.click(".gents-cistern-btn"); p.wait_for_timeout(500)
    r["card"] = p.evaluate("() => { const c=document.querySelector('.gents-cistern-card'); return c && !c.hidden ? c.innerText : null; }")
    r["seen"] = p.evaluate("() => JSON.parse(localStorage.getItem('dssVoicesSeen')||'[]')")
    r["glass_after"] = p.evaluate("() => window.dssVoices.lines('cb','his glass')")
    p.screenshot(path=os.path.join(OUT, case + ".png"), full_page=True)
    p.click(".gents-cistern-btn"); p.wait_for_timeout(300)
    r["closed"] = p.evaluate("() => document.querySelector('.gents-cistern-card').hidden")
    r["errors"] = getattr(p, '_errors', None)
    res[case] = r
print(json.dumps(res, indent=1))
