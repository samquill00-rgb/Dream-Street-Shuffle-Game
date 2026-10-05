"""Threshold pages: each shows as the dark panel, its links work and lead on. Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 threshold.py OUT"""
import sys, os
import harness; from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W = int(os.environ.get("RW", "960")); PRE = os.environ.get("PRE", "")
g = Game(width=W, height=800); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
def panel(p): return p.evaluate("() => { const v=document.querySelector('tw-story .dss-threshold'); if(!v) return null; const b=v.querySelector('.dss-room-prose'); const r=b.getBoundingClientRect(); return {w:Math.round(r.width), top:Math.round(r.top), h:Math.round(r.height), text:b.innerText.replace(/\\s+/g,' ').trim().slice(0,90), links:[...b.querySelectorAll('tw-link')].filter(l=>l.getClientRects().length).map(l=>l.textContent.trim()), pe:getComputedStyle(b).pointerEvents, z:getComputedStyle(v).zIndex}; }")
CASES = [
 ("colony-door", "The Colony Room Door", "(set: $visited's Colony to false)(set: $metDavy to false)(set: $metSalvu to false)", "Right", "COIN"),
 ("colony-door-left", "The Colony Room Door", "(set: $visited's Colony to false)(set: $metDavy to false)(set: $metSalvu to false)", "Left", "COIN"),
 ("colony-member", "Colony Member", "", "Drink with Davy Merkin", "Davy Merkin"),
 ("maltese", "Maltese Gangsters", "", "KNOCK", "Approach Coppers Lair"),
 ("trishas-door-refused", "Failure: Trisha's", "(set: $hasTrishaMatchbook to false)", "Dean Street", "Dean Street"),
 ("trishas-door-matchbook", "Failure: Trisha's", "(set: $hasTrishaMatchbook to true)(set: $opponent to 'Jack Curtis')", "Give him the matchbook", None),
 ("oflatterly-intro", "O'Flatterly introduction", "(set: $hasMissingPage to true)(set: $returnedPage to false)", "Show him the page", "Return the page"),
 ("oflatterly-quest", "O'Flatterly's quest", "(set: $haunts to (a:))", "I'll look for it", "Dean Street"),
]
for key, pas, seeds, click, dest in CASES:
    print("== %s ==" % key, flush=True)
    p = g.page(pas, seeds); Game.click(p, "BEGIN", 1500); Game.clear_overlays(p)
    for _ in range(20):
        if panel(p): break
        p.wait_for_timeout(200)
    p.wait_for_timeout(1500); Game.clear_overlays(p)
    at = Game.name(p); check(at == pas, "%s: at %s" % (key, at))
    pn = panel(p); print("      panel:", pn)
    check(bool(pn) and pn["pe"] == "auto" and pn["w"] > 300, "%s: dark panel with the words" % key)
    btns = p.evaluate("() => [...document.querySelectorAll('tw-story .dss-threshold button')].map(b=>b.textContent.trim())")
    check(bool(pn) and (click in pn["links"] or click in btns), "%s: '%s' inside the panel (%s %s)" % (key, click, pn and pn["links"], btns))
    stat0 = p.evaluate("() => [...document.querySelectorAll('.stat-bars, .header-links')].some(e => e.closest('.dss-threshold'))")
    check(not stat0, "%s: the header stays out of the panel" % key)
    p.screenshot(path=os.path.join(OUT, PRE + "threshold-%s.png" % key))
    # click the link the way a player would: on its box
    def hit(t):
        xy = p.evaluate("(t) => { const l=[...document.querySelectorAll('tw-story .dss-threshold tw-link, tw-story .dss-threshold button')].find(l=>l.textContent.trim()===t); if(!l) return null; l.scrollIntoView({block:'center'}); const r=l.getBoundingClientRect(); return [r.left+r.width/2, r.top+r.height/2]; }", t)
        if xy: p.mouse.click(xy[0], xy[1])
        return xy
    if click == "KNOCK":
        for _ in range(3): hit("KNOCK"); p.wait_for_timeout(500)
        p.wait_for_timeout(7000)
    else:
        hit(click); p.wait_for_timeout(2500)
    if dest == "COIN":
        hit("Toss the Donkey"); p.wait_for_timeout(1200)
        coin = p.evaluate("() => { const c=document.querySelector('#coin-overlay'); return c ? getComputedStyle(c).zIndex : null; }")
        print("      coin overlay z:", coin); check(coin is not None and int(coin) > 900, "%s: the coin toss comes up over the panel" % key)
        p.screenshot(path=os.path.join(OUT, PRE + "threshold-%s-coin.png" % key)); dest = None
        Game.clear_overlays(p); p.wait_for_timeout(300)
        p.close(); continue
    Game.clear_overlays(p)
    now = Game.name(p); print("      after '%s': %s" % (click, now))
    if dest: check(now == dest, "%s: leads to %s" % (key, dest))
    else:
        pn2 = panel(p); print("      panel now:", pn2 and pn2["links"])
        check(now == pas and bool(pn2) and len(pn2["links"]) > 0, "%s: the reveal stays in the panel with its link" % key)
        p.screenshot(path=os.path.join(OUT, PRE + "threshold-%s-after.png" % key))
    check(not [e for e in p._errs if 'audio' not in e.lower()], "%s: no JS errors %s" % (key, [e[:160] for e in p._errs if 'audio' not in e.lower()][:2]))
    p.close()
g.close(); print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
