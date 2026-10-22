from pathlib import Path
p=Path('Dream Street Shuffle.twee'); s=p.read_text(); out=Path('scratchpad/visual-pass-dreams-50'); changes=[]
def edit(scene,old,new,label):
 global s
 a=s.index(scene); b=s.find('// ======',a+len(scene)); # use explicit scene range instead below
 end=s.find('\nsetInterval(function()',a)
 # scope through builder, before watcher
 t=s[a:end];assert old in t,label
 (out/('before-'+scene.split(' —')[0].split('= ')[-1].replace('/','-')+'.js')).write_text(t) if not any(x[0]==scene for x in changes) else None
 t=t.replace(old,new,1);s=s[:a]+t+s[end:];changes.append((scene,label))
nz='// ====== NAZCA APPROACH SCENE';ei='// ====== EASTER ISLAND SHORE SCENE';py='// ====== PYRAMID MOUTH SCENE';ap='// ====== THE ENLIGHTENMENT — AIRPORT PUB SCENE'
helper='''// Small material and fitting details shared by the dream scenes; no hit targets.
window.dssDreamDetail = function(scene) {
 var mats={};
 function mat(c,metal){var k=c+':'+!!metal;return mats[k]||(mats[k]=new THREE.MeshStandardMaterial({color:c,roughness:metal?0.67:0.94,metalness:metal?0.48:0}));}
 function put(geo,m,x,y,z,parent){var o=new THREE.Mesh(geo,m);o.position.set(x,y,z);(parent||scene).add(o);return o;}
 function box(w,h,d,c,x,y,z,p,metal){return put(new THREE.BoxGeometry(w,h,d),mat(c,metal),x,y,z,p);}
 function ring(r,t,c,x,y,z,p,vertical){var o=put(new THREE.TorusGeometry(r,t,5,24),mat(c,true),x,y,z,p);if(!vertical)o.rotation.x=Math.PI/2;return o;}
 function wire(points,r,c,p){return put(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(function(v){return new THREE.Vector3(v[0],v[1],v[2]);})),20,r,5,false),mat(c,false),0,0,0,p);}
 function pin(x,y,z,p){return put(new THREE.SphereGeometry(0.018,6,4),mat(0x777268,true),x,y,z,p);}
 return {mat:mat,put:put,box:box,ring:ring,wire:wire,pin:pin};
};

'''
s=s.replace(ap,helper+ap,1)
# detail instance after scene creation in all four builders
for scene in [nz,ei,py,ap]:
 a=s.index(scene);idx=s.index('var scene = new THREE.Scene();',a)+len('var scene = new THREE.Scene();');s=s[:idx]+'\n  var fine = window.dssDreamDetail(scene);'+s[idx:]
# NAZCA 15
edit(nz,'    // the tin awning on four poles', '''    // Door hinge leaves and a dark escutcheon, rubbed by use.
    [-2.05,-1.15].forEach(function(x){fine.box(0.16,0.035,0.022,0x3c3326,x,1.92,3.57,g,true);});
    fine.box(0.08,0.14,0.018,0x75613b,-1.2,1.05,3.64,g,true);
    // the tin awning on four poles''','Cantina door hinges and knob backplate')
edit(nz,'    // the tin awning on four poles','''    [0.95,2.85].forEach(function(x){for(var sy=1.45;sy<2.4;sy+=0.16)fine.box(0.44,0.018,0.035,0x53676b,x,sy,3.585,g);});
    // the tin awning on four poles''','Shutter slat relief')
edit(nz,'    // the tin awning on four poles','''    var signFix=new THREE.Group();signFix.position.set(3.6,2.6,3.56);signFix.rotation.z=-0.05;g.add(signFix);
    [[-0.4,-0.17],[0.4,-0.17],[-0.4,0.17],[0.4,0.17]].forEach(function(p){fine.pin(p[0],p[1],0,signFix);});
    // the tin awning on four poles''','Beer sign corner fixings')
