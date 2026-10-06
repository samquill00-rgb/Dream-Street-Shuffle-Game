"""Splice The Harmony game into the King's Chamber passage (2026-10-06).
Run from the repo root: python3 scratchpad/pyramid-harmony-2026-10-06/apply.py
"""
import re, sys
P = "Dream Street Shuffle.twee"
s = open(P, encoding="utf-8").read()

# 1. Dr Quill's paragraph replaces the four pink paragraphs.
old_prose = '''<div class="claude-draft">
The chamber is a stone box. Granite, not limestone. An empty sarcophagus stands against the far wall, lid lost. There is no ornament because the room is the ornament.

You stand at the centre and you hum. The chamber holds the hum longer than a chamber should, then gives the note back, slightly different.

Someone is sitting on the lip of the sarcophagus humming the same note a little under yours. The Bard, Al Hubz. He does not stop to introduce himself, because the note would drop.

The note has a number in it. The relation of one length to another, held in stone at the size of a room. You can almost see it.
</div>

(link: "Listen until it resolves")['''
assert s.count(old_prose) == 1

GAME = r'''<div>
At the heart of the granite chamber is an empty sarcophagus and at its heart, or where the heart would be, is the note the bard, Al Hubz, was singing, in the form of a buzzing scarab, caught mid-flight as if the wet air in the sepulchre was amber.
</div>

<!-- THE HARMONY (2026-10-06, Sam: "hold down a click to make your own humming reach a
     certain pitch which is exactly a tritone above his pitch"). Flat 2D canvas, no WebGL.
     Hold to hum: your note starts on Al Hubz's and climbs three semitones a second; let go
     to hold it. A tritone above him (six semitones, the ratio of root two) within 40 cents
     is a hit and sets $pyramidHarmony. Past the seventh semitone the note cracks. Three
     attempts, then fail-forward: the "Listen until it resolves" link appears either way.
     Every word on the screen is a pink placeholder in [Sam: ...] form. The hm-mark link is
     parked off-screen, not display:none, because Harlowe drops .click() on a hidden tw-link. -->
<div id="dss-harmony" class="claude-draft">
<div class="hm-stage"><canvas width="600" height="400" tabindex="0" aria-label="The granite chamber. An empty sarcophagus, and at its heart a scarab caught in amber. Hold to hum; let go to hold the note."></canvas><div class="hm-banner" aria-hidden="true"></div></div>
<div class="hm-status" role="status" aria-live="polite"><b class="hm-title">[Sam: Hold to hum. Let go when the scarab opens its wings.]</b><span class="hm-marks" aria-label="attempts"><i></i><i></i><i></i></span></div>
<div class="hm-help">[Sam: Mouse, finger or the space bar, held down.]</div>
</div>
<span id="hm-mark" aria-hidden="true">(link: "hm-harmony")[(set: $pyramidHarmony to true)]</span>
<style>
#dss-harmony{max-width:660px;width:100%;margin:22px auto 10px;text-align:center;box-sizing:border-box;font-family:Georgia,serif}
#dss-harmony > br,#dss-harmony .hm-stage > br,#dss-harmony .hm-status > br{display:none}
#dss-harmony b,#dss-harmony span{color:inherit}
#dss-harmony .hm-stage{position:relative;width:100%;aspect-ratio:3/2;border:1px solid #81765c;border-radius:6px;overflow:hidden;background:#130f0b;box-sizing:border-box;box-shadow:0 16px 50px #0007}
#dss-harmony canvas{display:block;width:100%;height:100%;touch-action:none;cursor:pointer;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
#dss-harmony canvas:focus-visible{outline:2px solid #dfb978;outline-offset:3px}
#dss-harmony .hm-banner{position:absolute;left:0;right:0;bottom:9%;pointer-events:none;font:italic clamp(13px,2.6vw,18px)/1.3 Georgia,serif;color:#f5d490;text-shadow:0 0 14px #f5d49066;opacity:0;transition:opacity .5s}
#dss-harmony .hm-status{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 4px 2px;font-size:clamp(13px,2.4vw,16px);text-align:left}
#dss-harmony .hm-marks{display:inline-flex;gap:7px;flex:none}
#dss-harmony .hm-marks i{display:inline-block;width:9px;height:9px;border:1px solid #c9ab6f;border-radius:50%;opacity:.55;transition:background .4s,opacity .4s}
#dss-harmony .hm-marks i.hm-miss{background:#6b5236}
#dss-harmony .hm-marks i.hm-hit{background:#f5d490;opacity:1;box-shadow:0 0 10px #f5d490aa}
#dss-harmony .hm-help{font-size:11px;letter-spacing:.08em;opacity:.6;padding:4px 0 0}
#hm-mark{position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none}
#hm-after{display:none}
#hm-after.hm-revealed{display:block;animation:hmReveal 1.2s ease-out}
@keyframes hmReveal{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion: reduce){#hm-after.hm-revealed{animation:none}}
</style>
<script>
(function(){
  var root=document.getElementById('dss-harmony'); if(!root||root.dataset.hmInit==='1')return; root.dataset.hmInit='1';
  var canvas=root.querySelector('canvas'), ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  var banner=root.querySelector('.hm-banner'), title=root.querySelector('.hm-title'), marks=root.querySelectorAll('.hm-marks i');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var F0=130.81, RATE=3, TARGET=6, TOL=0.4, CRACK=7, TRIES=3, R0=66;
  var CX=W*0.5, CY=H*0.56;
  var holding=false, holdStart=0, semis=0, attempt=0, done=false, ghosts=[], result='', resultAt=0, bannerUntil=0, thrum=[], raf=0, lastT=0;
  var ac=null, his=null, mine=null, hisGain=null, mineGain=null, master=null, lfo=null;
  var WORDS={hit:'[Sam: The chamber thrums. The scarab opens its wings.]',low:'[Sam: He waits. You let go too soon.]',high:'[Sam: Past it. The wings fold.]',crack:'[Sam: The note cracks.]',out:'[Sam: Al Hubz lets the note go.]'};
  function now(){return performance.now();}
  function freq(st){return F0*Math.pow(2,st/12);}
  function audio(){
    if(ac)return true; var AC=window.AudioContext||window.webkitAudioContext; if(!AC)return false;
    try{ac=new AC();}catch(e){return false;}
    master=ac.createGain(); master.gain.value=0.0001;
    var lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1100; lp.Q.value=0.7;
    var dry=ac.createGain(); dry.gain.value=0.8; var wet=ac.createGain(); wet.gain.value=0.45;
    var dl=ac.createDelay(0.5); dl.delayTime.value=0.083; var fb=ac.createGain(); fb.gain.value=0.58; var fl=ac.createBiquadFilter(); fl.type='lowpass'; fl.frequency.value=700;
    master.connect(lp); lp.connect(dry); dry.connect(ac.destination); lp.connect(dl); dl.connect(fl); fl.connect(fb); fb.connect(dl); fl.connect(wet); wet.connect(ac.destination);
    his=ac.createOscillator(); his.type='triangle'; his.frequency.value=F0; hisGain=ac.createGain(); hisGain.gain.value=0.17; his.connect(hisGain); hisGain.connect(master);
    lfo=ac.createOscillator(); lfo.frequency.value=4.6; var lg=ac.createGain(); lg.gain.value=reduced?0:1.4; lfo.connect(lg); lg.connect(his.frequency); lfo.start();
    mine=ac.createOscillator(); mine.type='triangle'; mine.frequency.value=F0; mineGain=ac.createGain(); mineGain.gain.value=0.0001; mine.connect(mineGain); mineGain.connect(master);
    his.start(); mine.start();
    master.gain.setTargetAtTime(1,ac.currentTime,0.4);
    return true;
  }
  function stopAudio(){
    if(!ac)return; try{master.gain.setTargetAtTime(0.0001,ac.currentTime,0.25);}catch(e){}
    var a=ac; ac=null; setTimeout(function(){try{a.close();}catch(e){}},900);
  }
  function shimmer(){
    if(!ac)return; var t=ac.currentTime; [1,1.5,2,3].forEach(function(m,i){
      var o=ac.createOscillator(); o.type='sine'; o.frequency.value=freq(TARGET)*m; var g=ac.createGain(); g.gain.value=0.0001;
      g.gain.setTargetAtTime(0.07/(i+1),t+i*0.06,0.08); g.gain.setTargetAtTime(0.0001,t+1.2+i*0.2,0.6);
      o.connect(g); g.connect(master); o.start(t); o.stop(t+4); });
  }
  function crackSound(){
    if(!ac)return; var t=ac.currentTime; mineGain.gain.cancelScheduledValues(t); mineGain.gain.setTargetAtTime(0.0001,t,0.03);
    var n=ac.createBufferSource(), b=ac.createBuffer(1,ac.sampleRate*0.18,ac.sampleRate), d=b.getChannelData(0);
    for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.4);
    n.buffer=b; var g=ac.createGain(); g.gain.value=0.12; var hp=ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=600; n.connect(hp); hp.connect(g); g.connect(master); n.start(t);
  }
  function say(text,secs){banner.textContent=text; banner.style.opacity='1'; bannerUntil=now()+(secs||2.4)*1000;}
  function begin(){
    if(done||holding)return; audio(); holding=true; holdStart=now(); semis=0; result='';
    if(ac){var t=ac.currentTime; mineGain.gain.cancelScheduledValues(t); mineGain.gain.setTargetAtTime(0.15,t,0.12); mine.frequency.setValueAtTime(F0,t);}
    try{canvas.focus({preventScroll:true});}catch(e){}
  }
  function settle(kind){
    holding=false; resultAt=now(); result=kind; ghosts.push({st:semis,at:resultAt,kind:kind});
    var i=attempt; attempt++; if(marks[i])marks[i].className=(kind==='hit')?'hm-hit':'hm-miss';
    if(kind==='hit'){ if(ac){var t=ac.currentTime; mineGain.gain.setTargetAtTime(0.16,t,0.1); mineGain.gain.setTargetAtTime(0.0001,t+2.6,0.9); hisGain.gain.setTargetAtTime(0.0001,t+2.6,0.9);} shimmer(); for(var k=0;k<4;k++)thrum.push({at:resultAt+k*260}); say(WORDS.hit,4); finish(true); return; }
    if(kind==='crack'){ crackSound(); say(WORDS.crack); }
    else { if(ac){var t2=ac.currentTime; mineGain.gain.setTargetAtTime(0.0001,t2+0.5,0.35);} say(WORDS[kind]); }
    if(attempt>=TRIES){ setTimeout(function(){ if(root.isConnected){ say(WORDS.out,4); if(ac){var t3=ac.currentTime; hisGain.gain.setTargetAtTime(0.0001,t3+0.6,1.2);} } },1500); finish(false); }
  }
  function release(){
    if(!holding)return; var d=semis-TARGET;
    settle(Math.abs(d)<=TOL?'hit':(d<0?'low':'high'));
  }
  function finish(won){
    if(done)return; done=true; title.textContent=won?WORDS.hit:WORDS.out;
    var mark=document.querySelector('#hm-mark tw-link'); if(won&&mark){try{mark.click();}catch(e){}}
    setTimeout(function(){ if(!root.isConnected)return; var after=document.getElementById('hm-after'); if(after){after.classList.add('hm-revealed');} },won?2200:2600);
  }
  // controls
  canvas.addEventListener('pointerdown',function(e){e.preventDefault(); try{canvas.setPointerCapture(e.pointerId);}catch(x){} begin();});
  ['pointerup','pointercancel'].forEach(function(ev){canvas.addEventListener(ev,function(e){e.preventDefault(); release();});});
  canvas.addEventListener('contextmenu',function(e){e.preventDefault();});
  function onKey(e){ if(e.code!=='Space'&&e.key!==' ')return; if(!root.isConnected)return; e.preventDefault(); if(e.type==='keydown'){ if(!e.repeat)begin(); } else release(); }
  window.addEventListener('keydown',onKey); window.addEventListener('keyup',onKey);
  window.addEventListener('blur',release);
  // drawing
  var grain=[]; for(var g=0;g<420;g++)grain.push([Math.random()*W,Math.random()*H,Math.random()]);
  function closeness(st){ var c=1-Math.abs(st-TARGET)/2.6; return c<0?0:c*c; }
  function draw(t){
    var dt=lastT?Math.min(50,t-lastT):16; lastT=t;
    if(holding){ semis=(now()-holdStart)/1000*RATE; if(ac)mine.frequency.setTargetAtTime(freq(semis),ac.currentTime,0.02); if(semis>=CRACK){semis=CRACK; settle('crack');} }
    var breathe=reduced?0:Math.sin(t/1400)*2;
    ctx.clearRect(0,0,W,H);
    var bg=ctx.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#17120d'); bg.addColorStop(1,'#0d0a07'); ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // the box: a granite room drawn as a wedge of perspective
    ctx.strokeStyle='rgba(245,212,144,0.16)'; ctx.lineWidth=1;
    ctx.strokeRect(70.5,46.5,W-141,H-100);
    ctx.beginPath(); ctx.moveTo(0.5,0.5); ctx.lineTo(70.5,46.5); ctx.moveTo(W-0.5,0.5); ctx.lineTo(W-70.5,46.5); ctx.moveTo(0.5,H-0.5); ctx.lineTo(70.5,H-53.5); ctx.moveTo(W-0.5,H-0.5); ctx.lineTo(W-70.5,H-53.5); ctx.stroke();
    // joints in the granite
    ctx.strokeStyle='rgba(245,212,144,0.07)'; for(var j=1;j<4;j++){ctx.beginPath(); ctx.moveTo(70.5,46.5+j*(H-100)/4); ctx.lineTo(W-70.5,46.5+j*(H-100)/4); ctx.stroke();}
    // sarcophagus
    ctx.save(); ctx.translate(CX,CY+58); ctx.strokeStyle='rgba(245,212,144,0.34)'; ctx.lineWidth=1.2; ctx.strokeRect(-118.5,-26.5,237,53); ctx.strokeStyle='rgba(245,212,144,0.14)'; ctx.strokeRect(-106.5,-16.5,213,33); ctx.restore();
    // after-images of earlier attempts
    for(var gi=0;gi<ghosts.length;gi++){ var gh=ghosts[gi]; var age=(now()-gh.at)/1000; var al=gh.kind==='hit'?0.22:Math.max(0.05,0.2-age*0.03);
      ctx.beginPath(); ctx.arc(CX,CY,R0*Math.pow(2,gh.st/12),0,Math.PI*2); ctx.strokeStyle='rgba(245,212,144,'+al.toFixed(3)+')'; ctx.setLineDash(gh.kind==='crack'?[3,9]:[]); ctx.lineWidth=1; ctx.stroke(); ctx.setLineDash([]); }
    // his ring, breathing
    ctx.beginPath(); ctx.arc(CX,CY,R0+breathe,0,Math.PI*2); ctx.strokeStyle='rgba(245,212,144,0.55)'; ctx.lineWidth=1.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(CX,CY,R0+breathe+6,0,Math.PI*2); ctx.strokeStyle='rgba(245,212,144,0.10)'; ctx.lineWidth=5; ctx.stroke();
    // my ring
    var showMine=holding||(result&&result!=='crack'&&(now()-resultAt)<2600);
    if(showMine){ var r=R0*Math.pow(2,semis/12); var ma=holding?0.75:Math.max(0,0.75-(now()-resultAt)/2600*0.75);
      ctx.beginPath(); ctx.arc(CX,CY,r,0,Math.PI*2); ctx.strokeStyle='rgba(255,236,196,'+ma.toFixed(3)+')'; ctx.lineWidth=1.6; ctx.stroke(); }
    // the thrum: rings rolling out from the scarab after a hit
    for(var ti=thrum.length-1;ti>=0;ti--){ var age2=(now()-thrum[ti].at)/1000; if(age2<0)continue; if(age2>2.2){thrum.splice(ti,1);continue;}
      ctx.beginPath(); ctx.arc(CX,CY,R0*1.4142+age2*120,0,Math.PI*2); ctx.strokeStyle='rgba(245,212,144,'+(0.35*(1-age2/2.2)).toFixed(3)+')'; ctx.lineWidth=2; ctx.stroke(); }
    // the scarab in amber
    var c=done&&result==='hit'?1:(holding?closeness(semis):(result&&result!=='crack'?closeness(semis)*Math.max(0,1-(now()-resultAt)/1800):0));
    var glow=ctx.createRadialGradient(CX,CY,2,CX,CY,60+c*50); glow.addColorStop(0,'rgba(255,190,96,'+(0.22+c*0.5).toFixed(3)+')'); glow.addColorStop(1,'rgba(255,190,96,0)'); ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(CX,CY,60+c*50,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(CX,CY);
    var open=c*1.05, flutter=reduced?0:Math.sin(t/90)*0.05*c;
    ctx.fillStyle='rgba(245,212,144,'+(0.18+c*0.42).toFixed(3)+')'; ctx.strokeStyle='rgba(255,236,196,'+(0.35+c*0.55).toFixed(3)+')'; ctx.lineWidth=1;
    [-1,1].forEach(function(side){ ctx.save(); ctx.rotate(side*(open+flutter)); ctx.beginPath(); ctx.ellipse(side*9,-2,7,15,side*0.18,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.restore(); });
    ctx.fillStyle='rgba(120,78,34,'+(0.6+c*0.4).toFixed(3)+')'; ctx.beginPath(); ctx.ellipse(0,2,8,13,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(255,236,196,'+(0.5+c*0.5).toFixed(3)+')'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,-11); ctx.lineTo(0,15); ctx.strokeStyle='rgba(255,236,196,'+(0.25+c*0.4).toFixed(3)+')'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-13,4,0,Math.PI*2); ctx.fillStyle='rgba(120,78,34,0.9)'; ctx.fill(); ctx.stroke();
    ctx.restore();
    // rim of lamplight on the box edge, and grain
    var rim=ctx.createLinearGradient(0,H-54,0,H); rim.addColorStop(0,'rgba(245,212,144,0)'); rim.addColorStop(1,'rgba(245,212,144,0.07)'); ctx.fillStyle=rim; ctx.fillRect(0,H-54,W,54);
    ctx.fillStyle='rgba(255,236,196,0.05)'; for(var k=0;k<grain.length;k++){ var p=grain[k]; var y=(p[1]+(reduced?0:t*0.004*p[2]))%H; ctx.fillRect(p[0],y,1,1); }
    if(bannerUntil&&now()>bannerUntil){banner.style.opacity='0'; bannerUntil=0;}
    if(!root.isConnected){ stopAudio(); window.removeEventListener('keydown',onKey); window.removeEventListener('keyup',onKey); window.removeEventListener('blur',release); return; }
    raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
  if(window.DSS_DEV){ window._harmonyDev={begin:begin,release:release,state:function(){return {semis:semis,attempt:attempt,done:done,result:result,holding:holding};},setSemis:function(v){semis=v; holdStart=now()-v/RATE*1000;}}; }
})();
</script>

<span id="hm-after">
(link: "Listen until it resolves")['''

s = s.replace(old_prose, GAME)

# 2. close the hm-after span after the reveal block's final hook.
old_tail = '''[[Back the way you came|Pyramid Return]]
]

:: Pyramid Return'''
assert s.count(old_tail) == 1
s = s.replace(old_tail, '''[[Back the way you came|Pyramid Return]]
]
</span>

:: Pyramid Return''')

# 3. the flag: initialised with the other pyramid flags and reset with the night.
old_init = "(set: $pyramidRunWon to false)\\\n(set: $himalayaClimbWon to false)\\\n"
assert s.count(old_init) == 1
s = s.replace(old_init, "(set: $pyramidRunWon to false)\\\n(set: $pyramidHarmony to false)\\\n(set: $himalayaClimbWon to false)\\\n")
old_reset = "(set: $pyramidNumber to false)(set: $pyramidResidueSeen to false)(set: $pyramidRunWon to false)\\"
assert s.count(old_reset) == 1
s = s.replace(old_reset, "(set: $pyramidNumber to false)(set: $pyramidResidueSeen to false)(set: $pyramidRunWon to false)(set: $pyramidHarmony to false)\\")

open(P, "w", encoding="utf-8").write(s)
print("applied")
