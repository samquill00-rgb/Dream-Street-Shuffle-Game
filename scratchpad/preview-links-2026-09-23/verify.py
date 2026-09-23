"""Verify the ?start= preview links, the old hash form, a plain load, and preview.html.
Serves the repo root on :8777 (start it first) and drives headless Chromium."""
import sys, json, re
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
import harness
from harness import Game, INIT_JS, BODIES, AUDIT_HEADER
BASE = "http://localhost:8777/"
GAME = BASE + "Dream%20Street%20Shuffle.html"
OUT = "/home/user/Dream-Street-Shuffle-Game/scratchpad/preview-links-2026-09-23/"

def new_page(g, url, width=1280, height=900):
    p = g.b.new_page(viewport={"width": width, "height": height})
    errs = []; p.on("pageerror", lambda e: errs.append(str(e)[:200])); p._errs = errs
    header = BODIES["header header"] + AUDIT_HEADER
    p.add_init_script("(" + INIT_JS + ")(" + json.dumps({"start": None, "header": header}) + ")")
    p.goto(url, wait_until="domcontentloaded")
    return p

def settle(p, ms=2500):
    p.wait_for_timeout(ms)
    return p.evaluate("()=>{const n=document.querySelector('#audit-name');return n?n.textContent.trim():null}")

def state(p):
    p.evaluate("()=>{const l=[...document.querySelectorAll('tw-story tw-link')].find(e=>e.textContent.trim()==='AUDIT READ'); if(l) l.click();}"); p.wait_for_timeout(400)
    t = p.evaluate("()=>{const n=document.querySelector('#audit-state');return n?n.textContent:''}")
    return t

def errors(p):
    tw = p.evaluate("()=>document.querySelectorAll('tw-error').length")
    return tw, [e for e in p._errs if 'audio' not in e.lower()]

g = Game()
results = {}
WORLDS = {"himalayas": ("Airport Pub", "keyLighter"), "nazca": ("Nazca Approach", "keyCocaine"),
          "easter": ("Easter Island Shore", "keyTicket"), "pyramid": ("Pyramid Mouth", "keySlip"),
          "ezekiel": ("The Plain of Chebar", "keyEye")}
for slug, (want, key) in WORLDS.items():
    p = new_page(g, GAME + "?start=" + slug)
    name = settle(p, 3500)
    st = state(p)
    tw, js = errors(p)
    ok_key = ('"%s",spent' % key) in st.replace(" ", "") or ("%s:spent" % key) in st.replace(" ", "")
    results[slug] = {"landed": name, "want": want, "ok": name == want, "tw-errors": tw, "js": js,
                     "url_after": p.url, "state": st[:600]}
    p.screenshot(path=OUT + "start-" + slug + ".png")
    p.close()

# refresh mid-world returns to the world start, not the title
p = new_page(g, GAME + "?start=nazca"); settle(p, 3500)
p.evaluate("()=>{const l=[...document.querySelectorAll('tw-story tw-link')].find(e=>/Out onto the pampa/.test(e.textContent)); l.click();}"); p.wait_for_timeout(1500)
mid = p.evaluate("()=>document.querySelector('#audit-name').textContent.trim()")
p.reload(wait_until="domcontentloaded"); after = settle(p, 3500)
results["refresh"] = {"mid": mid, "after_reload": after, "url": p.url}
p.close()

# old hash form still works and strips the hash
p = new_page(g, GAME + "#dss-debug-jump=Nazca%20Race"); name = settle(p, 3500)
results["hash"] = {"landed": name, "url": p.url, "errors": errors(p)}
p.close()

# raw passage name through ?start=
p = new_page(g, GAME + "?start=Pyramid%20Run"); name = settle(p, 3500)
results["start-passage"] = {"landed": name, "errors": errors(p)}
p.close()

# plain load stays on the title
p = new_page(g, GAME); name = settle(p, 3000)
results["plain"] = {"landed": name, "errors": errors(p)}
p.close()

# launcher page: phone width, no horizontal scroll, link lands in the world
for w, tag in ((390, "phone"), (1280, "desktop")):
    p = g.b.new_page(viewport={"width": w, "height": 844 if w == 390 else 900})
    p.goto(BASE + "preview.html"); p.wait_for_timeout(500)
    scroll = p.evaluate("()=>document.documentElement.scrollWidth > document.documentElement.clientWidth")
    p.screenshot(path=OUT + "launcher-" + tag + ".png", full_page=True)
    results["launcher-" + tag] = {"hscroll": scroll}
    p.close()
p = new_page(g, BASE + "preview.html"); p.click("a.world:has-text(\"Easter Island\")"); name = settle(p, 4000)
results["launcher-click"] = {"landed": name, "url": p.url}
p.close()
g.close()
print(json.dumps(results, indent=1))
