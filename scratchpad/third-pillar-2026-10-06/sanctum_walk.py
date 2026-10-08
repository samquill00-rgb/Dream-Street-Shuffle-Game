"""The Sanctum is one screen with one link out, into the Fetch with no 'Not yet'."""
import harness
from harness import Game
g = Game()
p = g.page("The Sanctum", "(set: $lilyCount to 2)"); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 700): break
    Game.clear_overlays(p)
p.wait_for_timeout(2500)
print("links:", p.evaluate("() => [...document.querySelectorAll('tw-link')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim())"), "errors", p.locator("tw-error").count())
p.evaluate("() => [...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()==='Go now').click()"); p.wait_for_timeout(25000)
print("now at:", p.evaluate("() => (document.getElementById('audit-name')||{}).textContent"), "not-yet shown:", p.evaluate("() => document.body.innerText.includes('Not yet. Back to the night.')"), "errors", p.locator("tw-error").count())
