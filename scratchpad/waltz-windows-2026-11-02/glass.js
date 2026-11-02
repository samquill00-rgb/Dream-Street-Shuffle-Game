window.dssWaltzGlass = function(canvas, ms, opening, enchant, still, reveal, streetProgress) {
  var c=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  reveal=reveal===undefined?1:Math.max(0,Math.min(1,reveal));
  streetProgress=Math.max(0,Math.min(1,streetProgress||0));
  var t=still?0:ms/1000, o=Math.max(0,Math.min(1,opening)), e=enchant;
  var candleFlicker=still?1:.94+.035*Math.sin(t*10.7)+.025*Math.sin(t*17.3+1.2);
  c.save(); c.scale(W/360,H/540);
  c.fillStyle='#100e13'; c.fillRect(0,0,360,540);
  var vx=180+(still?0:Math.sin(t*.63)*22*e), vy=65;
  var glow=c.createRadialGradient(vx,110,2,vx,160,330);
  glow.addColorStop(0,'#665036'); glow.addColorStop(.35,'#24202a'); glow.addColorStop(1,'#0b0c12'); c.fillStyle=glow;c.fillRect(0,0,360,540);
  // Floors and shelves share perspective; each musical figure exchanges the windows.
  for(var side=-1;side<=1;side+=2){
    c.fillStyle=side<0?'#17151e':'#201a20';c.beginPath();c.moveTo(vx,vy);c.lineTo(180+side*240,540);c.lineTo(180+side*300,0);c.closePath();c.fill();
    for(var i=0;i<7;i++){
      var depth=((i/7+t*.045)%1), z=depth*depth, y=vy+z*470;
      var turn=still?0:Math.sin(t*.75+i*.8)*e*21*z;
      var x=vx+side*(22+z*160)+turn, w=8+z*34, h=13+z*75;
      // Cecil Court shop windows: fanlights, books and celestial instruments.
      // Local coordinates keep every detail in the same receding perspective.
      c.save();c.translate(x,y);c.scale(w,h);
      c.globalAlpha=(.22+z*.5)*Math.min(1,depth*12,(1-depth)*9);
      var kind=(i+(side>0?1:0))%3;
      function arch(inset){c.beginPath();c.moveTo(-.5+inset,0);c.lineTo(-.5+inset,-.66);c.bezierCurveTo(-.5+inset,-1.06,.5-inset,-1.06,.5-inset,-.66);c.lineTo(.5-inset,0);c.closePath();}
      c.fillStyle='#18131a';arch(0);c.fill();
      c.strokeStyle='#bda579';c.lineWidth=.035;arch(.025);c.stroke();
      c.fillStyle=kind===0?'#78523a':kind===1?'#304e58':'#4d3857';arch(.09);c.fill();
      c.strokeStyle='rgba(222,195,139,.7)';c.lineWidth=.012;
      // A radiating fanlight, rather than a square crossbar.
      for(var ray=0;ray<7;ray++){var angle=Math.PI+ray*Math.PI/6;c.beginPath();c.moveTo(0,-.66);c.lineTo(Math.cos(angle)*.38,-.66+Math.sin(angle)*.3);c.stroke();}
      c.beginPath();c.moveTo(-.41,-.65);c.lineTo(.41,-.65);c.stroke();
      if(kind===0){
        // Uneven gilt-backed books in a softly lit bookseller's window.
        for(var shelf=0;shelf<2;shelf++){
          var base=-.09-shelf*.26;
          for(var book=0;book<7;book++){
            var bh=.12+((book*7+i*3+shelf)%5)*.014,bx=-.35+book*.1;
            c.fillStyle=['#b99863','#4a6260','#8c6161','#77704d'][(book+i)%4];c.fillRect(bx,base-bh,.072,bh);
            c.fillStyle='rgba(233,207,154,.55)';c.fillRect(bx+.012,base-bh+.025,.048,.009);
          }
          c.fillStyle='#b39462';c.fillRect(-.4,base,.8,.018);
        }
      }else if(kind===1){
        // Tall leaded diamonds; the glass catches the waltz's cool light.
        for(var pane=0;pane<3;pane++){
          var py=-.53+pane*.19;
          c.beginPath();c.moveTo(0,py-.075);c.lineTo(.28,py);c.lineTo(0,py+.075);c.lineTo(-.28,py);c.closePath();c.stroke();
        }
        c.beginPath();c.moveTo(0,-.64);c.lineTo(0,-.03);c.stroke();
      }else{
        // A little brass armillary sphere in an antiquarian display.
        c.save();c.translate(0,-.35);c.strokeStyle='#d0b575';c.lineWidth=.018;
        c.beginPath();c.ellipse(0,0,.28,.18,0,0,Math.PI*2);c.stroke();
        c.beginPath();c.ellipse(0,0,.13,.18,-.4,0,Math.PI*2);c.stroke();
        c.beginPath();c.ellipse(0,0,.28,.055,.22,0,Math.PI*2);c.stroke();
        c.beginPath();c.moveTo(0,.18);c.lineTo(0,.24);c.moveTo(-.16,.24);c.lineTo(.16,.24);c.stroke();c.restore();
      }
      // Fluted pilasters and a small scalloped canopy break up the silhouette.
      c.strokeStyle='#c4aa78';c.lineWidth=.018;
      [-1,1].forEach(function(edge){c.beginPath();c.moveTo(edge*.51,.02);c.lineTo(edge*.51,-.68);c.moveTo(edge*.56,.02);c.lineTo(edge*.56,-.68);c.stroke();});
      c.fillStyle='#25202a';c.beginPath();c.moveTo(-.6,-.61);c.lineTo(-.46,-.73);c.lineTo(.46,-.73);c.lineTo(.6,-.61);
      for(var scallop=5;scallop>=0;scallop--)c.quadraticCurveTo(-.5+scallop*.2,-.54,-.6+scallop*.2,-.61);
      c.closePath();c.fill();c.strokeStyle='#b29b70';c.lineWidth=.014;c.stroke();
      c.restore();
    }
  }
  c.globalAlpha=1;
  for(var r=0;r<19;r++){var z=((r/19+t*.12)%1);z*=z;var y=vy+z*480;c.strokeStyle='rgba(171,150,119,'+(.06+z*.2)+')';c.beginPath();c.moveTo(vx-z*260,y);c.quadraticCurveTo(vx,y+(still?0:Math.sin(t+r)*e*12),vx+z*260,y);c.stroke();}
  // Watkins is a room behind glass. Only the following passage opens onto the street.
  if(o<1){
    c.save();c.globalAlpha=1-o;
    c.fillStyle='#17120f';c.fillRect(0,0,360,540);
    var lamp=c.createRadialGradient(180,175,8,180,230,310);lamp.addColorStop(0,'rgba(107,110,88,'+(.66*candleFlicker)+')');lamp.addColorStop(.55,'#252329');lamp.addColorStop(1,'#090c12');c.fillStyle=lamp;c.fillRect(0,0,360,540);
    c.fillStyle='#30251b';c.beginPath();c.moveTo(60,330);c.lineTo(300,330);c.lineTo(360,540);c.lineTo(0,540);c.closePath();c.fill();
    c.strokeStyle='#57412b';c.lineWidth=1;
    for(var plank=0;plank<10;plank++){c.beginPath();c.moveTo(60+plank*27,330);c.lineTo(-90+plank*60,540);c.stroke();}
    c.globalAlpha=(1-o)*reveal;
    // A rear stockroom door, surrounded by densely filled, stationary shelves.
    c.fillStyle='#0d0b0b';c.fillRect(151,174,58,161);c.strokeStyle='#765a37';c.lineWidth=5;c.strokeRect(149,172,62,164);
    function bookcase(x,y,w,h,seed){
      c.fillStyle='#24180f';c.fillRect(x,y,w,h);c.strokeStyle='#755334';c.lineWidth=5;c.strokeRect(x,y,w,h);
      var palette=['#604232','#62604a','#66444a','#3d5250','#8c744f','#493e52'];
      for(var shelf=0;shelf<5;shelf++){
        var base=y+(shelf+1)*h/5;
        for(var bx=x+5,n=0;bx<x+w-5;n++){
          var bw=4+((n*7+shelf*3+seed)%7),bh=17+((n*11+shelf*13+seed)%18);
          c.fillStyle=palette[(n+shelf+seed)%palette.length];c.fillRect(bx,base-bh-3,Math.min(bw,w-(bx-x)-4),bh);
          c.fillStyle='#c5aa7155';c.fillRect(bx+1,base-bh+1,Math.max(1,bw-2),1);
          c.fillStyle='#09080755';c.fillRect(bx,base-bh-3,1,bh);
          c.fillStyle='#d0b47366';c.fillRect(bx+1,base-8,Math.max(1,bw-2),1);c.fillRect(bx+1,base-bh+5,Math.max(1,bw-2),1);
          if(bw>6){c.fillStyle='#c8b79344';c.fillRect(bx+3,base-bh+10,1,Math.min(9,bh-15));}
          bx+=bw+1;
        }
        c.fillStyle='#80603b';c.fillRect(x,base-3,w,4);
        c.strokeStyle='#d3b27d25';c.lineWidth=.5;c.beginPath();c.moveTo(x+3,base-2);c.lineTo(x+w-3,base-2);c.stroke();
        for(var grain=0;grain<5;grain++){var gy=base-9-grain*8;c.strokeStyle=grain%2?'#bf92551a':'#09070935';c.beginPath();c.moveTo(x+2,gy);c.bezierCurveTo(x+w*.3,gy+2,x+w*.7,gy-2,x+w-2,gy+1);c.stroke();}

      }
    }
    bookcase(57,85,87,247,2);bookcase(216,85,87,247,5);
    bookcase(9,47,43,367,1);bookcase(308,47,43,367,3);
    // Tables of stacked volumes and the amber shop lamp.
    c.fillStyle='#6e4b2b';c.fillRect(41,391,70,8);c.fillRect(49,399,5,68);c.fillRect(98,399,5,68);
    for(var stack=0;stack<4;stack++){c.fillStyle=stack%2?'#746746':'#593a35';c.fillRect(48+stack%2*22,381-Math.floor(stack/2)*10,37,8);}
    // A ghostly six-candle chandelier, wax and tarnished silver rather than an electric shade.
    c.save();c.strokeStyle='#9bafaa';c.lineWidth=1.2;
    c.beginPath();c.moveTo(180,0);c.lineTo(180,66);c.stroke();
    for(var chain=8;chain<62;chain+=7){c.beginPath();c.ellipse(180,chain,1.8,3,0,0,Math.PI*2);c.stroke();}
    var candles=[];for(var arm=0;arm<6;arm++){var angle=arm*Math.PI/3+.22;candles.push({x:180+Math.cos(angle)*43,y:81+Math.sin(angle)*13});}candles.sort(function(a,b){return a.y-b.y;});
    candles.forEach(function(p,i){
      c.strokeStyle='#8d9f98';c.lineWidth=2;c.beginPath();c.moveTo(180,65);c.bezierCurveTo(180,98,p.x,105,p.x,p.y+8);c.stroke();
      c.strokeStyle='#c0cfc1';c.lineWidth=1;c.beginPath();c.ellipse(p.x,p.y+8,7,2,0,0,Math.PI*2);c.stroke();
      c.fillStyle='#c7d0bd';c.fillRect(p.x-2.7,p.y-9,5.4,17);
      c.fillStyle='#8eaa9e';c.fillRect(p.x-2.7,p.y-7,1,14);
      c.strokeStyle='#d5dcc7';c.beginPath();c.moveTo(p.x+2,p.y-4);c.lineTo(p.x+3,p.y+3);c.stroke();
      var sway=still?0:Math.sin(t*7.1+i*1.9)*.65, flame=still?1:.94+.07*Math.sin(t*12.3+i*2.1);
      var halo=c.createRadialGradient(p.x,p.y-14,0,p.x,p.y-14,23);halo.addColorStop(0,'rgba(185,222,197,'+(.2*candleFlicker)+')');halo.addColorStop(1,'rgba(119,176,162,0)');c.fillStyle=halo;c.fillRect(p.x-23,p.y-37,46,46);
      c.fillStyle='#d9edcb';c.beginPath();c.moveTo(p.x,p.y-9);c.bezierCurveTo(p.x-5,p.y-13,p.x+sway,p.y-20*flame,p.x+sway,p.y-20*flame);c.bezierCurveTo(p.x+4,p.y-14,p.x+4,p.y-11,p.x,p.y-9);c.fill();
      c.fillStyle='#f3e3ae';c.beginPath();c.ellipse(p.x,p.y-12,1.4,2.5,0,0,Math.PI*2);c.fill();
    });
    c.restore();
    // Occult furnishings belong to the shop: a wall seal, brass armillary and a scrying glass.
    c.save();c.strokeStyle='#bca27499';c.lineWidth=1;
    c.beginPath();c.arc(180,140,20,0,Math.PI*2);c.arc(180,140,16,0,Math.PI*2);c.stroke();
    c.beginPath();for(var star=0;star<=5;star++){var ang=-Math.PI/2+star*4*Math.PI/5;var sx=180+14*Math.cos(ang),sy=140+14*Math.sin(ang);if(star)c.lineTo(sx,sy);else c.moveTo(sx,sy);}c.stroke();
    c.font='14px Georgia,serif';c.textAlign='center';c.fillStyle='#b89c69';c.fillText('☿',114,77);c.fillText('♄',248,77);
    c.fillStyle='#3c3026';c.fillRect(246,363,59,7);c.fillRect(251,370,4,55);c.fillRect(297,370,4,55);
    c.strokeStyle='#bd975a';c.lineWidth=1.2;c.beginPath();c.ellipse(277,340,17,17,0,0,Math.PI*2);c.ellipse(277,340,7,17,.5,0,Math.PI*2);c.ellipse(277,340,17,6,-.45,0,Math.PI*2);c.moveTo(277,356);c.lineTo(277,363);c.moveTo(267,363);c.lineTo(287,363);c.stroke();
    var orb=c.createRadialGradient(72,358,1,75,361,13);orb.addColorStop(0,'#c4d7b9');orb.addColorStop(.35,'#748e89');orb.addColorStop(.8,'#303e4a');orb.addColorStop(1,'#b7b085');c.fillStyle=orb;c.beginPath();c.arc(75,361,12,0,Math.PI*2);c.fill();c.fillStyle='#8f744b';c.fillRect(67,373,16,4);
    // A worn chalk working circle on the floor, visible through the dancers' shadows.
    c.strokeStyle='#a8b0a04d';c.lineWidth=.8;c.beginPath();c.ellipse(180,381,70,20,0,0,Math.PI*2);c.ellipse(180,381,64,17,0,0,Math.PI*2);c.stroke();
    c.beginPath();for(var mark=0;mark<6;mark++){var ma=mark*Math.PI/3;c.moveTo(180+Math.cos(ma)*66,381+Math.sin(ma)*18);c.lineTo(180+Math.cos(ma)*74,381+Math.sin(ma)*22);}c.stroke();
    c.restore();
    // Stable aged grain, scuffs and dust: cached translucent surface, no shimmering noise.
    if(!window._dssWatkinsWear){
      var wear=document.createElement('canvas');wear.width=360;wear.height=540;var wc=wear.getContext('2d'),seed=1973;
      function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
      for(var speck=0;speck<2700;speck++){var sx=rand()*360,sy=rand()*540;wc.fillStyle=speck%2?'rgba(219,196,143,.07)':'rgba(0,0,0,.09)';wc.fillRect(sx,sy,.5+rand(),.4+rand());}
      for(var scratch=0;scratch<95;scratch++){var sx=rand()*360,sy=335+rand()*200;wc.strokeStyle='rgba(205,176,122,.07)';wc.lineWidth=.5;wc.beginPath();wc.moveTo(sx,sy);wc.lineTo(sx+rand()*18-9,sy+5+rand()*24);wc.stroke();}
      window._dssWatkinsWear=wear;
    }
    c.drawImage(window._dssWatkinsWear,0,0);
    // Tiny occult stars on the rear wall; individual glimmers rather than flashing lights.
    c.save();
    var wallStars=[[154,107,2.4],[176,113,1.7],[204,100,2.1],[161,157,1.5],[201,164,1.8],[148,80,1.6],[212,77,1.9],[180,168,1.4],[234,60,1.6],[125,61,1.7]];
    wallStars.forEach(function(star,i){
      var glimmer=still?.88:.48+.52*Math.pow((1+Math.sin(t*(1.1+i*.09)+i*2.3))*.5,3);
      c.globalAlpha=(1-o)*reveal*glimmer;
      var halo=c.createRadialGradient(star[0],star[1],0,star[0],star[1],star[2]*5);halo.addColorStop(0,'rgba(218,237,197,.75)');halo.addColorStop(1,'rgba(161,192,176,0)');c.fillStyle=halo;c.fillRect(star[0]-14,star[1]-14,28,28);
      c.strokeStyle='#ecf5d2';c.lineWidth=1.1;c.beginPath();c.moveTo(star[0]-star[2]*1.3,star[1]);c.lineTo(star[0]+star[2]*1.3,star[1]);c.moveTo(star[0],star[1]-star[2]*1.9);c.lineTo(star[0],star[1]+star[2]*1.9);c.stroke();c.fillStyle='#f4f8dd';c.beginPath();c.arc(star[0],star[1],.9,0,Math.PI*2);c.fill();
    });c.restore();
    // Broad, slow candle spill travels over the book spines beneath the moving shadows.
    c.save();c.beginPath();c.rect(57,85,87,247);c.rect(216,85,87,247);c.rect(9,47,43,367);c.rect(308,47,43,367);c.clip();
    for(var wash=0;wash<2;wash++){
      var sweep=still?0:Math.sin(t*.85+wash*2.4)*22;
      var lx=wash?263:96,ly=215+(still?0:Math.sin(t*.6+wash)*38);
      var spill=c.createRadialGradient(lx+sweep,ly,4,lx+sweep,ly,125);spill.addColorStop(0,'rgba(183,206,147,'+(.25*candleFlicker)+')');spill.addColorStop(.5,'rgba(147,177,130,.11)');spill.addColorStop(1,'rgba(109,149,125,0)');c.fillStyle=spill;c.fillRect(lx-150,ly-130,300,260);
    }c.restore();
    // The rotating solid couple interrupts the chandelier: project their silhouettes onto the bookcases.
    if(window._dssWaltzCoupleMesh){
      var shadow=window._dssWatkinsShadow;if(!shadow){shadow=document.createElement('canvas');shadow.width=360;shadow.height=540;window._dssWatkinsShadow=shadow;}
      var sc=shadow.getContext('2d');sc.clearRect(0,0,360,540);sc.fillStyle='#080b13';
      var turn=t*Math.PI/3, cosTurn=Math.cos(turn),sinTurn=Math.sin(turn),lightX=still?0:2*Math.sin(t*7.3)+Math.sin(t*11.9);
      window._dssWaltzCoupleMesh.forEach(function(face){
        sc.beginPath();face.pts.forEach(function(p,i){
          var facing=face.actor===0?1:-1,xx=facing*(p[2]-25),zz=-facing*p[0];
          var wx=xx*cosTurn+zz*sinTurn,wz=-xx*sinTurn+zz*cosTurn;
          var ray=165/(120-wz),sx=180+(lightX+(wx-lightX)*ray)*1.25,sy=330+(-290+(p[1]+290)*ray)*.85;
          if(i)sc.lineTo(sx,sy);else sc.moveTo(sx,sy);
        });sc.closePath();sc.fill();
      });
      c.save();c.beginPath();c.rect(57,85,87,247);c.rect(216,85,87,247);c.rect(9,47,43,367);c.rect(308,47,43,367);c.clip();
      c.globalAlpha=(1-o)*reveal*(.53+(1-candleFlicker)*1.1);c.filter='blur(2.1px)';c.drawImage(shadow,0,0);c.globalAlpha*=.38;c.drawImage(shadow,still?3:3+Math.sin(t*4.1)*2,-2);c.restore();
    }
    // Cool sidelight and a shaded violet recess: a slow breathing change, no flashes.
    var breath=still?1:.9+.1*Math.sin(t*.6);
    var cold=c.createRadialGradient(56,276,4,56,276,176);cold.addColorStop(0,'rgba(85,159,145,'+(.21*breath)+')');cold.addColorStop(1,'rgba(40,92,94,0)');c.fillStyle=cold;c.fillRect(0,100,260,400);
    var violet=c.createRadialGradient(290,242,5,290,242,159);violet.addColorStop(0,'rgba(122,91,156,.17)');violet.addColorStop(1,'rgba(60,40,90,0)');c.fillStyle=violet;c.fillRect(130,90,230,360);
    c.restore();
  }
  // Closed ballroom hold: the bodies orbit a common centre, turning front to back.
  // Hands stay joined at shoulder height; skirts, coat and stepping feet follow the turn.
  // A solid, depth-sorted couple: every surface turns in space, including faces and the backs of clothes.
  // Cached geometry is projected into the existing canvas, keeping the window and passage handover intact.
  if(!window._dssWaltzCoupleMesh){
    var mesh=[], actor=0;
    function solid(center,radius,color,rows,cols){
      rows=rows||7;cols=cols||12;
      function point(i,j){var lat=-Math.PI/2+Math.PI*i/rows,lon=2*Math.PI*j/cols;return [center[0]+radius[0]*Math.cos(lat)*Math.cos(lon),center[1]+radius[1]*Math.sin(lat),center[2]+radius[2]*Math.cos(lat)*Math.sin(lon)];}
      for(var i=0;i<rows;i++)for(var j=0;j<cols;j++){var pts=[point(i,j),point(i+1,j),point(i+1,j+1),point(i,j+1)];mesh.push({actor:actor,pts:pts,col:color});}
    }
    function sleeve(a,b,r,color){
      // A rounded solid segment, oriented along the actual three-dimensional upper arm or forearm.
      var dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz),u=[dx/len,dy/len,dz/len];
      var v=Math.abs(u[1])<.9?[0,1,0]:[1,0,0],dot=u[0]*v[0]+u[1]*v[1]+u[2]*v[2];v=v.map(function(q,k){return q-u[k]*dot;});var vl=Math.hypot.apply(null,v);v=v.map(function(q){return q/vl;});var w=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
      function ring(end,j){var ang=j*Math.PI/5;return end.map(function(q,k){return q+r*(v[k]*Math.cos(ang)+w[k]*Math.sin(ang));});}
      for(var j=0;j<10;j++)mesh.push({actor:actor,pts:[ring(a,j),ring(b,j),ring(b,j+1),ring(a,j+1)],col:color});
      solid(a,[r,r,r],color,4,8);solid(b,[r,r,r],color,4,8);
    }
    for(actor=0;actor<2;actor++){
      var woman=actor===0,cloth=woman?[111,76,54]:[46,42,44],skin=[197,159,101];
      solid([-8,-5,3],[9,4,14],[39,29,27],4,10);solid([8,-5,3],[9,4,14],[39,29,27],4,10);
      if(woman){
        // Round heavy skirt: a full circumference, pleated in the geometry, with a narrower waist.
        var rings=[[-10,34,24],[-23,33,23],[-46,27,20],[-71,20,16],[-83,16,14]];
        for(var rr=0;rr<rings.length-1;rr++)for(var j=0;j<24;j++){
          function skirt(r,j){var ang=j*Math.PI/12,pleat=j%2?1:.94;return [Math.cos(ang)*rings[r][1]*pleat,rings[r][0],Math.sin(ang)*rings[r][2]*pleat];}
          mesh.push({actor:actor,pts:[skirt(rr,j),skirt(rr+1,j),skirt(rr+1,j+1),skirt(rr,j+1)],col:j%2?[120,85,57]:cloth});
        }
        solid([0,-105,0],[24,30,17],cloth);
        // Shawl covers shoulders and back; a clasp and pendant identify its front.
        solid([0,-122,-2],[29,14,20],[158,130,81]);
        solid([0,-113,17],[5,7,2],[215,181,106],5,10);
        for(var f=-3;f<=3;f++)sleeve([f*6,-121,17],[f*6,-107+Math.abs(f)*2,18],1,[192,157,92]);
      }else{
        sleeve([-9,-53,0],[-9,-10,0],7,cloth);sleeve([9,-53,0],[9,-10,0],7,cloth);
        solid([0,-100,0],[22,37,14],cloth);
        solid([-10,-62,-7],[12,25,8],cloth);solid([10,-62,-7],[12,25,8],cloth);
        solid([0,-109,13],[10,24,3],[109,93,66]);
        solid([0,-127,14],[9,12,3],[213,202,165]);
        // Narrow lapels lie on the front; the rear remains an uninterrupted dark coat.
        sleeve([-17,-131,11],[-3,-99,15],3,[147,120,77]);sleeve([17,-131,11],[3,-99,15],3,[128,105,71]);
        solid([-4,-127,18],[5,3,2],[36,30,32],4,8);solid([4,-127,18],[5,3,2],[36,30,32],4,8);
        for(var bt=0;bt<3;bt++)solid([0,-109+bt*10,17],[1.5,1.5,1],[196,162,98],4,6);
        sleeve([0,-98,-14],[0,-68,-14],.7,[91,76,56]);
      }
      solid([0,-139,0],[7,12,7],skin,5,10);
      solid([0,-156,0],woman?[16,20,14]:[13,21,13],skin,9,16);
      solid([-13,-155,0],[3,5,3],skin,5,8);solid([13,-155,0],[3,5,3],skin,5,8);
      // Anonymous, featureless brass faces; identity stays in clothing and silhouette.
      if(woman){
        // Grey hair at the sides/back, wrapped headcloth above it. Face remains open at the front.
        solid([0,-161,-7],[18,18,11],[129,124,107]);
        solid([-15,-153,-1],[5,14,8],[151,145,125]);solid([15,-153,-1],[5,14,8],[151,145,125]);
        solid([0,-173,-2],[19,9,15],[117,91,65]);
        sleeve([-15,-175,8],[14,-175,8],1.5,[189,158,102]);
      }
      // Partners face inward. Both bent arms maintain the shared ballroom frame throughout the turn.
      var arm=woman?[155,124,78]:[66,56,45];
      if(woman){
        sleeve([-20,-123,0],[-27,-111,15],6,arm);sleeve([-27,-111,15],[-20,-119,25],5,arm);
        sleeve([20,-123,0],[24,-117,25],6,arm);sleeve([24,-117,25],[20,-126,47],5,arm);
        solid([-20,-119,25],[4,3,4],skin,5,8);solid([20,-126,47],[4,3,4],skin,5,8);
      }else{
        sleeve([20,-123,0],[27,-112,12],6,arm);sleeve([27,-112,12],[20,-119,25],5,arm);
        sleeve([-20,-123,0],[-28,-111,32],6,arm);sleeve([-28,-111,32],[-10,-106,62],5,arm);
        solid([20,-119,25],[4,3,4],skin,5,8);solid([-10,-106,62],[4,3,4],skin,5,8);
      }
    }
    window._dssWaltzCoupleMesh=mesh;
  }
  var phase=t*Math.PI/3, rise=still?0:1.8*(1-Math.cos(t*Math.PI)), ca=Math.cos(phase),sa=Math.sin(phase),faces=[];
  function project(p,actor){
    var facing=actor===0?1:-1;
    // Local front (+z) points towards the partner along the shared x axis.
    var x=facing*(p[2]-25),z=-facing*p[0],y=p[1];
    var xx=x*ca+z*sa,zz=-x*sa+z*ca;
    var perspective=510/(510-zz);
    return [180+xx*perspective,377-rise+(y+zz*.14)*perspective,zz];
  }
  if(o<1){
    window._dssWaltzCoupleMesh.forEach(function(face){
      var ps=face.pts.map(function(p){return project(p,face.actor);}),a=ps[0],b=ps[1],d=ps[2];
      var ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=d[0]-a[0],vy=d[1]-a[1],vz=d[2]-a[2];
      var nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,nl=Math.hypot(nx,ny,nz)||1;
      // Soft amber modelling light; double-sided faces avoid gaps at pole caps.
      var light=(.47+.42*Math.abs((nx*.35-ny*.55+nz*.75)/nl))*candleFlicker;
      faces.push({ps:ps,z:ps.reduce(function(n,p){return n+p[2];},0)/ps.length,col:face.col.map(function(v){return Math.round(v*light);})});
    });
    faces.sort(function(a,b){return a.z-b.z;});c.save();c.globalAlpha=(1-o)*reveal;c.lineWidth=.35;
    faces.forEach(function(f){c.fillStyle=c.strokeStyle='rgb('+f.col.map(function(v){return Math.round(19+(v-19)*reveal);}).join(',')+')';c.beginPath();f.ps.forEach(function(p,i){if(i)c.lineTo(p[0],p[1]);else c.moveTo(p[0],p[1]);});c.closePath();c.fill();c.stroke();});c.restore();
  }
  // Mist belongs to the crossing, not just the room: it spills out and thins along the street.
  {
    c.save();c.globalAlpha=(1-.32*o)*(1-.6*streetProgress);
    c.translate(0,o*42+streetProgress*18);
    for(var fog=0;fog<5;fog++){
      var drift=still?0:Math.sin(t*.18+fog*1.7)*49;
      c.save();c.translate(50+fog*66+drift,385+fog*18+(still?0:Math.sin(t*.23+fog)*7));c.scale(3.6,.6);
      var mist=c.createRadialGradient(0,0,2,0,0,39);mist.addColorStop(0,'rgba(155,177,170,.22)');mist.addColorStop(.45,'rgba(138,163,164,.12)');mist.addColorStop(1,'rgba(121,147,155,0)');c.fillStyle=mist;c.fillRect(-40,-40,80,80);c.restore();
    }
    // Stage dry ice: irregular broad banks slide sideways and overlap through the centre, never orbit.
    var banks=[[119,372,53,14],[167,378,61,17],[210,370,48,13],[241,384,58,15],[146,396,72,17],[203,407,66,18],[92,415,58,15],[266,426,70,19],[176,438,90,19]];
    banks.forEach(function(bank,i){
      var drift=still?0:Math.sin(t*(.13+i*.013)+i*2.17)*24;
      var roll=still?0:Math.sin(t*.31+i*1.7)*4;
      c.save();c.translate(bank[0]+drift,bank[1]+roll);c.scale(bank[2]/30,bank[3]/30);
      var haze=c.createRadialGradient(-5,-2,0,0,0,30);haze.addColorStop(0,'rgba(184,204,196,.27)');haze.addColorStop(.35,'rgba(162,190,185,.20)');haze.addColorStop(.7,'rgba(137,169,171,.085)');haze.addColorStop(1,'rgba(130,162,164,0)');c.fillStyle=haze;c.fillRect(-31,-31,62,62);c.restore();
      // A thinner irregular crest breaks the smooth bank into a soft, rolling edge.
      c.save();c.translate(bank[0]+drift-12,bank[1]+roll-7);c.scale(bank[2]/42,.19);
      var crest=c.createRadialGradient(0,0,0,0,0,26);crest.addColorStop(0,'rgba(200,216,204,.12)');crest.addColorStop(1,'rgba(147,174,171,0)');c.fillStyle=crest;c.fillRect(-27,-27,54,54);c.restore();
    });
    c.globalAlpha=1-o;
    var shade=c.createRadialGradient(180,275,75,180,275,310);shade.addColorStop(0,'rgba(4,7,13,0)');shade.addColorStop(1,'rgba(4,7,13,.48)');c.fillStyle=shade;c.fillRect(0,0,360,540);c.restore();
  }
  // Exactly two figures; no viewer silhouette.
  c.globalAlpha=1;
  var pane=1-o;
  // First there is only the onlooker's single large silhouette in opaque, misted glass.
  // It belongs to the window surface, not the room, and vanishes as the shop becomes clear.
  if(reveal<1){
    c.save();c.globalAlpha=(1-reveal)*pane;
    var frost=c.createRadialGradient(180,230,20,180,260,360);frost.addColorStop(0,'#616a67');frost.addColorStop(.65,'#384348');frost.addColorStop(1,'#1a252d');c.fillStyle=frost;c.fillRect(0,0,360,540);
    c.fillStyle='#11191e';c.shadowColor='#10161c';c.shadowBlur=9;
    c.beginPath();c.ellipse(180,192,29,38,0,0,Math.PI*2);c.fill();
    c.beginPath();c.moveTo(166,220);c.lineTo(165,235);c.bezierCurveTo(136,236,113,254,107,285);c.bezierCurveTo(99,325,108,366,114,400);c.lineTo(104,540);c.lineTo(256,540);c.lineTo(246,400);c.bezierCurveTo(252,366,261,325,253,285);c.bezierCurveTo(247,254,224,236,195,235);c.lineTo(194,220);c.closePath();c.fill();c.restore();
  }
  c.strokeStyle='rgba(183,150,91,'+(.8*pane)+')';c.lineWidth=9;
  for(var j=0;j<4;j++){var px=30+j*100;c.beginPath();c.moveTo(px,0);c.lineTo(px+(vx-px)*o*.35,540);c.stroke();}
  c.lineWidth=12;c.strokeRect(6,6,348,528);
  c.fillStyle='rgba(150,174,184,'+(.055*pane)+')';c.fillRect(0,0,360,540);
  c.restore();
};