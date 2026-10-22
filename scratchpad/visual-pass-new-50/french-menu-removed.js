// ---- CHALKBOARD SIGN outside ----
// A-frame chalkboard
var cbLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.7, 0.35), woodMat);
cbLeg1.position.set(-1.65, 0.35, 1.05); cbLeg1.rotation.z = 0.08; pub.add(cbLeg1);
var cbLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.7, 0.35), woodMat);
cbLeg2.position.set(-1.95, 0.35, 1.05); cbLeg2.rotation.z = -0.08; pub.add(cbLeg2);
// Board face
var cbBoard = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.04),
new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 }));
cbBoard.position.set(-1.8, 0.42, 1.2); cbBoard.rotation.y = 0.12; pub.add(cbBoard);
// Wood frame around board
placeMesh(pub, new THREE.BoxGeometry(0.44, 0.03, 0.05), woodMat, -1.8, 0.71, 1.2);
placeMesh(pub, new THREE.BoxGeometry(0.44, 0.03, 0.05), woodMat, -1.8, 0.13, 1.2);
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.55, 0.05), woodMat, -1.58, 0.42, 1.2);
placeMesh(pub, new THREE.BoxGeometry(0.03, 0.55, 0.05), woodMat, -2.02, 0.42, 1.2);

var cbC = document.createElement('canvas');
cbC.width = 96; cbC.height = 128;
var cbctx = cbC.getContext('2d');
cbctx.fillStyle = '#0a0a0a'; cbctx.fillRect(0, 0, 96, 128);
cbctx.fillStyle = '#c8c0a0'; cbctx.font = 'italic 13px Georgia'; cbctx.textAlign = 'center';
cbctx.fillText('MENU', 48, 22);
cbctx.fillText('du Jour', 48, 40);
cbctx.strokeStyle = '#808060'; cbctx.lineWidth = 0.5;
cbctx.beginPath(); cbctx.moveTo(20, 48); cbctx.lineTo(76, 48); cbctx.stroke();
cbctx.font = '10px Georgia';
cbctx.fillText('Soupe \u00E0 l\'oignon', 48, 65);
cbctx.fillText('Steak frites', 48, 82);
cbctx.fillText('Cr\u00E8me br\u00FBl\u00E9e', 48, 99);
cbctx.fillStyle = '#a09060'; cbctx.font = 'italic 9px Georgia';
cbctx.fillText('~ Bon App\u00E9tit ~', 48, 120);
var cbTex = new THREE.CanvasTexture(cbC);
var cbFace = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.5),
new THREE.MeshBasicMaterial({ map: cbTex }));
cbFace.position.set(-1.8, 0.42, 1.23); cbFace.rotation.y = 0.12; pub.add(cbFace);
exterior.finish(woodMat,false);exterior.plate(pub,-1.8,0.71,1.23,0.11,0.035,0,0x71654c);exterior.age(cbTex,false);

