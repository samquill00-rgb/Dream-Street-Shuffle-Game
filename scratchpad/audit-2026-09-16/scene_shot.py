"""Screenshot an approach scene: python3 scene_shot.py "<passage>" <out.png> [seconds]
Waits for the canvas, reports canvases, JS errors, failed requests; screenshots the scene canvas' parent."""
import sys, json
from harness import Game, URL
from playwright.sync_api import sync_playwright
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
class G(Game):
    def __init__(self,w=1280,h=900):
        self.pw=sync_playwright().start(); self.b=self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS); self.w,self.h=w,h
name, out = sys.argv[1], sys.argv[2]; secs = float(sys.argv[3]) if len(sys.argv)>3 else 7
g=G(); p=g.page(name, audit_header=False); Game.click(p,"BEGIN",900); p.wait_for_timeout(int(secs*1000))
info={"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),
      "shimmer":p.evaluate("()=>!!document.querySelector('.dss-shimmer')"),
      "errors":[e[:200] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e],
      "net":[c for c in p._cons if 'udio' not in c[1] and 'favicon' not in c[1] and 'textContent' not in c[1]][:6]}
c=p.query_selector("canvas")
if c:
    wrap=p.evaluate_handle("(c)=>c.closest('.dss-scene-wrap, .approach-wrap, .scene-wrap, div')", c)
    wrap.as_element().scroll_into_view_if_needed(); wrap.as_element().screenshot(path=out)
else:
    p.screenshot(path=out)
print(json.dumps(info)); p.close(); g.close()
