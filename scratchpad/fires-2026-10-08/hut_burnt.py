"""The burnt hut: his fire line and button on the card, cream."""
import sys, harness
from harness import Game
g = Game()
p = g.page("Soho Hut Burns", "(set: $sobriety to 20)(set: $blackouts to 1)(set: $hutBurnt to false)(set: $hasMatches to true)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(9000)
print(p.evaluate("() => [...document.getElementById('sq-card').children].map(e=>[e.textContent, getComputedStyle(e).color])"))
if len(sys.argv) > 1: p.screenshot(path=sys.argv[1])
print("errors", p.locator("tw-error").count())
