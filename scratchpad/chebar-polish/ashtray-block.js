var ashG=new THREE.Group();ashG.position.set(ashPos[0],ashPos[1],ashPos[2]);scene.add(ashG);
var ashGlass=new THREE.MeshPhysicalMaterial({color:0xb6bca9,roughness:0.32,metalness:0,envMap:roomEnv,envMapIntensity:0.55,clearcoat:0.4,transparent:true,opacity:0.43,depthWrite:false,side:THREE.DoubleSide});
var ashProfile=[[0,0.001],[0.039,0.001],[0.047,0.005],[0.051,0.018],[0.050,0.023],[0.045,0.024],[0.039,0.010],[0,0.009]].map(function(p){return new THREE.Vector2(p[0],p[1]);});
mesh(new THREE.LatheGeometry(ashProfile,40),ashGlass,0,0,0,ashG);
// Four low rim rests, worn smooth where cigarettes were laid.
for(var rest=0;rest<4;rest++){pubArc(ashG,0.047,0.0022,ashGlass,0,0.023,0,Math.PI/2-0.12,rest*Math.PI/2+0.06);}
var ashGrey=new THREE.MeshStandardMaterial({color:0x77736a,roughness:1});
var ashDust=tex(128,128,function(cx,w,h){cx.clearRect(0,0,w,h);for(var n=0;n<700;n++){var angle=n*2.39996,r=Math.sqrt((n*37%701)/701)*53;cx.fillStyle=n%3?'rgba(102,98,88,0.24)':'rgba(193,184,161,0.3)';cx.fillRect(64+Math.cos(angle)*r,64+Math.sin(angle)*r,1+n%3,1);}});
var dust=mesh(new THREE.CircleGeometry(0.036,32),new THREE.MeshStandardMaterial({map:ashDust,transparent:true,roughness:1,depthWrite:false}),0,0.0095,0,ashG);dust.rotation.x=-Math.PI/2;
var buttPaper=new THREE.MeshStandardMaterial({map:pubWear('#d8ceb3',19,false),roughness:0.95});
var buttFilter=new THREE.MeshStandardMaterial({map:pubWear('#9b6c39',23,false),roughness:1});
for(var end=0;end<3;end++){
 var butt=new THREE.Group();butt.position.set((end-1)*0.016,0.012,(end%2)*0.015-0.009);butt.rotation.y=end*1.8+0.4;ashG.add(butt);
 var paper=mesh(new THREE.CylinderGeometry(0.0031,0.0034,0.014+end*0.003,10),buttPaper,0,0,0,butt);paper.rotation.z=Math.PI/2;
 var filter=mesh(new THREE.CylinderGeometry(0.0034,0.0034,0.009,10),buttFilter,-0.011,0,0,butt);filter.rotation.z=Math.PI/2;
 var char=mesh(new THREE.SphereGeometry(0.0034,8,6),ashGrey,0.008+end*0.0015,0,0,butt);char.scale.x=0.55;
}
for(var fleck=0;fleck<15;fleck++){var angle=fleck*2.4,r=0.008+(fleck*7%23)/1000;var crumb=mesh(new THREE.SphereGeometry(0.0007+fleck%3*0.0002,5,4),ashGrey,Math.cos(angle)*r,0.0105,Math.sin(angle)*r,ashG);crumb.scale.y=0.4;}
