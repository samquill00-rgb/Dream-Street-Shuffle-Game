"""The locked path: hut burnt -> only Coach + windows on the map; three windows -> fire at the Coach; Coach Fire Ending -> The Fetch, no way back."""
import sys, harness
from harness import Game
g = Game()
SEED = "(set: $sobriety to 40)(set: $blackouts to 1)(set: $hutBurnt to true)(set: $metRed to true)(set: $enteredVenue to true)(set: $hasCoin to true)(set: $returns to 6)"
# 1. Dean Street with the hut burnt: which doors are open on the map?
p = g.page("Dean Street", SEED + "(set: $brokenWindows to (a:))")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(2500)
print("labels", p.evaluate("() => [...document.querySelectorAll('.soho-door-label')].map(e=>e.textContent.trim()+':'+e.className.replace('soho-door-label ',''))"))
print("coach link", p.evaluate("() => !!document.querySelector('tw-link[passage-name=\"Approach The Coach\"]')"))
print("window actions", p.evaluate("() => document.querySelectorAll('[data-window-action] tw-link').length"))
print("errors", p.locator("tw-error").count())
if len(sys.argv) > 1: p.screenshot(path=sys.argv[1]+"-hub.png")
# 2. Approach The Coach before three windows: no ENTER, the wait card
p = g.page("Approach The Coach", SEED + "(set: $brokenWindows to (a: 'frith'))")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(4000)
print("coach early: enter shown", p.evaluate("() => [...document.querySelectorAll('button')].filter(b=>/ENTER THE COACH/.test(b.textContent)&&getComputedStyle(b).display!='none').length"))
print("coach early: cards", p.evaluate("() => [...document.querySelectorAll('button,div')].filter(e=>/Sam:/.test(e.textContent)&&e.children.length==0).map(e=>e.textContent.trim())"))
if len(sys.argv) > 1: p.screenshot(path=sys.argv[1]+"-coach-early.png")
# 3. Approach The Coach after three windows: the fire buttons
p = g.page("Approach The Coach", SEED + "(set: $brokenWindows to (a: 'frith','greek','romilly'))")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(4000)
print("coach ready: buttons", p.evaluate("() => [...document.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!='none'&&b.offsetParent).map(b=>b.textContent.trim())"))
if len(sys.argv) > 1: p.screenshot(path=sys.argv[1]+"-coach-ready.png")
# 4. The Coach Burns fires with no matches at all
p = g.page("The Coach Burns", SEED + "(set: $brokenWindows to (a: 'frith','greek','romilly'))(set: $hasMatches to false)(set: $coachBurnt to false)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(3000)
print("burns: fire scene", p.evaluate("() => !!document.querySelector('#ch-container[data-fire=\"true\"]')"), "links", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(l=>l.textContent.trim()+'->'+l.getAttribute('passage-name'))"))
# 5. Coach Fire Ending -> The Fetch, with no way back
p = g.page("Coach Fire Ending", SEED + "(set: $coachBurnt to true)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print("ending links", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(l=>l.textContent.trim()+'->'+l.getAttribute('passage-name'))"))
p.locator("tw-link", has_text="on towards dawn").first.click(); p.wait_for_timeout(2500)
print("fetch links", p.evaluate("() => [...document.querySelectorAll('tw-link')].map(l=>l.textContent.trim()+'->'+l.getAttribute('passage-name'))"))
print("errors", p.locator("tw-error").count())
