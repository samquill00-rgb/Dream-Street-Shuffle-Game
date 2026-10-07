import sys
P = '/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee'
s = open(P, encoding='utf-8').read()
start = s.index(':: Green Sea House of Cards [green-sea]')
end = s.index('\n:: ', start + 10)
p = s[start:end]
def rep(old, new, count=1):
    global p
    n = p.count(old)
    if n != count: sys.exit(f'expected {count} got {n}: {old[:80]!r}')
    p = p.replace(old, new)

# ---- 1. layout: meters and status under the table, labelled like the beer mats
meters_old = '<div class="cards-meters"><span class="cards-deck"></span><span class="cards-built"></span><span class="cards-angle"></span></div>\n'
rep(meters_old, '')
help_line = '<div class="cards-help">Drag the foot to slide the base; drag the body to tilt. Then place or set the card. Shift + arrows moves the base.</div>\n'
status_line = '<div class="cards-status" role="status" aria-live="polite">Build pairs, then lay bridges across them. Wait for the table to quieten.</div>\n'
rep(help_line + status_line, help_line)
canvas_end = 'Space sets the card."></canvas>\n'
rep(canvas_end, canvas_end
    + '<div class="cards-meters"><span><small>Cards left</small><b class="cards-deck"></b></span><span><small>Standing</small><b class="cards-built"></b></span><span><small>Lean</small><b class="cards-angle"></b></span></div>\n'
    + status_line)

# ---- CSS
rep("#dss-house-cards .cards-meters{display:flex;flex-wrap:wrap;gap:6px 16px;justify-content:space-between;font-size:13px;padding:10px 2px;font-variant-numeric:tabular-nums}\n",
    "#dss-house-cards .cards-meters{display:flex;gap:6px 16px;justify-content:space-between;padding:12px 2px 6px;font-variant-numeric:tabular-nums}\n"
    "#dss-house-cards .cards-meters span{flex:1;text-align:left;border-bottom:1px solid #ffffff16;padding-bottom:8px}\n"
    "#dss-house-cards .cards-meters small{display:block;font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:.75}\n"
    "#dss-house-cards .cards-meters b{display:block;font-weight:normal;font-size:clamp(20px,4vw,28px);margin-top:4px}\n")
rep("#dss-house-cards .cards-status{min-height:3.4em;font-size:15px;line-height:1.6}\n",
    "#dss-house-cards .cards-status{min-height:2.6em;font-size:clamp(16px,2.6vw,19px);line-height:1.45;padding-top:8px}\n"
    "#dss-house-cards .cards-help{font-size:12px;line-height:1.5;opacity:.75;margin-top:2px}\n")

# ---- JS state + sound helper
rep("  var listeners = [], resizeObs, observer, dev;\n",
    "  var listeners = [], resizeObs, observer, dev;\n"
    "  var endAt = 0, outcomeKind = '';\n"
    "  // The game's own small sounds (dssAudio): a card set down, the table's thump, the glass.\n"
    "  function sfx(name, delay) {\n"
    "    var run = function () { if (disposed) return; try { var a = window.dssAudio; if (a && typeof a[name] === 'function') a[name](); } catch (e) {} };\n"
    "    if (delay) setTimeout(run, delay); else run();\n"
    "  }\n")
# tumble: a patter of cards coming down
rep("    broken.forEach(function(i){if(placed[i]){placed[i]=null;falls++;}});\n",
    "    var n=0;broken.forEach(function(i){if(placed[i]){placed[i]=null;falls++;if(n<5)sfx('cardTurn',n*70);n++;}});\n")
# place / set sounds
rep("      if (Math.abs(previous-angle) > .1 || Math.abs(previousBase-baseX) > .1) placed[i].stability = quality.stability;\n",
    "      if (Math.abs(previous-angle) > .1 || Math.abs(previousBase-baseX) > .1) placed[i].stability = quality.stability;\n"
    "      sfx('cardTurn');\n")
rep("    used++;\n    if (valid)", "    used++; sfx('cardTurn');\n    if (valid)")
# roar sound
rep("    flash = .6;\n    var level = currentLevel(), broken = [];\n",
    "    flash = .6; sfx('muffledThud'); if (final) sfx('glassClink',160);\n    var level = currentLevel(), broken = [];\n")
# finish
rep("    ended = true; running = false; pointer = null;\n",
    "    ended = true; running = false; pointer = null; endAt = elapsed; outcomeKind = outcome;\n"
    "    if (outcome !== 'loss') sfx('brightChord',380);\n")
