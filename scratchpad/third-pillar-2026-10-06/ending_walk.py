"""Option A: Ezekiel Return -> The Synthesis; Alt-Dawn 'Wake' -> The Fetch with no 'Not yet'. Run with PYTHONPATH=scratchpad/audit-2026-09-16, a server on 8777."""
import harness
from harness import Game
g = Game()
def boot(target, seeds):
    p = g.page(target, seeds); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    for _ in range(3):
        if not Game.click(p, "On.", 700): break
        Game.clear_overlays(p)
    p.wait_for_timeout(2500); return p
def name(p): return p.evaluate("() => (document.getElementById('audit-name')||{}).textContent")
def links(p): return p.evaluate("() => [...document.querySelectorAll('tw-passage tw-link')].map(l=>l.textContent.trim()).filter(t=>t.length<60)")
p = boot("Ezekiel Return", "(set: $lilyCount to 2)")
print("1", name(p), links(p))
p.evaluate("() => [...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()==='Follow').click()"); p.wait_for_timeout(2500)
print("2", name(p), links(p), "errors", p.locator("tw-error").count()); p.close()
p = boot("Alt-Dawn", "(set: $lilyCount to 2)")
print("3", name(p), links(p))
p.evaluate("() => [...document.querySelectorAll('tw-link')].find(l=>l.textContent.trim()==='Wake').click()"); p.wait_for_timeout(25000)
print("4", name(p), links(p), "not-yet shown:", p.evaluate("() => document.body.innerText.includes('Not yet. Back to the night.')"), "errors", p.locator("tw-error").count(), [e[:100] for e in p._errs if 'audio' not in e.lower()][:3])
p.close()
p = boot("The Fetch", "(set: $lilyCount to 2)"); p.wait_for_timeout(22000)
print("5 control (no Sanctum):", name(p), "not-yet shown:", p.evaluate("() => document.body.innerText.includes('Not yet. Back to the night.')"))