edit(nz,'    box(9.4, 0.08, 0.08, poleMat, 0, 2.72, 6.9, g);','''    box(9.4, 0.08, 0.08, poleMat, 0, 2.72, 6.9, g);
    for(var af=-4.4;af<4.5;af+=0.8)fine.pin(af,2.74,6.95,g);''','Awning fascia rivets')
edit(nz,'    window.__bulb = bulb;','''    fine.put(new THREE.CylinderGeometry(0.037,0.044,0.08,12),fine.mat(0x766755,true),-0.7,2.5,5.4,g);
    window.__bulb = bulb;''','Bare bulb socket')
edit(nz,'c.position.set(x, 0, z); c.rotation.y = r;', '''for(var cs=-1;cs<=1;cs+=2)fine.box(0.022,0.3,0.009,0xbcb9aa,cs*0.15,0.66,-0.175,c);
    fine.box(0.3,0.006,0.28,0xd6d2c4,0,0.464,0,c);
    c.position.set(x, 0, z); c.rotation.y = r;''','Plastic chair moulding and rubbed seats')
edit(nz,'    var bottle = new THREE.MeshStandardMaterial', '''    fine.ring(0.39,0.009,0xc7c4b7,2.8,0.742,4.9,g);
    var bottle = new THREE.MeshStandardMaterial''','Porch table rolled edge')
edit(nz,'    cyl(0.03, 0.035, 0.22, 8, bottle, 2.7, 0.85, 4.85, g); cyl(0.03, 0.035, 0.22, 8, bottle, 2.95, 0.85, 5.0, g);','''    [[2.7,4.85],[2.95,5.0]].forEach(function(p){
      var bg=new THREE.Group();bg.position.set(p[0],0.742,p[1]);g.add(bg);
      var profile=[[0,0],[0.032,0.004],[0.034,0.11],[0.03,0.14],[0.014,0.17],[0.014,0.23],[0.017,0.233]].map(function(v){return new THREE.Vector2(v[0],v[1]);});
      fine.put(new THREE.LatheGeometry(profile,14),bottle,0,0,0,bg);fine.ring(0.016,0.003,0x5c4827,0,0.228,0,bg);
      fine.put(new THREE.CylinderGeometry(0.0345,0.0345,0.055,14,1,true),fine.mat(0xb5a78a),0,0.075,0,bg);
    });''','Porch bottles with shoulders, lips and faded labels')
edit(nz,'    var broom = cyl(','''    [0.05,0.28,0.65,0.87].forEach(function(y){fine.ring(0.322,0.014,0x59606d,3.9,y,2.6,g);});
    fine.put(new THREE.CylinderGeometry(0.045,0.045,0.018,10),fine.mat(0x44464c,true),4.05,0.909,2.6,g);
    var broom = cyl(''','Blue drum rolled hoops and filler cap')
edit(nz,'    // a water butt and a hose','''    var br=new THREE.Group();br.position.set(4.2,0.72,3.2);br.rotation.z=-0.12;g.add(br);
    fine.box(0.14,0.07,0.045,0x745d3d,0,-0.6,0,br);
    for(var bs=0;bs<15;bs++){var bx=-0.067+bs*0.009;fine.wire([[bx,-0.62,0],[bx*1.3,-0.69,0.009],[bx*1.5,-0.73,0.012]],0.003,0x9c8b64,br);}
    // a water butt and a hose''','Broom binding and splayed dry bristles')
edit(nz,'    // THE PROPELLER:','''    fine.ring(0.28,0.018,0x494843,-3.9,0.79,5.9,g);
    fine.wire([[-3.7,0.12,5.9],[-3.5,0.04,6.05],[-3.3,0.04,5.8],[-3.6,0.04,5.6],[-3.8,0.06,5.8]],0.018,0x393b31,g);
    // THE PROPELLER:''','Water butt lip and slack hose')
