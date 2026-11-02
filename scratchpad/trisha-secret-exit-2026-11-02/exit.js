// Trisha's secret exit: opening colour, chromatic passage, live destination reveal.
(function () {
  var running = false, releasing = null;
  function begin(link) {
    if (running) return;
    running = true;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var veil = document.createElement('div'), canvas = document.createElement('canvas');
    veil.id = 'dss-trisha-secret-exit';
    veil.setAttribute('role', 'img'); veil.setAttribute('aria-label', 'A coloured doorway opens. Violet, turquoise and amber light pass through the dark; Dean Street appears through the exit.');
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#030407;pointer-events:auto;';
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    veil.appendChild(canvas); document.body.appendChild(veil);
    var cx = canvas.getContext('2d'), started = performance.now(), raf = 0, done = false, navigated = false, mapStill = null, stillAt = 0;
    function navigate() {
      if (navigated) return; navigated = true; releasing = link;
      try { if (link.isConnected) link.click(); } finally { releasing = null; }
    }
    function finish() {
      if (done) return; done = true; cancelAnimationFrame(raf); clearTimeout(safety);
      document.removeEventListener('keydown', skip, true); window.removeEventListener('resize', size);
      try { navigate(); } finally {
        veil.style.transition = reduced ? 'opacity .4s ease' : 'opacity 1.1s ease'; veil.style.opacity = '0';
        setTimeout(function () { veil.remove(); running = false; }, reduced ? 450 : 1150);
      }
    }
    function skip(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); finish(); } }
    function size() { canvas.width = Math.round(innerWidth * Math.min(devicePixelRatio || 1, 1.5)); canvas.height = Math.round(innerHeight * Math.min(devicePixelRatio || 1, 1.5)); mapStill = null; }
    function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * x * (x * (x * 6 - 15) + 10); }
    // One soft, uneven mist stamp, reused by the existing animation loop.
    var mist=document.createElement('canvas');mist.width=256;mist.height=128;
    var mg=mist.getContext('2d');
    if(mg)for(var mi=0;mi<9;mi++){
      var mx=35+mi*23,my=64+Math.sin(mi*2.7)*22;
      var cloud=mg.createRadialGradient(mx,my,0,mx,my,42);
      cloud.addColorStop(0,'rgba(171,193,207,.22)');cloud.addColorStop(.4,'rgba(145,171,190,.11)');cloud.addColorStop(1,'rgba(145,171,190,0)');
      mg.fillStyle=cloud;mg.fillRect(0,0,256,128);
    }
    function rect(x,y,w,h,col) { cx.fillStyle=col; cx.fillRect(x,y,w,h); }
    // Overlapping cards cover the threshold, then tip and fall away in depth.
    var exitCards=[];
    for(var cr=0;cr<7;cr++)for(var cc=0;cc<8;cc++){
      var ci=cr*8+cc,noise=(Math.sin(ci*91.73+4)*43758.54)%1;
      exitCards.push({col:cc,row:cr,id:ci,noise:noise,
        at:.65+Math.abs(cc-3.5)*.15+cr*.13+(noise+1)*.13});
    }
    function fallingCards(t,w,h,dw,dh,x,y){
      var cards=exitCards.map(function(card){return {card:card,p:Math.max(0,Math.min(1,(t-card.at)/2.65))};});
      cards.sort(function(a,b){return b.p-a.p;});
      cards.forEach(function(item){
        var c=item.card,p=item.p;if(p>=1)return;
        var motion=p*p*p*(p*(p*6-15)+10);
        var cw=dw/8*1.08,ch=dh/7*1.08,flight=motion*motion;
        var centreX=x+(c.col+.5)*dw/8,centreY=y+(c.row+.5)*dh/7;
        var rx=motion*(2.15+c.noise*.55),ry=motion*(c.col%2?2.55:-2.55),rz=motion*(c.noise*.55);
        var depth=flight*dw*5.5,focal=dw*1.4;
        function vertex(u,v){
          var px=u*cw,py=v*ch,pz=0;
          var yy=py*Math.cos(rx),zz=py*Math.sin(rx);py=yy;pz=zz;
          var xx=px*Math.cos(ry)+pz*Math.sin(ry);pz=-px*Math.sin(ry)+pz*Math.cos(ry);px=xx;
          xx=px*Math.cos(rz)-py*Math.sin(rz);py=px*Math.sin(rz)+py*Math.cos(rz);px=xx;
          var scale=focal/(focal+depth+pz);
          return [w/2+(centreX-w/2+px+c.noise*dw*flight*.3)*scale,
            h*.48+(centreY-h*.48+py+dh*flight*.8)*scale];
        }
        function face(points,fill,stroke){cx.beginPath();points.forEach(function(pt,i){cx[i?'lineTo':'moveTo'](pt[0],pt[1]);});cx.closePath();if(fill){cx.fillStyle=fill;cx.fill();}if(stroke){cx.strokeStyle=stroke;cx.lineWidth=Math.max(.5,1.1*(1-p));cx.stroke();}}
        cx.globalAlpha=1-ease((p-.78)/.22);
        var light=Math.max(0,Math.cos(rx)*Math.cos(ry));
        var shade=Math.round(13+light*16),palette=c.id%3;
        face([vertex(-.5,-.5),vertex(.5,-.5),vertex(.5,.5),vertex(-.5,.5)],
          'rgb('+(shade+(palette===2?9:0))+','+(shade+(palette===0?10:3))+','+(shade+15)+')','rgba(210,184,130,.7)');
        // Stepped gold foil borders, fans and individually varied celestial seals.
        face([vertex(-.41,-.35),vertex(-.34,-.35),vertex(-.34,-.43),vertex(.34,-.43),vertex(.34,-.35),vertex(.41,-.35),vertex(.41,.35),vertex(.34,.35),vertex(.34,.43),vertex(-.34,.43),vertex(-.34,.35),vertex(-.41,.35)],null,'rgba(207,173,107,.62)');
        function ink(points,close){cx.beginPath();points.forEach(function(pt,i){var v=vertex(pt[0],pt[1]);cx[i?'lineTo':'moveTo'](v[0],v[1]);});if(close)cx.closePath();cx.strokeStyle='rgba(225,197,143,'+(.38+light*.25)+')';cx.lineWidth=Math.max(.45,.8*(1-p));cx.stroke();}
        for(var fan=0;fan<7;fan++){
          var theta=Math.PI*(.18+fan*.106);
          ink([[0,-.24],[Math.cos(theta)*.29,-.24-Math.sin(theta)*.13]],false);
          ink([[0,.24],[Math.cos(theta)*.29,.24+Math.sin(theta)*.13]],false);
        }
        var ring=[];for(var seg=0;seg<32;seg++){var a=seg*Math.PI/16;ring.push([Math.cos(a)*.2,Math.sin(a)*.13]);}ink(ring,true);
        if(palette===0){
          var star=[];for(var sp=0;sp<5;sp++){var sa=-Math.PI/2+sp*Math.PI*4/5;star.push([Math.cos(sa)*.16,Math.sin(sa)*.105]);}ink(star,true);
        }else if(palette===1){
          ink([[0,-.105],[.145,.075],[-.145,.075]],true);ink([[0,.105],[.145,-.075],[-.145,-.075]],true);
        }else{
          ink([[0,-.07],[.14,0],[0,.07],[-.14,0]],true);
          var pupil=[];for(var ps=0;ps<20;ps++){var pa=ps*Math.PI/10;pupil.push([Math.cos(pa)*.045,Math.sin(pa)*.045]);}ink(pupil,true);
        }
        ink([[0,-.19],[0,-.15]],false);ink([[0,.15],[0,.19]],false);
      });
      cx.globalAlpha=1;
    }
    function paint(now) {
      var t = (now-started)/(reduced ? 1000 : 1550), w=canvas.width,h=canvas.height;
      if (reduced) { if(t>.2)navigate(); if(t>.8)finish(); else raf=requestAnimationFrame(paint); return; }
      if(t>3.45)navigate();
      var destination=navigated && document.querySelector('#soho-map-container canvas');
      // The doorway stays fixed; the last image is a still of the map at its gameplay size.
      var reveal=ease((t-3.65)/1), crossing=0;
      cx.globalCompositeOperation='source-over';cx.globalAlpha=1;rect(0,0,w,h,'#030407');
      var opening=ease(t/.9), travel=ease((t-.8)/3.7), arrival=crossing;
      var dw=Math.min(w*.36,h*.53)*(1+arrival*3),dh=h*.8*(1+arrival*2.5), x=(w-dw)/2,y=(h-dh)/2;
      // A breathing passage: curved silver threads pull towards the exit.
      cx.save();cx.beginPath();cx.rect(x,y,dw,dh);cx.clip();
      var well=cx.createLinearGradient(0,y,0,y+dh);well.addColorStop(0,'#070914');well.addColorStop(.58,'#151e2a');well.addColorStop(1,'#030509');cx.fillStyle=well;cx.fillRect(x,y,dw,dh);
      cx.save();cx.globalCompositeOperation='screen';
      for(var i=0;i<34;i++){
        var angle=i*Math.PI*2/34, phase=t*.38+i*.73;
        var endX=w/2+Math.cos(angle)*dw*.9,endY=h*.48+Math.sin(angle)*dh*.85;
        var bend=Math.sin(phase)*dw*.17;
        cx.strokeStyle='rgba('+(i%3===0?'153,112,193':i%3===1?'106,184,194':'187,179,153')+','+(.025+.045*(.5+.5*Math.sin(phase)))*(1-reveal)+')';
        cx.lineWidth=.7+(i%4)*.4;
        cx.beginPath();cx.moveTo(w/2+Math.cos(angle)*dw*.045,h*.48+Math.sin(angle)*dh*.045);
        cx.bezierCurveTo(w/2+bend+Math.cos(angle)*dw*.2,h*.48+Math.sin(angle)*dh*.12,endX-bend,endY-Math.sin(angle)*dh*.2,endX,endY);cx.stroke();
      }
      cx.restore();
      for(var r=0;r<110;r++){
        var rz=(r/110+travel*.3)%1, ry=h*.52+Math.pow(rz,2)*dh*.55;
        var shimmer=.5+.5*Math.sin(r*4.7+t*2.4),rw=dw*(.015+rz*.38)*shimmer;
        rect(w/2+Math.sin(r*8.1)*dw*rz*.28-rw/2,ry,rw,1+rz*2,'rgba(156,191,207,'+(.04+shimmer*.18)+')');
      }
      // Low ribbons drift across one another; passing blooms colour the vapour.
      // Clear the view as the real street comes into focus.
      if(mg){
        cx.globalCompositeOperation='screen';
        for(var m=0;m<16;m++){
          var depth=m/15, drift=Math.sin(t*(.22+depth*.09)+m*2.4);
          var mw=dw*(.72+depth*.75),mh=dh*(.17+depth*.19);
          var mistX=w/2-mw/2+drift*dw*.24;
          var mistY=y+dh*(.36+depth*.5)+Math.sin(t*.31+m)*dh*.035;
          cx.globalAlpha=(.43+depth*.22)*opening*(1-reveal*.89);
          cx.drawImage(mist,mistX,mistY,mw,mh);
        }
        cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
      }
      fallingCards(t,w,h,dw,dh,x,y);
      cx.restore();
      // Heavy door leaf swings away into darkness, with a coloured edge.
      var leaf=dw*(1-opening);rect(x,y,leaf,dh,'#100c15');
      cx.strokeStyle='rgba(225,180,233,'+(.6*(1-opening))+')';cx.lineWidth=3;cx.strokeRect(x+leaf,y,1,dh);
      cx.strokeStyle='rgba(34,39,50,'+(1-crossing)+')';cx.lineWidth=9*(1-crossing);if(crossing<1)cx.strokeRect(x-5,y-5,dw+10,dh+10);
      // Gilded architectural corner keys, rather than repeated tunnel frames.
      if(crossing<1){
        cx.save();cx.globalAlpha=(1-crossing)*opening;cx.strokeStyle='rgba(207,174,111,.65)';cx.lineWidth=1;
        [-1,1].forEach(function(sx){[-1,1].forEach(function(sy){
          var cornerX=w/2+sx*dw/2,cornerY=h/2+sy*dh/2;
          cx.beginPath();cx.moveTo(cornerX-sx*dw*.13,cornerY+sy*5);cx.lineTo(cornerX-sx*dw*.045,cornerY+sy*5);cx.lineTo(cornerX-sx*dw*.045,cornerY-sy*12);cx.lineTo(cornerX+sx*5,cornerY-sy*12);cx.lineTo(cornerX+sx*5,cornerY-sy*dh*.09);cx.stroke();
        });});cx.restore();
      }
      // Three deliberate colour events, over a second apart: bloom then lingering afterimage.
      var pulses=[{at:.18,c:'207,63,225'},{at:1.5,c:'33,220,219'},{at:2.85,c:'255,157,57'}];
      pulses.forEach(function(p){var age=t-p.at;if(age<0||age>1.6)return;
        var strength=age<.3?ease(age/.3):Math.exp(-(age-.3)*3.2);
        cx.save();cx.globalCompositeOperation='screen';
        var bloom=cx.createRadialGradient(w/2,h*.48,0,w/2,h*.48,Math.max(w,h)*.8);
        bloom.addColorStop(0,'rgba('+p.c+','+strength*.58+')');bloom.addColorStop(.3,'rgba('+p.c+','+strength*.34+')');bloom.addColorStop(1,'rgba('+p.c+',0)');cx.fillStyle=bloom;cx.fillRect(0,0,w,h);
        cx.shadowColor='rgb('+p.c+')';cx.shadowBlur=32*strength;cx.strokeStyle='rgba('+p.c+','+strength*.9+')';cx.lineWidth=3+strength*7;cx.strokeRect(x,y,dw,dh);
        cx.globalAlpha=strength*.24;cx.lineWidth=18;cx.beginPath();cx.ellipse(w/2,h*.48,dw*.66,dh*.65,Math.sin(t)*.05,0,Math.PI*2);cx.stroke();cx.restore();
      });
      // Dust and tiny refracted streaks give the light something to move through.
      cx.save();cx.globalCompositeOperation='screen';
      for(var d=0;d<80;d++){var phase=(d*.618+t*.11)%1,dx=w/2+Math.sin(d*71.3)*dw*(.15+phase*.65),dy=h/2+Math.cos(d*19.7)*dh*phase*.7;cx.strokeStyle='rgba(174,194,220,'+(.06+phase*.18)*(1-reveal)+')';cx.lineWidth=1;cx.beginPath();cx.moveTo(dx,dy);cx.lineTo(dx+(dx-w/2)*.018,dy+(dy-h/2)*.018);cx.stroke();}cx.restore();
      // Take one frame after the map has settled, with no animated crop or zoom.
      if(!mapStill && destination && t>4.4){
        var bounds=destination.getBoundingClientRect();
        if(bounds.width>0&&bounds.height>0){
          mapStill=document.createElement('canvas');mapStill.width=w;mapStill.height=h;
          var sc=mapStill.getContext('2d'),sx=w/innerWidth,sy=h/innerHeight;
          if(sc){var ratio=destination.width/destination.height,mw=Math.min(bounds.width*sx,w*.82,h*.72*ratio),mh=mw/ratio;sc.fillStyle='#030407';sc.fillRect(0,0,w,h);sc.drawImage(destination,(w-mw)/2,(h-mh)/2,mw,mh);stillAt=t;}
          else mapStill=null;
        }
      }
      if(mapStill){
        cx.globalAlpha=ease((t-stillAt)/.8);cx.drawImage(mapStill,0,0);cx.globalAlpha=1;
        // One full second of the complete, motionless last image, then the UI fades in.
        if(t>stillAt+1.8){finish();return;}
      }

      raf=requestAnimationFrame(paint);
    }
    var safety=setTimeout(finish,18000);
    veil.addEventListener('click',finish);document.addEventListener('keydown',skip,true);window.addEventListener('resize',size);
    size();if(cx)raf=requestAnimationFrame(paint);else finish();
  }
  setInterval(function(){var host=document.getElementById('dss-secret-exit-entry');if(host&&!host.dataset.started){var link=host.querySelector('tw-link');if(link){host.dataset.started='1';begin(link);}}},100);
})();
