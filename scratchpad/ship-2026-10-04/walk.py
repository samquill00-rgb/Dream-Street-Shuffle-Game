"""The ship (2026-10-04): walks the ringing box, the three faces of the call, the woman on the
corner, the stairs line, the notebook and the dawn traces. Run from scratchpad/audit-2026-09-16:
PYTHONPATH=. DSS_FAST=1 python3 ../ship-2026-10-04/walk.py <outdir>"""
import sys, os
from harness import *
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
g = Game(width=1212, height=900)
fails = []
def check(cond, msg):
    print(("ok   " if cond else "FAIL ") + msg)
    if not cond: fails.append(msg)
def errs(p): return [e[:160] for e in p._errs if 'audio' not in e.lower()]
MID = "(set: $afterMidnight to true)(set: $enteredVenue to true)(set: $inisToldOfPillars to true)"
T, W, VR, SKY = 16, 416, 26, 3
def boot(seeds):
    p = g.page("Dean Street", seeds)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 900): break
        Game.clear_overlays(p)
    return p
def tele(p, c, r): return p.evaluate("([c,r]) => window.__dssSohoTeleport(c,r)", [c, r])
def shot(p, name): p.evaluate("() => window.dispatchEvent(new Event('resize'))"); p.wait_for_timeout(900); p.screenshot(path=os.path.join(out, name + ".png"))
def walk_into_box(p):
    tele(p, 19, 25); shot(p, "box-trail-far")
    tele(p, 19, 23); p.wait_for_timeout(600); shot(p, "box-trail-near")
    p.keyboard.down("ArrowUp"); p.wait_for_timeout(700); p.keyboard.up("ArrowUp"); p.wait_for_timeout(2200)
    return Game.name(p)

# A. afloat, she told you, sober: give her name
p = boot(MID + '(set: $shipFate to "afloat")(set: $holdsAshtonName to true)(set: $savedBy to "ashton")(set: $crossed to "ashton")(set: $haunts to (a: $haunt4))')
check(p.evaluate("() => document.querySelector('.dss-hub-flag[data-k=ring]')?.textContent.trim()") == "on", "A: ring flag on after midnight")
at = walk_into_box(p); check(at == "The Phone Box Rings", "A: walking onto the box reaches The Phone Box Rings (" + str(at) + ")")
p.screenshot(path=os.path.join(out, "A-rings.png"))
check(Game.click(p, "Accept the call", 900), "A: Accept the call")
s = Game.snapshot(p); check(s["at"] == "The Phone Box Answered", "A: answered"); check("Give them her name" in s["links"] and "Say nothing and hang up" in s["links"], "A: the two choices show " + str(s["links"]))
p.screenshot(path=os.path.join(out, "A-answered.png"))
Game.click(p, "Give them her name", 600); check("Debt is paid" in p.inner_text("tw-passage"), "A: gave her name")
p.screenshot(path=os.path.join(out, "A-given.png"))
Game.click(p, "Back to Dean Street", 1500); Game.clear_overlays(p)
check(p.evaluate("() => document.querySelector('.dss-hub-flag[data-k=ring]')?.textContent.trim()") == "", "A: ring flag off after the call")
Game.click(p, "NOTEBOOK", 1800); nb = p.inner_text("body")
check("THE SHIP" in nb and "you gave them her name" in nb and "paid, with her name" in nb, "A: notebook THE SHIP and the Debt trace")
p.screenshot(path=os.path.join(out, "A-notebook.png"), full_page=True)
check(not errs(p), "A: no page errors " + str(errs(p))); p.close()

# B. sunk, a name sold: the news, and the name bought nothing
p = boot(MID + '(set: $shipFate to "sunk")(set: $crossed to "red")(set: $metRed to true)')
at = walk_into_box(p); check(at == "The Phone Box Rings", "B: rings")
Game.click(p, "Accept the call", 900); t = p.inner_text("tw-passage")
check("mid-Atlantic" in t and "bought nothing" in t, "B: the news with the sold-name line")
p.screenshot(path=os.path.join(out, "B-news.png"))
Game.click(p, "Back to Dean Street", 1200); Game.clear_overlays(p)
check(not errs(p), "B: no page errors " + str(errs(p))); p.close()