rep("      if (back) back.click();\n    },2800);", "      if (back) back.click();\n    },3400);")
# meters: numbers under their labels
rep("    root.querySelector('.cards-deck').textContent = (DECK-used)+' cards left';\n    root.querySelector('.cards-built').textContent = liveCount()+' / '+slots.length+' standing';\n",
    "    root.querySelector('.cards-deck').textContent = String(DECK-used);\n    root.querySelector('.cards-built').textContent = liveCount()+' / '+slots.length;\n")

# ---- card(): a gilt edge when the house stands
rep("    suit(n,g.length*.3,0,.25);suit(n,g.length*.7,0,.25);ctx.restore();\n  }\n",
    "    suit(n,g.length*.3,0,.25);suit(n,g.length*.7,0,.25);\n"
    "    if(gild>0){ctx.strokeStyle='rgba(246,206,120,'+gild+')';ctx.lineWidth=1.2;ctx.strokeRect(-.5,-3,g.length+1,6);}\n"
    "    ctx.restore();\n  }\n")

SCENE = r"""  // THE GREEN SEA BEHIND THE BUILD (2026-10-07). The bar as LINE 2 draws it: arched
  // windows full of sea light, the portrait on the wall, the cribbage pair at one table
  // and the family at the other with their deck, a lamp over the cards. The room answers
  // each roar (the family rise, the lamp swings, the glass shivers) and leans in as the
  // chatter builds. Reduced motion keeps all of it still.
  var gild = 0;
  var FIGURES = [ // x, shoulder y, head r, table (0 cribbage, 1 family), phase
    {x:58,y:250,r:11,t:0,p:0},{x:134,y:247,r:11,t:0,p:1.7},
    {x:436,y:246,r:10,t:1,p:.4},{x:474,y:240,r:11,t:1,p:2.1},{x:516,y:243,r:10,t:1,p:3.3},{x:556,y:248,r:9,t:1,p:4.4}
  ];
  function arch(x0,x1,top,bot){var r=(x1-x0)/2;ctx.beginPath();ctx.moveTo(x0,bot);ctx.lineTo(x0,top+r);ctx.arc(x0+r,top+r,r,Math.PI,0);ctx.lineTo(x1,bot);ctx.closePath();}
  function scene() {
    var roarK=reduced?0:clamp(flash/.6,0,1), warnK=warning&&!reduced?1:0, t=reduced?0:elapsed;
    var bg=ctx.createLinearGradient(0,0,0,363);bg.addColorStop(0,'#081214');bg.addColorStop(.55,'#122020');bg.addColorStop(1,'#25241a');
    ctx.fillStyle=bg;ctx.fillRect(-5,-5,W+10,H+10);
    // Two arched windows on the sea.
    [[20,104],[496,580]].forEach(function(w,k){
      var x0=w[0],x1=w[1],cx=(x0+x1)/2,top=40,bot=204;
      var spill=ctx.createRadialGradient(cx,150,8,cx,170,170);spill.addColorStop(0,'#5ab8cc26');spill.addColorStop(1,'#5ab8cc00');
      ctx.fillStyle=spill;ctx.fillRect(cx-180,0,360,363);
      ctx.save();arch(x0,x1,top,bot);
      var sea=ctx.createLinearGradient(0,top,0,bot);sea.addColorStop(0,'#10303a');sea.addColorStop(.5,'#2a6a70');sea.addColorStop(.56,'#1d5a62');sea.addColorStop(1,'#0f3a40');
      ctx.fillStyle=sea;ctx.fill();ctx.clip();
      ctx.strokeStyle='#a8e0d840';ctx.lineWidth=1;
      for(var j=0;j<6;j++){var yy=136+j*12,ph=t*.5+j*1.3+k*2;ctx.beginPath();
        for(var xx=x0;xx<=x1;xx+=4){var v=yy+Math.sin(xx*.11+ph)*(1+j*.25);if(xx===x0)ctx.moveTo(xx,v);else ctx.lineTo(xx,v);}ctx.stroke();}
      var moon=ctx.createRadialGradient(cx,92,1,cx,92,30);moon.addColorStop(0,'#c8f0ee55');moon.addColorStop(1,'#c8f0ee00');ctx.fillStyle=moon;ctx.fillRect(x0,top,x1-x0,bot-top);
      ctx.restore();
      ctx.strokeStyle='#0a1518';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,top);ctx.lineTo(cx,bot);ctx.moveTo(x0,118);ctx.lineTo(x1,118);ctx.stroke();
      arch(x0,x1,top,bot);ctx.strokeStyle='#8ad8e855';ctx.lineWidth=1.4;ctx.stroke();
      ctx.fillStyle='#3b3426';ctx.fillRect(x0-6,bot,x1-x0+12,5);
    });
    // The portrait on the wall.
    ctx.fillStyle='#5a4426';ctx.fillRect(150,66,44,56);ctx.strokeStyle='#b8a87066';ctx.lineWidth=1;ctx.strokeRect(150.5,66.5,43,55);
    ctx.fillStyle='#1a1e18';ctx.fillRect(155,71,34,46);
    ctx.fillStyle='#2c2e24';ctx.beginPath();ctx.arc(172,88,7,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(159,117);ctx.quadraticCurveTo(160,97,172,97);ctx.quadraticCurveTo(184,97,185,117);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#7a3a2c88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(164,103);ctx.lineTo(181,114);ctx.stroke();
    // Lamp over the cards: a slow sway, a swing on the roar.
    var swing=Math.sin(t*1.1)*.012+roarK*Math.sin(t*9)*.09+warnK*Math.sin(t*14)*.012;
    var lx=300+Math.sin(swing)*40,ly=Math.cos(swing)*40;
    var cone=ctx.createRadialGradient(lx,ly+8,4,lx+(lx-300)*2,250,300);cone.addColorStop(0,'#e8b86a50');cone.addColorStop(.5,'#d9a3541c');cone.addColorStop(1,'#b9863000');
    ctx.fillStyle=cone;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#6a5a3c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(300,0);ctx.lineTo(lx,ly-8);ctx.stroke();
    ctx.save();ctx.translate(lx,ly);ctx.rotate(-swing);
    ctx.fillStyle='#b99554';ctx.beginPath();ctx.moveTo(-20,8);ctx.lineTo(-10,-10);ctx.lineTo(10,-10);ctx.lineTo(20,8);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffe3a8';ctx.beginPath();ctx.ellipse(0,8,13,2.4,0,0,Math.PI*2);ctx.fill();ctx.restore();
    // Back tables: cribbage on the left, the family's game on the right.
    FIGURES.forEach(function(f,i){
      var lift=f.t?roarK*(4+(i%2)*4):roarK*1.5, lean=warnK*Math.sin(t*6+f.p)*1.6+(reduced?0:Math.sin(t*.7+f.p)*.6);
      var x=f.x+lean,y=f.y-lift;
      ctx.fillStyle='#0b1414';ctx.beginPath();ctx.arc(x,y-f.r-3,f.r,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(f.x-16,282);ctx.lineTo(x-15,y+8);ctx.quadraticCurveTo(x-14,y-2,x,y-2);ctx.quadraticCurveTo(x+14,y-2,x+15,y+8);ctx.lineTo(f.x+16,282);ctx.closePath();ctx.fill();
      if(f.t && i%2 && roarK>.15){ctx.strokeStyle='#0b1414';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+11,y+4);ctx.lineTo(x+20,y-14-roarK*10);ctx.stroke();ctx.lineCap='butt';}
      ctx.strokeStyle=f.x<300?'#5ab8cc30':'#5ab8cc26';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y-f.r-3,f.r,Math.PI*.9,Math.PI*1.6);ctx.stroke();
    });
    ctx.fillStyle='#6a4a2c';ctx.fillRect(28,262,138,5);ctx.fillRect(412,266,170,5);
    ctx.fillStyle='#2a1d12';ctx.fillRect(36,267,4,30);ctx.fillRect(154,267,4,30);ctx.fillRect(420,271,4,26);ctx.fillRect(570,271,4,26);
    // The cribbage board and its pegs.
    ctx.fillStyle='#9a7a48';ctx.fillRect(80,258,34,4);ctx.fillStyle='#e8d5ad';ctx.fillRect(86,256,1.5,2);ctx.fillStyle='#c0503a';ctx.fillRect(104,256,1.5,2);
    // The Italian deck on the family's table: a pile, a trick in play, cards that jump on the roar.
    [[440,0],[462,.2],[488,-.15],[530,.1],[551,-.25]].forEach(function(c,j){
      var hop=roarK*(j%2?3:1.5);
      ctx.save();ctx.translate(c[0],264-hop);ctx.rotate(c[1]+roarK*(j%2?.3:-.2));ctx.fillStyle='#e8d5ad';ctx.fillRect(-5,-1.6,10,3.2);
      ctx.fillStyle=j%2?'#874634':'#c19645';ctx.fillRect(-1.5,-1,3,2);ctx.restore();
    });
    ctx.fillStyle='#6e2a22';ctx.fillRect(504,260,12,5);ctx.fillStyle='#e8d5ad';ctx.fillRect(504,264,12,1);
  }
  // What is left of the eighteen: a face-down stack on the near edge of the table.
  function deckPile() {
    var left=Math.max(0,DECK-used);if(!left)return;
    var x=446,y=398;
    for(var k=0;k<left;k++){ctx.fillStyle=k%2?'#d9c49a':'#bfa77a';ctx.fillRect(x,y-k*1.1,48,1.1);}
    var top=y-left*1.1;
    ctx.fillStyle='#6e2a22';ctx.beginPath();ctx.moveTo(x+4,top-9);ctx.lineTo(x+52,top-9);ctx.lineTo(x+48,top);ctx.lineTo(x,top);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#e0c890aa';ctx.lineWidth=.8;ctx.stroke();
    ctx.strokeStyle='#c19645aa';ctx.beginPath();ctx.moveTo(x+26,top-7.5);ctx.lineTo(x+33,top-4.5);ctx.lineTo(x+24,top-1.5);ctx.lineTo(x+17,top-4.5);ctx.closePath();ctx.stroke();
  }
  // The glass on the near table; its surface shivers on the roar.
  function glass() {
    var roarK=reduced?0:clamp(flash/.6,0,1), t=elapsed;
    ctx.fillStyle='#b3833540';ctx.beginPath();ctx.moveTo(521.5,366);
    for(var xx=521.5;xx<=546.5;xx+=2.5)ctx.lineTo(xx,366+Math.sin(xx*.8+t*40)*roarK*1.6);
    ctx.lineTo(546,385);ctx.quadraticCurveTo(534,389,522,385);ctx.closePath();ctx.fill();
    ctx.fillStyle='#94b5aa12';ctx.strokeStyle='#a4b9aa70';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(515,330);ctx.lineTo(520,387);ctx.quadraticCurveTo(534,393,548,387);ctx.lineTo(553,330);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#e8f4ee30';ctx.beginPath();ctx.moveTo(519,334);ctx.lineTo(523,382);ctx.stroke();
  }
  // The end of the round: a warm light settles on a standing house; an unfinished one dims.
  function ending() {
    if(!ended)return;
    var k=reduced?1:clamp((elapsed-endAt)/.9,0,1);
    if(outcomeKind!=='loss'){
      var halo=ctx.createRadialGradient(300,285,10,300,285,230);halo.addColorStop(0,'rgba(240,200,120,'+(.24*k)+')');halo.addColorStop(1,'rgba(240,200,120,0)');
      ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    } else { ctx.fillStyle='rgba(4,9,10,'+(.38*k)+')';ctx.fillRect(0,0,W,H); }
  }
"""
rep("  function draw() {\n", SCENE + "  function draw() {\n")

