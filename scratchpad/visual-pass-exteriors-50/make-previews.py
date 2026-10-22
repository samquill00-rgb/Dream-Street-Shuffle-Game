from pathlib import Path
s=Path('Dream Street Shuffle.twee').read_text();out=Path('scratchpad/visual-pass-exteriors-50')
ka=s.index('// ====== dssScene —');kb=s.index('// ====== SHARED THREE.JS DISPOSAL',ka);kit=s[ka:kb]
helper=Path('scratchpad/visual-pass-exteriors-50/helper.js').read_text()
prefix='''<!doctype html><meta charset="utf-8"><base href="/"><style>body{margin:0;background:#15100b}#errors{position:fixed;top:0;left:0;z-index:99999;color:red;background:white;font:18px monospace}#views{position:fixed;bottom:0;left:0;z-index:99998}button{font:12px Georgia;color:#ddc9a7;background:#242018;border:1px solid #544a36}</style><body><div id="errors"></div><tw-passage><div id="CONTAINER"></div></tw-passage><div id="views"></div><script src="vendor/three/three.min.js"></script><script>
window.onerror=function(m){document.getElementById('errors').textContent+=m+' ';};window.dssSceneFailed=function(e){document.getElementById('errors').textContent+=e.message;};
window._dssThreeRegistry={};window._dssBindScene=function(id,s,r,c){window._dssThreeRegistry[id]={resize:function(){}};
var view=null,render=r.render.bind(r);r.render=function(scene,camera){if(view&&camera===c){c.position.fromArray(view.pos);c.lookAt(new THREE.Vector3().fromArray(view.tgt));}return render(scene,camera);};
VIEWS.forEach(function(v){var b=document.createElement('button');b.textContent=v.name;b.onclick=function(){view=v;};document.getElementById('views').appendChild(b);});};window._dssDisposeWrap=function(){};
</script><script>'''
items=[
('ginger','// ====== GINGER LIGHT SCENE','// ====== SOHO SQUARE','ga',[{'name':'Phone box','pos':[-0.4,2,-1.8],'tgt':[-2.2,1.6,-5.2]},{'name':'Road covers','pos':[0,1.5,4.5],'tgt':[-1.5,0.1,1.5]}]),
('french','// ====== FRENCH HOUSE SCENE',"// ====== THE ROOM'S WORDS",'fh',[{'name':'Entrance','pos':[0.5,1.5,4.8],'tgt':[-1.1,1.2,0.4]},{'name':'Hanging sign','pos':[6,4.3,6],'tgt':[4.5,4,1.5]}]),
('coach','// ====== COACH AND HORSES SCENE','// ====== PILLARS OF HERCULES SCENE','ch',[{'name':'Greek Street entrance','pos':[4.2,1.8,-0.8],'tgt':[0.25,1.5,-2.5]},{'name':'Hanging sign','pos':[4,4.2,-0.7],'tgt':[1.2,3.8,-4.2]}]),
('pillars','// ====== PILLARS OF HERCULES SCENE',"// ====== LACKLAND'S OFFICE SCENE",'ph',[{'name':'Pub entrance','pos':[2,1.6,5],'tgt':[0.7,1.4,0.7]},{'name':'Map shop','pos':[-6,1.8,5],'tgt':[-6,1.7,0.6]},{'name':'Right shop','pos':[7,1.8,5],'tgt':[7,1.7,0.6]}]),
('ronnie',"// ====== RONNIE SCOTT'S SCENE","// ====== COPPER'S LAIR SCENE",'rs',[{'name':'Entrance','pos':[1.2,1.6,5],'tgt':[-0.2,1.4,0.4]},{'name':'Road details','pos':[0.2,1.6,8],'tgt':[-2.5,0.1,6]}])]
import json
for slug,start,end,cid,views in items:
 a=s.index(start);b=s.index(end,a+len(start));block=s[a:b]
 (out/(slug+'.html')).write_text(prefix.replace('CONTAINER',cid+'-container').replace('VIEWS',json.dumps(views))+kit+helper+block+'</script>')
