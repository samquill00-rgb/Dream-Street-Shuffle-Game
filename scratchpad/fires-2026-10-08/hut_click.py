"""Soho Square hut: hover shows the name, a click on the door opens its card."""
import harness
from harness import Game
g = Game()
p = g.page("Soho Square: the hut", "(set: $sobriety to 20)(set: $blackouts to 1)(set: $hasMatches to true)(set: $hutBurnt to false)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(6000)
hit = None
for y in range(380, 620, 20):
    for x in range(300, 1200, 30):
        p.mouse.move(x, y); p.wait_for_timeout(30)
        t = p.evaluate("() => [...document.querySelectorAll('#sq-wrap div')].filter(d=>d.style.opacity==='1' && d.style.textTransform==='uppercase').map(d=>d.textContent)[0] || ''")
        if t: hit = (x, y, t); break
    if hit: break
print("hover:", hit)
if hit:
    p.mouse.click(hit[0], hit[1]); p.wait_for_timeout(2500)
    print("card:", p.evaluate("() => document.getElementById('sq-card').innerText"))
print("errors", p.locator("tw-error").count())
