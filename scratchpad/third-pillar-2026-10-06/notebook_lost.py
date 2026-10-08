"""Notebook has no LOST TO DRINK section; Dawn record no lost count."""
import harness
from harness import Game
g = Game()
for target in ("Entering The Pillars of Hercules", "Dawn"):
    p = g.page(target, '(set: $lostToDrink to (a: "lily1", "gooch"))'); Game.click(p, "BEGIN", 900); Game.clear_overlays(p)
    p.wait_for_timeout(2500)
    if target != "Dawn":
        p.evaluate("() => { const l=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()==='NOTEBOOK'); if(l) l.click(); }"); p.wait_for_timeout(2500)
    html = p.evaluate("() => document.body.innerText")
    print(target, "notebook open:", "PASSWORDS" in html, "lost-to-drink text:", "LOST TO DRINK" in html.upper(), "nb-lost:", p.locator(".nb-lost").count(), "errors:", p.locator("tw-error").count(), "at:", p.evaluate("() => (document.getElementById('audit-name')||{}).textContent"))
