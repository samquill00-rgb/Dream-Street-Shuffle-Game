import sys, re; sys.path.insert(0, "scratchpad/audit-2026-09-16")
import harness
harness.STATE_VARS.append("ringSnoozed")
harness.AUDIT_HEADER = ('\n<div id="audit-name">(print: (passage:)\'s name)</div>\n(link-repeat: "AUDIT READ")[<div id="audit-state">(print: (dm: ' + ",".join('"%s", $%s' % (v, v) for v in harness.STATE_VARS) + '))</div>]')
from harness import Game
g = Game()
LILY = "(set: $lilyCount to 1)(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $phoneCallReturnsAt to 0)(set: $returns to 8)(set: $sobriety to 70)"
def snooze(p):
    st = Game.snapshot(p)["state"] or ""; m = re.search(r"ringSnoozed(\w+)", st); return m.group(1) if m else st[-80:]
p = g.page("Coach and Horses bar", LILY)
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
print("ring", p.locator(".phone-ringing").count(), "snoozed", snooze(p))
Game.click(p, "I’m not here", 700); print("after refusal snoozed", snooze(p))
Game.click(p, "Back to the bar", 900); Game.clear_overlays(p); p.wait_for_timeout(1200)
print("back at", Game.name(p), "ring", p.locator(".phone-ringing").count(), "snoozed", snooze(p))
Game.click(p, "← Exit to the street", 1200); Game.clear_overlays(p)
print("hub", Game.name(p), "snoozed", snooze(p))
g.close()