edit(nz,'    // THE PROPELLER:','''    fine.put(new THREE.SphereGeometry(0.16,16,8),fine.mat(0xb29a52,true),-2.6,0.67,3.9,g).scale.y=0.55;
    fine.box(0.055,0.07,0.04,0x675a3c,-2.6,0.79,3.9,g,true);
    fine.ring(0.075,0.012,0x9f8b4a,-2.6,0.81,3.9,g,true);
    // THE PROPELLER:''','Gas cylinder domed shoulder and valve guard')
edit(nz,'    propG.position.set(','''    for(var hb=0;hb<6;hb++){var ha=hb*Math.PI/3;fine.pin(Math.cos(ha)*0.095,Math.sin(ha)*0.095,0.09,propG);}
    propG.position.set(''','Propeller hub fasteners')
edit(nz,'    // rooftop: a water tank','''    [-1,1].forEach(function(side){fine.wire([[-0.07,side*0.15,0.02],[-0.055,side*0.65,0.035],[-0.035,side*1.12,0.025]],0.004,0x777d7c,propG);});
    // rooftop: a water tank''','Propeller blade worn leading edges')
edit(nz,'    // the whole block faces the road','''    fine.box(1.24,0.04,1.24,0x47484b,2.5,4.82,-1.5,g,true);
    fine.wire([[3.08,4.2,-1.5],[3.27,4.2,-1.5],[3.3,3.45,-1.5],[3.55,3.4,-1.5]],0.035,0x68675d,g);
    // the whole block faces the road''','Roof tank lid seam and outlet pipe')
# EASTER 10
edit(ei,'new THREE.DodecahedronGeometry(r, 0), bx < 5','new THREE.DodecahedronGeometry(r, 1), bx < 5','Wave-softened basalt boulders')
edit(ei,'new THREE.DodecahedronGeometry(gr, 0)','new THREE.DodecahedronGeometry(gr, 1)','Rounded waterline shingle')
edit(ei,'    pool.rotation.x = -Math.PI / 2;', '''    var rim=fine.ring(pool.geometry.parameters.radius,0.012,0x353c42,px,beachY(px,pz)+0.009,pz);rim.scale.y=1;
    pool.rotation.x = -Math.PI / 2;''','Rock pool mineral rims')
# correct ellipse after pool scale established
s=s.replace('pool.position.set(px, beachY(px, pz) + 0.012, pz); scene.add(pool);','pool.position.set(px, beachY(px, pz) + 0.012, pz); rim.scale.y=pool.scale.y; scene.add(pool);',1)
edit(ei,'var k = mesh(new THREE.CylinderGeometry(0.02, 0.04, rand(0.4, 1.4), 5), kelp, kx, beachY(kx, kz) + 0.03, kz); k.rotation.set(Math.PI / 2 + rand(-0.3, 0.3), 0, rand(0, 3));','''var kl=rand(0.4,1.4),kr=rand(0,3),kg=new THREE.Group();kg.position.set(kx,beachY(kx,kz)+0.03,kz);kg.rotation.y=kr;scene.add(kg);fine.wire([[0,0,0],[kl*0.25,0.01,0.08],[kl*0.65,0.008,-0.06],[kl,0,0.02]],0.022,0x151a12,kg);''','Kelp curved stranded stems')
edit(ei,'    var d2 = mesh(','''    for(var wg=-1;wg<=1;wg++)fine.wire([[wg*0.025,-1.06,0.058],[wg*0.03,-0.3,0.07],[wg*0.02,0.6,0.057],[wg*0.018,1.03,0.045]],0.003,0x514c43,d);
    var d2 = mesh(''','Large driftwood split grain')
