"""His Coach lines in: the window button, the wait card, Burn it, the fire line and the scene's own exit to the Fetch."""
import sys, harness
from harness import Game
g = Game()
SEED = "(set: $sobriety to 40)(set: $blackouts to 1)(set: $hutBurnt to true)(set: $metRed to true)(set: $enteredVenue to true)(set: $hasCoin to true)(set: $returns to 6)"
OUT = sys.argv[1]
p = g.page("Dean Street", SEED, audit_header=False)
Game.click(p, "BEGIN", 1200); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 900): break
p.wait_for_timeout(2500); Game.clear_overlays(p)
print("thread flag", p.evaluate("() => (document.querySelector('.dss-hub-flag[data-k=\"thread-coach\"]')||{}).textContent"))
print("smash button", p.evaluate("() => { var b=document.getElementById('dss-smash-window'); return b && [b.textContent, b.className, getComputedStyle(b).color]; }"))
p.evaluate("() => window.__dssSohoTeleport && window.__dssSohoTeleport(43,35)"); p.wait_for_timeout(1500)
p.screenshot(path=OUT+"-hub-path.png")
p = g.page("Approach The Coach", SEED + "(set: $brokenWindows to (a: 'frith'))")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(4000)
print("wait card", p.evaluate("() => [...document.querySelectorAll('#ch-wrap div, body > div > div')].filter(e=>/Coach and Horses\\. It looks/.test(e.textContent)&&e.children.length==0).map(e=>[e.textContent.slice(0,40), getComputedStyle(e).color])"))
p.screenshot(path=OUT+"-coach-wait.png")
p = g.page("Approach The Coach", SEED + "(set: $brokenWindows to (a: 'frith','greek','romilly'))")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(4000)
print("ready buttons", p.evaluate("() => [...document.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!='none'&&b.offsetParent).map(b=>b.textContent.trim())"))
p.screenshot(path=OUT+"-coach-ready.png")
p = g.page("The Coach Burns", SEED + "(set: $brokenWindows to (a: 'frith','greek','romilly'))(set: $hasMatches to false)(set: $coachBurnt to false)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(5000)
print("fire buttons", p.evaluate("() => [...document.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!='none'&&b.offsetParent).map(b=>b.textContent.trim())"))
print("fire card", p.evaluate("() => [...document.querySelectorAll('div')].filter(e=>/It is done/.test(e.textContent)&&e.children.length==0).map(e=>[getComputedStyle(e).color, getComputedStyle(e).opacity])"))
p.screenshot(path=OUT+"-fire.png")
p.wait_for_timeout(16000)
print("after the fire at", Game.name(p), "links", p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l=>l.textContent.trim())"))
p.screenshot(path=OUT+"-fetch.png")
print("errors", p.locator("tw-error").count(), p._errs[:3])
