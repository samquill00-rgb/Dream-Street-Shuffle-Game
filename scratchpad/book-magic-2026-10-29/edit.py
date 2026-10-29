from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text()
anchor="// ====== INSIDE O'FLATTERLY'S —"
helper='''// 2026-10-29 (Sam): books quietly exchange colours at independent paces.
// Scene-owned state, using the existing frame callbacks; no extra timers.
window.dssBookMagic = function() {
 var books=[], palette=[0x6a2a1a,0x245840,0x343b70,0x704369,0x9b7735,0x567576].map(function(c){return new THREE.Color(c);});
 return { add:function(mat){var n=books.length;books.push({mat:mat,base:mat.color.clone(),pace:8+(n*7.31%19),offset:n*2.399,target:palette[n%palette.length]});},
 frame:function(t,still){if(still)return;books.forEach(function(b){var v=(Math.sin(t*6.283185/b.pace+b.offset)+1)*0.5;v=v*v*(3-2*v);b.mat.color.copy(b.base).lerp(b.target,v);});} };
};

'''
s=s.replace(anchor,helper+anchor,1)
a=s.index(anchor);b=s.index('// <<<< DSS ROOM OI END',a);block=s[a:b]
block=block.replace('var bookCols =','var oiBookMagic = window.dssBookMagic();\nvar bookCols =',1)
block=block.replace('var bk = mesh(new THREE.BoxGeometry(bw, bh,', 'oiBookMagic.add(bm);\nvar bk = mesh(new THREE.BoxGeometry(bw, bh,',1)
block=block.replace('if (still) return;','oiBookMagic.frame(t, still);\nif (still) return;',1)
s=s[:a]+block+s[b:]
a=s.index("// ====== O'FLATTERLY'S BOOKSHOP SCENE");b=s.index('// ====== THIRD PILLAR PORTAL',a);block=s[a:b]
block=block.replace('var displayTex =', '''var ofBookMaskCanvas = document.createElement('canvas');
ofBookMaskCanvas.width=1024;ofBookMaskCanvas.height=768;
var ofBookMask = ofBookMaskCanvas.getContext('2d'), ofBookCount=0;
var ofMagicTime={value:0};
var displayTex =''',1)
block=block.replace('cx.rotate(lean);','''cx.rotate(lean);
ofBookMask.save();ofBookMask.translate(bx+bw/2,sy);ofBookMask.rotate(lean);
ofBookMask.fillStyle='rgb('+ (25+(ofBookCount++*73)%210) +',0,0)';
ofBookMask.fillRect(-bw/2,-bh,bw,bh);ofBookMask.restore();''',1)
block=block.replace('cx.fillRect(bx, sy - (ly + 1) * lh - 2, lw, lh);','''cx.fillRect(bx, sy - (ly + 1) * lh - 2, lw, lh);
ofBookMask.fillStyle='rgb('+(25+(ofBookCount++*73)%210)+',0,0)';
ofBookMask.fillRect(bx,sy-(ly+1)*lh-2,lw,lh);''',1)
block=block.replace("cx.fillStyle = 'rgba(204,182,134,0.9)';", "ofBookMask.clearRect(px2-3,py2-3,pw2+6,ph2+6);\ncx.fillStyle = 'rgba(204,182,134,0.9)';",1)
needle='// 3D dressing just behind the glass'
shader='''// The existing painted spines get a second, static identity mask. The GPU
// changes each independently; lettering, shadows and paper notices stay put.
var ofBookMaskTex=new THREE.CanvasTexture(ofBookMaskCanvas);
ofDisplay.material.onBeforeCompile=function(shader){
 shader.uniforms.ofBookMask={value:ofBookMaskTex};shader.uniforms.ofMagicTime=ofMagicTime;
 shader.fragmentShader='uniform sampler2D ofBookMask;\\nuniform float ofMagicTime;\\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',[
 '#include <map_fragment>',
 'vec4 bookID=texture2D(ofBookMask,vUv);',
 'float seed=bookID.r*255.0;',
 'float phase=ofMagicTime*6.283185/(8.0+mod(seed*0.731,19.0))+seed*2.399;',
 'float blend=0.5+0.5*sin(phase);blend=blend*blend*(3.0-2.0*blend);',
 'vec3 hue=mix(vec3(0.055,0.16,0.10),vec3(0.19,0.07,0.18),0.5+0.5*sin(seed*1.71));',
 'hue=mix(hue,vec3(0.26,0.18,0.045),0.5+0.5*cos(seed*0.91));',
 'float lum=dot(diffuseColor.rgb,vec3(0.2126,0.7152,0.0722));',
 'float chroma=max(max(diffuseColor.r,diffuseColor.g),diffuseColor.b)-min(min(diffuseColor.r,diffuseColor.g),diffuseColor.b);',
 'vec3 magic=hue*lum/max(0.01,dot(hue,vec3(0.2126,0.7152,0.0722)));',
 'diffuseColor.rgb=mix(diffuseColor.rgb,magic,bookID.a*blend*smoothstep(0.015,0.08,chroma));'
 ].join('\\n'));
};
ofDisplay.material.customProgramCacheKey=function(){return 'of-magic-books-1';};
// Register the mask with the room's normal texture disposal.
ofDisplay.material.userData.dssBookMask=ofBookMaskTex;
var ofBookMagic=window.dssBookMagic();
'''
block=block.replace(needle,shader+needle,1)
# Register the existing three physical window stacks without changing their geometry.
old='placeMesh(new THREE.BoxGeometry(0.34, stackH, 0.24), new THREE.MeshStandardMaterial({ color: [0x8a4418, 0x5d4a1e, 0x6b1f1f][bs], roughness: 0.7 }), stackX - 0.2, 0.62 + stackH / 2, -0.04);'
new='var ofStack= '+old+'\nofBookMagic.add(ofStack.material);'
assert old in block;block=block.replace(old,new,1)
block=block.replace('var t = ofStill ? 4 : clock.getElapsedTime();','var t = ofStill ? 4 : clock.getElapsedTime();\nofMagicTime.value = ofStill ? 0 : t;\nofBookMagic.frame(t, ofStill);',1)
# The mask is not a standard material map, so dispose explicitly on scene exit.
block=block.replace("window._dssDisposeWrap('of-wrap');", "if (window._dssThreeRegistry && window._dssThreeRegistry['of-wrap']) { var ofEntry=window._dssThreeRegistry['of-wrap']; if(ofEntry.scene)ofEntry.scene.traverse(function(o){if(o.material&&o.material.userData.dssBookMask)o.material.userData.dssBookMask.dispose();}); }\nwindow._dssDisposeWrap('of-wrap');")
s=s[:a]+block+s[b:];p.write_text(s)
