import sys, harness
from harness import Game
g = Game()
p = g.page("Soho Square: after", "(set: $hutBurnt to true)"); Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(2500)
print(p.evaluate("() => document.querySelector('blockquote.dss-scripture').innerText"))
p.locator("blockquote.dss-scripture").screenshot(path=sys.argv[1]); print("errors", p.locator("tw-error").count())
