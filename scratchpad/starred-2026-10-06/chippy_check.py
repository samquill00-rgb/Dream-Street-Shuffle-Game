"""Chippy: the exit link under the bar, the room's door card offering it, and the exit working. Args: [W H]"""
import sys, time, urllib.parse, json
from playwright.sync_api import sync_playwright
W = int(sys.argv[1]) if len(sys.argv) > 1 else 1440; H = int(sys.argv[2]) if len(sys.argv) > 2 else 900
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=" + urllib.parse.quote("Chinese Fish and Chips")
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
S = "/home/user/Dream-Street-Shuffle-Game/scratchpad/starred-2026-10-06/shots2/"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": W, "height": H}); p = c.new_page(); errs=[]
    p.on("pageerror", lambda e: errs.append(str(e)[:160]))
    p.goto(URL)
    try: p.wait_for_selector("#cf-wrap canvas", timeout=90000)
    except Exception as e: print("no room canvas", e)
    time.sleep(5)
    info = p.evaluate("""() => { const l=document.querySelector('.header-links .back-one-link tw-link'); const r=l&&l.getBoundingClientRect(); return {tags: document.querySelector('tw-passage')?.getAttribute('tags'), exit: l&&l.textContent.trim(), exitBox: r&&[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)], visible: !!(l&&l.getClientRects().length)}; }""")
    print("room", json.dumps(info)); p.screenshot(path=S+"chippy-room-%dx%d.png"%(W,H))
    # open the door's close-up card: the kit exposes hotspots? click the door by its halo via the kit's API if present, else via a text probe
    opened = p.evaluate("""() => { const k=window.dssRoomKitOpen||null; return !!k; }""")
    # try the kit's debug: find a card button list after clicking the door hotspot through the registered scene
    res = p.evaluate("""() => { const w=document.getElementById('cf-wrap'); if(!w) return 'no wrap'; const api=w.__dssRoom||window.__dssRooms&&window.__dssRooms.cf; return api?Object.keys(api).slice(0,12):'no api'; }""")
    print("api", res)
    print("errs", [e for e in errs if 'audio' not in e.lower()][:3]); b.close()
