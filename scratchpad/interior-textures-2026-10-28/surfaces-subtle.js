// 2026-10-28: restrained, material-specific surface detail for the indoor rooms.
// Paint into each room's existing canvas: no extra geometry, texture allocations or frame work.
window.dssInteriorSurface = function(t, kind, seed) {
if (!t || !t.image || !t.image.getContext) return t;
var c=t.image, x=c.getContext('2d'), w=c.width, h=c.height;
var key='_dssSurface_'+kind; if(c[key]) return t; c[key]=true;
function r(n){var v=Math.sin(n*127.1+(seed||1)*311.7)*43758.5453;return v-Math.floor(v);}
function line(a,b,d,e,col,width){x.strokeStyle=col;x.lineWidth=width||0.65;x.beginPath();x.moveTo(a,b);x.lineTo(d,e);x.stroke();}
x.save();
if(kind==='wood' || kind==='boards') {
  // Fine pores follow the existing horizontal grain; occasional broken fibres catch light.
  for(var i=0;i<650;i++){var px=r(i)*w,py=r(i+1700)*h;
    line(px,py,px+2+r(i+300)*17,py+r(i+900)*0.7,'rgba(9,5,2,0.13)',0.45);
    if(i%7===0)line(px,py+0.8,px+5+r(i+300)*13,py+1,'rgba(235,190,128,0.08)',0.5);
  }
  if(kind==='boards')for(var b=0;b<4;b++){
    var y=b*h/4,join=(0.18+r(b+9)*0.62)*w;
    line(0,y,w,y,'rgba(10,6,3,0.42)',1.2);
    line(0,y+1.4,w,y+1.4,'rgba(207,163,108,0.14)',0.7);
    line(join,y,join,y+h/4,'rgba(10,6,3,0.35)',1);
    for(var n=0;n<2;n++){x.fillStyle='rgba(15,9,5,0.42)';x.beginPath();x.arc(join+(n?4:-4),y+7,0.9,0,6.283);x.fill();}
  }
} else if(kind==='plaster' || kind==='stone') {
  // Broken trowel marks and mineral flecks rather than uniform digital noise.
  for(var i=0;i<1050;i++){var px=r(i)*w,py=r(i+2300)*h;
    x.fillStyle=i%3?'rgba(17,12,8,0.055)':'rgba(244,230,203,0.075)';
    x.fillRect(px,py,0.5+r(i+700)*2.2,0.5+r(i+900)*1.3);
  }
  for(var i=0;i<30;i++){var px=r(i+80)*w,py=r(i+180)*h;
    line(px,py,px+3+r(i+400)*13,py-1+r(i+500)*2,'rgba(234,219,191,0.045)',0.8);
  }
} else if(kind==='cloth') {
  // Crossed, irregular threads sit underneath the existing folds and pile.
  for(var y=1;y<h;y+=3)line(0,y,w,y,'rgba(225,192,158,0.045)',0.55);
  for(var a=1;a<w;a+=4)line(a,0,a,h,'rgba(8,5,5,0.075)',0.7);
  for(var i=0;i<500;i++){x.fillStyle='rgba(238,206,176,0.06)';x.fillRect(r(i)*w,r(i+400)*h,0.7,1.5);}
} else if(kind==='tile' || kind==='lino') {
  for(var i=0;i<85;i++){var px=r(i)*w,py=r(i+500)*h;
    line(px,py,px+2+r(i+800)*9,py+r(i+900)*2,kind==='tile'?'rgba(92,81,62,0.085)':'rgba(213,203,177,0.09)',0.55);
  }
  if(kind==='lino')for(var i=0;i<18;i++){x.strokeStyle='rgba(12,10,9,0.085)';x.lineWidth=1.2;x.beginPath();x.ellipse(r(i+33)*w,r(i+66)*h,3+r(i+44)*7,2+r(i+77)*3,r(i)*3,0.2,2.1);x.stroke();}
} else if(kind==='metal') {
  for(var i=0;i<200;i++){var y=r(i)*h;line(r(i+200)*w,y,w,y,'rgba(229,222,196,0.065)',0.45);}
}
x.restore();t.needsUpdate=true;return t;
};