edit(ei,'    var d2 = mesh(new THREE.CylinderGeometry(0.03, 0.05, 1.1, 5), wood, 2.1, beachY(2.1, -9) + 0.05, -9); d2.rotation.set(Math.PI / 2, 0, -1.1);','''    var d2 = mesh(new THREE.CylinderGeometry(0.03, 0.05, 1.1, 9), wood, 2.1, beachY(2.1, -9) + 0.05, -9); d2.rotation.set(Math.PI / 2, 0, -1.1);
    fine.wire([[0,0,0],[0.04,0.11,0.01],[0.11,0.18,0.02]],0.018,0x7a6a58,d2);''','Small driftwood broken branch')
edit(ei,"      ctx.fillRect(w * 0.36, h * 0.2, 3, h * 0.44);",'''      ctx.strokeStyle='rgba(112,120,124,0.3)';ctx.lineWidth=0.7;ctx.beginPath();ctx.moveTo(w*0.16,h*0.65);ctx.lineTo(w*0.85,h*0.65);ctx.moveTo(w*0.23,h*0.73);ctx.lineTo(w*0.8,h*0.73);ctx.stroke();
      ctx.fillRect(w * 0.36, h * 0.2, 3, h * 0.44);''','Distant boat gunwale and plank glints')
edit(ei,'    if (withSign) {','''    // Incisions follow the existing sculpture; keep the original child indices.
    for(var aj=-1.05;aj<1.4;aj+=0.52)fine.box(0.012,0.28,0.008,0x34363a,aj,0.23,1.107,g);
    if (withSign) {''','Ahu facing stone joints')
edit(ei,'    if (withSign) {','''    [-1,1].forEach(function(side){fine.box(0.025,0.72,0.12,0x33343a,side*0.685,4.22,-0.07,g);});
    if (withSign) {''','Moai ear inner recesses')
edit(ei,'    if (withSign) {','''    for(var finger=-0.5;finger<0.6;finger+=0.18)fine.box(0.011,0.095,0.008,0x38383b,finger,1.45,0.514,g);
    fine.box(0.44,0.018,0.008,0x303137,0,3.62,0.586,g);
    if (withSign) {''','Moai worn finger grooves and mouth incision')
# PYRAMID 10
edit(py,'    var rope = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pts).getPoints(60)), new THREE.LineBasicMaterial({ color: 0x8a7050 })); scene.add(rope);','''    var rope = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,0.026,6,false),fine.mat(0x8a7a5d));scene.add(rope);''','Barrier rope thickness and natural sag')
edit(py,'    var rope = new THREE.Mesh','''    for(var rf=0;rf<6;rf++){var fx=MX+6+rf*6,fz=B+4+rf*0.8;fine.ring(0.074,0.018,0x51483a,fx,1.04,fz,null,true);}
    var rope = new THREE.Mesh''','Barrier post eyelets')
edit(py,'    var rope = new THREE.Mesh','''    for(var pf=0;pf<6;pf++){var fx=MX+6+pf*6,fz=B+4+pf*0.8;fine.put(new THREE.CylinderGeometry(0.12,0.16,0.045,10),fine.mat(0x66543c),fx,0.025,fz);}
    var rope = new THREE.Mesh''','Post sand-set foot collars')
edit(py,'    mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.4, 6), iron, MX + 14, 1.2, B + 9.05);','''    mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.4, 6), iron, MX + 14, 1.2, B + 9.05);
    var sg=new THREE.Group();sg.position.copy(sign.position);sg.rotation.copy(sign.rotation);scene.add(sg);
    [[-0.98,-0.58],[0.98,-0.58],[-0.98,0.58],[0.98,0.58]].forEach(function(p){fine.pin(p[0],p[1],0.015,sg);});''','Warning sign dull corner rivets')
edit(py,'    var tyre = new THREE.Mesh','''    fine.box(0.035,1.2,0.035,0x6e5d44,-1.08,0,0.006,sg,true);fine.box(0.035,1.2,0.035,0x6e5d44,1.08,0,0.006,sg,true);
    var tyre = new THREE.Mesh''','Tin sign folded side hems')
