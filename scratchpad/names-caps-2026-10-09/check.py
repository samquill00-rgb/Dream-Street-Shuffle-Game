"""Names in capitals: load the passages that carry names and check nothing errors."""
import sys, harness
from harness import Game
g = Game()
OUT = sys.argv[1]
SEED = "(set: $metRed to true)(set: $enteredVenue to true)(set: $returns to 6)(set: $knowsCopperWord to true)(set: $hasLiver to true)(set: $hadLilyCall1 to true)(set: $hadDualRing to true)(set: $hasMissingPage to true)"
for name in ["Turn to Copper", "Copper confronts", "Lackland's Back Room", "The Empty Glass", "Davy Merkin", "Talk to the critic", "Martin Lackland's Office", "Shana Reads", "Inis O'Flatterly introduction", "Beaten", "Standing", "The dark pass"]:
    try:
        p = g.page(name, SEED)
        Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(2500)
        txt = p.evaluate("() => (document.querySelector('tw-passage')||{}).innerText||''")
        import re
        caps = sorted(set(re.findall(r"\b[A-Z][A-Z’'.]{2,}(?: [A-Z][A-Z’'.]+)*\b", txt)))[:12]
        print(name, "| at", Game.name(p), "| errors", p.locator("tw-error").count(), p._errs[:2], "| caps", caps)
        p.screenshot(path=OUT + "-" + re.sub(r"\W+", "-", name) + ".png")
    except Exception as e:
        print(name, "FAILED", e)
