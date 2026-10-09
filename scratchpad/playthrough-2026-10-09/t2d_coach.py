import sys; sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
g = Game()
p = g.page("Coach and Horses bar", "(set: $lilyCount to 1)(set: $hadLilyCall1 to false)(set: $hadPhoneCall to true)(set: $phoneCallReturnsAt to 0)(set: $returns to 8)(set: $sobriety to 70)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(1500)
Game.click(p, "I’m not here", 700); Game.click(p, "Back to the bar", 900); Game.clear_overlays(p)
for i in range(30):
    p.wait_for_timeout(1000)
    if p.evaluate("() => !!document.querySelector('#cb-wrap canvas') && !document.body.innerText.includes('LOADING')"): break
print("room up after ~%ds" % (i+1), "| at", Game.name(p), "| ring", p.locator(".phone-ringing").count(), "| room prose:", p.evaluate("() => (document.querySelector('.dss-room-prose')||{}).innerText||''")[:160].replace("\n"," / "))
p.screenshot(path="scratchpad/playthrough-2026-10-09/t2-coach-room-after-back.png")
g.close()
