// 2026-10-28: bold drawn surfaces, deliberately stylised rather than photographic.
// Room-owned canvases only; no extra meshes, lights, textures or frame work.
window.dssInteriorSurface = function(t, kind, seed) {
if (!t || !t.image || !t.image.getContext) return t;
var c=t.image, x=c.getContext('2d'), w=c.width, h=c.height;
var key='_dssSurface_'+kind; if(c[key]) return t; c[key]=true;
function r(n){var v=Math.sin(n*127.1+(seed||1)*311.7)*43758.5453;return v-Math.floor(v);}
function line(a,b,d,e,col,width){x.strokeStyle=col;x.lineWidth=width||1;x.beginPath();x.moveTo(a,b);x.lineTo(d,e);x.stroke();}
function patch(px,py,ww,hh,col){x.fillStyle=col;x.beginPath();x.moveTo(px,py+hh*.12);x.lineTo(px+ww*.72,py);x.lineTo(px+ww,py+hh*.24);x.lineTo(px+ww*.91,py+hh*.84);x.lineTo(px+ww*.24,py+hh);x.lineTo(px-ww*.08,py+hh*.62);x.closePath();x.fill();}
x.save();
if(kind==='wood' || kind==='boards') {
  // Long ink-like ribbons and broad rubbed strokes read from the doorway.
  for(var i=0;i<90;i++){
    var yy=r(i+1700)*h,phase=r(i+30)*6.28,bend=2+r(i+80)*8;
    x.strokeStyle=i%3?'rgba(12,6,3,0.27)':'rgba(219,163,91,0.24)';x.lineWidth=1+r(i+9)*2.3;x.beginPath();
    for(var a=-8;a<=w+8;a+=8){var y=yy+Math.sin(a*.018+phase)*bend+Math.sin(a*.042+phase)*1.7;if(a===-8)x.moveTo(a,y);else x.lineTo(a,y);}x.stroke();
  }
  for(var i=0;i<18;i++){var px=r(i+330)*w,py=r(i+440)*h;line(px,py,px+18+r(i+550)*70,py,'rgba(231,179,108,0.16)',2+r(i)*4);}
  // A handful of drawn knots, elongated with the grain.
  for(var k=0;k<3;k++){var px=(.16+r(k+77)*.68)*w,py=(.12+r(k+99)*.76)*h;
    for(var n=0;n<4;n++){x.strokeStyle=n%2?'rgba(214,153,80,0.25)':'rgba(17,8,3,0.35)';x.lineWidth=1.4;x.beginPath();x.ellipse(px,py,8+n*6,2+n*2,.04,0,6.283);x.stroke();}
  }
  if(kind==='boards')for(var b=0;b<4;b++){
    var y=b*h/4,join=(0.18+r(b+9)*0.62)*w;
    x.fillStyle=b%2?'rgba(225,169,99,0.07)':'rgba(16,8,3,0.08)';x.fillRect(0,y,w,h/4);
    line(0,y,w,y,'rgba(10,6,3,0.68)',2.4);line(0,y+2,w,y+2,'rgba(227,178,111,0.29)',1);
    line(join,y,join,y+h/4,'rgba(10,6,3,0.6)',1.8);
    for(var n=0;n<2;n++){x.fillStyle='rgba(15,9,5,0.6)';x.beginPath();x.arc(join+(n?5:-5),y+8,1.4,0,6.283);x.fill();}
  }
} else if(kind==='plaster' || kind==='stone') {
  // Angular washes and scumbled chips: visible painted texture, not camera grain.
  for(var i=0;i<140;i++){var px=r(i+120)*w,py=r(i+720)*h,sz=5+r(i+90)*25;
    patch(px,py,sz*(1+r(i+180)),sz*.55,i%3?'rgba(17,12,8,0.12)':'rgba(244,225,186,0.15)');
  }
  for(var i=0;i<300;i++){var px=r(i)*w,py=r(i+2300)*h;
    x.fillStyle=i%3?'rgba(17,12,8,0.15)':'rgba(244,230,203,0.19)';x.fillRect(px,py,1+r(i+700)*4,1+r(i+900)*2.5);
  }
  if(kind==='stone')for(var i=0;i<34;i++){var px=r(i+80)*w,py=r(i+180)*h;line(px,py,px+5+r(i+400)*18,py+2,'rgba(23,19,14,0.25)',1.2);line(px,py+2,px+7+r(i+400)*18,py+4,'rgba(224,209,177,0.16)',1);}
} else if(kind==='cloth' || kind==='carpet') {
  for(var y=1;y<h;y+=4)line(0,y,w,y,'rgba(225,192,158,0.16)',1.2);
  for(var a=1;a<w;a+=5)line(a,0,a,h,'rgba(8,5,5,0.24)',1.3);
  if(kind==='carpet'){
    // Faded small lozenges, woven into the existing room-coloured pile.
    var step=64;
    for(var row=-1;row<h/step+1;row++)for(var col=-1;col<w/step+1;col++){
      var px=col*step+(row%2)*step/2,py=row*step;
      x.strokeStyle='rgba(188,140,83,0.27)';x.lineWidth=2;x.beginPath();x.moveTo(px,py-23);x.lineTo(px+17,py);x.lineTo(px,py+23);x.lineTo(px-17,py);x.closePath();x.stroke();
      x.fillStyle='rgba(17,8,7,0.25)';x.fillRect(px-3,py-3,6,6);
    }
  }
  for(var i=0;i<260;i++){x.fillStyle=i%2?'rgba(238,206,176,0.17)':'rgba(9,5,4,0.18)';x.fillRect(r(i)*w,r(i+400)*h,1.2,2.8);}
} else if(kind==='tile' || kind==='lino') {
  // Larger enamel/aggregate flecks and broad irregular rubbed marks.
  for(var i=0;i<230;i++){var px=r(i)*w,py=r(i+500)*h;
    patch(px,py,2+r(i+800)*5,1+r(i+900)*3,i%3?'rgba(53,44,32,0.16)':'rgba(247,230,191,0.23)');
  }
  if(kind==='lino')for(var i=0;i<24;i++){x.strokeStyle='rgba(12,10,9,0.23)';x.lineWidth=2.3;x.beginPath();x.ellipse(r(i+33)*w,r(i+66)*h,6+r(i+44)*12,3+r(i+77)*5,r(i)*3,.2,2.1);x.stroke();}
} else if(kind==='metal') {
  for(var i=0;i<60;i++){var y=r(i)*h;line(r(i+200)*w,y,w,y,i%3?'rgba(229,208,161,0.2)':'rgba(24,18,11,0.25)',1+r(i+90)*2);}
  for(var i=0;i<26;i++)patch(r(i+9)*w,r(i+30)*h,7+r(i+80)*22,3+r(i+100)*7,'rgba(45,37,22,0.14)');
}
x.restore();t.needsUpdate=true;return t;
};
