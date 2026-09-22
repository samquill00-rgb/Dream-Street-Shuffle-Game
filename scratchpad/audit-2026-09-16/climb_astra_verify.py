import json
from harness import Game, URL
from playwright.sync_api import sync_playwright
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
out={}
def snap(p): return p.evaluate("()=>window._hcDev?window._hcDev.snapshot():null")
def ban(p): return p.evaluate("()=>({banner:document.getElementById('hc-banner')?.textContent,op:document.getElementById('hc-banner')?.style.opacity,hud:document.getElementById('hc-hud')?.textContent})")
def errs(p): return {"pageErrors":[e for e in p._errs if 'audio' not in e.lower()],"console":[c for c in p._cons if 'textContent' not in c[1] and 'udio' not in c[1]][:8]}
class G(Game):
    def __init__(self,w=1280,h=900):
        self.pw=sync_playwright().start(); self.b=self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS); self.w,self.h=w,h
def fresh(g):
    p=g.page("The Climb"); p.wait_for_timeout(2500); p.click("#hc-begin"); p.wait_for_timeout(600); return p
g=G()
p=g.b.new_page(viewport={"width":1280,"height":900}); p.goto(URL+"?dev=1",wait_until="domcontentloaded"); p.wait_for_timeout(400); p.close()
# 1 gap lips + shader compiled + snow count
p=fresh(g)
out["scene"]=p.evaluate("""()=>{let lines=0,pts=0;window._hcDev;return {lipsPresent:!!document.getElementById('hc-canvas'),drawCalls:window._hcDev.snapshot().drawCalls}}""")
p.evaluate("()=>window._hcDev.calm(true)"); p.evaluate("()=>window._hcDev.warp(28)"); p.wait_for_timeout(400)
out["gapHud"]=ban(p)["hud"]; p.screenshot(path="climb/astra_01_gap.png")
# 2 cornice: walk from 222 holding up; watch banner and cornice break
p.evaluate("()=>window._hcDev.warp(221)"); p.wait_for_timeout(300)
p.keyboard.down("ArrowUp"); tr=[]
for i in range(30):
    p.wait_for_timeout(100); s=snap(p); b=ban(p)["banner"]; tr.append((round(s["s"],1),s["corniceBroken"],b,s["whirl"]))
    if s["whirl"] or s["s"]>232: break
p.keyboard.up("ArrowUp"); out["cornice"]=tr[::3]+[tr[-1]]
# 3 natural avalanche, standing still at 60: hit -> whirl -> lands no farther uphill
p.close(); p=fresh(g); p.evaluate("()=>window._hcDev.calm(true)"); p.evaluate("()=>window._hcDev.warp(60)"); p.wait_for_timeout(300)
tr=[]
for i in range(60):
    p.wait_for_timeout(250); s=snap(p); b=ban(p)["banner"]
    tr.append((round(i*.25+.25,2),s["avalanche"],round(s["avalancheFront"],1),round(s["s"],1),s["slips"],s["whirl"],b))
    if i==6: p.screenshot(path="climb/astra_02_warning.png")
    if s["whirl"]: break
land=None
for i in range(40):
    p.wait_for_timeout(100); s=snap(p)
    if not s["whirl"]: land={"s":round(s["s"],1),"u":round(s["u"],2),"grounded":s["grounded"],"wind":s["wind"],"banner":ban(p)["banner"]}; break
out["avalanche_stand"]={"trace":tr[::4]+[tr[-1]],"landed":land}
# 4 natural avalanche walking in, jump on cue
p.close(); p=fresh(g); p.evaluate("()=>window._hcDev.calm(true)"); p.evaluate("()=>window._hcDev.warp(50)"); p.wait_for_timeout(300)
p.keyboard.down("ArrowUp"); jumped=False; log=[]
for i in range(240):
    p.wait_for_timeout(50); s=snap(p); b=ban(p)["banner"]
    if b.startswith("JUMP") and not jumped: p.wait_for_timeout(200); p.keyboard.down(" "); p.wait_for_timeout(250); p.keyboard.up(" "); jumped=True; log.append({"cueAt_s":round(s["s"],1),"front":round(s["avalancheFront"],1)})
    if s["whirl"]: log.append({"HIT":True}); break
    if jumped and s["avalanche"]=="idle": break
p.keyboard.up("ArrowUp"); s=snap(p); out["avalanche_jump"]={"jumped":jumped,"log":log,"slips":s["slips"],"s":round(s["s"],1)}
# 5 wind push cap and ending screenshots (mid and dawn) for the sheen
p.close(); p=fresh(g); p.evaluate("()=>window._hcDev.warp(300)"); p.wait_for_timeout(2500); p.screenshot(path="climb/astra_03_high.png")
p.evaluate("()=>window._hcDev.warp(425)"); p.wait_for_timeout(2500); p.screenshot(path="climb/astra_04_dawn.png")
out["errors"]=errs(p); p.close()
g.w,g.h=390,780; p=fresh(g); p.wait_for_timeout(1500); out["phone"]={"ok":bool(snap(p)),"errors":errs(p)}; p.screenshot(path="climb/astra_05_phone.png"); p.close(); g.close()
json.dump(out,open("climb/astra_results.json","w"),indent=1); print(json.dumps(out))
