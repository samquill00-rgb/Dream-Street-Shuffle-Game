import sys, re, harness
from harness import Game
g = Game()
SEED = "(set: $metRed to true)(set: $crossed to '')(set: $enteredVenue to true)(set: $returns to 6)(set: $knowsCopperWord to true)(set: $hasLiver to true)(set: $hadLilyCall1 to true)(set: $hadDualRing to true)(set: $hasMissingPage to true)"
for name in ["The Empty Glass", "Beaten", "O'Flatterly introduction", "Build Notebook", "Davy Merkin"]:
    p = g.page(name, SEED)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(3000)
    txt = p.evaluate("() => (document.querySelector('tw-passage')||{}).textContent||''")
    caps = sorted(set(re.findall(r"\b[A-Z][A-Z’'.]{2,}(?: [A-Z][A-Z’'.]+)*\b", txt)))[:14]
    print(name, "| at", Game.name(p), "| tw-errors", p.locator("tw-error").count(), "| caps", caps)
