"""Wire the six rooms into the twee: the room kit and each room's block into the
UserScript, the container into each venue passage (old drawn decoration off),
the CSS for the containers. Idempotent: every insertion sits between markers."""
import re, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
TWEE = "/home/user/Dream-Street-Shuffle-Game/Dream Street Shuffle.twee"
src = open(TWEE, encoding='utf-8').read()

ROOMS = [r for r in sys.argv[1:]] or ['cu', 'cb', 'ti', 'lk', 'cf', 'oi']

def between(s, start_marker, end_marker, new):
    """Replace (or insert) the block between two marker lines."""
    if start_marker in s:
        a = s.index(start_marker); b = s.index(end_marker, a) + len(end_marker)
        return s[:a] + new + s[b:]
    return None

# 1. the kit, before the French room block
KIT_A, KIT_B = '// >>>> DSS ROOM KIT BEGIN', '// <<<< DSS ROOM KIT END\n'
kit = KIT_A + '\n' + open(os.path.join(HERE, 'room_kit.js'), encoding='utf-8').read().rstrip('\n') + '\n' + KIT_B
r = between(src, KIT_A, KIT_B, kit)
if r is None:
    anchor = "// ====== INSIDE THE FRENCH — THE ROOM, WITH CLOSE-UPS ======"
    assert anchor in src
    src = src.replace(anchor, kit + '\n' + anchor, 1)
else:
    src = r

# 2. the rooms, before the Coach and Horses approach scene
for rid in ROOMS:
    path = os.path.join(HERE, rid + '_room.js')
    if not os.path.exists(path): print('no block for', rid); continue
    A, B = '// >>>> DSS ROOM %s BEGIN' % rid.upper(), '// <<<< DSS ROOM %s END\n' % rid.upper()
    block = A + '\n' + open(path, encoding='utf-8').read().rstrip('\n') + '\n' + B
    r = between(src, A, B, block)
    if r is None:
        anchor = "// ====== COACH AND HORSES SCENE — INLINE ======"
        assert anchor in src
        src = src.replace(anchor, block + '\n' + anchor, 1)
    else:
        src = r

# 3. the passages
def passage(name):
    m = re.search(r'^:: ' + re.escape(name) + r'(?: \[[^\]]*\])?(?: \{[^\n]*\})?\n', src, re.M)
    assert m, name
    n = re.search(r'^:: ', src[m.end():], re.M)
    end = m.end() + (n.start() if n else len(src) - m.end())
    return m.end(), end

def edit_passage(name, fn):
    global src
    a, b = passage(name)
    body = src[a:b]
    new = fn(body)
    assert new is not None, 'edit failed for ' + name
    src = src[:a] + new + src[b:]

def cu(body):
    if 'id="cu-container"' in body: return body
    old = ('(set: $awaitingCopperPwd to true)\\\n<!-- Swinging bulb -->\n<div class="cellar-bulb-wrap">\n')
    assert body.startswith(old), body[:120]
    i = body.index('</div>\n<div class="cellar-scene">\n<div class="cellar-light"></div>\n')
    j = i + len('</div>\n<div class="cellar-scene">\n<div class="cellar-light"></div>\n')
    return '(set: $awaitingCopperPwd to true)\\\n<div id="cu-container"></div>\\\n<div class="cellar-scene">\n' + body[j:]

def cb(body):
    if 'id="cb-container"' in body: return body
    old = '<h2 class="venue-title">The Coach and Horses</h2>\n'
    assert old in body
    return body.replace(old, '<div id="cb-container"></div>\\\n' + old, 1)

def ti(body):
    if 'id="ti-container"' in body: return body
    # the neon frame, the marquee and the two strips come off; the words, the title and the links stay
    assert body.startswith('<div class="trishas-frame">\n<svg class="trishas-marquee"')
    i = body.index('</svg>\n<span class="trishas-strip">(display: "Trisha Strip SVG")</span>\n') + len('</svg>\n<span class="trishas-strip">(display: "Trisha Strip SVG")</span>\n')
    body = '<div id="ti-container"></div>\\\n' + body[i:]
    tail = '[[Back to the street|Dean Street]]\n<span class="trishas-strip">(display: "Trisha Strip SVG")</span></div>\n'
    assert tail in body
    return body.replace(tail, '[[Back to the street|Dean Street]]\n', 1)

