"""No matches, no lighter: the door card offers 'look', then the last match and 'light it'."""
import harness
from harness import Game
g = Game()
p = g.page("Soho Square: the hut", "(set: $sobriety to 20)(set: $blackouts to 1)(set: $hutBurnt to false)(set: $hasMatches to false)(set: $dreamKey to \"\")")
Game.click(p, "BEGIN", 900); Game.clear_overlays(p); p.wait_for_timeout(4000)
card = "() => document.getElementById('sq-card').innerText.replace(/\\n+/g,' | ')"
p.evaluate("() => [...document.querySelectorAll('#sq-wrap button')].find(e=>e.textContent==='The hut door').click()"); p.wait_for_timeout(1500)
print("before:", p.evaluate(card))
p.evaluate("() => [...document.querySelectorAll('#sq-card button')].find(e=>e.textContent==='look').click()"); p.wait_for_timeout(1500)
print("after:", p.evaluate(card))
p.evaluate("() => [...document.querySelectorAll('#sq-card button')].find(e=>e.textContent==='light it').click()"); p.wait_for_timeout(4000)
print("now at:", p.evaluate("() => (document.getElementById('audit-name')||{}).textContent"), "errors", p.locator("tw-error").count())
