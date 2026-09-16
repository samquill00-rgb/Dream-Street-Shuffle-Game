import json
from harness import Game, URL
from playwright.sync_api import sync_playwright
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
out={}
def snap(p): return p.evaluate("()=>window._hcDev?window._hcDev.snapshot():null")
def ban(p): return p.evaluate("()=>({banner:document.getElementById('hc-banner')?.textContent, op:document.getElementById('hc-banner')?.style.opacity, hud:document.getElementById('hc-hud')?.textContent})")
def errs(p): return {"pageErrors":[e for e in p._errs if 'audio' not in e.lower()], "console":[c for c in p._cons if 'textContent' not in c[1] and 'Audio' not in c[1] and 'audio' not in c[1]][:10]}
def waitWhirlEnd(p,maxms=5000):
    t=0
    while t<maxms:
        p.wait_for_timeout(100); t+=100
        if not snap(p)["whirl"]: return t
    return -1
class G(Game):
    def __init__(self,w=1280,h=900):
        self.pw=sync_playwright().start(); self.b=self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS); self.w,self.h=w,h
g=G()
p=g.b.new_page(viewport={"width":1280,"height":900}); p.goto(URL+"?dev=1",wait_until="domcontentloaded"); p.wait_for_timeout(400); p.close()
p=g.page("The Climb"); p.wait_for_timeout(2500)
p.click("#hc-begin"); p.wait_for_timeout(600)
# 1 real wind drift: ridge 70 then plateau 57
for label,at in (("ridge70",70),("plateau57",57)):
    p.evaluate("()=>window._hcDev.calm(true)"); p.evaluate("(a)=>window._hcDev.warp(a)",at); waitWhirlEnd(p); p.evaluate("(a)=>window._hcDev.warp(a)",at); p.wait_for_timeout(100)
    p.evaluate("()=>window._hcDev.calm(false)")
    tr=[]
    for i in range(7):
        sn=snap(p); tr.append({"t":i*.5,"u":round(sn["u"],2),"wind":round(sn["wind"],2),"gust":sn["gust"],"width":round(sn["width"],1),"plateau":sn["plateau"],"whirl":sn["whirl"],"slips":sn["slips"]}); p.wait_for_timeout(500)
    out["drift_"+label]=tr
    out["hud_"+label]=ban(p)["hud"]
p.screenshot(path="climb/p3_01_plateau.png")
# 2 whirlwind
p.evaluate("()=>window._hcDev.calm(true)"); waitWhirlEnd(p); p.evaluate("()=>window._hcDev.warp(75)"); p.wait_for_timeout(150)
b=snap(p); p.evaluate("()=>window._hcDev.shove(9)")
tr=[]
for i in range(12):
    p.wait_for_timeout(250); sn=snap(p); tr.append({"t":round((i+1)*.25,2),"whirl":sn["whirl"],"s":round(sn["s"],1),"u":round(sn["u"],2),"y":round(sn["y"],1),"slips":sn["slips"]})
    if i==2: p.screenshot(path="climb/p3_02_whirl.png"); tr[-1]["banner"]=ban(p)["banner"]
    if not sn["whirl"] and i>1: break
out["whirl"]={"before":{"s":round(b["s"],1),"slips":b["slips"],"checkpoint":b["checkpoint"]},"trace":tr,"after":{k:snap(p)[k] for k in ("s","u","slips","checkpoint","whirl","grounded")}}
# 3 avalanche, standing still, no jump
p.evaluate("()=>window._hcDev.warp(53)"); p.wait_for_timeout(150); b=snap(p); p.evaluate("()=>window._hcDev.avalanche()")
tr=[]; shot=False
for i in range(24):
    p.wait_for_timeout(250); sn=snap(p); bn=ban(p)
    tr.append({"t":round((i+1)*.25,2),"phase":sn["avalanche"],"front":round(sn["avalancheFront"],1),"s":round(sn["s"],1),"slips":sn["slips"],"whirl":sn["whirl"],"banner":bn["banner"],"op":bn["op"]})
    if i==3: p.screenshot(path="climb/p3_03_avalanche_warning.png")
    if sn["avalanche"]=="running" and not shot: p.screenshot(path="climb/p3_04_avalanche_running.png"); shot=True
    if sn["whirl"]: break
out["avalanche_stand"]={"before":{"s":round(b["s"],1),"slips":b["slips"]},"trace":tr}
waitWhirlEnd(p)
# 4 avalanche, walking forward, jump on cue
p.evaluate("()=>window._hcDev.warp(53)"); p.wait_for_timeout(150); b=snap(p); p.evaluate("()=>window._hcDev.avalanche()")
p.keyboard.down("ArrowUp"); jumped=False; tr=[]
for i in range(160):
    p.wait_for_timeout(50); bn=ban(p)["banner"]; sn=snap(p)
    if bn=="JUMP" and not jumped: p.wait_for_timeout(250); p.keyboard.press(" "); jumped=True; tr.append({"cueAt":round(i*.05,2),"s":round(sn["s"],1),"front":round(sn["avalancheFront"],1)})
    if sn["avalanche"]=="idle" and i>20: break
    if sn["whirl"]: tr.append({"HIT":True}); break
p.keyboard.up("ArrowUp"); sn=snap(p)
out["avalanche_jump"]={"before":b["slips"],"after":sn["slips"],"jumped":jumped,"trace":tr,"s":round(sn["s"],1)}
waitWhirlEnd(p)
# 5 ending
p.keyboard.press("e"); p.wait_for_timeout(200); p.keyboard.down("ArrowUp"); p.wait_for_timeout(2500); p.keyboard.up("ArrowUp"); p.wait_for_timeout(9500)
sn=snap(p)
out["ending"]={"ending":sn and sn["ending"],"finished":sn and sn["finished"],"slips":sn and sn["slips"],"prints":sn and sn["prints"],"win":p.evaluate("()=>getComputedStyle(document.getElementById('hc-win')).display"),"lose":p.evaluate("()=>getComputedStyle(document.getElementById('hc-lose')).display")}
p.screenshot(path="climb/p3_06_ending.png")
Game.click(p,"Into the cave",1200)
out["teardown"]={"at":Game.name(p),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"hcDev":p.evaluate("()=>!!window._hcDev"),"stage":p.evaluate("()=>document.querySelectorAll('.hc-stage').length")}
out["errors"]=errs(p); p.close()
g.w,g.h=390,780; p=g.page("The Climb"); p.wait_for_timeout(2500); p.click("#hc-begin"); p.wait_for_timeout(1500); sn=snap(p)
out["phone"]={"hcDev":bool(sn),"errors":errs(p)}; p.screenshot(path="climb/p3_07_phone.png"); p.close(); g.close()
json.dump(out,open("climb/p3c_results.json","w"),indent=1); print(json.dumps(out))
