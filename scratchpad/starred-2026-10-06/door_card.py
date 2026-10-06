"""Open a room hotspot's card by name and list its buttons; optionally press one. Args: wrapId passage hotspotName [pressText] [W H]"""
import sys, time, urllib.parse, json
from playwright.sync_api import sync_playwright
w, pas, hot = sys.argv[1], sys.argv[2], sys.argv[3]
press = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != '-' else None
W = int(sys.argv[5]) if len(sys.argv) > 5 else 1440; H = int(sys.argv[6]) if len(sys.argv) > 6 else 900
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=" + urllib.parse.quote(pas)
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
S = "/home/user/Dream-Street-Shuffle-Game/scratchpad/starred-2026-10-06/shots2/"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": W, "height": H}); p = c.new_page(); errs=[]
    p.on("pageerror", lambda e: errs.append(str(e)[:160]))
    p.goto(URL)
    for _ in range(200):
        if p.evaluate("(w) => !!document.querySelector('#'+w+' canvas') && document.getElementById(w).dataset.cam === 'idle'", w): break
        time.sleep(0.3)
    time.sleep(1)
    for _ in range(6):
        n = p.evaluate("() => { let n=0; document.querySelectorAll('#coin-overlay,#match-overlay,#cig-overlay,#eat-overlay,#dss-key-overlay,#dss-quest-overlay,#drink-popup-overlay,#spew-popup-overlay').forEach(e=>{n++; e.remove();}); return n; }")
        if not n: break
        time.sleep(0.2)
    d = p.query_selector('tw-story > .dss-room-fixed .dss-room-dismiss') or p.query_selector('.dss-room-dismiss')
    if d:
        try: d.click(timeout=5000)
        except Exception as e: print('dismiss', str(e)[:80]); p.evaluate("() => { const d=document.querySelector('.dss-room-dismiss'); d && d.click(); }")
        time.sleep(1.2)
    spots = p.evaluate("(w) => window._dssThreeRegistry[w].hotspots.map(h => h.name)", w); print("hotspots", spots)
    if hot not in spots: print("no such hotspot"); b.close(); sys.exit(0)
    xy = p.evaluate("([w,name]) => { const e = window._dssThreeRegistry[w]; const h=e.hotspots.find(h=>h.name===name); const a=h.haloAt; const v = new THREE.Vector3(a[0],a[1],a[2]); v.project(e.camera); const c = document.querySelector('#'+w+' canvas'); const r = c.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }", [w, hot])
    print("door at", xy)
    p.mouse.move(xy[0], xy[1]); time.sleep(0.4); p.mouse.down(); p.mouse.up()
    for _ in range(140):
        if p.evaluate("(w) => document.getElementById(w).dataset.cam", w) == 'inspect': break
        time.sleep(0.15)
    time.sleep(1.2)
    card = p.evaluate("(w) => { const d=[...document.querySelectorAll('#'+w+' .dss-room-card')][0]; if(!d) return null; return {op: d.style.opacity, text: d.textContent.slice(0,200), buttons: [...d.querySelectorAll('.fi-action, button, tw-link, a')].map(b=>b.textContent.trim())}; }", w)
    print("card", json.dumps(card)); p.screenshot(path=S + w + "-" + hot.replace(' ','-') + "-card.png")
    if press and card:
        ok = p.evaluate("([w,t]) => { const d=[...document.querySelectorAll('#'+w+' .dss-room-card')][0]; const b=[...d.querySelectorAll('.fi-action, button, tw-link, a')].find(b=>b.textContent.trim()===t); if(!b) return false; b.click(); return true; }", [w, press])
        time.sleep(4)
        print("pressed", press, ok, "now at tags:", p.evaluate("() => document.querySelector('tw-passage')?.getAttribute('tags')"), "title:", p.evaluate("() => (document.querySelector('tw-passage')?.innerText||'').slice(0,80).replace(/\\n/g,' | ')"))
        p.screenshot(path=S + w + "-after-" + press.replace(' ','-')[:20] + ".png")
    print("errs", [e for e in errs if 'audio' not in e.lower()][:3]); b.close()
