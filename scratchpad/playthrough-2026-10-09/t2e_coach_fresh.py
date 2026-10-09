import sys; sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
g = Game()
def up(p, n=60):
    for i in range(n):
        p.wait_for_timeout(1000)
        if p.evaluate("() => !!document.querySelector('#cb-wrap canvas') && !document.body.innerText.includes('LOADING')"): return i+1
    return None
p = g.page("Coach and Horses bar", "(set: $sobriety to 70)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
print("fresh boot, no ring: room up after", up(p), "| cb-wrap:", p.evaluate("() => !!document.querySelector('#cb-wrap')"), "| errs", p._errs[:2], [c for c in p._cons if c[0]=='error'][:3])
p.close()
p = g.page("Coach and Horses lock", "(set: $sobriety to 70)(set: $blackouts to 0)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(800)
Game.click(p, "You gather your limbs to the bar.", 900); Game.clear_overlays(p)
print("via the gents link: at", Game.name(p), "room up after", up(p), "| errs", p._errs[:2], [c for c in p._cons if c[0]=='error'][:3])
g.close()