old_bg_start = "    var bg=ctx.createLinearGradient(0,0,0,H);"
old_bg_end = "ctx.lineTo(320,48);ctx.closePath();ctx.fill();\n"
i0 = p.index(old_bg_start); i1 = p.index(old_bg_end, i0) + len(old_bg_end)
p = p[:i0] + "    scene();\n" + p[i1:]
rep("for(var j=0;j<6;j++){ctx.beginPath();ctx.moveTo(0,375+j*8);ctx.bezierCurveTo(130,369+j*8,450,387+j*8,600,374+j*8);ctx.stroke();}\n",
    "for(var j=0;j<6;j++){ctx.beginPath();ctx.moveTo(0,375+j*8);ctx.bezierCurveTo(130,369+j*8,450,387+j*8,600,374+j*8);ctx.stroke();}\n    deckPile();\n")
rep("    placed.forEach(function(c,i){if(c)card(geometry(i,cardAngle(i)),i%4,i===editing);});\n",
    "    gild=ended&&outcomeKind!=='loss'?(reduced?.7:.45+.35*Math.sin((elapsed-endAt)*3)):0;\n"
    "    placed.forEach(function(c,i){if(c)card(geometry(i,cardAngle(i)),i%4,i===editing);});\n    gild=0;\n")
glass_old = "    ctx.fillStyle='#94b5aa12';ctx.strokeStyle='#a4b9aa70';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(515,330);ctx.lineTo(520,387);ctx.quadraticCurveTo(534,393,548,387);ctx.lineTo(553,330);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#b3833533';ctx.fillRect(522,366,24,19);\n    ctx.restore();\n"
rep(glass_old, "    glass();\n    ending();\n    ctx.restore();\n")

s = s[:start] + p + s[end:]
open(P, 'w', encoding='utf-8').write(s)
print('ok')
