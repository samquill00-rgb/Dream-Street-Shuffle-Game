"""Viewport screenshots of many passages in one browser. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. python3 ../beauty-loop-2026-09-24/survey.py OUTDIR WIDTH [reduced] < list  (one passage per line)"""
import sys, os
from harness import *
out, width = sys.argv[1], int(sys.argv[2])
reduced = len(sys.argv) > 3 and sys.argv[3] == 'reduced'
secs = float(os.environ.get("SECS", "4"))
RICH = ('(set: $inisToldOfPillars to true)(set: $returnedPage to true)(set: $metCritic to true)'
        '(set: $knowsCecilCourt to true)(set: $knowsLackland to true)(set: $metDavy to true)(set: $metShana to true)'
        '(set: $lilyCount to 3)(set: $haunts to (a: $haunt1, $haunt2, $haunt3))') + os.environ.get("SEED", "")
names = [l.strip() for l in sys.stdin if l.strip()]
g = Game(width=width, height=780 if width < 600 else 900)
for n in names:
    try:
        p = g.page(n, RICH)
        if reduced: p.emulate_media(reduced_motion='reduce')
        Game.click(p, "BEGIN", 1200)
        for _ in range(3):
            if Game.name(p) == n: break
            if not Game.click(p, "On.", 900): break
        p.wait_for_timeout(int(secs * 1000)); Game.clear_overlays(p)
        p.add_style_tag(content='#audit-name,tw-link:has(+ #audit-state),tw-hook:has(#audit-state){display:none!important} tw-expression:has(> tw-hook > tw-link) {}')
        p.evaluate("()=>{document.querySelectorAll('tw-link').forEach(e=>{if(e.textContent.trim()==='AUDIT READ'){let x=e; for(let i=0;i<3&&x.parentElement&&x.parentElement.tagName!=='TW-PASSAGE';i++) x=x.parentElement; x.style.display='none';}})}")
        fn = os.path.join(out, n.replace('/', '-').replace(' ', '_').replace("'", '') + '.png')
        p.screenshot(path=fn, full_page=os.environ.get('FULL','1')=='1')
        print(n, '->', Game.name(p), 'errs', [e[:100] for e in p._errs if 'audio' not in e.lower()][:2], flush=True)
        p.close()
    except Exception as e:
        print(n, 'FAILED', str(e)[:200], flush=True)
g.close()
