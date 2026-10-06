"""No key or no word from Inis: no pillar. Run: PYTHONPATH=scratchpad/audit-2026-09-16 python3 scratchpad/third-pillar-2026-10-06/pillar_walk.py"""
import harness
from harness import Game
g = Game()
def boot(target, seeds):
    p = g.page(target, seeds); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    p.wait_for_timeout(4000); return p
def info(p):
    return p.evaluate("""() => ({
      name: (document.getElementById('audit-name')||{}).textContent,
      svg: !!document.querySelector('tw-passage .pillar.centre'),
      links: [...document.querySelectorAll('tw-passage tw-link')].map(l=>l.textContent.trim()).filter(t=>t.length<60),
      text: document.querySelector('tw-passage').innerText.slice(0,0),
      shut: document.body.innerText.includes('fund your passage'),
      rises: document.body.innerText.includes('A third pillar rises'),
      canvas: !!document.querySelector('#pi-wrap canvas'),
      errs: document.querySelectorAll('tw-error').length })""")
base = '(set: $metCritic to true)(set: $sobriety to 70)(set: $pillarsNoAuto to false)'
for label, seed in [("no Inis, no key", base),
                    ("no Inis, key", base + '(set: $dreamKey to "lighter")'),
                    ("Inis, no key", base + '(set: $inisToldOfPillars to true)'),
                    ("Inis, key, drunk", base + '(set: $inisToldOfPillars to true)(set: $dreamKey to "lighter")(set: $sobriety to 20)'),
                    ("Inis, key, sober", base + '(set: $inisToldOfPillars to true)(set: $dreamKey to "lighter")')]:
    p = boot("Entering The Pillars of Hercules", seed)
    i = info(p); jserr = [e[:120] for e in p._errs if 'audio' not in e.lower()]
    print(label, "->", i, "js:", jserr[:3])
    p.close()
