from pathlib import Path
import re
s=Path('Dream Street Shuffle.twee').read_text();t=s.split(':: The Climb [',1)[1].split('\n:: ',1)[0]
css=s.split('/* v2-expansion: The Climb stage */',1)[1].split('/* v2-expansion: Pyramid Run stage */',1)[0]
markup=t[t.index('<div class="hc-stage">'):t.index('<span id="hc-win"')]
js=re.findall(r'<script>([\s\S]*?)</script>',t)[-1]
Path('/tmp/dss-climb.js').write_text(js)
# Test hooks exist only in this throwaway fixture, never in production.
hook='''window.hcTest={get:function(){return {px,py,vx,vy,grounded,prints,slips,breath,maxY,paused,finished,gameClock,checkpoint:checkpoint.y,endSeq,yetiY,printList:printList.map(p=>({...p})),ledges:LEDGES,ladders:LADDERS,route:ROUTE};},calm:function(){avvy.fired=true;snowNext=1e9;gust.next=1e9;invuln=1e6;},set:function(v){if('px'in v)px=v.px;if('py'in v)py=v.py;if('vx'in v)vx=v.vx;if('vy'in v)vy=v.vy;if('grounded'in v)grounded=v.grounded;if('slips'in v)slips=v.slips;if('prints'in v)prints=v.prints;if('breath'in v)breath=v.breath;if('maxY'in v)maxY=v.maxY;},step:function(dt,n){for(var i=0;i<(n||1);i++){gameClock+=dt*1000;update(dt,gameClock);drawDt=dt;draw(gameClock);}},stop:function(){cancelAnimationFrame(animId);},end:function(win){prints=win?10:0;slips=win?0:5;py=SUMMIT;grounded=true;},claim:function(i){claimFlag(LEDGES[i]);}};'''
js=js.replace('  loop();','  loop();\n'+hook)
html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#0c131c;margin:24px;font-family:Georgia;color:#eee}'+css+'</style>'+markup+'<span id="hc-win" style="display:none">Follow him in</span><span id="hc-lose" style="display:none">Climb in after him</span><script>window.dssAudio={isMuted:()=>true};</script><script>'+js+'</script>'
Path('/tmp/dss-climb-preview.html').write_text(html)