edit(py,'    var tyre = new THREE.Mesh','''    var treadTex=canvasTex(64,256,function(ctx,w,h){ctx.clearRect(0,0,w,h);ctx.strokeStyle='rgba(62,48,30,0.4)';ctx.lineWidth=5;for(var y=0;y<h;y+=18){ctx.beginPath();ctx.moveTo(5,y);ctx.lineTo(30,y+7);ctx.lineTo(59,y);ctx.stroke();}});
    var tyre = new THREE.Mesh''','Vehicle track broken tread texture')
# replace tyre material only scope direct no counted extra
start=s.index(py); q=s[start:];q=q.replace("new THREE.MeshBasicMaterial({ color: 0x4a3a28, transparent: true, opacity: 0.35, depthWrite: false })","new THREE.MeshBasicMaterial({ map:treadTex, transparent:true,opacity:0.55,depthWrite:false })",1);s=s[:start]+q
edit(py,'    // a faint light deep in the corridor','''    for(var ss=-1;ss<=1;ss+=2)fine.wire([[MX+ss*1.8,MY+0.12,MZ+1.71],[MX+ss*0.9,MY+0.1,MZ+1.72],[MX+ss*0.2,MY+0.095,MZ+1.72]],0.018,0x95836a);
    // a faint light deep in the corridor''','Entrance sill worn edge strata')
edit(py,'    // a faint light deep in the corridor','''    [-1,1].forEach(function(side){fine.wire([[MX+side*2.9,MY+2.8,MZ+1.01],[MX+side*2.65,MY+2.1,MZ+1.015],[MX+side*2.8,MY+1.5,MZ+1.01]],0.012,0x7e6d53);});
    // a faint light deep in the corridor''','Entrance jamb hairline fissures')
edit(py,'new THREE.DodecahedronGeometry(rand(0.2, 0.7), 0)','new THREE.DodecahedronGeometry(rand(0.2, 0.7), 1)','Weathered rubble at entrance lip')
edit(py,'new THREE.DodecahedronGeometry(pr, 0)','new THREE.DodecahedronGeometry(pr, 1)','Sand-eroded plateau pebbles')
# AIRPORT15
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    fine.box(0.5,0.045,0.065,0x383633,0,1.005,0.46,g);
    g.position.set(4.1, 0, 1.9);''','Trolley worn rubber push grip')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    for(var tr=-0.24;tr<0.3;tr+=0.12)fine.box(0.016,0.012,0.8,0xb0afa5,tr,0.23,0,g,true);
    g.position.set(4.1, 0, 1.9);''','Trolley platform rails')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    [[-0.26,-0.4],[0.26,-0.4],[-0.26,0.4],[0.26,0.4]].forEach(function(p){fine.box(0.085,0.1,0.03,0x767977,p[0],0.14,p[1],g,true);fine.pin(p[0]+0.043,0.08,p[1],g);});
    g.position.set(4.1, 0, 1.9);''','Trolley castor forks and axle caps')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    [-0.16,0.16].forEach(function(x){fine.box(0.026,0.365,0.012,0x6c563b,x,0.41,0.316,g);fine.box(0.026,0.009,0.71,0x6c563b,x,0.595,-0.05,g);});
    g.position.set(4.1, 0, 1.9);''','Large suitcase leather straps')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    [[-0.23,0.25],[0.23,0.25],[-0.23,0.56],[0.23,0.56]].forEach(function(p){fine.box(0.045,0.045,0.018,0x735f44,p[0],p[1],0.319,g);});
    g.position.set(4.1, 0, 1.9);''','Suitcase reinforced corners')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    fine.wire([[-0.065,0.54,0.328],[-0.065,0.58,0.34],[0.065,0.58,0.34],[0.065,0.54,0.328]],0.013,0x211d18,g);
    g.position.set(4.1, 0, 1.9);''','Suitcase folded carry handle')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    fine.box(0.405,0.012,0.008,0x7d817b,0.02,0.71,0.255,g,true);
    fine.wire([[-0.07,0.775,0.1],[-0.06,0.83,0.1],[0.1,0.83,0.1],[0.11,0.775,0.1]],0.009,0x323b42,g);
    g.position.set(4.1, 0, 1.9);''','Small travel bag zip and handle')
edit(ap,'    g.position.set(4.1, 0, 1.9);','''    fine.wire([[0.1,0.81,0.1],[0.17,0.78,0.19],[0.18,0.73,0.26]],0.003,0x978369,g);
    fine.box(0.065,0.09,0.003,0xbaad8d,0.18,0.7,0.263,g);
    g.position.set(4.1, 0, 1.9);''','Blank luggage tag and string')
edit(ap,'  // ============================================================\n  // THE PUB BAY','''  fine.ring(0.299,0.012,0x6d7072,6.1,0.951,1.5);
  // ============================================================
  // THE PUB BAY''','Litter bin rolled lid rim')
