"""tp_verify.py — Third Pillar in full mode: desktop, phone 390 and reduced motion, with a probe for the reflection plane."""
import sys, json, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/polish-loop-2026-09-22")
from harness import Game
from scene_check import G, PROBE
SEEDS='(set: $inisToldOfPillars to true)(set: $dreamKey to "lighter")'
OUT="/mnt/project-files/polish-loop"
LIGHTS="(id)=>{const r=window._dssThreeRegistry[id]; const L=[]; r.scene.traverse(x=>{if(x.isLight) L.push([x.type,+x.intensity.toFixed(2),x.position.toArray().map(v=>+v.toFixed(1))]);}); return L;}"
def run(w,h,rm,secs,shot):
    g=G(w,h,rm); p=g.page("Third Pillar Portal", seeds=SEEDS, audit_header=False); Game.click(p,"BEGIN",900); p.wait_for_timeout(int(secs*1000))
    info={"mode":"%dx%d %s"%(w,h,rm),"full":p.evaluate("()=>!!document.querySelector('#dss-portal-action tw-link')"),
          "canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"scrollWidth":p.evaluate("()=>document.documentElement.scrollWidth"),
          "btn":p.evaluate("()=>{const b=[...document.querySelectorAll('#tp-wrap div')].find(d=>/STEP THROUGH|BACK TO/.test(d.textContent)); return b?b.textContent+' op='+b.style.opacity:null}"),
          "errors":[e[:200] for e in p._errs if 'audio' not in e.lower() and 'textContent' not in e],
          "lights":p.evaluate(LIGHTS,"tp-wrap"),
          "refl":[a for a in p.evaluate(PROBE,"tp-wrap") if a.get("w")==1.5]}
    p.query_selector("#tp-wrap").screenshot(path=shot); print(json.dumps(info)); p.close(); g.close()
run(1280,900,"no-preference",9,os.path.join(OUT,"pass8-thirdpillar-after.png"))
run(390,780,"no-preference",9,os.path.join(OUT,"pass8-thirdpillar-phone.png"))
run(1280,900,"reduce",2.5,os.path.join(OUT,"pass8-thirdpillar-reduced.png"))
