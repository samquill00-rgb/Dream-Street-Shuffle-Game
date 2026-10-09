"""Note 2: refusing a venue phone call steps you back to the bar, not the street; the ring waits a lap."""
import sys
sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
OUT = "scratchpad/playthrough-2026-10-09/"
g = Game()
LILY = "(set: $lilyCount to 1)(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $phoneCallReturnsAt to 0)(set: $returns to 8)(set: $visited's Ronnies to true)(set: $visited's Colony to true)(set: $visited's Pillars to true)(set: $metCritic to true)(set: $sobriety to 70)"
def links(p): return [t for t in Game.snapshot(p)["links"] if t]
def sob(p):
    import re; m = re.search(r"sobriety(\d+)", Game.snapshot(p)["state"] or ""); return m.group(1) if m else "?"
for venue, back in [("Coach and Horses bar","Back to the bar"),("The French","Back to the bar"),("The Colony Room","Back to the bar"),("Ronnie Scott's","Back to the bar"),("Entering The Pillars of Hercules","Back to the bar")]:
    p = g.page(venue, LILY)
    Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(2000)
    ring = p.locator(".phone-ringing").count()
    s0 = sob(p)
    ok1 = Game.click(p, "I’m not here", 700)
    ls = links(p)
    ok2 = Game.click(p, back, 900); Game.clear_overlays(p); p.wait_for_timeout(2000)
    print("%-34s ring=%d refused=%s links=%s | back=%s -> at %s ring=%d sob %s->%s errs=%s %s" % (
        venue, ring, ok1, [l for l in ls if "Back" in l], ok2, Game.name(p), p.locator(".phone-ringing").count(), s0, sob(p), p.locator("tw-error").count(), p._errs[:1]))
    print("   bar links now:", links(p)[:8])
    p.screenshot(path=OUT + "t2-" + venue.replace(" ","-").replace("'","") + "-back-at-bar.png")
    # next lap: out to the hub and back in, the phone should ring again
    Game.click(p, "← Exit to the street", 900) or Game.click(p, "Leave the French", 900) or Game.click(p, "Not tonight.", 900)
    Game.clear_overlays(p); p.wait_for_timeout(800)
    print("   hub:", Game.name(p))
    p.close()
# the Pillars' Aoife ring
p = g.page("Entering The Pillars of Hercules", "(set: $hadPhoneCall to false)(set: $metCritic to false)(set: $visited's Pillars to true)(set: $sobriety to 70)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(2000)
print("Pillars Aoife ring=%d" % p.locator(".phone-ringing").count(), "sob", sob(p))
Game.click(p, "I’m not here", 700); Game.click(p, "Back to the bar", 900); Game.clear_overlays(p); p.wait_for_timeout(2000)
print("   -> at", Game.name(p), "ring=%d" % p.locator(".phone-ringing").count(), "sob", sob(p), "links", links(p)[:8], "errs", p.locator("tw-error").count(), p._errs[:1])
p.screenshot(path=OUT + "t2-pillars-aoife-back-at-bar.png")
g.close()
