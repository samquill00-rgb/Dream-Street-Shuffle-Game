"""Shot of any passage via the debug jump. Args: OUTFILE passage [W H] [reduced] [wait_ms] [clickText]"""
import sys, time, urllib.parse, json
from playwright.sync_api import sync_playwright
out, pas = sys.argv[1], sys.argv[2]
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1440; H = int(sys.argv[4]) if len(sys.argv) > 4 else 900
reduced = len(sys.argv) > 5 and sys.argv[5] == "reduced"
wait = int(sys.argv[6]) if len(sys.argv) > 6 else 3500
click = sys.argv[7] if len(sys.argv) > 7 else None
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=" + urllib.parse.quote(pas)
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": W, "height": H}, reduced_motion="reduce" if reduced else "no-preference", device_scale_factor=1)
    p = c.new_page(); errs = []
    p.on("pageerror", lambda e: errs.append(str(e)[:200]))
    p.goto(URL); time.sleep(wait / 1000)
    if click:
        ok = p.evaluate("(t)=>{const e=[...document.querySelectorAll('tw-link')].find(e=>e.textContent.trim()===t); if(!e) return false; e.click(); return true;}", click)
        print("click", click, ok); time.sleep(4)
    info = p.evaluate("() => ({tags: document.querySelector('tw-passage')?.getAttribute('tags'), links: [...document.querySelectorAll('tw-link')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()).slice(0,12), bq: [...document.querySelectorAll('blockquote')].map(b=>{const r=b.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]})})")
    print(json.dumps(info)); print("errs", [e for e in errs if 'audio' not in e.lower()][:3])
    p.screenshot(path=out); b.close()
