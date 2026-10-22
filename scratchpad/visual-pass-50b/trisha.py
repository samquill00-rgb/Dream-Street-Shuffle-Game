from common import *
s,a,b,t=scope("TRISHA'S");(root/'scratchpad/visual-pass-50b/trisha-before.js').write_text(t)
t=replace(t,'var W =','var detail=window.dssDetailProps(mesh,tex,k.roomEnv,scene);\nvar W =')
t=replace(t,"var vinyl = new THREE.MeshStandardMaterial({ color: 0x8a1a2a, roughness: 0.35, envMap: k.roomEnv, envMapIntensity: 0.5 });","var vinyl=detail.material('#7b2d38','cloth');vinyl.roughness=0.48;")
t=replace(t,'var bk = mesh(new THREE.BoxGeometry(len, 0.55, 0.1), vinyl, 0, 0.75, -0.22, g);', '''var bk=mesh(new THREE.BoxGeometry(len,0.55,0.1),vinyl,0,0.75,-0.22,g);
detail.wire([[-len/2+0.02,0.5,0.24],[len/2-0.02,0.5,0.24]],0.002,detail.material('#a55e5b','cloth'),g);
detail.wire([[-len/2+0.02,1.018,-0.165],[len/2-0.02,1.018,-0.165]],0.002,detail.material('#a55e5b','cloth'),g);''');mark(31)
t=replace(t,'k.contact(x, 0, z, 0.9); return g;', '''var ring=detail.arc(g,0.034,0.0009,detail.material('#705647','glaze'),0.08,0.516,-0.07,Math.PI*1.65,0.3);
detail.arc(g,0.275,0.0018,detail.material('#614334','glaze'),0,0.509,0);
k.contact(x, 0, z, 0.9); return g;''');mark(32)
t=replace(t,'candleFlames.push({ l: l, gl: gl, fl: fl });', '''for(var drip=0;drip<4;drip++){var angle=drip*2.4,drop=mesh(new THREE.SphereGeometry(1,10,8),detail.material('#d9cdb0','glaze'),Math.cos(angle)*0.022,0.207-drip%2*0.025,Math.sin(angle)*0.022,g);drop.scale.set(0.006,0.018+drip%3*0.009,0.006);}
mesh(new THREE.CylinderGeometry(0.0012,0.0015,0.009,6),detail.material('#342921','cloth'),0,0.283,0,g);
candleFlames.push({ l: l, gl: gl, fl: fl });''');mark(33)
t=replace(t,'mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.1, 12, 1, true), M.glass.clone(), 0, 0.05, 0, g).material.side = THREE.DoubleSide;','detail.cup(g,0.028,0.1);');mark(34)
t=replace(t,'mesh(new THREE.ConeGeometry(0.045, 0.06, 14, 1, true), M.glass.clone(), 0, 0.1, 0, g).material.side = THREE.DoubleSide;',"detail.lathe([[0,0.07],[0.004,0.072],[0.045,0.13],[0.0438,0.13],[0.003,0.073]],detail.glass,0,0,0,g);detail.arc(g,0.0444,0.0007,detail.glass,0,0.13,0);")
# Old liquid cone points up; turn it into a shallow level-filled bowl matching the glass.
t=replace(t,'mesh(new THREE.ConeGeometry(0.04, 0.05, 14), new THREE.MeshStandardMaterial({ color: 0xff3060, roughness: 0.1, transparent: true, opacity: 0.7, emissive: 0x600020, emissiveIntensity: 0.3 }), 0, 0.105, 0, g);',"mesh(new THREE.CylinderGeometry(0.034,0.003,0.045,28),new THREE.MeshPhysicalMaterial({color:0xa83345,roughness:0.2,transparent:true,opacity:0.65,envMap:k.roomEnv,envMapIntensity:0.35}),0,0.098,0,g);");mark(35)
t=replace(t,'var portG =', '''for(var grip=0;grip<8;grip++){var angle=grip*Math.PI/4;var handle=detail.lathe([[0,-0.07],[0.017,-0.07],[0.022,-0.05],[0.014,-0.02],[0.018,0.04],[0.023,0.06],[0,0.075]],detail.material('#80603d','glaze'),Math.cos(angle)*0.42,Math.sin(angle)*0.42,0,wheelG,16);handle.rotation.z=angle-Math.PI/2;}
var portG =''');mark(36)
t=replace(t,'var portMir =', '''for(var dog=0;dog<4;dog++){var angle=dog*Math.PI/2+0.3;var fitting=mesh(new THREE.BoxGeometry(0.045,0.012,0.012),detail.material('#927b4a','metal'),Math.cos(angle)*0.235,Math.sin(angle)*0.235,0.043,portG);fitting.rotation.z=angle;}
var portMir =''');mark(37)
t=replace(t,'function photoTex(seed)', '''(function(){var c=beltTex.image.getContext('2d');for(var y=0;y<32;y+=2){c.fillStyle='rgba(71,50,33,0.14)';c.fillRect(0,y,256,1);}for(var x=0;x<256;x+=3){c.fillStyle='rgba(225,213,184,0.13)';c.fillRect(x,0,1,32);}beltTex.needsUpdate=true;})();
for(var tie=0;tie<4;tie++){var angle=tie*Math.PI/2;var loop=mesh(new THREE.TorusGeometry(0.042,0.004,6,18),detail.material('#a79a78','cloth'),Math.cos(angle)*0.3,Math.sin(angle)*0.3,0.065,beltG);loop.rotation.z=angle;}
function photoTex(seed)''');mark(38)
t=replace(t,'// ---------- THE STAIRS up to the street', '''mesh(new THREE.TorusGeometry(0.195,0.005,8,40),detail.material('#816642','metal'),0,0,0.032,clockG);
mesh(new THREE.CircleGeometry(0.188,40),detail.glass,0,0,0.034,clockG);
// ---------- THE STAIRS up to the street''');mark(39)
t=replace(t,'// the wrap: a small fold', '''mesh(new THREE.BoxGeometry(0.06,0.14,0.004),detail.material('#826b45','metal'),0.28,1.03,0.043,backDoorG);
[-1,1].forEach(function(side){var fixing=mesh(new THREE.SphereGeometry(0.003,6,4),M.brass,0.28,1.03+side*0.055,0.047,backDoorG);fixing.scale.z=0.3;var hinge=mesh(new THREE.CylinderGeometry(0.009,0.009,0.07,10),M.brass,-0.42,1.0+side*0.65,0.04,backDoorG);});
// the wrap: a small fold''');mark(40)
save(s,a,b,t);print('Trisha: 10 completed')
