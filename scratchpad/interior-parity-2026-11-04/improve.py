from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text();out=Path('scratchpad/interior-parity-2026-11-04');(out/'source-before.twee').write_text(s)
def swap(a,b):
 global s
 assert a in s,a[:100]
 s=s.replace(a,b)
# Dark colour maps should not also dictate gloss: that turns dark grain into polished streaks.
a=s.index('// >>>> DSS ROOM KIT BEGIN');b=s.index('// <<<< DSS ROOM OI END',a)
room=s[a:b];room=room.replace('roughnessMap: grainA, ','').replace('roughnessMap: grainB, ','').replace('roughnessMap: grainC, ','')
room=room.replace('t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());','t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());')
s=s[:a]+room+s[b:]
# Feather smoke to complete transparency at all four edges.
needle="cx.fillStyle = g; cx.fillRect(0, 0, w, h); } });\nvar smokes ="
replacement="""cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
cx.globalCompositeOperation='destination-in';var fade=cx.createLinearGradient(0,0,w,0);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(0.2,'black');fade.addColorStop(0.8,'black');fade.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=fade;cx.fillRect(0,0,w,h);fade=cx.createLinearGradient(0,0,0,h);fade.addColorStop(0,'rgba(0,0,0,0)');fade.addColorStop(0.25,'black');fade.addColorStop(0.75,'black');fade.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=fade;cx.fillRect(0,0,w,h);cx.globalCompositeOperation='source-over'; });
var smokes ="""
swap(needle,replacement)
# Open Trisha's back-bar carcass, leaving bottles and shelves in front of its thin back.
swap('mesh(new THREE.BoxGeometry(0.4, 2.0, barLen), new THREE.MeshStandardMaterial({ map: k.grain[2], roughness: 0.6, envMap: k.roomEnv, envMapIntensity: 0.3 }), W / 2 - 0.2, 1.0, barZ, barG);',"""var backBarWood=new THREE.MeshStandardMaterial({map:k.grain[2],roughness:0.72,envMap:k.roomEnv,envMapIntensity:0.22});
mesh(new THREE.BoxGeometry(0.035,2.0,barLen),backBarWood,W/2-0.025,1.0,barZ,barG);
[barZ0,barZ1].forEach(function(z){mesh(new THREE.BoxGeometry(0.24,2,0.035),backBarWood,W/2-0.13,1,z,barG);});
mesh(new THREE.BoxGeometry(0.24,0.035,barLen),backBarWood,W/2-0.13,2,barZ,barG);""")
# Open food cabinet, supported glazing, visible food and warm interior.
swap('mesh(new THREE.BoxGeometry(1.2, 0.6, 0.7), steel, 0, 0.3, 0, cabG); mesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshPhysicalMaterial({ color: 0xf0f4f8, roughness: 0.05, transparent: true, opacity: 0.25, envMap: k.roomEnv, envMapIntensity: 1, clearcoat: 1 }), 0, 0.32, 0.36, cabG);',"""mesh(new THREE.BoxGeometry(1.2,0.025,0.7),steel,0,0.0125,0,cabG);
mesh(new THREE.BoxGeometry(1.2,0.03,0.7),steel,0,0.585,0,cabG);
mesh(new THREE.BoxGeometry(1.2,0.56,0.025),steelDull,0,0.3,-0.337,cabG);
[-0.585,0.585].forEach(function(x){[-0.325,0.325].forEach(function(z){mesh(new THREE.BoxGeometry(0.025,0.56,0.025),steel,x,0.3,z,cabG);});});
var cabinetGlass=new THREE.MeshPhysicalMaterial({color:0xe0e5df,roughness:0.13,transparent:true,opacity:0.12,envMap:k.roomEnv,envMapIntensity:0.5,clearcoat:1,side:THREE.DoubleSide,depthWrite:false});
mesh(new THREE.PlaneGeometry(1.14,0.54),cabinetGlass,0,0.3,0.342,cabG);
[-0.595,0.595].forEach(function(x){var pane=mesh(new THREE.PlaneGeometry(0.64,0.54),cabinetGlass,x,0.3,0,cabG);pane.rotation.y=Math.PI/2;});""")
swap('mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), new THREE.MeshStandardMaterial({ map: chipTex, roughness: 0.6 }), -0.28, 0.14, 0, cabG);',"""var chipMats=[0xdba24c,0xe6b763,0xbf8739].map(function(col){return new THREE.MeshStandardMaterial({color:col,roughness:0.83});});
mesh(new THREE.BoxGeometry(0.52,0.012,0.51),steelDull,-0.28,0.035,0,cabG);
for(var ci=0;ci<48;ci++){var chip=mesh(new THREE.BoxGeometry(0.017+rnd(ci+600)*0.009,0.016,0.075+rnd(ci+700)*0.055),chipMats[ci%3],-0.28+(rnd(ci+800)-0.5)*0.43,0.054+Math.floor(ci/16)*0.018,(rnd(ci+900)-0.5)*0.37,cabG);chip.rotation.set((rnd(ci+1000)-0.5)*0.2,rnd(ci+1100)*Math.PI,(rnd(ci+1200)-0.5)*0.15);}""")
swap('var fish = mesh(new THREE.BoxGeometry(0.28, 0.05, 0.12),','var fish = mesh(new THREE.SphereGeometry(1,20,10),')
swap('fish.rotation.y = (rnd(fs) - 0.5) * 0.5;','fish.scale.set(0.14,0.025,0.06); fish.rotation.y = (rnd(fs) - 0.5) * 0.5;')
p.write_text(s)
print('Applied open cabinets, feathered smoke, coherent wood roughness and texture clarity.')
