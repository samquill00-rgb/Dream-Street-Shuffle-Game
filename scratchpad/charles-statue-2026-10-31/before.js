  // Weather-worn king: plinth, boots, coat folds, lowered arm and a pale unreadable face.
  var king=new THREE.Group();king.position.set(-5,0,2);king.rotation.y=.67;scene.add(king); /* 2026-10-29: turned to face the view */
  box(1.8,.24,1.65,0,.12,0,stone,king);box(1.25,1.3,1.15,0,.88,0,stone,king);box(1.55,.2,1.4,0,1.57,0,stone,king);
  /* 2026-10-29 (Sam: "the statue looks like a child, make it taller and add detail"): Charles II rebuilt at a man's proportions, about 2.3 high on the
     plinth: booted legs with the weight on the left, a Roman cuirass with its skirt of strips and belt, a cloak from the shoulders, the right hand
     holding a baton, the left on the hip, a small head and a full periwig falling in curls to the shoulders */
  /* 2026-10-29 (Sam: "more detail on the king, use the knight I just downloaded as a base"): his knight_statue.blend (a rigged human in armour) can't
     be opened here, so the King is armoured like it, as the real Soho Square Charles II is: sabatons, greaves, poleyns with side-wings, cuisses,
     the strip skirt under stepped faulds, a ridged breastplate and gorget, layered pauldrons, couters, vambraces and gauntlets, the cloak, the
     baton, a modelled face (brows, nose, moustache) under the full periwig */
  function lame(r0,r1,h,y,sc,par){var q=mesh(new THREE.CylinderGeometry(r1,r0,h,20,1,true),stone,0,y,0,par||king);q.scale.z=sc||.78;q.material.side=THREE.DoubleSide;return q;}
  [[-.15,.06],[.17,0]].forEach(function(p){var x=p[0],z=p[1];
    for(var sb=0;sb<4;sb++)box(.17-sb*.01,.04,.09+sb*.012,x,1.7+sb*.03,z+.13-sb*.045,stone,king);box(.16,.09,.14,x,1.75,z-.04,stone,king);
    beam([x,1.8,z],[x*1.04,2.23,z*.6],.085,stone,king);var gr=mesh(new THREE.CylinderGeometry(.1,.085,.36,12),stone,x*1.04,2.0,z*.8,king);gr.scale.z=.85;
    var pk=orb(.105,x*1.04,2.27,z*.6+.02,stone,king);pk.scale.set(1,.8,1.1);var wing=mesh(new THREE.CircleGeometry(.07,12),stone,x*1.04+(x<0?-.1:.1),2.27,z*.6,king);wing.rotation.y=x<0?-Math.PI/2:Math.PI/2;wing.material.side=THREE.DoubleSide;
    beam([x*1.04,2.3,z*.6],[x*.9,2.72,0],.115,stone,king);for(var cl=0;cl<3;cl++){var cu=mesh(new THREE.CylinderGeometry(.125-cl*.004,.13-cl*.004,.08,14),stone,x*(1-cl*.04),2.42+cl*.09,z*.4*(1-cl*.3),king);cu.scale.z=.9;}});
  for(var ts=0;ts<16;ts++){var ta=ts/16*Math.PI*2;beam([Math.cos(ta)*.25,2.9,Math.sin(ta)*.2],[Math.cos(ta)*.31,2.6,Math.sin(ta)*.25],.03,stone,king);}
  for(var fd=0;fd<3;fd++)lame(.3+fd*.012,.28+fd*.012,.07,3.0-fd*.06);
  var cuir=mesh(new THREE.LatheGeometry([[0,3.04],[.28,3.04],[.3,3.12],[.32,3.28],[.31,3.44],[.25,3.56],[.12,3.62],[0,3.62]].map(function(q){return new THREE.Vector2(q[0],q[1]);}),24),stone,0,0,0,king);cuir.scale.z=.76;
  beam([0,3.1,.235],[0,3.52,.2],.018,stone,king);
  var belt=mesh(new THREE.TorusGeometry(.29,.028,8,28),stone,0,3.05,0,king);belt.rotation.x=Math.PI/2;belt.scale.y=.76;
  for(var gg=0;gg<3;gg++)lame(.14-gg*.012,.17-gg*.012,.04,3.6+gg*.035,.85);
  [-1,1].forEach(function(sd){var x=sd*.34;
    for(var pl=0;pl<4;pl++){var pd=orb(.15-pl*.012,x+sd*pl*.02,3.5-pl*.06,0,stone,king);pd.scale.set(1,.55,1.05);}
  });
  var cloak=mesh(new THREE.CylinderGeometry(.34,.52,1.5,22,1,true,Math.PI*.55,Math.PI*.9),stone,0,2.78,-.04,king);cloak.material.side=THREE.DoubleSide;
  for(var cf2=0;cf2<6;cf2++){var ca2=Math.PI*.6+cf2/5*Math.PI*.8;beam([Math.sin(ca2)*.36,3.45,Math.cos(ca2)*.3-.04],[Math.sin(ca2)*.5,2.06,Math.cos(ca2)*.42-.04],.02,stone,king);}
  beam([.37,3.42,0],[.46,3.07,.06],.072,stone,king);var cou=orb(.085,.46,3.06,.06,stone,king);cou.scale.set(1,.9,1.2);var vb=mesh(new THREE.CylinderGeometry(.07,.062,.24,12),stone,.44,2.93,.18,king);vb.rotation.x=.95;var gl=orb(.065,.42,2.8,.3,stone,king);gl.scale.set(.9,1.1,1);
  beam([.42,2.62,.22],[.43,3.2,.5],.028,stone,king);orb(.04,.43,3.2,.5,stone,king);orb(.035,.42,2.62,.22,stone,king);
  beam([-.37,3.42,0],[-.48,3.1,-.02],.072,stone,king);var cou2=orb(.085,-.48,3.1,-.02,stone,king);cou2.scale.set(1,.9,1.2);beam([-.48,3.1,-.02],[-.3,2.98,.08],.064,stone,king);var gl2=orb(.065,-.3,2.98,.08,stone,king);gl2.scale.set(1.1,.9,.9);
  beam([0,3.6,0],[0,3.74,.01],.07,stone,king);
  var face=orb(.12,0,3.86,.03,stone,king);face.scale.set(.85,1.1,.95);
  var nose=mesh(new THREE.ConeGeometry(.022,.06,8),stone,0,3.85,.145,king);nose.rotation.x=Math.PI/2+.4;
  [-1,1].forEach(function(sd){var br=mesh(new THREE.BoxGeometry(.05,.012,.02),stone,sd*.04,3.9,.12,king);br.rotation.z=sd*-.15;var eyeS=orb(.016,sd*.04,3.87,.115,stone,king);eyeS.scale.z=.5;var mo=mesh(new THREE.CylinderGeometry(.006,.01,.05,6),stone,sd*.022,3.805,.13,king);mo.rotation.z=Math.PI/2+sd*.35;});
  orb(.035,0,3.76,.09,stone,king).scale.set(1,.6,.8);
  var hair=orb(.17,0,3.9,-.05,stone,king);hair.scale.set(1.18,1.12,1);
  for(var hr=0;hr<4;hr++)for(var hk=0;hk<13;hk++){var ha=Math.PI*.12+hk/12*Math.PI*.76,hx=Math.cos(ha)*(.19+hr*.014),hz=-Math.sin(ha)*.15-.02;orb(.058-hr*.004,hx,3.86-hr*.11,hz,stone,king);if(hr<3&&Math.abs(hx)>.12)orb(.05,hx*1.02,3.86-hr*.11,.02,stone,king);} /* curls round the back and down both sides only, the face clear */
  /* 2026-10-29 (Sam: "age the statue and put a pigeon on its head"): the King and his plinth in their own weathered stone, greyed and green with
     lichen, black rain-streaks run down from every ledge, white droppings on the shoulders; and a London pigeon on his wig, looking about */
  (function(){var cv=document.createElement('canvas');cv.width=cv.height=256;var c=cv.getContext('2d');c.fillStyle='#8c8f86';c.fillRect(0,0,256,256);
    for(var i=0;i<900;i++){c.fillStyle='rgba('+(60+Math.random()*60|0)+','+(64+Math.random()*60|0)+','+(58+Math.random()*50|0)+',.18)';c.fillRect(Math.random()*256,Math.random()*256,2+Math.random()*6,2+Math.random()*6);}
    for(var s=0;s<70;s++){var x=Math.random()*256,y=Math.random()*80,g=c.createLinearGradient(0,y,0,y+60+Math.random()*170);g.addColorStop(0,'rgba(20,22,20,.55)');g.addColorStop(1,'rgba(20,22,20,0)');c.fillStyle=g;c.fillRect(x,y,1.5+Math.random()*4,256);}
    for(var l=0;l<60;l++){var lx=Math.random()*256,ly=Math.random()*256,r=2+Math.random()*9;c.fillStyle=Math.random()<.6?'rgba(110,130,70,.55)':'rgba(190,196,160,.6)';c.beginPath();c.arc(lx,ly,r,0,7);c.fill();}
    for(var w=0;w<18;w++){c.fillStyle='rgba(235,234,226,.75)';var wx=Math.random()*256,wy=Math.random()*40;c.fillRect(wx,wy,2+Math.random()*3,8+Math.random()*30);}
    var t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);
    var aged=new THREE.MeshStandardMaterial({color:0xb4b6aa,map:t,bumpMap:t,bumpScale:.04,roughness:.95,side:THREE.DoubleSide});
    king.traverse(function(o){if(o.isMesh)o.material=aged;});
    var pig=new THREE.Group();pig.position.set(.02,4.07,-.03);pig.rotation.y=.9;king.add(pig);
    function P(c2,r){return new THREE.MeshStandardMaterial({color:c2,roughness:r==null?.8:r});}
    var grey=P(0xf4f2ec,.7),dark=P(0xe6e3da,.7),neck=P(0xf8f6f0,.6),pink=P(0xd88a8a),beak=P(0x8a7a70),eye=P(0x1a1210,.3); /* 2026-10-29 (Sam): a white dove now, not a pigeon */
    function e(rx,ry,rz,m,x,y,z,par){var q=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),m);q.scale.set(rx,ry,rz);q.position.set(x,y,z);q.castShadow=true;(par||pig).add(q);return q;}
    e(.11,.075,.07,grey,0,.07,0);var wing=e(.1,.05,.075,P(0xeceae2,.7),-.02,.085,0);[-1,1].forEach(function(sd){var bar=new THREE.Mesh(new THREE.BoxGeometry(.05,.008,.005),dark);bar.position.set(-.02,.085,sd*.074);pig.add(bar);var bar2=bar.clone();bar2.position.x=-.06;pig.add(bar2);});
    var tl=new THREE.Mesh(new THREE.BoxGeometry(.1,.012,.06),dark);tl.position.set(-.15,.08,0);tl.rotation.z=.25;pig.add(tl);
    e(.05,.055,.05,neck,.08,.12,0);var hd=new THREE.Group();hd.position.set(.1,.16,0);pig.add(hd);e(.038,.035,.033,grey,0,0,0,hd);
    var bk=new THREE.Mesh(new THREE.ConeGeometry(.008,.03,6),beak);bk.rotation.z=-Math.PI/2;bk.position.set(.045,-.004,0);hd.add(bk);[-1,1].forEach(function(sd){e(.008,.008,.004,eye,.02,.01,sd*.03,hd);});
    [-1,1].forEach(function(sd){var lg=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.04,5),pink);lg.position.set(.01,.02,sd*.025);pig.add(lg);});
    var host=document.querySelector('#sq-container'),t0=performance.now(),iv=setInterval(function(){if(host&&!host.isConnected){clearInterval(iv);return;}var s2=(performance.now()-t0)/1000;hd.rotation.y=Math.sin(s2*.7)*.6+(Math.sin(s2*3.1)>.97?.5:0);hd.position.x=.1+Math.max(0,Math.sin(s2*5))*.012;},50);
  })();
  box(1.37,.09,1.26,0,1.38,0,stone,king);box(1.4,.10,1.3,0,.31,0,stone,king);
