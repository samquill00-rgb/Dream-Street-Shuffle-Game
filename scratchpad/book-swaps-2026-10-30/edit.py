from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text()
anchor='window.dssBookMagic = function() {'
helper='''// 2026-10-30 (Sam): occasional pairs vanish and reappear in each other's slots.
window.dssBookSwaps = function() {
 var pairs=[];
 return { pair:function(a,b){
  var i=pairs.length, ax=a.position.x,bx=b.position.x;
  var aw=a.geometry.parameters.width,bw=b.geometry.parameters.width;
  var mats=[];[a,b].forEach(function(book){book.traverse(function(o){if(o.material){var m=o.material;m.transparent=true;m.depthWrite=false;mats.push({m:m,alpha:m.opacity});}});});
  pairs.push({a:a,b:b,ax:ax,bx:bx,at:bx+bw/2-aw/2,bt:ax-aw/2+bw/2,mats:mats,start:5+i*1.9,period:11+(i*3.7%13)});
 },frame:function(t,still){if(still)return;pairs.forEach(function(p){
  var elapsed=t-p.start, turn=elapsed<0?-1:Math.floor(elapsed/p.period), age=elapsed<0?2:elapsed%p.period;
  var swapped=elapsed>=0 && (turn+(age>=0.8?1:0))%2===1;
  p.a.position.x=swapped?p.at:p.ax;p.b.position.x=swapped?p.bt:p.bx;
  var alpha=age<1.6?Math.abs(age-0.8)/0.8:1;alpha=alpha*alpha*(3-2*alpha);
  p.mats.forEach(function(v){v.m.opacity=v.alpha*alpha;});
 });} };
};

'''
assert anchor in s;s=s.replace(anchor,helper+anchor,1)
a=s.index("// ====== INSIDE O'FLATTERLY'S");b=s.index('// <<<< DSS ROOM OI END',a);v=s[a:b]
v=v.replace('var oiBookMagic = window.dssBookMagic();','var oiBookMagic = window.dssBookMagic(), oiBookSwaps=window.dssBookSwaps();',1)
v=v.replace('var bx = -len / 2 + 0.03;','var bx = -len / 2 + 0.03, rowBooks=[];',1)
old='if (rnd(bx * 7 + seed) < 0.3) mesh(new THREE.PlaneGeometry(bw * 0.9, bh * 0.9), new THREE.MeshStandardMaterial({ map: spineTex, transparent: true, roughness: 0.8 }), bx + bw / 2, y + 0.015 + bh / 2, 0.04 + 0.11 + rnd(bx + seed) * 0.05 + 0.001, g);'
new=old.replace('if (rnd(bx * 7 + seed) < 0.3) mesh','if (rnd(bx * 7 + seed) < 0.3) { var lettering=mesh')+' bk.attach(lettering); }\nrowBooks.push(bk);'
assert old in v;v=v.replace(old,new,1)
v=v.replace('bx += bw + 0.003;\n}\n}', 'bx += bw + 0.003;\n}\nif(sh%3===1 && rowBooks.length>5)oiBookSwaps.pair(rowBooks[2],rowBooks[3]);\n}',1)
# Foreground window pair, clearly visible at its close-up.
v=v.replace('mesh(new THREE.BoxGeometry(1.6, 0.03, 0.3), M.shelfWood,','var oiWindowBooks=[];\nmesh(new THREE.BoxGeometry(1.6, 0.03, 0.3), M.shelfWood,',1)
v=v.replace('oiBookMagic.add(wbk.material); }','oiBookMagic.add(wbk.material); oiWindowBooks.push(wbk); }\noiBookSwaps.pair(oiWindowBooks[2],oiWindowBooks[3]);',1)
v=v.replace('oiBookMagic.frame(t, still);','oiBookMagic.frame(t, still);\noiBookSwaps.frame(t, still);',1)
s=s[:a]+v+s[b:]
# Exterior painted books: cache a second arrangement once, no animated canvas uploads.
a=s.index("// ====== O'FLATTERLY'S BOOKSHOP SCENE");b=s.index('// ====== THIRD PILLAR PORTAL',a);v=s[a:b]
v=v.replace('var ofMagicTime={value:0};','var ofMagicTime={value:0}, ofSpineSlots=[];',1)
v=v.replace('cx.rotate(lean);','cx.rotate(lean);\nif(lean===0)ofSpineSlots.push({x:bx,y:sy-bh,w:bw,h:bh,row:sh});',1)
anchor='var ofBookMaskTex=new THREE.CanvasTexture(ofBookMaskCanvas);'
setup='''var ofSwapCanvas=document.createElement('canvas'),ofSwapMaskCanvas=document.createElement('canvas');
ofSwapCanvas.width=ofSwapMaskCanvas.width=1024;ofSwapCanvas.height=ofSwapMaskCanvas.height=768;
var ofSwapCtx=ofSwapCanvas.getContext('2d'),ofSwapMaskCtx=ofSwapMaskCanvas.getContext('2d');
ofSwapCtx.drawImage(displayTex.image,0,0);
var ofSwapPairs=0;
function ofSpineClear(r){return ![[130,170,100,120],[640,200,118,146],[360,430,136,120]].some(function(p){return r.x<p[0]+p[2]+4&&r.x+r.w>p[0]-4&&r.y<p[1]+p[3]+4&&r.y+r.h>p[1]-4;});}
for(var ofRow=0;ofRow<4;ofRow++){
 var slots=ofSpineSlots.filter(function(r){return r.row===ofRow&&ofSpineClear(r);});
 if(slots.length<2)continue;
 var aa=slots[1],bb=slots[slots.length-2];if(aa===bb)continue;
 [[aa,bb],[bb,aa]].forEach(function(pair){var dst=pair[0],src=pair[1];
  ofSwapCtx.drawImage(displayTex.image,src.x,src.y,src.w,src.h,dst.x,dst.y,dst.w,dst.h);
  ofSwapMaskCtx.fillStyle='rgb('+(32+ofSwapPairs*48)+',0,0)';ofSwapMaskCtx.fillRect(dst.x,dst.y,dst.w,dst.h);
 });ofSwapPairs++;
}
var ofSwapTex=new THREE.CanvasTexture(ofSwapCanvas),ofSwapMaskTex=new THREE.CanvasTexture(ofSwapMaskCanvas);
'''
assert anchor in v;v=v.replace(anchor,setup+anchor,1)
v=v.replace('shader.uniforms.ofBookMask={value:ofBookMaskTex};','shader.uniforms.ofSwapMap={value:ofSwapTex};shader.uniforms.ofSwapMask={value:ofSwapMaskTex};\n shader.uniforms.ofBookMask={value:ofBookMaskTex};',1)
v=v.replace("shader.fragmentShader='uniform sampler2D ofBookMask;", "shader.fragmentShader='uniform sampler2D ofSwapMap;\\nuniform sampler2D ofSwapMask;\\nuniform sampler2D ofBookMask;",1)
v=v.replace(" '#include <map_fragment>',", """ '#include <map_fragment>',
 'vec4 swapID=texture2D(ofSwapMask,vUv);',
 'float pairID=(swapID.r*255.0-32.0)/48.0;',
 'float swapElapsed=ofMagicTime-(5.0+pairID*2.7);',
 'if(swapID.a>0.9 && swapElapsed>=0.0){',
 'float swapPeriod=12.0+pairID*3.7;',
 'float age=mod(swapElapsed,swapPeriod);',
 'float swapped=mod(floor(swapElapsed/swapPeriod)+step(0.8,age),2.0);',
 'diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(ofSwapMap,vUv).rgb*diffuse,swapped);',
 'float vanish=age<1.6?abs(age-0.8)/0.8:1.0;',
 'diffuseColor.rgb*=smoothstep(0.0,1.0,vanish);',
 '}',""",1)
v=v.replace("return 'of-magic-books-2';", "return 'of-magic-books-3';",1)
v=v.replace('ofDisplay.material.userData.dssBookMask=ofBookMaskTex;','ofDisplay.material.userData.dssBookMask=ofBookMaskTex;\nofDisplay.material.userData.dssBookSwapMaps=[ofSwapTex,ofSwapMaskTex];',1)
v=v.replace('if(o.material&&o.material.userData.dssBookMask)o.material.userData.dssBookMask.dispose();','if(o.material&&o.material.userData.dssBookMask){o.material.userData.dssBookMask.dispose();(o.material.userData.dssBookSwapMaps||[]).forEach(function(tex){tex.dispose();});}',1)
s=s[:a]+v+s[b:];p.write_text(s)
