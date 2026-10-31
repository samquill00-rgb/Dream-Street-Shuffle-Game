window.dssSkeleton = function() {
  if (!window.THREE) return null;
  // 2026-10-30 (Sam): aged, tactile bone rather than smooth cream plastic.
  function surface(kind) {
    var c=document.createElement('canvas');c.width=c.height=256;var cx=c.getContext('2d');
    cx.fillStyle=kind==='wood'?'#69492e':'#dccba9';cx.fillRect(0,0,256,256);
    for(var i=0;i<95;i++){
      var x=(i*73.37)%256,y=(i*47.91)%256;
      var wash=cx.createRadialGradient(x,y,0,x,y,12+i%25);
      wash.addColorStop(0,kind==='wood'?'rgba(28,15,5,0.20)':'rgba(123,97,61,0.19)');wash.addColorStop(1,'rgba(110,85,49,0)');
      cx.fillStyle=wash;cx.fillRect(x-40,y-40,80,80);
    }
    for(var j=0;j<660;j++){
      cx.fillStyle=j%3?'rgba(105,80,48,0.18)':'rgba(255,246,215,0.28)';
      cx.fillRect((j*67.13)%256,(j*39.71)%256,0.6+j%2,kind==='wood'?8+j%29:0.8+j%3);
    }
    cx.strokeStyle=kind==='wood'?'rgba(29,16,8,0.28)':'rgba(124,101,69,0.16)';cx.lineWidth=kind==='wood'?1.1:0.65;
    for(var k=0;k<22;k++){var sx=(k*41.3)%256;cx.beginPath();cx.moveTo(sx,0);for(var yy=16;yy<=256;yy+=16)cx.lineTo(sx+Math.sin(yy*0.025+k)*2.5,yy);cx.stroke();}
    if(kind==='skull'){
      cx.strokeStyle='rgba(98,76,47,0.52)';cx.lineWidth=1.1;
      // Broken interlocking cranial seams, drawn into the bone surface.
      [0,1].forEach(function(axis){cx.beginPath();for(var n=0;n<=32;n++){var u=24+n*6.5,v=116+Math.sin(n*0.4)*12+(n%2?2:-2);var px=axis?v:u,py=axis?u:v;if(n)cx.lineTo(px,py);else cx.moveTo(px,py);}cx.stroke();});
    }
    return new THREE.CanvasTexture(c);
  }
  var boneMap=surface('bone'),skullMap=surface('skull'),woodMap=surface('wood');
  var g = new THREE.Group(), bone = new THREE.MeshStandardMaterial({ color: 0xf4e8cc, map:boneMap, bumpMap:boneMap, bumpScale:0.0018, roughnessMap:boneMap, roughness:0.88 }), dark = new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.9 }), wood = new THREE.MeshStandardMaterial({ color: 0x967557, map:woodMap, bumpMap:woodMap, bumpScale:0.004, roughness:0.82 });
  var skullBone=bone.clone();skullBone.map=skullBone.bumpMap=skullBone.roughnessMap=skullMap;
  function add(geo, m, x, y, z, rx, rz) { var o = new THREE.Mesh(geo, m); o.position.set(x, y, z); if (rx) o.rotation.x = rx; if (rz) o.rotation.z = rz; o.castShadow = true; g.add(o); return o; }
  function limb(a, b, r) { var A = new THREE.Vector3().fromArray(a), B = new THREE.Vector3().fromArray(b), d = B.clone().sub(A), o = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.8, r, d.length(), 8), bone); o.position.copy(A).add(B).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); o.castShadow = true; g.add(o); add(new THREE.SphereGeometry(r * 1.35, 8, 6), bone, B.x, B.y, B.z); }
  add(new THREE.CylinderGeometry(0.2, 0.24, 0.04, 16), wood, 0, 0.02, -0.12); add(new THREE.CylinderGeometry(0.018, 0.018, 1.9, 8), wood, 0, 0.97, -0.12); add(new THREE.BoxGeometry(0.02, 0.02, 0.14), wood, 0, 1.9, -0.06);
  var skull = add(new THREE.SphereGeometry(0.1, 16, 12), skullBone, 0, 1.68, 0); skull.scale.set(0.85, 1, 1.05);
  add(new THREE.BoxGeometry(0.1, 0.05, 0.08), bone, 0, 1.585, 0.025); [-0.035, 0.035].forEach(function(x) { add(new THREE.SphereGeometry(0.022, 8, 6), dark, x, 1.68, 0.082); }); add(new THREE.SphereGeometry(0.012, 6, 4), dark, 0, 1.635, 0.093);
  for (var v = 0; v < 14; v++) add(new THREE.CylinderGeometry(0.02, 0.022, 0.03, 8), bone, 0, 1.53 - v * 0.04, -0.02);
  for (var r = 0; r < 7; r++) { var rib = add(new THREE.TorusGeometry(0.11 - Math.abs(r - 3) * 0.008, 0.008, 6, 18, Math.PI * 1.75), bone, 0, 1.44 - r * 0.045, 0.03, Math.PI / 2); rib.rotation.z = Math.PI * 0.625; rib.scale.set(1.15, 0.85, 1); }
  add(new THREE.BoxGeometry(0.03, 0.17, 0.015), bone, 0, 1.33, 0.12);
  var pelvis = add(new THREE.TorusGeometry(0.095, 0.03, 8, 16), bone, 0, 0.93, 0, Math.PI / 2.4); pelvis.scale.set(1.25, 1, 0.8);
  [-1, 1].forEach(function(sd) {
    add(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 6), bone, sd * 0.09, 1.49, 0.03, 0, Math.PI / 2);
    limb([sd * 0.17, 1.48, 0], [sd * 0.2, 1.18, 0.02], 0.018); limb([sd * 0.2, 1.18, 0.02], [sd * 0.21, 0.92, 0.07], 0.015);
    for (var f = 0; f < 4; f++) limb([sd * (0.2 + f * 0.008), 0.92, 0.06 + f * 0.01], [sd * (0.2 + f * 0.01), 0.83, 0.08 + f * 0.012], 0.005);
    limb([sd * 0.09, 0.9, 0], [sd * 0.1, 0.5, 0.01], 0.022); limb([sd * 0.1, 0.5, 0.01], [sd * 0.1, 0.1, -0.01], 0.019);
    add(new THREE.BoxGeometry(0.07, 0.03, 0.17), bone, sd * 0.1, 0.07, 0.05);
  });
  return g;
};