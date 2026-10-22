from pathlib import Path
root=Path('.');p=root/'Dream Street Shuffle.twee';check=root/'scratchpad/visual-pass-50/checklist.md'
def mark(n):
 s=check.read_text();s=s.replace(f'- [ ] {n}.',f'- [x] {n}.');check.write_text(s)
def scope(name):
 s=p.read_text();a=s.index('// ====== INSIDE '+name);b=s.index('// ======',a+20);return s,a,b,s[a:b]
def replace(t,old,new):
 assert old in t,old[:130];return t.replace(old,new,1)
def save(s,a,b,t):p.write_text(s[:a]+t+s[b:])
s=p.read_text();helper=(root/'scratchpad/visual-pass-50/prop-helper.js').read_text();anchor='// ====== INSIDE THE COLONY'
assert 'window.dssDetailProps=' not in s;s=s.replace(anchor,helper+'\n'+anchor,1);p.write_text(s)
# COLONY
s,a,b,t=scope('THE COLONY');(root/'scratchpad/visual-pass-50/colony-before.js').write_text(t)
t=replace(t,'// the back bar: a real mirror', 'var detail=window.dssDetailProps(mesh,tex,roomEnv,scene);\n// the back bar: a real mirror')
f=t.index('var bm = new THREE.MeshPhysicalMaterial',t.index('function bottle('));e=t.index('(parent || scene).add(g); return g;',f)
t=t[:f]+"detail.bottle(g,h,r,col,Math.round(x*13+z*31));\n"+t[e:];mark(1)
f=t.index('var b = mesh(new THREE.CylinderGeometry(0.034');e=t.index('if (fill > 0)',f);t=t[:f]+'detail.cup(g,0.034,0.1);\n'+t[e:];mark(2)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.02, 16), ashMat, -0.9, 1.11, barZ + 0.12, barG);','detail.ash(-0.9,1.1,barZ+0.12,barG,0.06);');mark(3)
t=replace(t,"mesh(new THREE.BoxGeometry(0.26, 0.012, 0.18), new THREE.MeshStandardMaterial({ color: 0x1e4a2a, roughness: 0.95 }), barX0 + 0.95, 1.106, barZ + 0.08, barG);","var towel=detail.cloth(0.26,0.18,barX0+0.95,1.108,barZ+0.08,barG,'#46513a');towel.rotation.x=-Math.PI/2;");mark(4)
t=replace(t,'// bamboo stools, a bent back on each', '''// Soda syphon lever and downturned nozzle, over fluted glass.
var syMetal=detail.material('#ada896','metal');
detail.wire([[barX0+0.5,1.39,barZ-0.12],[barX0+0.57,1.39,barZ-0.12],[barX0+0.59,1.36,barZ-0.12]],0.006,syMetal,barG);
mesh(new THREE.BoxGeometry(0.075,0.007,0.015),syMetal,barX0+0.53,1.414,barZ-0.12,barG);
for(var flute=0;flute<10;flute++){var angle=flute/10*Math.PI*2;mesh(new THREE.CylinderGeometry(0.0015,0.0015,0.2,5),detail.glass,barX0+0.5+Math.cos(angle)*0.045,1.22,barZ-0.12+Math.sin(angle)*0.045,barG);}
// bamboo stools, a bent back on each''');mark(5)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 18), seatMat, 0, 0.64, 0, g).castShadow = true;',"var cushion=mesh(new THREE.SphereGeometry(1,20,10),detail.material('#66372b','cloth'),0,0.64,0,g);cushion.scale.set(0.17,0.029,0.17);detail.arc(g,0.165,0.002,seatMat,0,0.635,0);");mark(6)
t=replace(t,'stools.push(g); return g;', '''[[-0.13,-0.13],[0.13,-0.13],[-0.13,0.13],[0.13,0.13]].forEach(function(p){[0.18,0.53].forEach(function(y){mesh(new THREE.CylinderGeometry(0.021,0.021,0.014,10),detail.material('#b49a64','cloth'),p[0],y,p[1],g);});});
stools.push(g); return g;''');mark(7)
t=replace(t,"var ivoryMat = new THREE.MeshStandardMaterial({ color: 0xe8dcb8, roughness: 0.35, envMap: roomEnv, envMapIntensity: 0.25 });", "var ivoryMat=detail.material('#d4c9a5','paper');")
t=replace(t,'// a candle in a bottle, wax down the glass, and an empty glass on top', '''for(var keyWear=0;keyWear<36;keyWear++){mesh(new THREE.BoxGeometry(0.001,0.001,0.105),detail.material('#8d846c','paper'),-0.615+keyWear*0.034,0.856,0.37,pianoG);}
// Paper turns up softly at the music stand, with a visible centre fold.
var scoreEdge=mesh(new THREE.BoxGeometry(0.34,0.003,0.26),detail.material('#bcb092','paper'),-0.1,1.15,0.322,pianoG);scoreEdge.rotation.x=Math.PI/2-0.12;
mesh(new THREE.BoxGeometry(0.0018,0.24,0.002),detail.material('#ab9c7d','paper'),-0.1,1.15,0.329,pianoG);
// a candle in a bottle, wax down the glass, and an empty glass on top''');mark(8);mark(9)
t=replace(t,'var candle = new THREE.PointLight', '''var waxMat=detail.material('#e3d8b9','glaze');
for(var drip=0;drip<5;drip++){var angle=drip*2.4,len=0.024+drip%3*0.014;var bead=mesh(new THREE.SphereGeometry(1,10,8),waxMat,0.45+Math.cos(angle)*0.021,1.55-len*0.3,Math.sin(angle)*0.021,pianoG);bead.scale.set(0.006,len,0.006);}
mesh(new THREE.CylinderGeometry(0.0015,0.0018,0.012,6),detail.material('#332d24','cloth'),0.45,1.665,0,pianoG);
var candle = new THREE.PointLight''');mark(10)
save(s,a,b,t)
print('Colony: 10 completed')
