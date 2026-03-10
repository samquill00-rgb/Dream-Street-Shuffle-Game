#!/usr/bin/env python3
"""Update the Build Map passage and map CSS for the neon noir redesign."""

import re

twee_path = "/sessions/laughing-friendly-brahmagupta/mnt/Claude work/Dream Street Shuffle.twee"

with open(twee_path, "r", encoding="utf-8") as f:
    content = f.read()

# ============================================================
# 1. Replace the Build Map passage
# ============================================================

new_build_map = r""":: Build Map {"position":"500,200","size":"100,100"}
(set: _fv to "map-dot")(set: _fl to "#6a5a48")(set: _fp to "0")\
(if: $visited contains "French")[(if: $visited's French is true)[(set: _fv to "map-dot map-lit")(set: _fl to "#d4a574")(set: _fp to "1")]]\
(set: _pv to "map-dot")(set: _pl to "#6a5a48")(set: _pp to "0")\
(if: $visited contains "Pillars")[(if: $visited's Pillars is true)[(set: _pv to "map-dot map-lit")(set: _pl to "#d4a574")(set: _pp to "1")]]\
(set: _cv to "map-dot")(set: _cl to "#6a5a48")(set: _cp to "0")\
(if: $visited contains "Colony")[(if: $visited's Colony is true)[(set: _cv to "map-dot map-lit")(set: _cl to "#d4a574")(set: _cp to "1")]]\
(set: _rv to "map-dot")(set: _rl to "#6a5a48")(set: _rp to "0")\
(if: $visited contains "Ronnies")[(if: $visited's Ronnies is true)[(set: _rv to "map-dot map-lit")(set: _rl to "#d4a574")(set: _rp to "1")]]\
(set: _tv to "map-dot")(set: _tl to "#6a5a48")(set: _tp to "0")\
(if: $visited contains "Trishas")[(if: $visited's Trishas is true)[(set: _tv to "map-dot map-lit")(set: _tl to "#d4a574")(set: _tp to "1")]]\
(set: _lv to "map-dot")(set: _ll to "#6a5a48")(set: _lp to "0")\
(if: $knowsLackland is true)[(set: _lv to "map-dot map-lit")(set: _ll to "#d4a574")(set: _lp to "1")]\
(set: _ev to "map-dot")(set: _el to "#6a5a48")(set: _ep to "0")\
(if: $knowsCecilCourt is true)[(set: _ev to "map-dot map-lit")(set: _el to "#d4a574")(set: _ep to "1")]\
(set: _hv to "map-dot map-lit")(set: _hl to "#d4a574")(set: _hp to "1")\
(set: _m to "<div class='soho-map'><svg viewBox='0 0 340 440' xmlns='http://www.w3.org/2000/svg'>")\
(set: _m to _m + "<defs>")\
(set: _m to _m + "<filter id='vg' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='4' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>")\
(set: _m to _m + "<radialGradient id='lp'><stop offset='0%' stop-color='rgba(212,165,116,0.15)'/><stop offset='100%' stop-color='rgba(212,165,116,0)'/></radialGradient>")\
(set: _m to _m + "<linearGradient id='fg' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='rgba(30,28,25,0.3)'/><stop offset='40%' stop-color='rgba(10,9,8,0)'/><stop offset='70%' stop-color='rgba(10,9,8,0)'/><stop offset='100%' stop-color='rgba(30,28,25,0.4)'/></linearGradient>")\
(set: _m to _m + "</defs>")\
(set: _m to _m + "<rect width='340' height='440' fill='#0a0908'/>")\
(set: _m to _m + "<rect x='90' y='55' width='50' height='135' rx='1' fill='rgba(25,22,18,0.8)' stroke='rgba(50,42,35,0.15)' stroke-width='0.5'/>")\
(set: _m to _m + "<rect x='160' y='55' width='50' height='135' rx='1' fill='rgba(22,20,16,0.8)' stroke='rgba(50,42,35,0.15)' stroke-width='0.5'/>")\
(set: _m to _m + "<rect x='90' y='215' width='50' height='100' rx='1' fill='rgba(25,22,18,0.7)' stroke='rgba(50,42,35,0.15)' stroke-width='0.5'/>")\
(set: _m to _m + "<rect x='160' y='215' width='50' height='100' rx='1' fill='rgba(22,20,16,0.7)' stroke='rgba(50,42,35,0.15)' stroke-width='0.5'/>")\
(set: _m to _m + "<rect x='90' y='340' width='120' height='60' rx='1' fill='rgba(20,18,15,0.6)' stroke='rgba(50,42,35,0.1)' stroke-width='0.5'/>")\
(set: _m to _m + "<rect x='230' y='55' width='45' height='135' rx='1' fill='rgba(20,18,15,0.7)' stroke='rgba(50,42,35,0.12)' stroke-width='0.5'/>")\
(set: _m to _m + "<rect x='230' y='215' width='45' height='100' rx='1' fill='rgba(22,20,16,0.6)' stroke='rgba(50,42,35,0.12)' stroke-width='0.5'/>")\
(set: _m to _m + "<line x1='82' y1='40' x2='82' y2='410' stroke='rgba(212,165,116,0.08)' stroke-width='8'/>")\
(set: _m to _m + "<line x1='82' y1='40' x2='82' y2='410' stroke='rgba(212,165,116,0.06)' stroke-width='2'/>")\
(set: _m to _m + "<line x1='152' y1='25' x2='152' y2='420' stroke='rgba(212,165,116,0.1)' stroke-width='8'/>")\
(set: _m to _m + "<line x1='152' y1='25' x2='152' y2='420' stroke='rgba(212,165,116,0.07)' stroke-width='2'/>")\
(set: _m to _m + "<line x1='222' y1='40' x2='222' y2='410' stroke='rgba(212,165,116,0.08)' stroke-width='8'/>")\
(set: _m to _m + "<line x1='222' y1='40' x2='222' y2='410' stroke='rgba(212,165,116,0.06)' stroke-width='2'/>")\
(set: _m to _m + "<line x1='40' y1='200' x2='300' y2='200' stroke='rgba(212,165,116,0.09)' stroke-width='8'/>")\
(set: _m to _m + "<line x1='40' y1='200' x2='300' y2='200' stroke='rgba(212,165,116,0.06)' stroke-width='2'/>")\
(set: _m to _m + "<line x1='35' y1='60' x2='35' y2='400' stroke='rgba(212,165,116,0.03)' stroke-width='5'/>")\
(set: _m to _m + "<line x1='82' y1='325' x2='222' y2='325' stroke='rgba(212,165,116,0.04)' stroke-width='5'/>")\
(set: _m to _m + "<text x='82' y='35' text-anchor='middle' fill='rgba(212,165,116,0.3)' font-family='Playfair Display,Georgia,serif' font-size='9' letter-spacing='3'>FRITH ST</text>")\
(set: _m to _m + "<text x='152' y='20' text-anchor='middle' fill='rgba(212,165,116,0.4)' font-family='Playfair Display,Georgia,serif' font-size='9' letter-spacing='3'>DEAN ST</text>")\
(set: _m to _m + "<text x='222' y='35' text-anchor='middle' fill='rgba(212,165,116,0.3)' font-family='Playfair Display,Georgia,serif' font-size='9' letter-spacing='3'>GREEK ST</text>")\
(set: _m to _m + "<text x='170' y='195' text-anchor='middle' fill='rgba(212,165,116,0.25)' font-family='Playfair Display,Georgia,serif' font-size='8' letter-spacing='2'>OLD COMPTON ST</text>")\
(set: _m to _m + "<text x='152' y='10' text-anchor='middle' fill='rgba(212,165,116,0.15)' font-family='Playfair Display,Georgia,serif' font-size='7' letter-spacing='2'>&#9650; CENTRE POINT</text>")\
(set: _m to _m + "<circle cx='222' cy='70' r='25' fill='url(#lp)' opacity='" + _tp + "'/>")\
(set: _m to _m + "<circle cx='222' cy='70' r='4' class='" + _tv + "'/><text x='235' y='74' fill='" + _tl + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Trisha&#39;s</text>")\
(set: _m to _m + "<circle cx='82' cy='100' r='25' fill='url(#lp)' opacity='" + _lp + "'/>")\
(set: _m to _m + "<circle cx='82' cy='100' r='4' class='" + _lv + "'/><text x='69' y='104' text-anchor='end' fill='" + _ll + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Lackland&#39;s</text>")\
(set: _m to _m + "<circle cx='222' cy='110' r='25' fill='url(#lp)' opacity='" + _pp + "'/>")\
(set: _m to _m + "<circle cx='222' cy='110' r='4' class='" + _pv + "'/><text x='235' y='114' fill='" + _pl + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Pillars</text>")\
(set: _m to _m + "<circle cx='152' cy='130' r='25' fill='url(#lp)' opacity='" + _cp + "'/>")\
(set: _m to _m + "<circle cx='152' cy='130' r='4' class='" + _cv + "'/><text x='165' y='134' fill='" + _cl + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Colony Room</text>")\
(set: _m to _m + "<circle cx='82' cy='165' r='25' fill='url(#lp)' opacity='" + _rp + "'/>")\
(set: _m to _m + "<circle cx='82' cy='165' r='4' class='" + _rv + "'/><text x='69' y='169' text-anchor='end' fill='" + _rl + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Ronnie&#39;s</text>")\
(set: _m to _m + "<circle cx='222' cy='200' r='25' fill='url(#lp)' opacity='" + _hp + "'/>")\
(set: _m to _m + "<circle cx='222' cy='200' r='4' class='" + _hv + "'/><text x='235' y='204' fill='" + _hl + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Coach</text>")\
(set: _m to _m + "<circle cx='152' cy='255' r='25' fill='url(#lp)' opacity='" + _fp + "'/>")\
(set: _m to _m + "<circle cx='152' cy='255' r='4' class='" + _fv + "'/><text x='165' y='259' fill='" + _fl + "' font-family='Crimson Text,Georgia,serif' font-size='10'>The French</text>")\
(set: _m to _m + "<circle cx='110' cy='400' r='25' fill='url(#lp)' opacity='" + _ep + "'/>")\
(set: _m to _m + "<circle cx='110' cy='400' r='4' class='" + _ev + "'/><text x='123' y='404' fill='" + _el + "' font-family='Crimson Text,Georgia,serif' font-size='10'>Cecil Court</text>")\
(set: _m to _m + "<rect width='340' height='440' fill='url(#fg)' pointer-events='none'/>")\
(set: _m to _m + "<rect width='340' height='440' fill='none' stroke='rgba(10,9,8,0.8)' stroke-width='40' pointer-events='none'/>")\
(set: _m to _m + "</svg></div>")\
(dialog: _m, "&#10005;  CLOSE")"""

