"""Screenshot a passage after N seconds. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../polish-loop-2026-09-23/passage_shot.py "Passage" out.png [secs] [width] [reduced]  (SEED env adds sets)"""
import sys, os
from harness import *
target, out = sys.argv[1], sys.argv[2]
secs = float(sys.argv[3]) if len(sys.argv) > 3 else 3
width = int(sys.argv[4]) if len(sys.argv) > 4 else 1212
reduced = len(sys.argv) > 5 and sys.argv[5] == 'reduced'
RICH = ('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)'
        '(set: $knowsCecilCourt to true)(set: $knowsLackland to true)(set: $metDavy to true)(set: $metShana to true)'
        '(set: $lilyCount to 5)(set: $haunts to (a: $haunt1, $haunt2, $haunt3))') + os.environ.get("SEED", "")
g = Game(width=width, height=780 if width < 600 else 900)
p = g.page(target, RICH)
if reduced: p.emulate_media(reduced_motion='reduce')
Game.click(p, "BEGIN", 1200); p.wait_for_timeout(int(secs * 1000)); Game.clear_overlays(p)
print("at", Game.name(p))
p.screenshot(path=out, full_page=True)
print("errs", [e[:120] for e in p._errs if 'audio' not in e.lower()][:3])
g.close()
