from pathlib import Path
import re
s=Path('Dream Street Shuffle.twee').read_text();t=s.split(':: Pyramid Run [',1)[1].split('\n:: ',1)[0]
css=s.split('/* v2-expansion: Pyramid expedition frame */',1)[1].split('.dss-mini-exit {',1)[0]
markup=t[t.index('<div class="pr-stage">'):t.index('<span id="pyr-run-win"')]
js=re.findall(r'<script>([\s\S]*?)</script>',t)[-1]
Path('/tmp/pyr.js').write_text(js)
hook='''window.pyrTest={get:()=>({px,py,vy,onGround,stumbles,glyphCount,ball,paused,finished,gameClock,lastCheckpoint,ending,pitFall,FLOOR,GLYPHS,LINTELS,SCARABS,SANDS}),set:v=>{if('px'in v){px=v.px;camX=Math.max(0,px-240);}if('py'in v){py=v.py;camY=py-350;}if('vy'in v)vy=v.vy;if('onGround'in v)onGround=v.onGround;if('stumbles'in v)stumbles=v.stumbles;if('glyphCount'in v)glyphCount=v.glyphCount;if('invuln'in v)invuln=v.invuln;},step:(dt,n=1)=>{for(let i=0;i<n;i++){if(!paused)gameClock+=dt*1000;update(dt);draw();}},stop:()=>cancelAnimationFrame(animId)};'''
js=js.replace('  loop();','  loop();\n'+hook)
Path('/tmp/pyr-preview.html').write_text('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#0d0b08;margin:24px;color:#eee}'+css+'</style>'+markup+'<span id="pyr-run-win" style="display:none">Step into the Gallery</span><span id="pyr-run-lose" style="display:none">Limp into the Gallery</span><script>window.dssAudio={isMuted:()=>true};</script><script>'+js+'</script>')