edit(ap,'  // ============================================================\n  // THE PUB BAY','''  fine.box(0.18,0.045,0.012,0x17181a,6.1,0.82,1.773);
  fine.box(0.2,0.018,0.028,0x696b68,6.1,0.853,1.785,null,true);
  // ============================================================
  // THE PUB BAY''','Litter bin dark aperture and lip')
edit(ap,'  // ============================================================\n  // THE PUB BAY','''  for(var bf=0;bf<12;bf++){var ba=bf*Math.PI/6;fine.box(0.012,0.64,0.014,0x3a3a3c,6.1+Math.cos(ba)*0.267,0.46,1.5+Math.sin(ba)*0.267,null,true);}
  // ============================================================
  // THE PUB BAY''','Bin pressed body ribs')
edit(ap,'  // Pub ceiling: dark, joists','''  for(var ts=-6.5;ts<7;ts+=1.3)fine.pin(ts,0.033,0.045);
  // Pub ceiling: dark, joists''','Brass threshold inset fixings')
edit(ap,'    var d2 = cyl(0.22, 0.22, 13.5, 14, ductMat, -3.6, 3.62, -7.1); d2.rotation.x = Math.PI / 2;','''    var d2 = cyl(0.22, 0.22, 13.5, 14, ductMat, -3.6, 3.62, -7.1); d2.rotation.x = Math.PI / 2;
    [3.2,-3.6].forEach(function(x){for(var dz=-2;dz>-13;dz-=2.7)fine.ring(0.224,0.012,0x62666a,x,3.62,dz,null,true);});''','Ventilation duct joint bands')
edit(ap,'      var v = box(', '      var v = box(', 'TEMP') if False else None
edit(ap,'    var conduit = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });','''    for(var vz=-2;vz>-13;vz-=3.5)for(var vs=-0.16;vs<0.2;vs+=0.08)fine.box(0.028,0.006,0.4,0x34383b,3.2+vs,3.315,vz);
    var conduit = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });''','Vent outlet dark louvre slats')
edit(ap,'    g.position.set(1.4, 0, 1.7);','''    [-0.33,0.33].forEach(function(x){fine.box(0.055,0.055,0.045,0x8c7654,x,1.13,0,g,true);fine.pin(x,1.13,0.025,g);});
    fine.wire([[-0.33,0.55,-0.1],[-0.33,0.51,0],[-0.33,0.55,0.1]],0.008,0x6d6757,g);
    g.position.set(1.4, 0, 1.7);''','A-board top hinges and stay chain')
assert len(changes)==50,len(changes)
p.write_text(s)
(out/'CHECKLIST.md').write_text('# Dream worlds — 50 visual details\n\nProse, sign lettering, hit targets and interactions preserved.\n\n'+'\n'.join('- [x] '+str(i+1)+'. '+v[1] for i,v in enumerate(changes))+'\n')
print('Applied',len(changes),'details')
