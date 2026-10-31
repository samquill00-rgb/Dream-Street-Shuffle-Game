window.dssModelCardCanvas = function(floor) {
  var canvas=document.createElement('canvas');canvas.width=512;canvas.height=192;var c=canvas.getContext('2d');
  // Cheap card, softened edges, biro and old tape: a small street notice, not a shop logo.
  c.clearRect(0,0,512,192);c.beginPath();c.moveTo(9,12);c.lineTo(501,9);c.lineTo(505,177);c.lineTo(495,182);c.lineTo(345,179);c.lineTo(208,183);c.lineTo(11,178);c.lineTo(7,109);c.closePath();
  c.fillStyle='#bdbbad';c.fill();c.save();c.clip();
  var wash=c.createLinearGradient(0,0,512,192);wash.addColorStop(0,'rgba(60,51,31,.14)');wash.addColorStop(.35,'rgba(225,220,196,.15)');wash.addColorStop(1,'rgba(70,61,39,.22)');c.fillStyle=wash;c.fillRect(0,0,512,192);
  for(var i=0;i<620;i++){c.fillStyle=i%3?'rgba(69,60,44,.08)':'rgba(235,229,205,.17)';c.fillRect((i*71.39)%512,(i*43.71)%192,.5+i%2,.5+i%3);}
  c.strokeStyle='rgba(70,64,47,.11)';c.lineWidth=2;c.beginPath();c.moveTo(255,0);c.lineTo(259,192);c.stroke();
  c.fillStyle='#454844';c.font='48px "Courier New",monospace';c.textBaseline='alphabetic';c.textAlign='left';
  var word='Model',width=c.measureText(word).width,x=(512-width)/2;
  for(var j=0;j<word.length;j++){c.save();c.translate(x,91+(j%2?1.2:-.6));c.rotate((j%3-1)*.012);c.globalAlpha=.80+j*.025;c.fillText(word[j],0,0);c.restore();x+=c.measureText(word[j]).width;}
  c.globalAlpha=.78;c.font='25px "Courier New",monospace';c.textAlign='center';c.fillText(floor,256,139);c.globalAlpha=1;
  c.strokeStyle='rgba(76,63,39,.18)';c.lineWidth=1;for(var s=0;s<18;s++){var x=(s*91.3)%512,y=(s*67.7)%192;c.beginPath();c.moveTo(x,y);c.lineTo(x+7+s%11,y+1);c.stroke();}c.restore();
  [[111,13,-.08],[411,13,.06]].forEach(function(t){c.save();c.translate(t[0],t[1]);c.rotate(t[2]);c.fillStyle='rgba(183,157,103,.24)';c.fillRect(-35,-13,70,25);c.strokeStyle='rgba(226,211,169,.22)';c.lineWidth=1;c.strokeRect(-34,-12,68,23);c.restore();});
  return canvas;
};
