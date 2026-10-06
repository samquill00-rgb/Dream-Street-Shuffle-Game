"""Press "Draw it down" on The Wheel and log when each reveal sound is called relative to the press. Args: [reduced]"""
import sys, time, urllib.parse, json
from playwright.sync_api import sync_playwright
reduced = len(sys.argv) > 1 and sys.argv[1] == "reduced"
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=" + urllib.parse.quote("The Wheel")
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce" if reduced else "no-preference")
    p = c.new_page(); p.goto(URL); time.sleep(3.5)
    p.evaluate("""() => { window.__log=[]; const a=window.dssAudio; for (const k of ['loreUnravel','distantBell']) { const o=a[k]; a[k]=function(){ window.__log.push([k, performance.now()-window.__t0]); return o.apply(this, arguments); }; } }""")
    ok = p.evaluate("""() => { const e=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()==='Draw it down'); if(!e) return false; window.__t0=performance.now(); e.click(); return true; }""")
    time.sleep(4.5)
    print("reduced" if reduced else "desktop", "pressed", ok, json.dumps(p.evaluate("() => window.__log.map(([k,t])=>[k, Math.round(t)])")))
    p.screenshot(path="/home/user/Dream-Street-Shuffle-Game/scratchpad/starred-2026-10-06/shots2/wheel-%s.png" % ("reduced" if reduced else "desktop")); b.close()
