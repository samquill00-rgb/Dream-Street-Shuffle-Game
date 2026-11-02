// Trisha's secret exit: opening colour, chromatic passage, live destination reveal.
(function () {
  var running = false, releasing = null;
  document.addEventListener('click', function (ev) {
    var link = ev.target.closest && ev.target.closest('tw-link');
    if (!link || link === releasing || link.textContent.trim() !== 'Through the door') return;
    if (document.querySelector('.dss-hint-modal:not(.out)') || Date.now() < (window.__dssModalHold || 0)) return;
    ev.preventDefault(); ev.stopImmediatePropagation();
    if (running) return;
    running = true;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var veil = document.createElement('div'), canvas = document.createElement('canvas');
    veil.id = 'dss-trisha-secret-exit';
    veil.setAttribute('role', 'img'); veil.setAttribute('aria-label', 'A coloured doorway opens. Violet, turquoise and amber light pass through the dark; Dean Street appears through the exit.');
    veil.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:#030407;pointer-events:auto;';
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    veil.appendChild(canvas); document.body.appendChild(veil);
    var cx = canvas.getContext('2d'), started = performance.now(), raf = 0, done = false, navigated = false, arrivalAt = 0;
    function navigate() {
      if (navigated) return; navigated = true; releasing = link;
      try { if (link.isConnected) link.click(); } finally { releasing = null; }
    }
    function finish() {
      if (done) return; done = true; cancelAnimationFrame(raf); clearTimeout(safety);
      document.removeEventListener('keydown', skip, true); window.removeEventListener('resize', size);
      try { navigate(); } finally {
        veil.style.transition = 'opacity .65s ease'; veil.style.opacity = '0';
        setTimeout(function () { veil.remove(); running = false; }, 700);
      }
    }
    function skip(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); finish(); } }
    function size() { canvas.width = Math.round(innerWidth * Math.min(devicePixelRatio || 1, 1.5)); canvas.height = Math.round(innerHeight * Math.min(devicePixelRatio || 1, 1.5)); }
    function ease(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
    function rect(x,y,w,h,col) { cx.fillStyle=col; cx.fillRect(x,y,w,h); }
    function paint(now) {
      var t = (now-started)/1000, w=canvas.width,h=canvas.height;
      if (reduced) { if(t>.2)navigate(); if(t>.8)finish(); else raf=requestAnimationFrame(paint); return; }
      if(t>3.45)navigate();
      var destination=navigated && document.querySelector('#soho-map-container canvas');
      if(destination && destination.width && !arrivalAt)arrivalAt=t;
      var reveal=arrivalAt ? ease((t-arrivalAt)/1.15) : 0;
      cx.globalCompositeOperation='source-over';cx.globalAlpha=1;rect(0,0,w,h,'#030407');
      var opening=ease(t/.9), travel=ease((t-.8)/3.7), arrival=ease((t-4.6)/1.6);
      var dw=Math.min(w*.36,h*.53)*(1+arrival*3),dh=h*.8*(1+arrival*2.5), x=(w-dw)/2,y=(h-dh)/2;
      // Receding frames: a black passage that catches each passing colour.
      cx.save();cx.beginPath();cx.rect(x,y,dw,dh);cx.clip();
      var well=cx.createLinearGradient(0,y,0,y+dh);well.addColorStop(0,'#070914');well.addColorStop(.58,'#151e2a');well.addColorStop(1,'#030509');cx.fillStyle=well;cx.fillRect(x,y,dw,dh);
      for(var i=15;i>=0;i--){
        var z=((i/16+travel*.85)%1),scale=.12+Math.pow(z,2)*2.3;
        var fw=dw*scale,fh=dh*scale,fx=w/2-fw/2,fy=h*.48-fh/2;
        cx.strokeStyle='rgba(119,150,167,'+(.04+z*.18)+')';cx.lineWidth=1+z*3;cx.strokeRect(fx,fy,fw,fh);
        // Thin chromatic fringes trail the stone jambs.
        cx.strokeStyle='rgba(111,60,163,'+(z*.19)+')';cx.strokeRect(fx-3,fy,fw,fh);
        cx.strokeStyle='rgba(64,188,186,'+(z*.17)+')';cx.strokeRect(fx+3,fy,fw,fh);
      }
      for(var r=0;r<110;r++){
        var rz=(r/110+travel*.3)%1, ry=h*.52+Math.pow(rz,2)*dh*.55;
        var shimmer=.5+.5*Math.sin(r*4.7+t*2.4),rw=dw*(.015+rz*.38)*shimmer;
        rect(w/2+Math.sin(r*8.1)*dw*rz*.28-rw/2,ry,rw,1+rz*2,'rgba(156,191,207,'+(.04+shimmer*.18)+')');
      }
      // The view is the actual, already-running destination map, never a substitute street.
      if(reveal){cx.globalAlpha=reveal;cx.drawImage(destination,x,y,dw,dh);cx.globalAlpha=1;}
      cx.restore();
      // Heavy door leaf swings away into darkness, with a coloured edge.
      var leaf=dw*(1-opening);rect(x,y,leaf,dh,'#100c15');
      cx.strokeStyle='rgba(225,180,233,'+(.6*(1-opening))+')';cx.lineWidth=3;cx.strokeRect(x+leaf,y,1,dh);
      cx.strokeStyle='#222732';cx.lineWidth=9;cx.strokeRect(x-5,y-5,dw+10,dh+10);
      // Three deliberate colour events, over a second apart: bloom then lingering afterimage.
      var pulses=[{at:.18,c:'207,63,225'},{at:1.5,c:'33,220,219'},{at:2.85,c:'255,157,57'}];
      pulses.forEach(function(p){var age=t-p.at;if(age<0||age>1.4)return;
        var strength=age<.15?ease(age/.15):Math.exp(-(age-.15)*4.1);
        cx.save();cx.globalCompositeOperation='screen';
        var bloom=cx.createRadialGradient(w/2,h*.48,0,w/2,h*.48,Math.max(w,h)*.8);
        bloom.addColorStop(0,'rgba('+p.c+','+strength*.8+')');bloom.addColorStop(.3,'rgba('+p.c+','+strength*.48+')');bloom.addColorStop(1,'rgba('+p.c+',0)');cx.fillStyle=bloom;cx.fillRect(0,0,w,h);
        cx.shadowColor='rgb('+p.c+')';cx.shadowBlur=32*strength;cx.strokeStyle='rgba('+p.c+','+strength*.9+')';cx.lineWidth=3+strength*7;cx.strokeRect(x,y,dw,dh);
        for(var k=0;k<7;k++){cx.globalAlpha=strength*(1-k/8)*.18;cx.strokeRect(x-k*11,y-k*17,dw+k*22,dh+k*34);}cx.restore();
      });
      // Dust and tiny refracted streaks give the light something to move through.
      cx.save();cx.globalCompositeOperation='screen';
      for(var d=0;d<80;d++){var phase=(d*.618+t*.11)%1,dx=w/2+Math.sin(d*71.3)*dw*(.15+phase*.65),dy=h/2+Math.cos(d*19.7)*dh*phase*.7;cx.strokeStyle='rgba(174,194,220,'+(.06+phase*.18)*(1-reveal)+')';cx.lineWidth=1;cx.beginPath();cx.moveTo(dx,dy);cx.lineTo(dx+(dx-w/2)*.018,dy+(dy-h/2)*.018);cx.stroke();}cx.restore();
      if(arrivalAt && t>Math.max(6.2,arrivalAt+2.1)){finish();return;}
      raf=requestAnimationFrame(paint);
    }
    var safety=setTimeout(finish,11000);
    veil.addEventListener('click',finish);document.addEventListener('keydown',skip,true);window.addEventListener('resize',size);
    size();if(cx)raf=requestAnimationFrame(paint);else finish();
  },true);
})();
