"""Click through the five gift buttons in The Synthesis and report errors."""
import harness
from harness import Game
g = Game()
p = g.page("The Synthesis", ""); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 700): break
    Game.clear_overlays(p)
p.wait_for_timeout(2000)
for t in ["Speak the mantra","Hold up the tracing","Recall the glyph","Hum the number","Draw the wheel"]:
    ok = p.evaluate("(t) => { const l=[...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()===t); if(l){l.click(); return true;} return false; }", t)
    p.wait_for_timeout(900); print(t, ok)
print("seal link:", p.evaluate("() => [...document.querySelectorAll('tw-link')].some(l=>l.textContent.trim()==='Step into the Seal')"), "hexagram:", p.evaluate("() => !!document.querySelector('.hexagram-svg')"), "tw-errors:", p.locator("tw-error").count())
print(p.evaluate("() => document.querySelector('tw-passage').innerText.replace(/\\n+/g,' | ').slice(0,900)"))
