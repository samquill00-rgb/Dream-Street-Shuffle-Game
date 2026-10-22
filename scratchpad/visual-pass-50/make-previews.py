from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text();out=Path('scratchpad/visual-pass-50')
ka=s.index('// >>>> DSS ROOM KIT BEGIN');kb=s.index('// <<<< DSS ROOM KIT END',ka);kit=s[ka:kb]
helper=Path('scratchpad/visual-pass-50/prop-helper.js').read_text()
prefix='''<!doctype html><meta charset="utf-8"><base href="/"><style>body{margin:0;background:#15100b}#errors{position:fixed;top:0;z-index:99999;color:red;background:white;font:20px monospace}</style><body><div id="errors"></div><div id="CONTAINER"></div><script src="vendor/three/three.min.js"></script><script>
window.onerror=function(m){document.getElementById('errors').textContent+=m+' ';};window.dssSceneFailed=function(e){document.getElementById('errors').textContent+=e.message;};
window._dssThreeRegistry={};window._dssBindScene=function(id,s,r,c){window._dssThreeRegistry[id]={resize:function(){}};};window._dssDisposeWrap=function(){};
window.dssGhostTex=function(tex){return tex(16,16,function(){});};window.dssRoomScope=function(){return document.body;};window.dssStreetExit=function(){return [];};
window.dssWayOutArrow=function(){};window.dssRoomPlay=function(o){var target=new THREE.Vector3();var nav=document.createElement('div');nav.style.cssText='position:fixed;bottom:0;left:0;z-index:99998;background:#18140f;color:#ddc9a7';document.body.appendChild(nav);(o.HOTSPOTS||[]).forEach(function(h){if(!h.pos||!h.tgt)return;var b=document.createElement('button');b.textContent=h.name;b.style.cssText='font:11px Georgia;color:#ddc9a7;background:#242018;border:1px solid #544a36';b.onclick=function(){o.camera.position.fromArray(h.pos);target.fromArray(h.tgt);o.camera.lookAt(target);};nav.appendChild(b);});return {words:{},halo:{},curTarget:target,frame:function(){},withGlowsHidden:function(fn){fn();}};};
</script><script>'''
for name,slug,cid,mode in [('THE COLONY','colony','ci','old'),('THE PILLARS','pillars','pi','old'),("COPPER'S CELLAR",'cellar','cu','kit'),("LACKLAND'S OFFICE",'office','lk','kit'),("O'FLATTERLY'S",'bookshop','oi','kit')]:
 a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);block=s[a:b]
 (out/(slug+'.html')).write_text(prefix.replace('CONTAINER',cid+'-container')+helper+(kit if mode=='kit' else '')+block+'</script>')
# Save modified blocks for standalone syntax checks with Node, if available.
for name in ['THE COLONY','THE PILLARS',"COPPER'S CELLAR","LACKLAND'S OFFICE","O'FLATTERLY'S"]:
 a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20)
 (out/(name.replace(' ','-').replace("'",'')+'.js')).write_text(s[a:b])
