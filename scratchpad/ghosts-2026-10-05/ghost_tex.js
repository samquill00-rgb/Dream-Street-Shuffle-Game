// >>>> DSS GHOST TEX BEGIN
// The people in the rooms, as traces. One drawing for all ten rooms: a figure built from a head, a neck,
// sloped shoulders, a torso and arms, legs or a lap, with a posture picked by the seed; drawn as a soft
// aura, a faint core, a rim of lamplight down one side, a hollow chest and a slipped after-image, grained
// like film and dissolving towards the floor. `tex(w, h, draw)` and `rnd(seed)` are the room's own helpers.
window.dssGhostTex = function(tex, rnd, seed, seated, bright, tint) {
return tex(192, 384, function(cx, w, h) {
var r = function(k) { return rnd(seed + k); };
var col = tint || (bright ? [255, 236, 204] : [228, 214, 186]);
var C = function(a) { return 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a + ')'; };
var hx = 96 + (r(0) - 0.5) * 14, hy = seated ? 118 : 76, hr = 16 + r(1) * 5;
var lean = (r(2) - 0.5) * 0.16, tilt = (r(3) - 0.5) * 0.3, pose = Math.floor(r(4) * 4);
var sw = 46 + r(5) * 10, slope = 10 + r(6) * 10, slopeR = slope + (r(12) - 0.5) * 10, waist = sw * (0.72 + r(7) * 0.14), hip = sw * (0.86 + r(8) * 0.12);
var ny = hy + hr * 0.9, sy = ny + 16, wy = sy + 92, hy2 = wy + 36;
function body(k) {
// k is the copy: 0 the figure, 1 the after-image slipped a little
cx.save(); cx.translate(hx, sy); cx.rotate(lean * (k ? 1.35 : 1)); cx.translate(-hx, -sy);
if (k) cx.translate(6 + r(9) * 6, -3);
// torso and lap or legs, one closed path from the left shoulder round
cx.beginPath();
cx.moveTo(hx - sw / 2, sy + slope);
cx.quadraticCurveTo(hx - sw * 0.55, wy - 20, hx - waist / 2, wy);
if (seated) {
// thighs forward, foreshortened, knees high, the lower legs dropping away
cx.quadraticCurveTo(hx - hip / 2 - 4, wy + 10, hx - hip * 0.78, wy + 30);
cx.quadraticCurveTo(hx - hip * 0.86, wy + 52, hx - hip * 0.62, wy + 66);
cx.lineTo(hx - hip * 0.5, h); cx.lineTo(hx - 6, h); cx.lineTo(hx - 4, wy + 72); cx.lineTo(hx + 4, wy + 72); cx.lineTo(hx + 6, h); cx.lineTo(hx + hip * 0.5, h);
cx.lineTo(hx + hip * 0.62, wy + 66);
cx.quadraticCurveTo(hx + hip * 0.86, wy + 52, hx + hip * 0.78, wy + 30);
cx.quadraticCurveTo(hx + hip / 2 + 4, wy + 10, hx + waist / 2, wy);
} else {
cx.quadraticCurveTo(hx - hip / 2 - 2, hy2 - 10, hx - hip / 2, hy2);
cx.lineTo(hx - hip / 2 + 2, h); cx.lineTo(hx - 4, h); cx.lineTo(hx - 2, hy2 + 50); cx.lineTo(hx + 2, hy2 + 50); cx.lineTo(hx + 4, h); cx.lineTo(hx + hip / 2 - 2, h);
cx.lineTo(hx + hip / 2, hy2);
cx.quadraticCurveTo(hx + hip / 2 + 2, hy2 - 10, hx + waist / 2, wy);
}
cx.quadraticCurveTo(hx + sw * 0.55, wy - 20, hx + sw / 2, sy + slopeR);
// shoulders up over the neck
cx.quadraticCurveTo(hx + sw * 0.3, sy - 6, hx + 9, ny);
cx.lineTo(hx - 9, ny);
cx.quadraticCurveTo(hx - sw * 0.3, sy - 6, hx - sw / 2, sy + slope);
cx.closePath(); cx.fill();
// arms: 0 hanging, 1 one hand raised (a glass, a cigarette), 2 folded or on the bar, 3 one hand to the face
cx.lineCap = 'round'; cx.lineWidth = 13 + r(10) * 3;
var ax = hx - sw / 2 + 4, bx = hx + sw / 2 - 4, ay = sy + slope + 2, by = sy + slopeR + 2;
cx.beginPath();
if (pose === 0) { cx.moveTo(ax, ay); cx.quadraticCurveTo(ax - 10, ay + 50, ax - 6, ay + 104); cx.moveTo(bx, by); cx.quadraticCurveTo(bx + 10, by + 50, bx + 6, by + 104); }
else if (pose === 1) { cx.moveTo(ax, ay); cx.quadraticCurveTo(ax - 10, ay + 50, ax - 6, ay + 104); cx.moveTo(bx, ay); cx.quadraticCurveTo(bx + 22, ay + 40, bx + 2, ay + 64); cx.lineTo(hx + 12, hy + hr * 0.6); }
else if (pose === 2) { cx.moveTo(ax, ay); cx.quadraticCurveTo(ax - 12, ay + 46, ax + 10, ay + 78); cx.lineTo(bx - 10, ay + 74); cx.moveTo(bx, ay); cx.quadraticCurveTo(bx + 12, ay + 46, bx - 10, ay + 74); }
else { cx.moveTo(ax, ay); cx.quadraticCurveTo(ax - 20, ay + 44, ax + 2, ay + 60); cx.lineTo(hx - 10, hy + hr * 0.5); cx.moveTo(bx, ay); cx.quadraticCurveTo(bx + 10, ay + 50, bx + 6, ay + 104); }
cx.stroke();
// the head, a little tilted, with the neck
cx.save(); cx.translate(hx, hy); cx.rotate(tilt);
cx.beginPath(); cx.ellipse(0, 0, hr * 0.86, hr, 0, 0, 6.3); cx.fill();
cx.beginPath(); cx.rect(-7, hr * 0.5, 14, hr * 0.7); cx.fill();
cx.restore();
cx.restore();
}
// 1. the aura: the whole figure, wide and soft
try { cx.filter = 'blur(10px)'; } catch (e) {}
cx.fillStyle = C(bright ? 0.3 : 0.22); cx.strokeStyle = C(bright ? 0.3 : 0.22); body(0);
// 2. the after-image, slipped, soft
try { cx.filter = 'blur(4px)'; } catch (e) {}
cx.fillStyle = C(0.16); cx.strokeStyle = C(0.16); body(1);
// 3. the core, nearly sharp
try { cx.filter = 'blur(1.2px)'; } catch (e) {}
cx.fillStyle = C(bright ? 0.8 : 0.56); cx.strokeStyle = C(bright ? 0.8 : 0.56); body(0);
try { cx.filter = 'none'; } catch (e) {}
// 4. hollow the chest and the middle so the figure reads as a shell, a trace, not a solid
cx.globalCompositeOperation = 'destination-out';
var hol = cx.createRadialGradient(hx, sy + 46, 4, hx, sy + 46, 46); hol.addColorStop(0, 'rgba(0,0,0,0.42)'); hol.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = hol; cx.fillRect(0, 0, w, h);
var hh = cx.createRadialGradient(hx, hy, 2, hx, hy, hr * 0.8); hh.addColorStop(0, 'rgba(0,0,0,0.3)'); hh.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = hh; cx.fillRect(0, 0, w, h);
// 5. the rim of lamplight: the figure again, brighter, kept only along one edge
cx.globalCompositeOperation = 'source-over';
var side = r(11) < 0.5 ? -1 : 1;
var rimC = document.createElement('canvas'); rimC.width = w; rimC.height = h; var rx = rimC.getContext('2d');
var save = cx; cx = rx;
try { cx.filter = 'blur(1px)'; } catch (e) {}
cx.fillStyle = C(1); cx.strokeStyle = C(1); body(0);
try { cx.filter = 'none'; } catch (e) {}
cx.globalCompositeOperation = 'destination-out';
try { cx.filter = 'blur(1.5px)'; } catch (e) {}
cx.fillStyle = 'rgba(0,0,0,1)'; cx.strokeStyle = 'rgba(0,0,0,1)'; cx.save(); cx.translate(side * 8, 3); body(0); cx.restore();
try { cx.filter = 'none'; } catch (e) {}
var lg = cx.createLinearGradient(hx - side * 60, 0, hx + side * 60, 0); lg.addColorStop(0, 'rgba(0,0,0,1)'); lg.addColorStop(0.5, 'rgba(0,0,0,0.4)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
cx.fillStyle = lg; cx.fillRect(0, 0, w, h);
cx = save;
cx.globalAlpha = 1; cx.drawImage(rimC, 0, 0); cx.globalAlpha = 1;
// 6. grain, so it sits in the film of the room
cx.globalCompositeOperation = 'destination-in';
var gr = cx.createImageData(w, h), d = gr.data, s = seed * 977 + 13;
for (var i = 0; i < d.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; d[i + 3] = 200 + (s >> 16) % 56; d[i] = d[i + 1] = d[i + 2] = 255; }
var grC = document.createElement('canvas'); grC.width = w; grC.height = h; grC.getContext('2d').putImageData(gr, 0, 0);
cx.drawImage(grC, 0, 0);
// 7. dissolve towards the floor
cx.globalCompositeOperation = 'destination-out';
var g = cx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(seated ? 0.42 : 0.3, 'rgba(0,0,0,0.05)'); g.addColorStop(seated ? 0.72 : 0.62, 'rgba(0,0,0,0.45)'); g.addColorStop(seated ? 0.92 : 0.86, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,1)');
cx.fillStyle = g; cx.fillRect(0, 0, w, h);
cx.globalCompositeOperation = 'source-over';
});
};
// <<<< DSS GHOST TEX END
