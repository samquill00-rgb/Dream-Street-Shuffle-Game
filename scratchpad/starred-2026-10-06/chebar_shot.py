"""Shot of the Plain of Chebar scene. Args: OUTFILE [W H] [reduced]"""
import sys, time
from playwright.sync_api import sync_playwright
out = sys.argv[1]; W = int(sys.argv[2]) if len(sys.argv) > 2 else 1440; H = int(sys.argv[3]) if len(sys.argv) > 3 else 900
reduced = len(sys.argv) > 4 and sys.argv[4] == "reduced"
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=The%20Plain%20of%20Chebar"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": W, "height": H}, reduced_motion="reduce" if reduced else "no-preference", device_scale_factor=1)
    p = c.new_page(); errs = []
    p.on("pageerror", lambda e: errs.append(str(e)[:200]))
    p.on("console", lambda m: errs.append(m.text[:200]) if m.type == "error" else None)
    p.goto(URL); p.wait_for_selector("#pc-wrap canvas", timeout=60000); time.sleep(6)
    p.screenshot(path=out)
    # sample a column of pixels down the middle-right of the canvas for the horizon band
    print("errs", errs[:3])
    b.close()
