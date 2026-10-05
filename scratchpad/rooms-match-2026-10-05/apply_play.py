"""2026-10-05: lift the kit's hover/card/glow/reveal/words/camera machinery into window.dssRoomPlay and make
the kit and the four early rooms (fi, ci, pi, ri) call it. Idempotent-ish: refuses to run twice."""
import re, sys
P = 'Dream Street Shuffle.twee'
s = open(P, encoding='utf-8').read()
assert 'window.dssRoomPlay' not in s, 'already applied'
def one(old, new, where=None):
    global s
    n = s.count(old); assert n == 1, (n, old[:90])
    s = s.replace(old, new)

# ---------- 1. the kit's section becomes the shared function ----------
kb = s.index('// >>>> DSS ROOM KIT BEGIN'); ke = s.index('// <<<< DSS ROOM KIT END')
kit = s[kb:ke]
a = kit.index("var PINK = 'color:#ff3aa8;")
hint_line = "if (window.dssRoomHint) window.dssRoomHint(wrap, hint, 0.6); else { setTimeout(function() { hint.style.opacity = '0.6'; }, 2600); setTimeout(function() { hint.style.opacity = '0'; }, 9000); }\n"
b = kit.index(hint_line) + len(hint_line)
sec = kit[a:b]
body = sec
def rep(old, new):
    global body
    n = body.count(old); assert n == 1, (n, old[:90])
    body = body.replace(old, new)
rep("var C = spec.card || {};", "var C = o.card || {};")
rep("hint.textContent = spec.hint || 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';", "hint.textContent = o.hint || 'LOOK CLOSER AT WHAT CATCHES YOUR EYE';")
rep("card = document.createElement('div');\ncard.className = 'dss-room-card';", "var card = document.createElement('div');\ncard.className = 'dss-room-card';")
rep("activeSpot = null; card.style.opacity = '0'; card.style.pointerEvents = 'none';",
    "if (activeSpot && activeSpot.onLook) activeSpot.onLook(false);\nactiveSpot = null; card.style.opacity = '0'; card.style.pointerEvents = 'none';")
rep("showCard(spot);\nbeginTween(spot.pos, spot.tgt, 'inspect');\n});",
    "showCard(spot);\nbeginTween(spot.pos, spot.tgt, 'inspect');\nif (spot.onLook) spot.onLook(true);\n});")
rep("activeSpot = sp; showCard(sp); beginTween(sp.pos, sp.tgt, 'inspect'); });",
    "if (activeSpot && activeSpot.onLook) activeSpot.onLook(false); activeSpot = sp; showCard(sp); beginTween(sp.pos, sp.tgt, 'inspect'); if (sp.onLook) sp.onLook(true); });")
