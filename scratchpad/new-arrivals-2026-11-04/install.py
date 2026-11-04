from pathlib import Path
p=Path('Dream Street Shuffle.twee');s=p.read_text();Path('scratchpad/new-arrivals-2026-11-04/source-before.twee').write_text(s)
# Optional arrival mode uses the existing rendering machinery, with prose revealed by Continue.
a=s.index('// >>>> DSS ROOM KIT BEGIN');b=s.index('// <<<< DSS ROOM KIT END',a);kit=s[a:b]
kit=kit.replace('var top = 0, el = host;', 'if(spec.arrival)return {w:w,h:vh};\nvar top = 0, el = host;',1)
needle="var canvas = document.createElement('canvas');";kit=kit.replace(needle,"if(spec.arrival)wrap.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:9000;isolation:isolate;background:'+bgHex+';overflow:hidden;';\n"+needle,1)
kit=kit.replace('var play = window.dssRoomPlay({ wrap:',"var play = spec.arrival ? {words:{},curTarget:new THREE.Vector3(CAM.tx,CAM.ty,CAM.tz),frame:function(){},withGlowsHidden:function(fn){fn();}} : window.dssRoomPlay({ wrap:",1)
kit=kit.replace('function frameOnce() {','function frameOnce() {\nif(spec.arrival && wrap.hidden)return;',1)
s=s[:a]+kit+s[b:]
marker='// <<<< DSS ROOM KIT END';s=s.replace(marker,marker+'\n'+Path('scratchpad/new-arrivals-2026-11-04/scenes.js').read_text(),1)
for passage,cid in [('Bourchier Street: The Car Park','bc'),('The Barbershop','bd'),('Mister Jimmy’s Drug Store','jd'),("Lackland's Back Room",'pb'),('Coach and Horses lock','gt')]:
 a=s.index(':: '+passage+' [');i=s.index('\n',a)+1;s=s[:i]+'<div id="'+cid+'-container"></div>\n'+s[i:]
p.write_text(s)
