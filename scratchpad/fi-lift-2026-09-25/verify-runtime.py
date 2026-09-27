from pathlib import Path
import sys,types,json
root=Path('/Users/samquill/Claude work/Dream Street Shuffle - Game Files')
PERF_JS='''(() => {
const idDesc=Object.getOwnPropertyDescriptor(Element.prototype,'id');
Object.defineProperty(Element.prototype,'id',{...idDesc,set(v){if(v==='fi-wrap')window.fiStarted=performance.now();idDesc.set.call(this,v);}});
let bind;
Object.defineProperty(window,'_dssBindScene',{configurable:true,get(){return bind;},set(fn){bind=function(id,scene,renderer,camera){const out=fn.apply(this,arguments);if(id==='fi-wrap'){const render=renderer.render;renderer.render=function(s,c){const main=!renderer.getRenderTarget();const out=render.apply(this,arguments);if(main && !window.fiBuildMs) window.fiBuildMs=performance.now()-window.fiStarted;return out;};}return out;};}});
})()'''
src=(root/'scratchpad/audit-2026-09-16/harness.py').read_text().replace('/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee',str(root/'Dream Street Shuffle.twee')).replace('/opt/pw-browsers/chromium-1194/chrome-linux/chrome','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome').replace('errs = []','p.add_init_script('+repr(PERF_JS)+')\n        errs = []')
src=src.replace('self.b.new_page(viewport=', 'self.b.new_page(device_scale_factor=3, viewport=')
if 'reduced' in sys.argv: src=src.replace('p.goto(URL,', "p.emulate_media(reduced_motion='reduce')\n        p.goto(URL,")
h=types.ModuleType('harness');exec(compile(src,'harness-local','exec'),h.__dict__)
g=h.Game(width=390 if 'phone' in sys.argv else 1280,height=780 if 'phone' in sys.argv else 900)
p=g.page('Inside the French','')
if 'reduced' in sys.argv: p.emulate_media(reduced_motion='reduce')
h.Game.click(p,'BEGIN',1200); p.wait_for_selector('#fi-wrap canvas'); p.wait_for_timeout(1600)
metrics=p.evaluate('''() => {
const e=window._dssThreeRegistry['fi-wrap']; const r=e.renderer, scene=e.scene, cam=e.camera;
const positions={phone:[-3.44,1.33,-0.35],bar:[-1.7,1.2,0.5],door:[2.45,1.3,-4.4]};
const projected={};for(const [key,xyz] of Object.entries(positions)){const v=new THREE.Vector3(...xyz).project(cam);projected[key]={x:(v.x+1)*innerWidth/2,y:(1-v.y)*innerHeight/2,inFrame:Math.abs(v.x)<1&&Math.abs(v.y)<1};}
const gl=r.getContext();const debug=gl.getExtension('WEBGL_debug_renderer_info');
return {buildMs:window.fiBuildMs,pixelRatio:r.getPixelRatio(),drawCalls:r.info.render.calls,triangles:r.info.render.triangles,textureCount:r.info.memory.textures,geometryCount:r.info.memory.geometries,programs:r.info.programs.length,glError:gl.getError(),gpu:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):null,projected};
}''')
assert metrics['projected']['phone']['inFrame'] and metrics['projected']['bar']['inFrame'],metrics
assert metrics['glError']==0,metrics
assert metrics['buildMs']<2000,metrics
# Check advertised pixel ratio limits on an emulated high-density viewport.
p.evaluate('''() => { const e=window._dssThreeRegistry['fi-wrap']; window.fixtureScene=e.scene; window.fixtureRenderer=e.renderer; window.fixtureDispose={geometry:0,material:0,texture:0}; const seen=new Set(); e.scene.traverse(o=>{if(o.geometry&&!seen.has(o.geometry)){seen.add(o.geometry);o.geometry.addEventListener('dispose',()=>window.fixtureDispose.geometry++);} const ms=Array.isArray(o.material)?o.material:[o.material];ms.filter(Boolean).forEach(m=>{if(!seen.has(m)){seen.add(m);m.addEventListener('dispose',()=>window.fixtureDispose.material++);}Object.values(m).filter(x=>x&&x.isTexture).forEach(t=>{if(!seen.has(t)){seen.add(t);t.addEventListener('dispose',()=>window.fixtureDispose.texture++);}});});});}''')
snapshot='''() => {const e=window._dssThreeRegistry['fi-wrap'];return {camera:e.camera.position.toArray(),lights:e.scene.children.filter(o=>o.isPointLight).map(o=>o.intensity),dust:e.scene.children.filter(o=>o.isPoints).map(o=>Array.from(o.geometry.attributes.position.array)),sprites:e.scene.children.filter(o=>o.isSprite).map(o=>o.material.opacity)};}'''
first=p.evaluate(snapshot);p.wait_for_timeout(800);second=p.evaluate(snapshot)
metrics['motionFrozen']=first==second
if 'reduced' in sys.argv: assert metrics['motionFrozen'], 'Reduced motion moved'
else: assert not metrics['motionFrozen'], 'No animated atmosphere'
# Genuine viewport pointer/touch events for the phone, then step back.
phone=metrics['projected']['phone'];p.dispatch_event('#fi-wrap canvas','pointerdown',{'clientX':phone['x'],'clientY':phone['y'],'pointerType':'touch','bubbles':True})
p.wait_for_function("document.getElementById('fi-wrap').dataset.cam==='inspect'")
metrics['touchPhoneCard']=p.locator('#fi-wrap').inner_text().find('[Sam: the phone that rings]')>=0
assert metrics['touchPhoneCard']
p.dispatch_event('#fi-wrap canvas','pointerdown',{'clientX':8,'clientY':8,'pointerType':'touch','bubbles':True});p.wait_for_function("document.getElementById('fi-wrap').dataset.cam==='idle'")
# Direct bar hotspot, independently of TO THE BAR button.
x,y=p.evaluate("() => {const e=window._dssThreeRegistry['fi-wrap'];const v=new THREE.Vector3(-1.7,0.65,0.5).project(e.camera);return [(v.x+1)*innerWidth/2,(1-v.y)*innerHeight/2];}")
p.dispatch_event('#fi-wrap canvas','pointerdown',{'clientX':x,'clientY':y,'pointerType':'touch','bubbles':True})
p.wait_for_function("!document.getElementById('fi-wrap')",timeout=10000)
metrics['barLanded']=h.Game.name(p);metrics['disposal']=p.evaluate('''() => ({...window.fixtureDispose,registryGone:!window._dssThreeRegistry['fi-wrap'],contextLost:window.fixtureRenderer.getContext().isContextLost()})''')
assert metrics['barLanded']=='The French' and metrics['disposal']['registryGone']
metrics['errors']=p._errs;metrics['consoleErrors']=[v for k,v in p._cons if k=='error'];assert not metrics['errors'],metrics['errors']
print(json.dumps(metrics,indent=2));g.close()
