import sys; sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
g = Game()
p = g.page("Entering The Pillars of Hercules", "(set: $hadPhoneCall to false)(set: $metCritic to false)(set: $visited's Pillars to true)(set: $sobriety to 70)(set: $ringSnoozed to true)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print(p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e => e.textContent.slice(0,400))"))
print(p.evaluate("() => [...document.querySelectorAll('.phone-ringing')].map(e => e.textContent.trim().slice(0,80))"))
g.close()