rep("link.click(); stepBack(); });", "link.click(); stepBack(); if (o.onPress) o.onPress(spot, link); });")
assert 'spec.' not in body, [m.start() for m in re.finditer('spec\\.', body)]
play = """// >>>> DSS ROOM PLAY BEGIN
// ====== THE ROOM'S PLAY — what a player touches in any venue room, once (2026-10-05) ======
// Sam (2026-10-05): "Two visual systems. The first four rooms have their own machinery and the six
// later ones share one kit, so hover, cards and glow differ slightly room to room. A pass to make
// them match." The hover halo and its name, the close-up card and its paths, the resting glow, the
// reveal, the words panel and the camera's idle sway and tweens live here, once; the kit's six rooms
// and the four early rooms (French, Colony, Pillars, Ronnie's) all call it, each keeping its own
// scene, objects and plot clickables. Nothing about the game is decided here: a room only finds the
// passage's own links by their wording and presses them from the card.
// o: { wrap, canvas, host, scene, camera, CAM, HOTSPOTS, tex, still, card { fg, bg, border, dim, btn, btnBorder },
//      hint, onPress(spot, link), state() }
// a hotspot: { root, name, pos, tgt, actions(), prose(), line, figure, haloAt [x,y,z], haloSc, onLook(on) }
// returns { halo, restGroup, curTarget, words, card, frame(t, dt), withGlowsHidden(fn), stepBack, showCard, claimedLinks }
window.dssRoomPlay = function(o) {
var wrap = o.wrap, canvas = o.canvas, host = o.host, scene = o.scene, camera = o.camera, CAM = o.CAM, HOTSPOTS = o.HOTSPOTS, tex = o.tex, still = !!o.still;
var WRAP = wrap.id;
""" + body + """
// ---------- THE FRAME: the camera, the halo's breath, the words, the glow, the reveal ----------
var reg = window._dssThreeRegistry && window._dssThreeRegistry[WRAP];
var frames = 0;
if (reg) {
reg.camera = camera;
reg.hotspots = HOTSPOTS;
reg.state = function() { var st = { camMode: camMode, camK: camK, frames: frames }; if (o.state) { var x = o.state(); for (var key in x) st[key] = x[key]; } return st; };
reg.spots = HOTSPOTS.map(function(h) { return { name: h.name, tgt: h.tgt, haloAt: h.haloAt, figure: !!h.figure }; });
}
function frame(t, dt) {
frames++;
if (camMode === 'idle') {
camera.position.set(CAM.x + Math.sin(t * 0.11) * 0.04, CAM.y + Math.sin(t * 0.17) * 0.02, CAM.z);
curTarget.set(CAM.tx, CAM.ty, CAM.tz);
} else if (camMode === 'tween') {
camK = Math.min(1, camK + dt / 1.5);
var e = camK * camK * (3 - 2 * camK);
camera.position.lerpVectors(camFromP, camToP, e);
curTarget.lerpVectors(camFromT, camToT, e);
if (camK >= 1) camMode = camNext;
} else if (!still) {
// at a close-up the camera is held, not fixed: the French's small breath, now in every room
camera.position.x = camToP.x + Math.sin(t * 0.3) * 0.008; camera.position.y = camToP.y + Math.sin(t * 0.45) * 0.005;
}
camera.lookAt(curTarget);
if (wrap.dataset.cam !== camMode) wrap.dataset.cam = camMode;
if (!still && halo.visible) halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08;
if (words && Date.now() >= wordsNext) { wordsNext = Date.now() + 500; words.refresh(claimedLinks()); }
restTick(t);
if (reveal) reveal.tick();
}
// a mirror's render leaves the halo and the resting glow out of the glass
function withGlowsHidden(fn) {
var hw = halo.visible, rw = restGroup.visible;
halo.visible = false; restGroup.visible = false;
try { fn(); } finally { halo.visible = hw; restGroup.visible = rw; }
}
if (still) { camera.lookAt(curTarget); wrap.dataset.cam = 'idle'; }
return { halo: halo, restGroup: restGroup, curTarget: curTarget, words: words, card: card, frame: frame, withGlowsHidden: withGlowsHidden, stepBack: stepBack, showCard: showCard, claimedLinks: claimedLinks };
};
// <<<< DSS ROOM PLAY END

"""
kit2 = kit[:a] + """// ---------- THE CLOSE-UPS, AND THE PATHS: shared with every room (window.dssRoomPlay) ----------
var play = window.dssRoomPlay({ wrap: wrap, canvas: canvas, host: host, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: still,
card: spec.card, hint: spec.hint, state: function() { return { active: active, animId: animId }; } });
var words = play.words, curTarget = play.curTarget;
""" + kit[b:]
# the kit's own uses of what moved
def krep(old, new):
    global kit2
    n = kit2.count(old); assert n == 1, (n, old[:90])
    kit2 = kit2.replace(old, new)
krep("var card = null;\nfunction passageLinks(sel) {", "var play = null;\nfunction passageLinks(sel) {")
krep("!(card && card.contains(l))", "!(play && play.card.contains(l))")
krep(" var haloWas = halo.visible; if (haloWas) halo.visible = false; restGroup.visible = false;", "")
krep(" if (haloWas) halo.visible = true; restGroup.visible = true;", "")
krep("""window._dssThreeRegistry[WRAP].camera = camera;
window._dssThreeRegistry[WRAP].hotspots = HOTSPOTS;
window._dssThreeRegistry[WRAP].state = function() { return { camMode: camMode, camK: camK, active: active, animId: animId, frames: frameCount }; };
window._dssThreeRegistry[WRAP].spots = HOTSPOTS.map(function(h) { return { name: h.name, tgt: h.tgt, haloAt: h.haloAt, figure: !!h.figure }; });
var frameCount = 0;
""", "")
krep("animId = requestAnimationFrame(animate); frameCount++;", "animId = requestAnimationFrame(animate);")
krep("""if (camMode === 'idle') {
camera.position.set(CAM.x + Math.sin(t * 0.11) * 0.04, CAM.y + Math.sin(t * 0.17) * 0.02, CAM.z);
curTarget.set(CAM.tx, CAM.ty, CAM.tz);
} else if (camMode === 'tween') {
camK = Math.min(1, camK + dt / 1.5);
var e = camK * camK * (3 - 2 * camK);
camera.position.lerpVectors(camFromP, camToP, e);
curTarget.lerpVectors(camFromT, camToT, e);
if (camK >= 1) camMode = camNext;
}
camera.lookAt(curTarget);
if (wrap.dataset.cam !== camMode) wrap.dataset.cam = camMode;
""", "play.frame(t, dt);\n")
krep("if (halo.visible) halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08;\n", "")
krep("for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t);",
     "play.withGlowsHidden(function() { for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t); });")
