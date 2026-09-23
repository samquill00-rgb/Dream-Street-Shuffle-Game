import sys, json, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
from harness import Game
from scene_check import G, PROBE
SEEDS='(set: $inisToldOfPillars to true)(set: $dreamKey to "lighter")'
def run(rm, secs, shot):
    g=G(1280,900,rm); p=g.page("Third Pillar Portal", seeds=SEEDS, audit_header=False); Game.click(p,"BEGIN",900); p.wait_for_timeout(int(secs*1000))
    info={"mode":rm,"full":p.evaluate("()=>!!document.querySelector('#dss-portal-action tw-link')"),
          "btn":p.evaluate("()=>{const b=[...document.querySelectorAll('#tp-wrap div')].find(d=>/STEP THROUGH|BACK TO/.test(d.textContent)); return b?b.textContent+' op='+b.style.opacity:null}"),
          "pillarY":p.evaluate("(id)=>{const r=window._dssThreeRegistry[id]; let y=null; r.scene.traverse(o=>{if(o.type==='Group'&&o.children.length===5&&o.position.y<=0.001&&o.position.y>-6) y=+o.position.y.toFixed(3)}); return y}", "tp-wrap"),
          "errors":[e[:200] for e in p._errs if 'audio' not in e.lower()],
          "additivePlanes":p.evaluate(PROBE,"tp-wrap")}
    p.query_selector("#tp-wrap").screenshot(path=shot); print(json.dumps(info)); p.close(); g.close()
run("no-preference", 9, "/mnt/project-files/polish-loop/pass7-thirdpillar-after.png")
run("reduce", 2.5, "/mnt/project-files/polish-loop/pass7-thirdpillar-reduced.png")
