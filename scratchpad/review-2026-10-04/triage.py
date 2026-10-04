import sys, os, re
import harness; from harness import Game
harness.STATE_VARS += ["drinksTonight","drinksRound","blackouts","lostToDrink","crossed","savedBy","lilyCount","pillarsVisits"]
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">' + "".join('%s=(print: $%s);;' % (v, v) for v in harness.STATE_VARS) + '</div>]')
OUT = "scratchpad/review-2026-10-04/out/triage"; os.makedirs(OUT, exist_ok=True)
g = Game(width=1280, height=900)
def st(p):
    s = Game.snapshot(p); return {k: (re.search(r'(?:^|;;)%s=(.*?);;' % k, s["state"] or "") or [None, None])[1] for k in harness.STATE_VARS}, s
def vis_pink(p): return p.evaluate("() => [...document.querySelectorAll('.claude-draft')].map(e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return {t:e.innerText.slice(0,60), vis:(r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.opacity!=='0'&&cs.display!=='none'), op:cs.opacity}})")
def errs(p): return [e[:160] for e in p._errs if 'audio' not in e.lower()]
# A. Beaten / Standing drunk + crossing: are the pink lines visible?
for pas in ("Beaten", "Standing"):
    p = g.page(pas, '(set: $sobriety to 20)(set: $crossed to "red")(set: $metRed to true)(set: $enteredVenue to true)(set: $haunts to (a: $haunt4))'); Game.click(p, "BEGIN", 900); p.wait_for_timeout(3500); Game.clear_overlays(p)
    print("==", pas, "pink:", vis_pink(p)); print("   canvas:", p.evaluate("() => [...document.querySelectorAll('tw-passage canvas')].map(c=>c.width)"), "errs", errs(p))
    p.screenshot(path=OUT+"/%s.png" % pas); p.close()
# B. gents second time
p = g.page("Coach and Horses lock", '(set: $sobriety to 8)(set: $blackouts to 2)(set: $blackedOut to true)(set: $enteredVenue to true)'); Game.click(p, "BEGIN", 900); p.wait_for_timeout(3000); Game.clear_overlays(p)
print("== gents 2nd: pink", vis_pink(p)); print("   links", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())"))
p.screenshot(path=OUT+"/gents2.png"); p.close()
# C. Retch: first blackout, read sobriety on the next passage
p = g.page("Coach and Horses lock", '(set: $sobriety to 5)(set: $blackouts to 1)(set: $blackedOut to true)(set: $enteredVenue to true)'); Game.click(p, "BEGIN", 900); p.wait_for_timeout(3000); Game.clear_overlays(p)
print("== gents 1st links", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())"))
Game.click(p, "Retch.", 1200); Game.click(p, "You gather your limbs to the bar.", 2500); Game.clear_overlays(p); s,_ = st(p); print("   after Retch, at", _["at"], "sobriety", s["sobriety"]); p.close()
# D. Alba Incomplete -> Dawn
p = g.page("Alba Incomplete", '(set: $blackouts to 2)(set: $lostToDrink to (a: "lily4","fetch"))(set: $enteredVenue to true)'); Game.click(p, "BEGIN", 900); p.wait_for_timeout(2500)
Game.click(p, "Traveller, sleep!", 4000); print("== after sleep at", Game.name(p))
for i in range(6):
    n = Game.name(p); ls = p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim()).filter(t=>t!=='AUDIT READ')")
    print("   ", n, ls[:5])
    if n == "Dawn": break
    if ls: Game.click(p, ls[0], 9000)
    else: p.wait_for_timeout(6000)
t = p.inner_text("tw-passage"); print("   Dawn lost line:", re.findall(r".{40}lost to drink.{30}", t, re.I)[:2], "errs", errs(p)); p.screenshot(path=OUT+"/dawn.png", full_page=True); p.close()
# E. notebook lost section
p = g.page("Dean Street", '(set: $lostToDrink to (a: "lily4","fetch","pillar"))(set: $enteredVenue to true)'); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if Game.name(p)=="Dean Street": break
    Game.click(p, "On.", 800); Game.clear_overlays(p)
Game.click(p, "NOTEBOOK", 2500); nb = p.inner_text("body"); i = nb.find("LOST TO DRINK"); print("== notebook lost:", nb[i-20:i+400].replace("\n"," | ") if i>=0 else "NO SECTION"); p.screenshot(path=OUT+"/nb-lost.png", full_page=True); p.close()
# F. Pillars: does every return to the bar cost 9?
p = g.page("Entering The Pillars of Hercules", '(set: $sobriety to 70)(set: $enteredVenue to true)'); Game.click(p, "BEGIN", 900); p.wait_for_timeout(3000); Game.clear_overlays(p)
s,_ = st(p); print("== Pillars entry: sobriety", s["sobriety"], "visits", s["pillarsVisits"])
Game.click(p, "Get a drink at the bar", 1500); ls = p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())"); print("   menu", ls)
Game.click(p, ls[1], 1500); s,_ = st(p); print("   after drink at", _["at"], "sobriety", s["sobriety"]); ls = p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())"); print("   links", ls)
back = [l for l in ls if 'bar' in l.lower() or 'back' in l.lower()]
if back: Game.click(p, back[0], 3000); Game.clear_overlays(p); s,_ = st(p); print("   back at", _["at"], "sobriety", s["sobriety"], "visits", s["pillarsVisits"])
p.close()
p = g.page("The French", '(set: $sobriety to 70)(set: $enteredVenue to true)'); Game.click(p, "BEGIN", 900); p.wait_for_timeout(3000); Game.clear_overlays(p); s,_ = st(p); print("== French entry sobriety", s["sobriety"]); p.close()
g.close()
