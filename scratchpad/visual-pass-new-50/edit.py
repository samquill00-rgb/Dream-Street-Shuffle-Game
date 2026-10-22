from pathlib import Path
import re
p=Path('Dream Street Shuffle.twee');s=p.read_text();out=Path('scratchpad/visual-pass-new-50');tasks=[]
def task(slug,start,end,anchor,label,code):tasks.append((slug,start,end,anchor,label,code))
def add(slug,label,code):
 start,end,anchor=scopes[slug];task(slug,start,end,anchor,label,code)
scopes={
'bookshop':("// ====== O'FLATTERLY'S BOOKSHOP SCENE",'// ====== THIRD PILLAR PORTAL SCENE','// ---- LIGHTING: the shop is'),
 'trisha':("// ====== TRISHA'S SCENE","// ====== O'FLATTERLY'S BOOKSHOP SCENE",'// Lighting\n'),
 'colony':('// ====== COLONY ROOM SCENE',"// ====== RONNIE SCOTT'S SCENE",'// ============================================================\n// PUDDLES'),
 'lackland':("// ====== LACKLAND'S OFFICE SCENE",'// ====== CARTHAGE COAST','var silhouettes = [];'),
 'centre':('// ====== CENTRE POINT SCENE','function buildFcScene()','// ============================================================\n// SKY —')}
