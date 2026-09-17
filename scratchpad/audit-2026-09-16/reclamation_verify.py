import json
from harness import Game, URL
from playwright.sync_api import sync_playwright
ARGS=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
out={}
def snap(p): return p.evaluate("()=>window._rcDev?window._rcDev.snapshot():null")
def ban(p): return p.evaluate("()=>({banner:document.getElementById('rc-banner')?.textContent,op:document.getElementById('rc-banner')?.style.opacity,hud:document.getElementById('rc-hud')?.textContent})")
def errs(p): return {"pageErrors":[e for e in p._errs if 'audio' not in e.lower()],"console":[c for c in p._cons if 'textContent' not in c[1] and 'udio' not in c[1]][:8]}
class G(Game):
    def __init__(self,w=1280,h=900):
        self.pw=sync_playwright().start(); self.b=self.pw.chromium.launch(headless=True,executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome",args=ARGS); self.w,self.h=w,h
g=G()
p=g.b.new_page(viewport={"width":1280,"height":900}); p.goto(URL+"?dev=1",wait_until="domcontentloaded"); p.wait_for_timeout(400); p.close()
p=g.page("The Reclamation"); p.wait_for_timeout(2500)
out["boot"]={"dev":p.evaluate("()=>!!window.DSS_DEV"),"rcDev":p.evaluate("()=>!!window._rcDev"),"skipVisible":p.evaluate("()=>getComputedStyle(document.getElementById('rc-skip')).display")}
p.screenshot(path="reclaim/01_cover.png")
p.click("#rc-begin"); p.wait_for_timeout(3500)
out["afterBegin"]=snap(p); out["banner1"]=ban(p)
p.screenshot(path="reclaim/02_wave1.png")
# aim at the first live drone and fire
def shoot_first():
    return p.evaluate("""()=>{const d=window._rcDev;const m=d.machines().find(m=>m.alive);if(!m)return null;d.aimAt(m.hit);d.fire();return m.kind;}""")
k=shoot_first(); p.wait_for_timeout(500); s1=snap(p); out["shot1"]={"target":k,"after":{x:s1[x] for x in ("silenced","rounds","live")},"banner":ban(p)["banner"]}
p.screenshot(path="reclaim/03_shot.png")
# spend the clip to see reload
for i in range(5): p.evaluate("()=>window._rcDev.fire()"); p.wait_for_timeout(450)
out["reload"]={"snap":{x:snap(p)[x] for x in ("rounds","reloading")},"hud":ban(p)["hud"]}
p.wait_for_timeout(1700); out["reloaded"]={x:snap(p)[x] for x in ("rounds","reloading")}
# shoot a spirit
sp=p.evaluate("()=>{const d=window._rcDev;const s=d.spirits().find(s=>s.gone<=0);d.aimAt(s.hit);d.fire();return true;}"); p.wait_for_timeout(500)
out["spirit"]={"disturbed":snap(p)["disturbed"],"banner":ban(p)["banner"]}
p.screenshot(path="reclaim/04_spirit.png")
# spawn a rig and let it light up
p.evaluate("()=>{const m=window._rcDev.spawn('rig');m.z=-60;m.stopZ=-58;}"); p.wait_for_timeout(4500)
out["rig"]={"glare":snap(p)["glare"],"hud":ban(p)["hud"],"glareCss":p.evaluate("()=>document.getElementById('rc-glare').style.opacity")}
p.screenshot(path="reclaim/05_rig_glare.png")
# shoot the rig lamp then the rig
for i in range(2):
    p.evaluate("()=>{const d=window._rcDev;const m=d.machines().find(m=>m.alive&&m.kind==='rig');if(m){d.aimAt(m.hit);d.fire();}}"); p.wait_for_timeout(600)
out["rigDown"]={"silenced":snap(p)["silenced"],"glare":snap(p)["glare"],"banner":ban(p)["banner"]}
# crawler at the wall
p.evaluate("()=>{const m=window._rcDev.spawn('crawler');m.z=-40;window._rcDev.spawn('rig').z=-70;}"); p.wait_for_timeout(1500); p.screenshot(path="reclaim/06a_midfield.png"); p.evaluate("()=>{const m=window._rcDev.machines().find(m=>m.kind==='crawler'&&m.alive);if(m)m.z=-13;}"); p.wait_for_timeout(2500)
out["wall"]={"atWall":snap(p)["atWall"],"banner":ban(p)["banner"]}
p.screenshot(path="reclaim/06_crawler.png")
# dev E: silence everything live, then progress to win
p.keyboard.press("e"); p.wait_for_timeout(300)
for i in range(40):
    p.wait_for_timeout(600); s=snap(p)
    if s["ending"]>=0: break
    if s["live"]: p.keyboard.press("e")
out["progress"]={x:snap(p)[x] for x in ("silenced","wave","ending","endKind","spawned" if False else "queue")}
p.wait_for_timeout(4500); s=snap(p)
out["ending"]={"ending":s["ending"],"kind":s["endKind"],"finished":s["finished"],"win":p.evaluate("()=>getComputedStyle(document.getElementById('rc-win')).display"),"lose":p.evaluate("()=>getComputedStyle(document.getElementById('rc-lose')).display"),"hud":ban(p)["hud"]}
p.screenshot(path="reclaim/07_ending.png")
Game.click(p,"Stand before the sixth",1500)
out["teardown"]={"at":Game.name(p),"canvases":p.evaluate("()=>document.querySelectorAll('canvas').length"),"rcDev":p.evaluate("()=>!!window._rcDev"),"stage":p.evaluate("()=>document.querySelectorAll('.rc-stage').length"),"state":Game.snapshot(p)["state"][:80]}
out["errors"]=errs(p); p.close()
# lose by spirits
p=g.page("The Reclamation"); p.wait_for_timeout(2500); p.click("#rc-begin"); p.wait_for_timeout(1200)
shots=[]
for i in range(3):
    p.evaluate("()=>{const d=window._rcDev;const s=d.spirits().find(s=>s.gone<=0);d.aimAt(s.hit);d.fire();}"); p.wait_for_timeout(700); shots.append((snap(p)["disturbed"],ban(p)["banner"]))
out["loseShots"]=shots
p.wait_for_timeout(4200); s=snap(p)
out["loseSpirits"]={"disturbed":s["disturbed"],"kind":s["endKind"],"finished":s["finished"],"lose":p.evaluate("()=>getComputedStyle(document.getElementById('rc-lose')).display"),"hud":ban(p)["hud"]}
p.close()
# phone
g.w,g.h=390,780; p=g.page("The Reclamation"); p.wait_for_timeout(2500); p.click("#rc-begin"); p.wait_for_timeout(2000)
out["phone"]={"rcDev":bool(snap(p)),"bloom":snap(p)["bloom"],"scrollW":p.evaluate("()=>document.documentElement.scrollWidth"),"errors":errs(p)}
p.screenshot(path="reclaim/08_phone.png"); p.close(); g.close()
json.dump(out,open("reclaim/results.json","w"),indent=1); print(json.dumps(out,indent=0)[:6000])
