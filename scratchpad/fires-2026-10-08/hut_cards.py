"""Soho Square hut: his lines on the cards, cream; pink only for placeholders."""
import sys, harness
from harness import Game
g = Game()
p = g.page("Soho Square: the hut", "(set: $sobriety to 20)(set: $blackouts to 1)(set: $hasMatches to true)(set: $hutBurnt to false)")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(5000)
out = sys.argv[1] if len(sys.argv) > 1 else '/tmp/hut'
for name in ("door", "king", "gate"):
    p.evaluate("(n) => { const b=[...document.querySelectorAll('button')].find(e=>e.textContent.includes(n)); if(b) b.click(); }", name)
    p.wait_for_timeout(2500)
    info = p.evaluate("() => { const c=document.getElementById('sq-card'); return c ? [...c.children].map(e=>[e.tagName, e.textContent, getComputedStyle(e).color]) : null }")
    print(name, info)
    p.screenshot(path=f"{out}-{name}.png")
    p.evaluate("() => { const b=[...document.querySelectorAll('#sq-card button')].find(e=>e.textContent.includes('step back')); if(b) b.click(); }"); p.wait_for_timeout(1500)
print("visible passage text has 'Charlie':", p.evaluate("() => { const e=[...document.querySelectorAll('[data-sq-copy=king]')][0]; return e ? e.getClientRects().length>0 && getComputedStyle(e).visibility : 'none' }"))
print("errors", p.locator("tw-error").count())