krep("if (words && clock.getElapsedTime() >= wordsNext) { wordsNext = clock.getElapsedTime() + 0.5; words.refresh(claimedLinks()); }\nrestTick(t);\nif (reveal) reveal.tick();\n", "")
krep("if (still) { camera.lookAt(curTarget); wrap.dataset.cam = 'idle'; }\n", "")
s = s[:kb] + play + kit2 + s[ke:]

# ---------- 2. the four early rooms ----------
ROOMS = {
 'fi': dict(start='// ====== INSIDE THE FRENCH — THE ROOM, WITH CLOSE-UPS ======', end='// ====== INSIDE THE COLONY — THE ROOM, WITH CLOSE-UPS ======',
            card="{ fg: 'rgba(220,198,150,0.92)', bg: 'rgba(10,7,4,0.78)', border: 'rgba(200,168,106,0.32)', dim: 'rgba(200,180,140,0.5)', btn: 'rgba(230,200,120,0.95)', btnBorder: 'rgba(200,170,100,0.45)' }"),
 'ci': dict(start='// ====== INSIDE THE COLONY — THE ROOM, WITH CLOSE-UPS ======', end='// ====== INSIDE THE PILLARS — THE ROOM, WITH CLOSE-UPS ======',
            card="{ fg: 'rgba(215,225,180,0.92)', bg: 'rgba(6,10,4,0.8)', border: 'rgba(170,200,110,0.3)', dim: 'rgba(190,200,150,0.5)', btn: 'rgba(220,235,160,0.95)', btnBorder: 'rgba(180,200,110,0.45)' }"),
 'pi': dict(start='// ====== INSIDE THE PILLARS — THE ROOM, WITH CLOSE-UPS ======', end="// ====== INSIDE RONNIE'S — THE ROOM, WITH CLOSE-UPS ======",
            card="{ fg: 'rgba(215,225,180,0.92)', bg: 'rgba(6,10,4,0.8)', border: 'rgba(170,200,110,0.3)', dim: 'rgba(190,200,150,0.5)', btn: 'rgba(220,235,160,0.95)', btnBorder: 'rgba(180,200,110,0.45)' }"),
 'ri': dict(start="// ====== INSIDE RONNIE'S — THE ROOM, WITH CLOSE-UPS ======", end='// >>>> DSS ROOM CU BEGIN',
            card="{ fg: 'rgba(215,225,180,0.92)', bg: 'rgba(6,10,4,0.8)', border: 'rgba(170,200,110,0.3)', dim: 'rgba(190,200,150,0.5)', btn: 'rgba(220,235,160,0.95)', btnBorder: 'rgba(180,200,110,0.45)' }"),
}
for r, R in ROOMS.items():
    rb = s.index(R['start']); re_ = s.index(R['end']); room = s[rb:re_]
    def rr(old, new, count=1):
        global room
        n = room.count(old); assert n == count, (r, n, old[:90])
        room = room.replace(old, new)
    # the card colours of each room's own BTN/card lines are what R['card'] carries; check they still say so
    for key, want in re.findall(r"(\w+): '([^']+)'", R['card']):
        assert want in room, (r, key, want)
    a = room.index('var hotspotRoots = HOTSPOTS.map')
    hl = "if (window.dssRoomHint) window.dssRoomHint(%sWrap, %sHint, 1); else { setTimeout(function() { %sHint.style.opacity = '1'; }, 2600); setTimeout(function() { %sHint.style.opacity = '0'; }, 9000); }\n" % (r, r, r, r)
    b = room.index(hl) + len(hl)
    extra = ''
    if r == 'ri':
        extra = ",\nonPress: function(spot, link) { if (link.tagName !== 'TW-LINK') setTimeout(function() { try { var ar = document.getElementById('bar-arena') || link; ar.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {} }, 250); }"
    call = ("// ---------- the hover, the card, the resting glow, the reveal and the words: shared with every room (window.dssRoomPlay) ----------\n"
            "var play = window.dssRoomPlay({ wrap: %sWrap, canvas: %sCanvas, host: %sHost, scene: scene, camera: camera, CAM: CAM, HOTSPOTS: HOTSPOTS, tex: tex, still: %sStill,\n"
            "card: %s, hint: 'LOOK CLOSER AT WHAT CATCHES YOUR EYE', state: function() { return { active: %sActive, animId: %sAnimId }; }%s });\n"
            "var words = play.words, halo = play.halo, curTarget = play.curTarget;\n") % (r, r, r, r, R['card'], r, r, extra)
    room = room[:a] + call + room[b:]
    rr("!(card && card.contains(l))", "!(play && play.card.contains(l))")
    rr("window._dssThreeRegistry['%s-wrap'].camera = camera;\nwindow._dssThreeRegistry['%s-wrap'].hotspots = HOTSPOTS;\n" % (r, r), "")
    if r == 'fi':
        rr("""if (camMode === 'idle') {
camera.position.set(CAM.x + Math.sin(t * 0.11) * 0.05, CAM.y + Math.sin(t * 0.17) * 0.02, CAM.z);
curTarget.set(CAM.tx, CAM.ty, CAM.tz);
} else if (camMode === 'tween') {
camK = Math.min(1, camK + dt / 1.5);
var e = camK * camK * (3 - 2 * camK);
camera.position.lerpVectors(camFromP, camToP, e); curTarget.lerpVectors(camFromT, camToT, e);
if (camK >= 1) camMode = camNext;
} else {
camera.position.x = camToP.x + Math.sin(t * 0.3) * 0.008; camera.position.y = camToP.y + Math.sin(t * 0.45) * 0.005;
}
camera.lookAt(curTarget);
fiWrap.dataset.cam = camMode;
""", "play.frame(t, dt);\n")
        rr("if (halo.visible) { halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08; }\n", "")
        rr("reflectRoom(curTarget);\nif (words && clock.getElapsedTime() >= wordsNext) { wordsNext = clock.getElapsedTime() + 0.5; words.refresh(claimedLinks()); }\nrestTick(t, fiStill);\nif (reveal) reveal.tick();\n",
           "play.withGlowsHidden(function() { reflectRoom(curTarget); });\n")
        # the door's light at its close-up, and the halo's own spots and sizes, move onto the hotspots
        rr("{ root: photoG, name: 'the photographs', pos: [0.2, 1.95, -2.4], tgt: [0.9, 2.0, -4.5],",
           "{ root: photoG, name: 'the photographs', pos: [0.2, 1.95, -2.4], tgt: [0.9, 2.0, -4.5], haloAt: [0.4, 2.0, -4.4], haloSc: 1.4,")
        rr("{ root: doorG, name: 'the blue door', pos: [1.9, 1.5, -2.3], tgt: [2.45, 1.3, -4.5],",
           "{ root: doorG, name: 'the blue door', pos: [1.9, 1.5, -2.3], tgt: [2.45, 1.3, -4.5], haloAt: [2.45, 1.3, -4.4], haloSc: 1.1,\nonLook: function(on) { doorLight.intensity = on ? 0.9 : 0; doorGlow.material.opacity = on ? 0.55 : 0; },")
        rr("{ root: barG, name: 'the bar', pos: [-1.05, 1.45, 1.55], tgt: [-2.55, 1.25, -0.4],",
           "{ root: barG, name: 'the bar', pos: [-1.05, 1.45, 1.55], tgt: [-2.55, 1.25, -0.4], haloAt: [-1.5, 1.2, -0.3], haloSc: 1.4,")
        rr("{ root: winG, name: 'the window', pos: [2.2, 1.7, -1.5], tgt: [3.7, 1.9, -2.4],",
           "{ root: winG, name: 'the window', pos: [2.2, 1.7, -1.5], tgt: [3.7, 1.9, -2.4], haloAt: [3.6, 1.95, -2.4], haloSc: 1.1,")
    else:
        rr("""if (camMode === 'idle') {
camera.position.set(CAM.x + Math.sin(t * 0.11) * 0.04, CAM.y + Math.sin(t * 0.17) * 0.02, CAM.z);
curTarget.set(CAM.tx, CAM.ty, CAM.tz);
} else if (camMode === 'tween') {
camK = Math.min(1, camK + dt / 1.5);
var e = camK * camK * (3 - 2 * camK);
camera.position.lerpVectors(camFromP, camToP, e);
curTarget.lerpVectors(camFromT, camToT, e);
if (camK >= 1) camMode = camNext;
}
camera.lookAt(curTarget);
if (%sWrap.dataset.cam !== camMode) %sWrap.dataset.cam = camMode;
""" % (r, r), "play.frame(t, dt);\n")
        rr("if (halo.visible) halo.material.opacity = 0.8 + Math.sin(t * 0.9) * 0.08;\n", "")
        rr("for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t);\nif (words && clock.getElapsedTime() >= wordsNext) { wordsNext = clock.getElapsedTime() + 0.5; words.refresh(claimedLinks()); }\nrestTick(t, %sStill);\nif (reveal) reveal.tick();\n" % r,
           "play.withGlowsHidden(function() { for (var mr = 0; mr < mirrors.length; mr++) mirrors[mr].update(curTarget, t); });\n")
        rr("if (%sStill) { camera.lookAt(curTarget); %sWrap.dataset.cam = 'idle'; }\n" % (r, r), "")
        rr(" var haloWas = typeof halo !== 'undefined' && halo.visible; if (haloWas) halo.visible = false;", "")
        rr(" if (haloWas) halo.visible = true;", "")
    s = s[:rb] + room + s[re_:]
open(P, 'w', encoding='utf-8').write(s)
print('applied')
