"""Seeded shots of the Chebar scene with tuning variants. Args: OUTDIR label tuneJSON [W H] [reduced]"""
import sys, time, json
from playwright.sync_api import sync_playwright
OUT, label, tune = sys.argv[1], sys.argv[2], sys.argv[3]
W = int(sys.argv[4]) if len(sys.argv) > 4 else 1440; H = int(sys.argv[5]) if len(sys.argv) > 5 else 900
reduced = len(sys.argv) > 6 and sys.argv[6] == "reduced"
URL = "http://localhost:8777/Dream%20Street%20Shuffle.html?dev=1#dss-debug-jump=The%20Plain%20of%20Chebar"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
SEED = "(function(){var a=0x9e3779b9;Math.random=function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();"
with sync_playwright() as pw:
    b = pw.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    c = b.new_context(viewport={"width": W, "height": H}, reduced_motion="reduce" if reduced else "no-preference", device_scale_factor=1)
    c.add_init_script(SEED + "window.__pcTune=" + tune + ";")
    p = c.new_page(); errs = []
    p.on("pageerror", lambda e: errs.append(str(e)[:200]))
    p.goto(URL); p.wait_for_selector("#pc-wrap canvas", timeout=60000); time.sleep(6)
    path = "%s/%s-%dx%d%s.png" % (OUT, label, W, H, "-reduced" if reduced else "")
    p.screenshot(path=path); print(path, "errs", [e for e in errs if 'audio' not in e.lower()][:3])
    b.close()
