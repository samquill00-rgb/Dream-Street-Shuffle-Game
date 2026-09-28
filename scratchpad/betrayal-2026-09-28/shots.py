import sys
sys.path.insert(0, "scratchpad/audit-2026-09-16")
from harness import Game
OUT = "scratchpad/betrayal-2026-09-28/"
g = Game()
SEED = '(set: $haunts to (a: $haunt4))(set: $knowsCopperWord to false)'
def shot(p, name):
    p.wait_for_timeout(600); p.locator("tw-passage").screenshot(path=OUT+name)
def run(label, choice, result, tag):
    p = g.page("Turn to Copper", seeds=SEED, audit_header=False); Game.clear_overlays(p)
    if label == "keep": shot(p, "v-lair-choices.png")
    Game.click(p, choice, 900); Game.clear_overlays(p)
    if label != "keep": shot(p, f"v-lair-{label}.png")
    Game.click(p, "Brace yourself", 900)
    p.wait_for_timeout(1500); p.evaluate("(id) => document.querySelector('#'+id+' tw-link').click()", "go-fight-"+result); p.wait_for_timeout(900)
    Game.click(p, "Try to get up" if result == "defeat" else "Escape up the stairs", 900); Game.clear_overlays(p)
    shot(p, f"v-rescue-{label}-{result}.png")
    links = p.evaluate("() => [...document.querySelectorAll('tw-link')].map(e=>e.textContent.trim())")
    Game.click(p, links[0], 900)
    if links[0] == "He has something to tell you": Game.click(p, "Dean Street", 900)
    Game.clear_overlays(p); shot(p, f"v-darkpass-{label}-{result}.png"); p.close()
run("keep", "Say nothing", "defeat", "")
run("ashton", "Break the agreement. Look at her.", "defeat", "")
run("red", "Give him Red's name", "victory", "")
run("john", "Give him John's name", "victory", "")
# notebook with the Debt sold
p = g.page("Dean Street", seeds='(set: $crossed to "john")(set: $haunts to (a: $haunt4))', audit_header=False)
Game.clear_overlays(p); p.wait_for_timeout(800)
p.evaluate("() => { const b=[...document.querySelectorAll('*')].find(e=>e.children.length===0 && e.textContent.trim()==='NOTEBOOK'); b && b.click(); }")
p.wait_for_timeout(1200)
txt = p.evaluate("() => document.body.innerText"); print("notebook has sold:", "sold" in txt, "| Debt:", "The Debt" in txt)
p.screenshot(path=OUT+"v-notebook-john.png"); p.close()
p = g.page("The Colony Room", seeds='(set: $crossed to "red")(set: $haunts to (a: $haunt1))(set: $visited\'s Colony to false)', audit_header=False)
Game.clear_overlays(p); shot(p, "v-colony-red.png"); p.close()
g.close()
