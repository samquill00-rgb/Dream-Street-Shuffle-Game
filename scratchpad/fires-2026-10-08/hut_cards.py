"""Soho Square hut: objects clicked in the scene only; name + his line on each card."""
import sys, harness
from harness import Game
g = Game()
p = g.page("Soho Square: the hut", "(set: $sobriety to 20)(set: $blackouts to 1)(set: $hasMatches to true)(set: $hutBurnt to false)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(5000)
out = sys.argv[1] if len(sys.argv) > 1 else '/tmp/hut'
print("dock on screen:", p.evaluate("() => [...document.querySelectorAll('#sq-wrap button')].map(b => { const r=b.getBoundingClientRect(); return [b.textContent, r.top < innerHeight] })"))
for name in ("The hut door", "The Statue of Charles II", "The gate"):
    p.evaluate("(n) => { const b=[...document.querySelectorAll('#sq-wrap button')].find(e=>e.textContent===n); if(b) b.click(); }", name)
    p.wait_for_timeout(2500)
    print(p.evaluate("() => { const c=document.getElementById('sq-card'); return [...c.children].map(e=>[e.textContent, getComputedStyle(e).color]) }"))
    p.screenshot(path=f"{out}-{name.split()[-1]}.png")
    p.evaluate("() => { const b=[...document.querySelectorAll('#sq-card button')].find(e=>e.textContent==='step back'); if(b) b.click(); }"); p.wait_for_timeout(1500)
print("errors", p.locator("tw-error").count())
