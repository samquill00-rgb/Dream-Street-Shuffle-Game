"""tp_trial.py — load the Third Pillar (full mode), then try water/rim values live and measure the strip."""
import sys, json, os
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/audit-2026-09-16")
sys.path.insert(0, "/home/user/Dream-Street-Shuffle-Game/scratchpad/polish-loop-2026-09-22")
from harness import Game
from scene_check import G
from PIL import Image
SEEDS='(set: $inisToldOfPillars to true)(set: $dreamKey to "lighter")'
OUT=sys.argv[1] or "/tmp/claude-0/-home-user-Dream-Street-Shuffle-Game/719e52c5-416c-5991-b225-43acf8032dce/scratchpad/tp"
TRIALS=json.loads(sys.argv[2]) if len(sys.argv)>2 else [{}]
SET="""(o)=>{const r=window._dssThreeRegistry['tp-wrap']; let fl=null, rim=null;
r.scene.traverse(x=>{ if(x.isMesh&&x.geometry&&x.geometry.type==='PlaneGeometry'&&x.geometry.parameters.width===70) fl=x;
 if(x.isDirectionalLight&&x.position.z<-8) rim=x; });
if(o.rough!=null) fl.material.roughness=o.rough; if(o.metal!=null) fl.material.metalness=o.metal;
if(o.rim!=null) rim.intensity=o.rim; if(o.rimx!=null) rim.position.x=o.rimx; if(o.rimy!=null) rim.position.y=o.rimy; if(o.rimz!=null) rim.position.z=o.rimz;
let gold=null, whirl=null; r.scene.traverse(x=>{ if(x.isPointLight&&x.position.y>2) gold=x; if(x.isMesh&&x.geometry&&x.geometry.type==='CircleGeometry') whirl=x; });
if(o.hideFloor!=null) fl.visible=!o.hideFloor; if(o.hideWhirl!=null) whirl.visible=!o.hideWhirl;
if(o.goldScale!=null){ const L=gold; if(!L.__wrapped){ L.__wrapped=true; L.__i=L.intensity; Object.defineProperty(L,'intensity',{get(){return L.__i;},set(v){L.__i=v*(window.__tpGoldScale==null?1:window.__tpGoldScale);}}); } window.__tpGoldScale=o.goldScale; }
let cyan=null; r.scene.traverse(x=>{ if(x.isPointLight&&x.position.y<2) cyan=x; });
if(o.cyanScale!=null){ const L=cyan; if(!L.__wrapped){ L.__wrapped=true; L.__i=L.intensity; Object.defineProperty(L,'intensity',{get(){return L.__i;},set(v){L.__i=v*(window.__tpCyanScale==null?1:window.__tpCyanScale);}}); } window.__tpCyanScale=o.cyanScale; }
if(o.color!=null) fl.material.color.setHex(o.color);
window.__tpGold=gold;
if(o.cyany!=null) cyan.position.y=o.cyany;
if(o.refl!=null){ if(!window.__tpRefl){ const c=document.createElement('canvas'); c.width=64; c.height=256; const cx=c.getContext('2d'), w=64, h=256;
 var g=cx.createLinearGradient(0,0,w,0); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(0.32,'rgba(212,174,106,0.22)'); g.addColorStop(0.5,'rgba(240,208,144,0.85)'); g.addColorStop(0.68,'rgba(212,174,106,0.22)'); g.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle=g; cx.fillRect(0,0,w,h);
 var v=cx.createLinearGradient(0,0,0,h); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(0.18,'rgba(0,0,0,0.1)'); v.addColorStop(0.55,'rgba(0,0,0,0.55)'); v.addColorStop(1,'rgba(0,0,0,1)'); cx.globalCompositeOperation='destination-out'; cx.fillStyle=v; cx.fillRect(0,0,w,h);
 for(var rb=0;rb<22;rb++){ var ry=6+Math.random()*(h-12); cx.fillStyle='rgba(0,0,0,'+(0.25+Math.random()*0.5)+')'; cx.fillRect(0,ry,w,1+Math.random()*2.2); }
 const tex=new THREE.CanvasTexture(c); const m=new THREE.Mesh(new THREE.PlaneGeometry(1.5,6.2), new THREE.MeshBasicMaterial({map:tex, blending:THREE.AdditiveBlending, transparent:true, opacity:0.29, depthWrite:false})); m.rotation.x=-Math.PI/2; m.position.set(0,0.035,4.3); r.scene.add(m); window.__tpRefl=m; }
 window.__tpRefl.visible=!!o.refl; if(o.reflOp!=null) window.__tpRefl.material.opacity=o.reflOp; }
if(o.lights){ r.scene.traverse(x=>{ if(x.isLight){ const k=x.isAmbientLight?'amb':x.isDirectionalLight?(x.position.z<-8?'rim':'cool'):(x.position.y>2?'gold':'cyan'); if(o.lights[k]!=null){ if(!x.__w){ x.__w=true; x.__i=x.intensity; x.__s=1; x.__raw=x.__i; Object.defineProperty(x,'intensity',{get(){return x.__i;},set(v){x.__raw=v; x.__i=v*x.__s;}}); } x.__s=o.lights[k]; x.intensity=x.__raw; } } }); }
if(o.exposure!=null) r.renderer.toneMappingExposure=o.exposure;
if(o.info){ const keys=Object.keys(r); const mat=fl.material; return {keys, env:!!r.scene.environment, envMap:!!mat.envMap, emissive:mat.emissive&&mat.emissive.getHexString(), type:mat.type, comp:!!window.dssMakeComposer, tm:r.renderer.toneMapping, exp:r.renderer.toneMappingExposure, lights:(()=>{const L=[]; r.scene.traverse(x=>{if(x.isLight) L.push([x.type,x.color.getHexString(),+x.intensity.toFixed(2),x.position.toArray().map(v=>+v.toFixed(1))]);}); return L;})()}; }
return {rough:fl.material.roughness, metal:fl.material.metalness, rim:rim.intensity, gold:+gold.intensity.toFixed(2), floorVis:fl.visible, whirlVis:whirl.visible, color:fl.material.color.getHexString()}; }"""
def measure(path):
    im=Image.open(path).convert("RGB"); w,h=im.size
    # strip: centre column, from the plinth foot down to the frame edge
    box=im.crop((w//2-60, int(h*0.82), w//2+60, h)); px=list(box.getdata())
    lum=[0.2126*r+0.7152*g+0.0722*b for r,g,b in px]
    mx=max(lum); hot=sum(1 for l in lum if l>150); mean=sum(lum)/len(lum)
    fb=im.crop((0, int(h*0.78), w, h)); fp=list(fb.getdata()); fl=[0.2126*r+0.7152*g+0.0722*b for r,g,b in fp]
    return {"maxLum":round(mx), "hotPx":hot, "meanLum":round(mean,1), "floorMean":round(sum(fl)/len(fl),1)}
g=G(1280,900,"no-preference"); p=g.page("Third Pillar Portal", seeds=SEEDS, audit_header=False); Game.click(p,"BEGIN",900); p.wait_for_timeout(9000)
for i,tr in enumerate(TRIALS):
    st=p.evaluate(SET,tr); p.wait_for_timeout(400)
    shot=os.path.join(OUT,"trial%d.png"%i); p.query_selector("#tp-wrap").screenshot(path=shot)
    print(json.dumps({"trial":tr,"state":st,"strip":measure(shot),"errors":[e[:120] for e in p._errs if 'audio' not in e.lower()]}))
p.close(); g.close()