def lk(body):
    if 'id="lk-container"' in body: return body
    old = 'You find the building on Frith Street, on the door: M. Lackland.\n'
    assert old in body
    return body.replace(old, '<div id="lk-container"></div>\\\n' + old, 1)

def cf(body):
    if 'id="cf-container"' in body: return body
    # the strip lights and the tubes come off; the scene wrapper stays (it carries the flower-only dimming), the words stay
    old_head = '<div class="chippy-scene">\n(if: $hadChippy is true and $tookLily1 is false)[<span class="dss-flower-only-marker"></span>]\n<div class="chippy-light top"></div>\n<div class="chippy-light bottom"></div>\n'
    assert body.startswith(old_head), body[:200]
    i = body.index('</svg>\nYou find it after some looking') + len('</svg>\n')
    body = '<div id="cf-container"></div>\\\n<div class="chippy-scene">\n(if: $hadChippy is true and $tookLily1 is false)[<span class="dss-flower-only-marker"></span>]\n' + body[i:]
    m = re.search(r'\n<svg class="chippy-tube"[^\n]*</svg>\n</div>\n', body)
    assert m
    return body[:m.start()] + '\n</div>\n' + body[m.end():]

def oi(body):
    if 'id="oi-container"' in body: return body
    old = '<span class="shop-bell-marker" style="display:none">'
    assert old in body
    return body.replace(old, '<div id="oi-container"></div>\\\n' + old, 1)

EDITS = {'cu': ('Turn to Copper', cu), 'cb': ('Coach and Horses bar', cb), 'ti': ("Trisha's", ti), 'lk': ("Martin Lackland's Office", lk), 'cf': ('Chinese Fish and Chips', cf), 'oi': ("O'Flatterly's shop", oi)}
for rid in ROOMS:
    if rid in EDITS: edit_passage(*EDITS[rid])

# 4. CSS
CSS_A, CSS_B = '/* >>>> DSS ROOMS 2026-09-30 BEGIN */', '/* <<<< DSS ROOMS 2026-09-30 END */\n'
css = CSS_A + '''
/* 2026-09-30: six more venue passages carry a room (Coach and Horses bar,
   Trisha's, Lackland's office, the Chippy, Copper's cellar, O'Flatterly's).
   As with the first four, the old drawn decoration under the room came off
   in the passage markup and the room holds the passage's words. The
   cellar's and the chippy's wrappers stay (other passages share them and the
   chippy's carries the flower-only dimming), flattened under the room. */
#cb-container, #ti-container, #lk-container, #cf-container, #cu-container, #oi-container { position: relative; }
tw-passage:has(#cu-container) .cellar-scene { position: static; }
tw-passage:has(#cf-container) .chippy-scene { position: static; padding: 0; }
.dss-room-prose .venue-title { margin-top: 0; }
.dss-room-prose .cellar-scene .claude-draft, .dss-room-prose .chippy-scene .claude-draft { margin: 0.4em 0; }
''' + CSS_B
r = between(src, CSS_A, CSS_B, css)
if r is None:
    anchor = "/* Under a room the Colony's flat green wash gives way to the cast above"
    assert anchor in src
    src = src.replace(anchor, css + '\n' + anchor, 1)
else:
    src = r

# 5. the words panel: a press on the password box focuses it, so the words can be typed
old = "if (t) t.click();\n}\ncanvas.addEventListener('pointerup', up);"
new = "if (t) { t.click(); if (/^(INPUT|TEXTAREA)$/.test(t.tagName)) { try { t.focus(); } catch (e) {} } }\n}\ncanvas.addEventListener('pointerup', up);"
if old in src: src = src.replace(old, new, 1)
assert new in src

open(TWEE, 'w', encoding='utf-8').write(src)
print('applied', ROOMS)
