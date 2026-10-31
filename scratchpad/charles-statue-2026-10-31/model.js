  // Charles II: modelled from Sam's two Soho Square photographs, 2026-10-31.
  var king=new THREE.Group();king.name='charles-ii-soho';king.position.set(-5,0,2);king.rotation.y=.67;scene.add(king);
  function kEll(x,y,z,rx,ry,rz,par){var m=mesh(new THREE.SphereGeometry(1,24,18),stone,x,y,z,par||king);m.scale.set(rx,ry,rz);return m;}
  function kCurve(points,r,par){return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(function(p){return new THREE.Vector3().fromArray(p);})),Math.max(16,points.length*6),r,8,false),stone,0,0,0,par||king);}
  function kLimb(a,b,r0,r1,par){var A=new THREE.Vector3().fromArray(a),B=new THREE.Vector3().fromArray(b),d=B.clone().sub(A);var profile=[[0,0],[r0*.8,.025],[r0,.12],[r0*.98,.35],[r1,.76],[r1*.9,.96],[0,1]];
    var m=mesh(new THREE.LatheGeometry(profile.map(function(p){return new THREE.Vector2(p[0],(p[1]-.5)*d.length());}),20),stone,0,0,0,par||king);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
  // Stepped square footing, rounded carved drum and overhanging stone cap.
  box(1.8,.16,1.65,0,.08,0,stone,king);box(1.6,.13,1.47,0,.225,0,stone,king);
  box(1.36,.26,1.24,0,.42,0,stone,king);box(1.6,.12,1.44,0,.61,0,stone,king);
  mesh(new THREE.CylinderGeometry(.59,.64,.83,48),stone,0,1.085,0,king);
  box(1.35,.11,1.23,0,1.55,0,stone,king);box(1.25,.07,1.14,0,1.64,0,stone,king);
  // Weathered masks and scroll reliefs appear on the front and sides of the drum.
  [0,Math.PI/2,-Math.PI/2].forEach(function(angle){var relief=new THREE.Group();relief.position.set(Math.sin(angle)*.595,1.1,Math.cos(angle)*.595);relief.rotation.y=angle;king.add(relief);
    kEll(0,.06,.012,.10,.135,.035,relief);kEll(0,.035,.052,.022,.057,.027,relief);
    [-1,1].forEach(function(sd){kCurve([[sd*.015,.015,.047],[sd*.07,-.02,.056],[sd*.14,-.035,.028],[sd*.16,.005,.02],[sd*.115,.03,.023]],.018,relief);kCurve([[sd*.035,.10,.038],[sd*.07,.115,.037],[sd*.09,.09,.022]],.012,relief);});
    kCurve([[-.22,-.14,.006],[-.13,-.18,.035],[0,-.14,.043],[.13,-.18,.035],[.22,-.14,.006]],.018,relief);
  });
  var plaqueCanvas=document.createElement('canvas');plaqueCanvas.width=512;plaqueCanvas.height=192;var pc=plaqueCanvas.getContext('2d');pc.fillStyle='#465a55';pc.fillRect(0,0,512,192);pc.strokeStyle='#9eaa92';pc.lineWidth=8;pc.strokeRect(8,8,496,176);pc.fillStyle='#d5d4ba';pc.textAlign='center';pc.font='42px Georgia';pc.fillText('CHARLES II',256,87);pc.font='24px Georgia';pc.fillText('1681',256,133);
  var plaqueMat=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(plaqueCanvas),roughness:.89});
  var plaque=mesh(new THREE.PlaneGeometry(.68,.255),plaqueMat,0,.415,.632,king);plaque.rotation.x=-.13;plaque.userData.keepMaterial=true;
  // Contrapposto: one straight supporting leg, the other eased forward.
  [[-.16,.08,-.018],[.16,0,.015]].forEach(function(p){var x=p[0],z=p[1];
    var foot=kEll(x,1.745,z+.10,.091,.064,.19);foot.rotation.y=p[2]*4;
    kLimb([x,1.79,z],[x*.94,2.24,z-.025],.072,.089);
    kEll(x*.94,2.245,z+.035,.087,.091,.07);
    kCurve([[x-.075,2.25,z+.056],[x,2.20,z+.10],[x+.075,2.25,z+.056]],.009);
    kLimb([x*.94,2.28,z-.02],[x*.86,2.80,-.025],.095,.135);
    kCurve([[x-.05,1.82,z+.104],[x-.045,2.05,z+.068],[x-.033,2.18,z+.061]],.007);
  });
  // Continuous cuirass, softly rounded rather than stacks of armour cylinders.
  var chest=mesh(new THREE.LatheGeometry([[0,3.0],[.24,3.0],[.27,3.06],[.285,3.19],[.30,3.36],[.27,3.49],[.19,3.58],[.10,3.62],[0,3.62]].map(function(p){return new THREE.Vector2(p[0],p[1]);}),40),stone,0,0,0,king);chest.scale.z=.70;
  [-1,1].forEach(function(sd){kEll(sd*.29,3.48,-.005,.13,.125,.13);kCurve([[sd*.03,3.48,.185],[sd*.13,3.40,.211],[sd*.24,3.43,.15]],.012);});
  // Roman skirt: broad overlapping panels with horizontal carved bands, as in the references.
  for(var panel=0;panel<10;panel++){var angle=panel/10*Math.PI*2;
    var strip=mesh(new THREE.CylinderGeometry(.286,.323,.43,6,3,true,angle-.30,.56),stone,0,2.835,0,king);strip.scale.z=.77;
    for(var band=0;band<4;band++){var r=.29+band*.008,y=3.00-band*.10;var points=[];for(var t=0;t<=6;t++){var a=angle-.27+t*.09;points.push([Math.sin(a)*r,y-.012*Math.cos((t-3)*.5),Math.cos(a)*r*.77]);}kCurve(points,.008);}
  }
  // A broad cloak with deep irregular folds falls behind the legs to the base.
  var capePos=[],capeUV=[],capeIdx=[],cols=40,rows=24;
  for(var row=0;row<=rows;row++){var v=row/rows;for(var col=0;col<=cols;col++){var u=col/cols,angle=Math.PI*.47+u*Math.PI*1.06,r=.30+v*.13+Math.sin(u*Math.PI*12+v*.9)*(.012+v*.026);capePos.push(Math.sin(angle)*r,3.52-v*1.78+Math.sin(u*8)*v*.035,Math.cos(angle)*r*.85-.045);capeUV.push(u,v);if(row<rows&&col<cols){var i=row*(cols+1)+col;capeIdx.push(i,i+cols+1,i+1,i+1,i+cols+1,i+cols+2);}}}
  var capeGeo=new THREE.BufferGeometry();capeGeo.setAttribute('position',new THREE.Float32BufferAttribute(capePos,3));capeGeo.setAttribute('uv',new THREE.Float32BufferAttribute(capeUV,2));capeGeo.setIndex(capeIdx);capeGeo.computeVertexNormals();mesh(capeGeo,stone,0,0,0,king);
  // Diagonal mantle/sash: his right fist gathers it across the chest.
  var sashPos=[],sashUV=[],sashIdx=[];for(var j=0;j<=20;j++){var t=j/20,x=.23-t*.46,y=3.51-t*.36,z=.17+Math.sin(t*Math.PI)*.084;
    [-1,1].forEach(function(sd){sashPos.push(x+sd*.036,y+sd*.043,z+Math.cos(t*4)*.004);sashUV.push(sd<0?0:1,t);});if(j<20){var i=j*2;sashIdx.push(i,i+2,i+1,i+1,i+2,i+3);}}
  var sashGeo=new THREE.BufferGeometry();sashGeo.setAttribute('position',new THREE.Float32BufferAttribute(sashPos,3));sashGeo.setAttribute('uv',new THREE.Float32BufferAttribute(sashUV,2));sashGeo.setIndex(sashIdx);sashGeo.computeVertexNormals();mesh(sashGeo,stone,0,0,0,king);
  // Right arm bends to the gathered cloak, left elbow angles out with the hand resting on the hip.
  kLimb([-.30,3.47,0],[-.38,3.13,.075],.085,.07);kEll(-.38,3.13,.075,.075,.075,.075);
  kLimb([-.38,3.13,.075],[-.14,3.17,.265],.066,.052);
  var fist=kEll(-.135,3.17,.276,.071,.066,.05);fist.rotation.z=.13;
  for(var f=0;f<4;f++)kCurve([[-.17,3.195-f*.018,.299],[-.13,3.201-f*.018,.325],[-.094,3.185-f*.018,.295]],.007);
  kLimb([.30,3.47,0],[.43,3.15,.012],.085,.067);kEll(.43,3.15,.012,.073,.075,.071);kLimb([.43,3.15,.012],[.265,2.99,.197],.062,.05);
  var palm=kEll(.254,2.993,.205,.055,.075,.032);palm.rotation.z=-.5;
  for(var f=0;f<4;f++)kCurve([[.234+f*.017,3.027,.221],[.216+f*.019,2.98,.244],[.213+f*.018,2.949,.227]],.006);
  // Small neck and the split, pleated seventeenth-century cravat.
  kLimb([0,3.57,0],[0,3.76,0],.073,.063);
  [-1,1].forEach(function(sd){for(var fold=0;fold<3;fold++)kCurve([[sd*(.013+fold*.013),3.71,.088],[sd*(.02+fold*.018),3.60,.131],[sd*(.024+fold*.02),3.54,.145]],.008);});
  // Long, sober face turned slightly to his right, framed by a full carved periwig.
  var head=new THREE.Group();head.position.set(0,3.842,.013);head.rotation.y=-.24;king.add(head);
  kEll(0,.004,-.006,.089,.123,.088,head);kEll(0,-.079,.035,.065,.045,.052,head);
  [-1,1].forEach(function(sd){kEll(sd*.047,-.026,.065,.035,.045,.026,head);kCurve([[sd*.014,.045,.077],[sd*.04,.052,.09],[sd*.065,.038,.07]],.008,head);kCurve([[sd*.019,.021,.085],[sd*.04,.023,.091],[sd*.060,.014,.074]],.004,head);});
  kLimb([0,.033,.083],[0,-.027,.112],.015,.012,head);kEll(0,-.03,.117,.017,.015,.021,head);
  kCurve([[-.029,-.062,.092],[0,-.066,.103],[.027,-.062,.092]],.004,head);
  [-1,1].forEach(function(sd){kCurve([[0,-.048,.102],[sd*.018,-.045,.106],[sd*.032,-.054,.092]],.004,head);});
  kEll(0,-.103,.056,.035,.014,.031,head);
  kEll(0,.044,-.05,.112,.125,.086,head);
  // Ringlets are carved winding strands rather than a halo of spherical beads.
  [-1,1].forEach(function(sd){for(var row=0;row<5;row++){for(var lock=0;lock<3;lock++){var pts=[],cx=sd*(.092+lock*.022+row*.007),cy=.07-row*.073,cz=-.026-lock*.024;
    for(var n=0;n<=18;n++){var a=n/18*Math.PI*2.7;pts.push([cx+Math.cos(a)*.019,cy-n*.0028,cz+Math.sin(a)*.019+.053]);}kCurve(pts,.012,head);
  }}});
  for(var curl=0;curl<7;curl++){var x=-.09+curl*.03; kCurve([[x-.02,.104,.043],[x-.012,.132,.064],[x+.01,.135,.063],[x+.022,.114,.053]],.013,head);}