# C. drunk, she told you: the slip
p = boot(MID + '(set: $shipFate to "afloat")(set: $holdsAshtonName to true)(set: $sobriety to 20)')
at = walk_into_box(p); Game.click(p, "Accept the call", 900); t = p.inner_text("tw-passage")
check("too far gone" in t and "Give them her name" not in t, "C: the drunk slip, no choice")
Game.click(p, "Back to Dean Street", 1200); Game.clear_overlays(p); Game.click(p, "NOTEBOOK", 1800); nb = p.inner_text("body")
check("do not remember doing it" in nb, "C: notebook says you do not remember")
check(not errs(p), "C: no page errors " + str(errs(p))); p.close()

# D. afloat, no name: the rumour grown; and refusing counts
p = boot(MID + '(set: $shipFate to "afloat")')
walk_into_box(p); Game.click(p, "I'm not here", 800); t = p.inner_text("tw-passage")
check("let it ring" in t, "D: refused line"); Game.click(p, "Back to Dean Street", 1200); Game.clear_overlays(p)
check(p.evaluate("() => document.querySelector('.dss-hub-flag[data-k=ring]')?.textContent.trim()") == "", "D: box stops ringing once refused")
check(not errs(p), "D: no page errors " + str(errs(p))); p.close()
p = boot(MID + '(set: $shipFate to "afloat")')
walk_into_box(p); Game.click(p, "Accept the call", 900); t = p.inner_text("tw-passage")
check("asking for a name you do not have" in t, "D2: the rumour grown"); p.close()

# E. the woman on the corner, after midnight, sunk
p = boot(MID + '(set: $shipFate to "sunk")')
tele(p, 7, 8); p.wait_for_timeout(500); shot(p, "E-woman-far")
p.keyboard.down("ArrowUp"); p.wait_for_timeout(1500); p.keyboard.up("ArrowUp"); p.wait_for_timeout(2200)
at = Game.name(p); check(at == "The Woman from the Line", "E: reached The Woman from the Line (" + str(at) + ")")
t = p.inner_text("tw-passage"); check("gone, mid-Atlantic" in t, "E: she brings the sinking"); p.screenshot(path=os.path.join(out, "E-woman.png"))
Game.click(p, "Walk on", 1500); Game.clear_overlays(p)
check(p.evaluate("() => document.querySelector('.dss-hub-flag[data-k=met-line]')?.textContent.trim()") == "on", "E: met-line flag on")
Game.click(p, "NOTEBOOK", 1800); nb = p.inner_text("body"); check("gone, mid-Atlantic" in nb, "E: notebook has the sinking")
check(not errs(p), "E: no page errors " + str(errs(p))); p.close()

# F. the stairs: Beaten and Standing with Ashton set the flag and lead to her dark-pass variant
for pas, link in (("Beaten", "Up the stairs"), ("Standing", "Out onto Dean Street")):
    p = g.page(pas, '(set: $crossed to "ashton")(set: $enteredVenue to true)'); p.wait_for_timeout(1500)
    t = p.inner_text("tw-passage"); check("half tells you" in t, pas + ": her stairs line shows")
    check(p.evaluate("() => document.querySelectorAll('tw-error').length") == 0, pas + ": no tw-error")
    check(Game.click(p, link, 4500), pas + ": " + link); t = p.inner_text("tw-passage")
    check("Ashton comes up the stairs" in t, pas + " -> dark pass: Ashton variant")
    p.close()
p = g.page("Dean Street", MID + '(set: $shipFate to "afloat")(set: $savedBy to "ashton")(set: $crossed to "ashton")')
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
    Game.clear_overlays(p)
# the flag is set on the stairs, not by seeding savedBy: reach the box without it and the call is the rumour
walk_into_box(p); Game.click(p, "Accept the call", 900); t = p.inner_text("tw-passage")
check("asking for a name you do not have" in t, "F: without the stairs line you hold no name"); p.close()
# G. the critic's rumour, the dawn traces
p = g.page("Talk to the critic", "(set: $afterMidnight to false)"); s = Game.snapshot(p)
check("pipe cleaners" in s["textSample"], "critic: rumour line"); check(not s["twErrors"], "critic: no tw-error"); p.close()
for pas in ("Alba Incomplete", "Alba Complete"):
    p = g.page(pas, '(set: $shipNews to "sunk")(set: $ashtonSold to true)'); p.wait_for_timeout(1500); t = p.inner_text("tw-passage")
    check("dawn trace" in t and "cannot take back" in t, pas + ": both traces"); check(p.evaluate("() => document.querySelectorAll('tw-error').length") == 0, pas + ": no tw-error"); p.close()
g.close()
print("\nFAILS:", len(fails)); [print(" -", f) for f in fails]
