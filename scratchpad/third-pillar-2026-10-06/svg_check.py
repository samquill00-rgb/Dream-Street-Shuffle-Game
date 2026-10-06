import harness
from harness import Game
g = Game()
for label, seed in [("Inis, key, drunk", '(set: $metCritic to true)(set: $inisToldOfPillars to true)(set: $dreamKey to "lighter")(set: $sobriety to 20)'),("no Inis", '(set: $metCritic to true)(set: $sobriety to 70)')]:
    p = g.page("Entering The Pillars of Hercules", seed); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    p.wait_for_timeout(5000)
    print(label, p.evaluate("""() => ({anySvg: document.querySelectorAll('svg.pillar.centre').length,
      cards: [...document.querySelectorAll('#pi-wrap *')].filter(e=>/third pillar/i.test(e.textContent) && e.children.length==0).map(e=>e.textContent.slice(0,40)),
      links: [...document.querySelectorAll('tw-link')].map(l=>l.textContent.trim()).filter(t=>t.length<50)})"""))
    p.screenshot(path="/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/45a31670-4af3-5c4a-89ac-f3069fee8a74/scratchpad/pi-%s.png" % label.replace(", ","-").replace(" ","_"))
    p.close()
