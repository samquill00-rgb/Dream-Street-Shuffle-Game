from pathlib import Path
import re
root=Path.cwd();s=(root/'Dream Street Shuffle.twee').read_text()
module=s.split('// >>>> DSS ROOM PLAY BEGIN',1)[1].split('// <<<< DSS ROOM PLAY END',1)[0]
hover=s.split('window.dssRoomHoverName = function(wrap)',1)[1].split('// >>>> DSS GHOST TEX BEGIN',1)[0]
css_start=re.search(r'^:: .*\[stylesheet\].*$',s,re.M).end();css_end=re.search(r'^:: ',s[css_start:],re.M).start()+css_start
css=s[css_start:css_end]
bootstrap='''
window._dssThreeRegistry={'qa-wrap':{}};
var wrap=document.querySelector('#qa-wrap'),canvas=document.querySelector('canvas'),host=document.querySelector('#qa-host');
var scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(60,wrap.clientWidth/wrap.clientHeight,.1,50);
var CAM={x:0,y:1.5,z:5,tx:0,ty:1.2,tz:0};camera.position.set(0,1.5,5);camera.lookAt(0,1.2,0);camera.updateMatrixWorld();
function tex(w,h,draw){var c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c);}
var a=document.createElement('button');a.textContent='Inspect the object';a.onclick=function(){window.actionCount=(window.actionCount||0)+1};
a.style.display='none';host.appendChild(a);
var roots=[-1,1].map(function(x){var root=new THREE.Mesh(new THREE.BoxGeometry(.6,1.2,.6),new THREE.MeshBasicMaterial());root.position.set(x,1.2,0);scene.add(root);return root;});
var HOTSPOTS=roots.map(function(root,i){return{root:root,name:i?'Right object':'Left object',pos:[i?.8:-.8,1.4,2.5],tgt:[i?1:-1,1.2,0],prose:function(){return 'A little room detail, held in warm light. This text can be selected and read without closing the view.';},actions:function(){return[a]}}});
window.play=dssRoomPlay({wrap:wrap,canvas:canvas,host:host,scene:scene,camera:camera,CAM:CAM,HOTSPOTS:HOTSPOTS,tex:tex,still:location.search.includes('still')});
function advance(){play.frame(performance.now()/1000,1/60);scene.updateMatrixWorld(true);camera.updateMatrixWorld();requestAnimationFrame(advance)}advance();
window.project=function(i){var p=roots[i].position.clone().project(camera),r=canvas.getBoundingClientRect();return{x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2}};
'''
html='''<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>'''+css+'''body{margin:0;background:#151b24}#qa-wrap{position:relative;width:100vw;height:100vh}canvas{width:100%;height:100%;display:block}</style><div id="qa-host"><div id="qa-wrap"><canvas></canvas></div></div><script src="'''+(root/'vendor/three/three.min.js').as_uri()+'''"></script><script>window.dssRoomHoverName = function(wrap)'''+hover+module+bootstrap+'''</script>'''
Path('/tmp/dss-room-controls-qa.html').write_text(html)
