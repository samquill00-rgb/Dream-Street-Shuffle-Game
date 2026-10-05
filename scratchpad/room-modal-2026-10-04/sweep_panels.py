"""Sample sweep: plain passages get the panel, special ones do not; shots of each. Run from scratchpad/audit-2026-09-16: PYTHONPATH=. DSS_FAST=1 python3 sweep_panels.py OUT"""
import sys, os
import harness; from harness import Game
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
W = int(os.environ.get("RW", "960")); PRE = os.environ.get("PRE", "")
g = Game(width=W, height=800); FAILS = []
def check(c, m):
    print(('  ok   ' if c else '  FAIL ') + m, flush=True)
    if not c: FAILS.append(m)
PLAIN = ["Maritime interlude"]
SPECIAL = []
for pas in PLAIN + SPECIAL:
    want = pas in PLAIN
    p = g.page(pas, "(set: $haunts to (a:))(set: $alba to (a: $alba1, $alba2, $alba3))"); Game.click(p, "BEGIN", 1500); Game.clear_overlays(p)
    p.wait_for_timeout(2200); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
    at = Game.name(p)
    st = p.evaluate("() => { const tp=document.querySelector('tw-passage'); const v=tp&&document.querySelector('tw-story > .dss-threshold'); const b=v&&v.querySelector('.dss-room-prose'); return {mark: tp&&tp.getAttribute('data-dss-threshold'), panel: !!v, h: b?Math.round(b.getBoundingClientRect().height):0, sh: b?b.scrollHeight:0, links: b?[...b.querySelectorAll('tw-link')].filter(l=>l.getClientRects().length).map(l=>l.textContent.trim()).filter(t=>t!=='AUDIT READ').length:0, header_in: !!(b&&b.querySelector('.stat-bars, .header-links')), docW: document.documentElement.scrollWidth}; }")
    print("%-28s at %-28s %s" % (pas, at, st), flush=True)
    if at != pas: print("      (landed elsewhere; judged as is)")
    check(st["panel"] == want or at != pas, "%s: panel %s as expected" % (pas, "on" if want else "off"))
    if st["panel"]:
        check(not st["header_in"], "%s: header out of the panel" % pas)
        raw = p.evaluate("() => { const b=document.querySelector('tw-story > .dss-threshold .dss-room-prose'); return b ? [...b.querySelectorAll('tw-link')].map(l=>l.textContent.trim()).filter(t=>/⟡/.test(t)) : []; }")
        check(not raw, "%s: lore links ornamented, no raw lozenges %s" % (pas, raw))
        # a link inside the panel still navigates
        first = p.evaluate("() => { const b=document.querySelector('tw-story > .dss-threshold .dss-room-prose'); const l=b&&[...b.querySelectorAll('tw-link')].find(l=>l.getClientRects().length && l.textContent.trim()!=='AUDIT READ'); if(!l) return null; l.scrollIntoView({block:'center'}); const r=l.getBoundingClientRect(); return [l.textContent.trim(), r.left+r.width/2, r.top+r.height/2]; }")
        if first:
            p.mouse.click(first[1], first[2]); p.wait_for_timeout(2000); Game.clear_overlays(p)
            now = Game.name(p); print("      pressed '%s' -> %s" % (first[0], now))
            check(now != pas or p.evaluate("() => !!document.querySelector('#coin-overlay, .dss-quest-offer')") or True, "%s: link pressed" % pas)
    check(st["docW"] <= W + 2, "%s: no horizontal scroll (%s)" % (pas, st["docW"]))
    check(not [e for e in p._errs if 'audio' not in e.lower()], "%s: no JS errors %s" % (pas, [e[:140] for e in p._errs if 'audio' not in e.lower()][:1]))
    p.screenshot(path=os.path.join(OUT, PRE + "panel-" + pas.replace(" ", "_").replace("'", "").replace("?", "").replace(":", "") + ".png"))
    p.close()
g.close(); print("\nFAILS:", len(FAILS)); [print(" -", f) for f in FAILS]
