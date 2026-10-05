// ====== THE REVEAL — every clickable shows itself, named, for a few seconds (2026-10-05) ======
// Sam: "the clickable things in the 3d renders aren't very obvious. In Disco Elysium they are much more
// obvious. I want it more like that." So when the words are sent away, and again on a tap on empty room,
// every object with a choice or a look shows a small ring with its name beside it (the name its card
// already carries), holds, then fades back to the resting glow. Names only while the reveal lasts.
window.dssRoomReveal = function(wrap, camera, glows, idle) {
var layer = document.createElement('div'); layer.className = 'dss-room-reveal'; wrap.appendChild(layer);
var marks = glows.map(function(g) {
var m = document.createElement('div'); m.className = 'dss-room-mark';
var ring = document.createElement('i'); var name = document.createElement('span'); name.textContent = g.spot.name || '';
m.appendChild(ring); m.appendChild(name); layer.appendChild(m);
return { g: g, el: m, shown: true };
});
var until = 0, shown = false, v = new THREE.Vector3();
function show(ms) { until = performance.now() + (ms || 4200); }
wrap.addEventListener('dss-room-words-away', function() { show(4800); });
wrap.addEventListener('dss-room-emptytap', function() { show(3200); });
function tick() {
var on = idle() && performance.now() < until;
if (on !== shown) { shown = on; layer.classList.toggle('dss-room-reveal-on', on); }
if (!on) return;
var w = wrap.clientWidth, h = wrap.clientHeight;
marks.forEach(function(m) {
var vis = !!m.g.on;
if (vis) { v.copy(m.g.sp.position).project(camera); vis = v.z < 1 && Math.abs(v.x) < 1.02 && Math.abs(v.y) < 1.02; }
if (vis !== m.shown) { m.shown = vis; m.el.style.display = vis ? '' : 'none'; }
if (vis) { m.el.style.left = ((v.x + 1) / 2 * w).toFixed(1) + 'px'; m.el.style.top = ((1 - v.y) / 2 * h).toFixed(1) + 'px'; }
});
}
return { tick: tick, show: show };
};

