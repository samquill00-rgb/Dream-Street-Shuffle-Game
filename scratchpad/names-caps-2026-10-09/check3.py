import harness
from harness import Game
g = Game()
p = g.page("The Empty Glass", "")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(6000)
print(repr(p.evaluate("() => document.body.innerText.slice(0,600)")))
p.screenshot(path="/mnt/project-files/names-caps-2026-10-09/empty-glass.png")