# Find the Build Map passage (from :: Build Map to the next :: passage)
pattern = r'(:: Build Map \{[^\n]+\}\n).*?(?=\n:: )'
match = re.search(pattern, content, re.DOTALL)
if match:
    old_passage = match.group(0)
    content = content.replace(old_passage, new_build_map)
    print(f"Replaced Build Map passage ({len(old_passage)} chars -> {len(new_build_map)} chars)")
else:
    print("ERROR: Could not find Build Map passage!")

# ============================================================
# 2. Update the map CSS styles
# ============================================================

# Replace the old map CSS block
old_css = """.soho-map { background: #0a0908; padding: 0.5em; }
.soho-map svg { width: 100%; height: auto; display: block; }
.map-st { stroke: rgba(212, 165, 116, 0.12); stroke-width: 1.5; }
.map-sn { fill: rgba(212, 165, 116, 0.35); font-family: 'Playfair Display', Georgia, serif; font-size: 11px; text-anchor: middle; letter-spacing: 0.15em; }
.map-dot { fill: #2a2520; stroke: #4a4035; stroke-width: 1; }
.map-lit { fill: #d4a574; stroke: #ffd699; stroke-width: 1.5; filter: drop-shadow(0 0 6px rgba(212, 165, 116, 0.8)) drop-shadow(0 0 12px rgba(212, 165, 116, 0.4)); }
.map-vn { fill: #6a5a48; font-family: 'Crimson Text', Georgia, serif; font-size: 11px; }
.map-lm { fill: rgba(212, 165, 116, 0.2); font-family: 'Playfair Display', Georgia, serif; font-size: 9px; text-anchor: middle; letter-spacing: 0.2em; }"""

new_css = """.soho-map { background: #0a0908; padding: 0.8em; border: 1px solid rgba(90,74,58,0.3); }
.soho-map svg { width: 100%; height: auto; display: block; }
.map-dot { fill: #2a2520; stroke: #4a4035; stroke-width: 1; }
.map-lit { fill: #d4a574; stroke: #ffd699; stroke-width: 1.5; filter: drop-shadow(0 0 6px rgba(212, 165, 116, 0.8)) drop-shadow(0 0 12px rgba(212, 165, 116, 0.4)); }"""

if old_css in content:
    content = content.replace(old_css, new_css)
    print("Replaced map CSS styles")
else:
    print("WARNING: Could not find exact old CSS block, searching...")
    # Try a looser match
    css_pattern = r'\.soho-map \{ background.*?\.map-lm \{[^\}]+\}'
    css_match = re.search(css_pattern, content, re.DOTALL)
    if css_match:
        content = content.replace(css_match.group(0), new_css)
        print("Replaced map CSS (loose match)")
    else:
        print("ERROR: Could not find map CSS!")

with open(twee_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done! Twee file updated.")
