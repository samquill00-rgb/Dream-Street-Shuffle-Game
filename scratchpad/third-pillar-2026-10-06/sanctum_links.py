"""List every clickable link on the Sanctum and Sitting screens."""
import harness
from harness import Game
g = Game()
for target in ["The Sanctum", "The Sanctum — Sitting", "The Synthesis"]:
    p = g.page(target, ""); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    p.wait_for_timeout(2500)
    print(target, p.evaluate("() => [...document.querySelectorAll('tw-link, a, button')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()).filter(t=>t && t.length<50)"))
    p.close()
