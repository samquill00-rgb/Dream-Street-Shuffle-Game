import sys, re; sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
OUT = "scratchpad/playthrough-2026-10-09/"
g = Game()
def links(p): return [t for t in Game.snapshot(p)["links"] if t]
def errs(p): return p.evaluate("() => [...document.querySelectorAll('tw-error')].map(e => e.textContent.slice(0,200))")
# Lily ring in the Pillars
p = g.page("Entering The Pillars of Hercules", "(set: $lilyCount to 1)(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $phoneCallReturnsAt to 0)(set: $returns to 8)(set: $visited's Pillars to true)(set: $metCritic to true)(set: $sobriety to 70)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print("Lily: ring=%d" % p.locator(".phone-ringing").count(), "errs", errs(p))
Game.click(p, "I’m not here", 700); Game.click(p, "Back to the bar", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print("  -> at", Game.name(p), "ring=%d" % p.locator(".phone-ringing").count(), "errs", errs(p), "links", links(p)[:8])
p.screenshot(path=OUT + "t2-pillars-lily-back-at-bar.png"); p.close()
# Aoife ring in the Pillars
p = g.page("Entering The Pillars of Hercules", "(set: $hadPhoneCall to false)(set: $metCritic to false)(set: $visited's Pillars to true)(set: $sobriety to 70)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print("Aoife: ring=%d" % p.locator(".phone-ringing").count(), "errs", errs(p), "sob", re.search(r"sobriety(\d+)", Game.snapshot(p)["state"]).group(1))
Game.click(p, "I’m not here", 700); Game.click(p, "Back to the bar", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print("  -> at", Game.name(p), "ring=%d" % p.locator(".phone-ringing").count(), "errs", errs(p), "sob", re.search(r"sobriety(\d+)", Game.snapshot(p)["state"]).group(1), "links", links(p)[:8])
p.screenshot(path=OUT + "t2-pillars-aoife-back-at-bar.png"); p.close()
g.close()
