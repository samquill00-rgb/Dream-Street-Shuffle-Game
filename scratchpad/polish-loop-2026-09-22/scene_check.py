"""scene_check.py "<passage>" <wrap-id> <tag> — desktop shot + registry probe, phone 390 overflow, reduced-motion run."""
import sys, json, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
from playwright.sync_api import sync_playwright
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
OUT="/mnt/project-files/polish-loop"
name, wrap, tag = (sys.argv+["","",""])[1:4]
class BP:
    def __init__(s,b,rm): s.b=b; s.rm=rm
    def new_page(s, **kw): return s.b.new_page(reduced_motion=s.rm, **kw)
    def close(s): s.b.close()
class G(Game):
    def __init__(self,w,h,rm="no-preference"):
        self.pw=sync_playwright().start()
        self.b=BP(self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS), rm)
        self.w,self.h=w,h
PROBE="""(id)=>{const r=window._dssThreeRegistry&&window._dssThreeRegistry[id]; if(!r||!r.scene) return 'no registry '+id; const out=[];
r.scene.traverse(o=>{ if(o.isMesh && o.material && o.material.blending===2 && o.geometry && o.geometry.type==='PlaneGeometry'){ const p=o.geometry.parameters; const wp=o.getWorldPosition(new THREE.Vector3());
 out.push({w:p.width,h:p.height,pos:[+wp.x.toFixed(2),+wp.y.toFixed(2),+wp.z.toFixed(2)],op:+o.material.opacity.toFixed(3),vis:o.visible,map:!!o.material.map}); } }); return out; }"""
def run(w,h,rm,secs,shot=None):
    g=G(w,h,rm); p=g.page(name, audit_header=False); Game.click(p,"BEGIN",900); p.wait_for_timeout(int(secs*1000))
    info={"mode":"%dx%d %s"%(w,h,rm),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),
          "scrollWidth":p.evaluate("()=>document.documentElement.scrollWidth"),
          "errors":[e[:200] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e],
          "net":[c for c in p._cons if 'udio' not in c[1] and 'favicon' not in c[1] and 'textContent' not in c[1]][:6],
          "additivePlanes":p.evaluate(PROBE, wrap)}
    if shot:
        el=p.query_selector("#"+wrap)
        (el or p).screenshot(path=shot)
    print(json.dumps(info)); p.close(); g.close()
if __name__=="__main__":
  run(1280,900,"no-preference",9,os.path.join(OUT,"pass7-%s-after.png"%tag))
  run(390,780,"no-preference",6)
  run(1280,900,"reduce",3,os.path.join(OUT,"pass7-%s-reduced.png"%tag))
