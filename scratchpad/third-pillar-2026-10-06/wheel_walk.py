"""The Wheel's 'Come back' goes straight into the Synthesis."""
import harness
from harness import Game
g = Game()
p = g.page("The Wheel", ""); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
for _ in range(3):
    if not Game.click(p, "On.", 700): break
    Game.clear_overlays(p)
p.wait_for_timeout(2500)
def links(): return p.evaluate("() => [...document.querySelectorAll('tw-link')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim())")
print("start", links())
for _ in range(4):
    l = [x for x in links() if x not in ("AUDIT READ","NOTEBOOK","Meet her look")]
    if not l: break
    if "Come back" in l:
        p.evaluate("() => [...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()==='Come back').click()"); p.wait_for_timeout(2500); break
    p.evaluate("(t) => [...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()===t).click()", l[0]); p.wait_for_timeout(6000); print("clicked", l[0], links())
print("now at:", p.evaluate("() => (document.getElementById('audit-name')||{}).textContent"), "errors", p.locator("tw-error").count())