add('bookshop','Door knob escutcheon and screws',"f.box(0.085,0.14,0.008,0x78643b,-1.28,1.45,0.105);f.pin(-1.28,1.5,0.113);f.pin(-1.28,1.4,0.113);")
add('bookshop','Door hinge leaves',"[0.6,2.35].forEach(function(y){f.box(0.075,0.09,0.01,0x4f5949,-2.015,y,0.12);f.pin(-2.015,y,0.133);});")
add('bookshop','Stone threshold rubbed top',"ex.step(null,-1.62,0.052,0.35,0.96,0.27);")
add('bookshop','Canvas awning stitched seams',"[-0.36,0.38].forEach(function(x){f.wire([[x,-0.48,0.003],[x,0,0.003],[x,0.48,0.003]],0.0025,0x72816a,awning);});")
add('bookshop','Awning support pivot bolts',"[-0.72,2.07].forEach(function(x){f.box(0.08,0.11,0.018,0x344f3c,x,2.73,0.155,null,true);f.pin(x,2.73,0.17);});")
add('bookshop','Browsing crates slats and end battens',"for(var c=0;c<3;c++){var x=-0.05+c*0.78;[-0.23,0.23].forEach(function(dx){f.box(0.035,0.16,0.018,0x69503a,x+dx,0.72,1.218);});f.box(0.62,0.008,0.01,0x1c160e,x,0.71,1.216);}")
add('bookshop','Stock bench worn rail and pegged joints',"f.box(2.25,0.012,0.018,0x70533a,0.675,0.622,1.249);[-0.375,1.725].forEach(function(x){f.box(0.035,0.025,0.006,0x9a7851,x,0.59,1.215);});")
add('bookshop','Hanging sign raised narrow rim',"[-0.2,0.2].forEach(function(x){f.box(0.012,0.5,0.025,0x52634a,x,-0.28,0,ofPivot);});[-0.53,-0.03].forEach(function(y){f.box(0.4,0.012,0.025,0x52634a,0,y,0,ofPivot);});")
add('bookshop','Hanging sign eyelets',"[-0.13,0.13].forEach(function(x){f.ring(0.022,0.005,0x666b53,x,-0.014,0,ofPivot,true);});")
add('bookshop','Window glazing edge dust',"ex.glassEdge(null,0.675,1.5,0.13,2.85,1.65,0);")
add('trisha','Knob backplate tiny fixings',"f.pin(0.36,1.958,0.234);f.pin(0.36,1.842,0.234);")
add('trisha','Letterbox corner screws',"[-0.177,0.177].forEach(function(x){f.pin(x,1.62,0.244);});")
add('trisha','Black door hinge knuckles',"[0.9,2.8].forEach(function(y){f.box(0.055,0.095,0.025,0x30312b,-0.515,y,0.232);});")
add('trisha','Lower door rubbed paint',"for(var k=0;k<6;k++)f.box(0.03+k*0.008,0.004,0.002,0x37342a,-0.3+k*0.11,0.69+(k%3)*0.02,0.227);")
add('trisha','Number slate recessed fixings',"[[-1.68,2.94],[-1.42,2.94],[-1.68,3.26],[-1.42,3.26]].forEach(function(p){f.pin(p[0],p[1],0.169);});")
add('trisha','Lantern bracket wall plate',"f.box(0.11,0.2,0.018,0x35342b,-1.08,3.55,0.155,null,true);f.pin(-1.08,3.62,0.173);f.pin(-1.08,3.48,0.173);")
add('trisha','Lantern top ventilation slots',"for(var v=0;v<4;v++)f.box(0.025,0.012,0.003,0x090b0b,-1.17+v*0.05,3.37,0.522);")
add('trisha','Awning underside support ribs',"[-0.7,0,0.7].forEach(function(x){f.wire([[x,4.43,0.58],[x,4.42,0.86],[x,4.41,1.12]],0.008,0x38362d);});")
add('trisha','Stone steps gently worn noses',"ex.step(null,0,0.462,0.38,1.26,0.35);ex.step(null,0,0.352,0.62,1.41,0.39);")
add('trisha','Kerb block joints',"for(var j=-3.5;j<4;j+=1)f.box(0.009,0.12,0.008,0x22221f,j,0.35,5.075);")
add('colony','Door hinges on both entrances',"[leftDoor,rightDoor].forEach(function(g){[0.6,2.6].forEach(function(y){f.box(0.055,0.09,0.018,0x554d3e,-0.52,y,0.15,g,true);});});")
add('colony','Door knob backplate fixings',"[leftDoor,rightDoor].forEach(function(g){f.pin(-0.055,1.55,0.152,g);f.pin(0.055,1.55,0.152,g);});")
add('colony','Letterbox hinged flap edge',"[leftDoor,rightDoor].forEach(function(g){f.box(0.22,0.01,0.009,0x9e8655,0,1.12,0.153,g,true);});")
add('colony','Drain inset slots and cast frame',"ex.tread(null,-1,0.022,2.8,0.47,0.32,false);")
add('colony','Bollard turned collars',"f.ring(0.091,0.012,0x4e4d46,2.2,0.16,2.2);f.ring(0.083,0.009,0x4e4d46,2.2,0.72,2.2);")
add('colony','Old railing stumps split tops',"for(var st=0;st<3;st++){f.box(0.009,0.025,0.02,0x7a6950,-2.5+st*0.3,0.38,0.5);}")
add('colony','Cast iron pipe joint collars',"[0.9,4,7.5,11].forEach(function(y){f.ring(0.045,0.008,0x45443b,0.15,y,0.12);});")
add('colony','Hopper dark open throat',"f.put(new THREE.CircleGeometry(0.083,12),f.mat(0x090b0c),0.15,13.405,0.12).rotation.x=-Math.PI/2;")
add('colony','Drainpipe shoe mouth',"f.box(0.075,0.065,0.003,0x080a0b,0.15,0.17,0.242);f.box(0.1,0.015,0.025,0x47453a,0.15,0.135,0.247,null,true);")
add('colony','Streetlamp base anchor bolts',"[-3,6,-10].forEach(function(x){f.ring(0.17,0.02,0x4b4840,x,0.1,1.8);[-0.12,0.12].forEach(function(dx){f.pin(x+dx,0.12,1.91);});});")
add('lackland','Door knob fixing heads',"f.pin(-0.055,1.55,0.152,doorGroup);f.pin(0.055,1.55,0.152,doorGroup);")
add('lackland','Letterbox flap rolled edge',"f.box(0.23,0.009,0.009,0x9e8655,0,1.12,0.153,doorGroup,true);")
add('lackland','Door hinge leaves and knuckles',"[0.6,2.65].forEach(function(y){f.box(0.055,0.09,0.018,0x525747,-0.52,y,0.15,doorGroup,true);});")
add('lackland','Drain cast tread and lifting recess',"ex.tread(null,-1.5,0.022,2.8,0.47,0.32,false);")
add('lackland','Bollard base collar',"f.ring(0.095,0.014,0x55534a,1.8,0.15,2.2);f.ring(0.082,0.01,0x55534a,1.8,0.73,2.2);")
add('lackland','Dustbin lid rolled rim',"f.ring(0.245,0.013,0x77766b,0,0.017,0,lid);")
add('lackland','Dustbin lid carry handle',"f.wire([[-0.06,0.018,0],[-0.06,0.065,0],[0.06,0.065,0],[0.06,0.018,0]],0.009,0x77766b,lid);")
add('lackland','Dustbin pressed body ribs',"for(var r=0;r<12;r++){var a=r*Math.PI/6;var rib=f.box(0.014,0.57,0.014,0x66665d,-3.8+Math.cos(a)*0.239,0.5,1.2+Math.sin(a)*0.239,null,true);}")
add('lackland','Dustbin side handles',"[-1,1].forEach(function(side){f.wire([[-3.8+side*0.23,0.66,1.15],[-3.8+side*0.29,0.66,1.15],[-3.8+side*0.29,0.58,1.25],[-3.8+side*0.23,0.58,1.25]],0.008,0x77766b);});")
add('lackland','Streetlamp foot collars and bolts',"[2.5,-5,10].forEach(function(x){f.ring(0.17,0.018,0x4b4840,x,0.1,2.5);f.pin(x-0.12,0.12,2.61);f.pin(x+0.12,0.12,2.61);});")
add('centre','Podium concrete expansion joints',"[-2.4,0,2.4].forEach(function(x){f.box(0.012,1.8,0.008,0x706e64,x,1,3.505);});")
add('centre','Overhang drip groove',"f.box(7.7,0.008,0.012,0x77756b,0,1.974,3.94);")
add('centre','Colonnade pillar foot collars',"for(var i=0;i<8;i++){var a=i*Math.PI/4;f.ring(0.18,0.009,0x939084,Math.sin(a)*3.8,0.06,Math.cos(a)*3.8);}")
add('centre','Podium rain-sill edging',"f.box(6.9,0.025,0.04,0x9c998d,0,0.16,3.53);")
add('centre','Lower block window bottom glazing beads',"for(var w=0;w<6;w++)f.box(0.82,0.025,0.018,0x6e706d,-3.5+w*1.4,3.35,0.54);")
add('centre','Lower block window side gaskets',"for(var w=0;w<6;w++){var x=-3.5+w*1.4;[-0.399,0.399].forEach(function(dx){f.box(0.012,0.89,0.008,0x202522,x+dx,3.8,0.534);});}")
add('centre','Roof plant room louvres',"for(var l=0;l<8;l++)f.box(1.5,0.025,0.03,0x3d4140,0,TOWER_H+1.2+l*0.1,1.765);")
add('centre','Warning lamp metal footing',"f.put(new THREE.CylinderGeometry(0.16,0.19,0.065,12),f.mat(0x6d6c63,true),0,TOWER_H+3.08,0);")
add('centre','Warning lamp guard ring',"f.ring(0.123,0.008,0x6d6c63,0,TOWER_H+3.2,0);")
add('centre','Paving movement joints',"[-6,-3,0,3,6].forEach(function(x){f.box(0.009,0.002,4,0x30312e,x,0.003,6.3);});")
assert len(tasks)==50
(out/'checklist.md').write_text('# Fifty details in previously untouched exteriors\n\n'+'\n'.join('- [ ] '+str(i+1)+'. '+v[0]+': '+v[4] for i,v in enumerate(tasks))+'\n')
for slug,(start,end,anchor) in scopes.items():
 a=s.index(start);b=s.index(end,a+len(start));t=s[a:b];(out/(slug+'-before.js')).write_text(t)
 codes=['// Restrained fittings and worn edges: exterior detail pass.','(function(){var f=window.dssDreamDetail('+('cpScene' if slug=='centre' else 'scene')+');var ex=window.dssExteriorDetail('+('cpScene' if slug=='centre' else 'scene')+');']
 for v in tasks:
  if v[0]==slug:codes.extend(['// '+v[4],v[5]])
 codes.append('})();\n')
 assert anchor in t,slug;t=t.replace(anchor,'\n'.join(codes)+'\n'+anchor,1);s=s[:a]+t+s[b:]
p.write_text(s)
check=out/'checklist.md';check.write_text(check.read_text().replace('[ ]','[x]'))
print('Completed 50 scoped details')
