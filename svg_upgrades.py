#!/usr/bin/env python3
"""Apply all SVG visual upgrades to Dream Street Shuffle."""

import re

twee_path = "/sessions/laughing-friendly-brahmagupta/mnt/Claude work/Dream Street Shuffle.twee"

with open(twee_path, "r", encoding="utf-8") as f:
    content = f.read()

changes = []

# ============================================================
# 1. NOTEBOOK ICONS — Replace Unicode with inline SVG icons
# ============================================================

# Haunts collected: ⬖ → amber diamond SVG
haunt_svg = '<svg viewBox="0 0 12 12" width="12" height="12" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M6 1 L10 6 L6 11 L2 6 Z" fill="#d4a574" opacity="0.9"/><path d="M6 3 L8 6 L6 9 L4 6 Z" fill="#e8c88a" opacity="0.6"/></svg>'
content = content.replace(
    '<div class="nb-item">⬖ ',
    '<div class="nb-item">' + haunt_svg + ' '
)

# Haunts uncollected: ○ → dim circle SVG
uncollected_svg = '<svg viewBox="0 0 12 12" width="12" height="12" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="6" cy="6" r="4" fill="none" stroke="#b0a898" stroke-width="1" opacity="0.5"/></svg>'
content = content.replace(
    '<div class="nb-grey">○ ',
    '<div class="nb-grey">' + uncollected_svg + ' '
)

# Passwords: ⚿ → key SVG
key_svg = '<svg viewBox="0 0 14 12" width="14" height="12" style="display:inline-block;vertical-align:middle;margin-right:4px"><circle cx="4" cy="6" r="3" fill="none" stroke="#d4a574" stroke-width="1.2"/><line x1="7" y1="6" x2="13" y2="6" stroke="#d4a574" stroke-width="1.2"/><line x1="11" y1="6" x2="11" y2="8" stroke="#d4a574" stroke-width="1"/><line x1="13" y1="6" x2="13" y2="8" stroke="#d4a574" stroke-width="1"/></svg>'
content = content.replace(
    '<div class="nb-item">⚿ ',
    '<div class="nb-item">' + key_svg + ' '
)

# Objects: ◈ → gem/crystal SVG
gem_svg = '<svg viewBox="0 0 12 12" width="12" height="12" style="display:inline-block;vertical-align:middle;margin-right:4px"><path d="M6 1 L10 4 L6 11 L2 4 Z" fill="none" stroke="#d4a574" stroke-width="1"/><line x1="2" y1="4" x2="10" y2="4" stroke="#d4a574" stroke-width="0.8" opacity="0.6"/><line x1="6" y1="1" x2="4" y2="4" stroke="#d4a574" stroke-width="0.5" opacity="0.4"/><line x1="6" y1="1" x2="8" y2="4" stroke="#d4a574" stroke-width="0.5" opacity="0.4"/></svg>'
content = content.replace(
    '<div class="nb-item">◈ ',
    '<div class="nb-item">' + gem_svg + ' '
)

changes.append("Replaced notebook Unicode icons with SVG (⬖, ○, ⚿, ◈)")

# ============================================================
# 2. STAT BARS — Replace with SVG gauges
# ============================================================

# Replace the stat bar HTML in the header passage (line 2475)
# The stat bars are built inline with (print:) macros
# We'll replace the CSS to make the existing bars look like neon gauges
# and add SVG tick marks via CSS pseudo-elements

old_stat_css = """.stat-bars {
  clear: both;
  background: #1a1816;
  border: 1px solid #4a4035;
  padding: 8px 20px;
  margin: 0 auto 0.5em auto;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.85em;
  display: flex;
  width: 100%;
  max-width: 500px;
  justify-content: center;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
}
tw-passage .stat-bars {
  display: flex !important;
  width: 100% !important;
  max-width: 500px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding: 8px 20px !important;
  gap: 20px !important;
  box-sizing: border-box !important;
}
.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.stat-label {
  color: #a09080;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.65em;
  flex-shrink: 0;
}
.stat-bar {
  flex: 1;
  height: 8px;
  background: #252220;
  border: 1px solid #3a3530;
  overflow: hidden;
  display: block;
}
.bar-fill {
  display: block;
  height: 100%;
  transition: width 0.3s ease;
}
.bar-good {
  background: #d4a520;
}
.bar-warning {
  background: #a0a0a0;
}
.bar-danger {
  background: #b08050;"""

new_stat_css = """.stat-bars {
  clear: both;
  background: linear-gradient(180deg, #141210 0%, #1a1816 50%, #141210 100%);
  border: 1px solid rgba(90,74,58,0.3);
  padding: 10px 20px;
  margin: 0 auto 0.5em auto;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.85em;
  display: flex;
  width: 100%;
  max-width: 500px;
  justify-content: center;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
  position: relative;
}
.stat-bars::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background:
    repeating-linear-gradient(90deg, rgba(212,165,116,0.03) 0px, rgba(212,165,116,0.03) 1px, transparent 1px, transparent 20%);
  pointer-events: none;
}
tw-passage .stat-bars {
  display: flex !important;
  width: 100% !important;
  max-width: 500px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding: 10px 20px !important;
  gap: 20px !important;
  box-sizing: border-box !important;
}
.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.stat-label {
  color: #a09080;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.6em;
  flex-shrink: 0;
  text-shadow: 0 0 8px rgba(160,144,128,0.3);
}
.stat-bar {
  flex: 1;
  height: 6px;
  background: #151310;
  border: 1px solid rgba(60,50,40,0.5);
  border-radius: 3px;
  overflow: hidden;
  display: block;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
}
.bar-fill {
  display: block;
  height: 100%;
  transition: width 0.4s ease;
  border-radius: 3px;
}
.bar-good {
  background: linear-gradient(90deg, #b89020, #d4a520);
  box-shadow: 0 0 8px rgba(212,165,32,0.6), 0 0 16px rgba(212,165,32,0.3);
}
.bar-warning {
  background: linear-gradient(90deg, #808080, #a0a0a0);
  box-shadow: 0 0 6px rgba(160,160,160,0.4);
}
.bar-danger {
  background: linear-gradient(90deg, #904030, #b05040);
  box-shadow: 0 0 8px rgba(176,80,64,0.6), 0 0 16px rgba(176,80,64,0.3);"""

if old_stat_css in content:
    content = content.replace(old_stat_css, new_stat_css)
    changes.append("Upgraded stat bars with neon gauge styling")
else:
    changes.append("WARNING: Could not find stat bar CSS to replace")

# ============================================================
# 3. VENUE ANNOUNCEMENT FRAMES — Neon sign SVG border
# ============================================================

old_fvh = """.first-visit-hint {
  background: linear-gradient(135deg, rgba(40, 30, 18, 0.6) 0%, rgba(30, 22, 12, 0.6) 100%);
  border: 1px solid rgba(212, 165, 116, 0.25);
  border-left: 3px solid #d4a574;
  padding: 0.6em 1em;
  margin: 0.8em 0 1.2em 0;
  font-size: 0.8em;
  font-style: normal;
  font-family: 'Playfair Display', Georgia, serif;
  color: #d4a574;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.85;
}"""

new_fvh = """@keyframes neonFlicker {
  0%, 100% { opacity: 0.85; }
  92% { opacity: 0.85; }
  93% { opacity: 0.4; }
  94% { opacity: 0.85; }
  96% { opacity: 0.3; }
  97% { opacity: 0.85; }
}
.first-visit-hint {
  background: linear-gradient(135deg, rgba(40, 30, 18, 0.6) 0%, rgba(30, 22, 12, 0.6) 100%);
  border: 1px solid rgba(212, 165, 116, 0.15);
  padding: 0.8em 1.2em;
  margin: 0.8em 0 1.2em 0;
  font-size: 0.8em;
  font-style: normal;
  font-family: 'Playfair Display', Georgia, serif;
  color: #d4a574;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
  position: relative;
  animation: neonFlicker 8s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(212,165,116,0.6), 0 0 20px rgba(212,165,116,0.3);
  box-shadow: 0 0 15px rgba(212,165,116,0.1), inset 0 0 15px rgba(212,165,116,0.05);
}
.first-visit-hint::before,
.first-visit-hint::after {
  content: '';
  position: absolute;
  top: -1px; bottom: -1px;
  width: 20px;
  border-top: 1px solid rgba(212,165,116,0.4);
  border-bottom: 1px solid rgba(212,165,116,0.4);
}
.first-visit-hint::before {
  left: -1px;
  border-left: 1px solid rgba(212,165,116,0.4);
  border-right: none;
}
.first-visit-hint::after {
  right: -1px;
  border-right: 1px solid rgba(212,165,116,0.4);
  border-left: none;
}"""

if old_fvh in content:
    content = content.replace(old_fvh, new_fvh)
    changes.append("Added neon sign frame to venue announcements")
else:
    changes.append("WARNING: Could not find first-visit-hint CSS")

# ============================================================
# 4. HAUNT BOX — SVG corner flourishes
# ============================================================

old_haunt = """.haunt-box {
  background: linear-gradient(135deg, #1e1810 0%, #2a2018 50%, #1e1810 100%);
  border: 1px solid #8a6a3a;
  border-left: 3px solid #c49a5a;
  padding: 1em 1.4em;
  margin: 0.8em 0;
  font-family: 'Crimson Text', Georgia, serif;
  color: #c4a882;
  box-shadow: 0 0 15px rgba(180, 140, 80, 0.15), inset 0 0 30px rgba(140, 100, 50, 0.05);
  text-align: center;
}"""

new_haunt = """.haunt-box {
  background: linear-gradient(135deg, #1e1810 0%, #2a2018 50%, #1e1810 100%);
  border: 1px solid rgba(138,106,58,0.4);
  padding: 1.2em 1.6em;
  margin: 0.8em 0;
  font-family: 'Crimson Text', Georgia, serif;
  color: #c4a882;
  box-shadow: 0 0 15px rgba(180, 140, 80, 0.15), inset 0 0 30px rgba(140, 100, 50, 0.05);
  text-align: center;
  position: relative;
  animation: hauntPulse 3s ease-in-out infinite;
}
.haunt-box::before,
.haunt-box::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: #c49a5a;
  border-style: solid;
  opacity: 0.6;
}
.haunt-box::before {
  top: -2px; left: -2px;
  border-width: 2px 0 0 2px;
}
.haunt-box::after {
  bottom: -2px; right: -2px;
  border-width: 0 2px 2px 0;
}"""

if old_haunt in content:
    content = content.replace(old_haunt, new_haunt)
    changes.append("Added corner flourishes to haunt boxes")
else:
    changes.append("WARNING: Could not find haunt-box CSS")

# ============================================================
# 5. LORE BOX — Decorative top/bottom borders
# ============================================================

old_lore = """.lore-box {
  background: linear-gradient(135deg, #121a18 0%, #182220 50%, #121a18 100%);
  border: 1px solid #3a5a4a;
  border-left: 3px solid #5a9a7a;
  padding: 1em 1.4em;
  margin: 0.8em 0;
  font-family: 'Crimson Text', Georgia, serif;
  font-size: 0.9em;
  color: #8aaa98;
  font-style: italic;
  line-height: 1.6;
  box-shadow: 0 0 12px rgba(80, 140, 110, 0.1), inset 0 0 20px rgba(60, 100, 80, 0.05);
}"""

new_lore = """.lore-box {
  background: linear-gradient(135deg, #121a18 0%, #182220 50%, #121a18 100%);
  border: 1px solid rgba(58,90,74,0.4);
  border-top: none;
  border-bottom: none;
  padding: 1.2em 1.6em;
  margin: 0.8em 0;
  font-family: 'Crimson Text', Georgia, serif;
  font-size: 0.9em;
  color: #8aaa98;
  font-style: italic;
  line-height: 1.6;
  box-shadow: 0 0 12px rgba(80, 140, 110, 0.1), inset 0 0 20px rgba(60, 100, 80, 0.05);
  position: relative;
}
.lore-box::before,
.lore-box::after {
  content: '';
  display: block;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #5a9a7a 20%, #5a9a7a 50%, #5a9a7a 80%, transparent 100%);
  opacity: 0.5;
  position: absolute;
  left: 0; right: 0;
}
.lore-box::before { top: -1px; }
.lore-box::after { bottom: -1px; }"""

if old_lore in content:
    content = content.replace(old_lore, new_lore)
    changes.append("Added decorative borders to lore boxes")
else:
    changes.append("WARNING: Could not find lore-box CSS")

# ============================================================
# 6. REVELATION BOX — Star SVG upgrade
# ============================================================

old_rev_star = """.revelation-box::before {
  content: "✦";
  position: absolute;
  top: -0.6em;
  left: 50%;
  transform: translateX(-50%);
  background: #141820;
  padding: 0 0.5em;
  color: #8ab4d8;
  font-size: 1em;
  text-shadow: 0 0 10px rgba(150, 190, 230, 0.5);
}"""

# Replace ✦ with a CSS-drawn 4-point star using clip-path
new_rev_star = """.revelation-box::before {
  content: '';
  position: absolute;
  top: -0.6em;
  left: 50%;
  transform: translateX(-50%);
  background: #141820;
  padding: 0 0.6em;
  width: 1.2em;
  height: 1.2em;
}
.revelation-box::after {
  content: '';
  position: absolute;
  top: -0.5em;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #8ab4d8;
  clip-path: polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%);
  filter: drop-shadow(0 0 4px rgba(138,180,216,0.8)) drop-shadow(0 0 8px rgba(150,190,230,0.5));
  animation: blueGlowStar 3s ease-in-out infinite;
}
@keyframes blueGlowStar {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(138,180,216,0.6)) drop-shadow(0 0 8px rgba(150,190,230,0.3)); }
  50% { filter: drop-shadow(0 0 6px rgba(138,180,216,1)) drop-shadow(0 0 12px rgba(150,190,230,0.6)); }
}"""

if old_rev_star in content:
    content = content.replace(old_rev_star, new_rev_star)
    changes.append("Upgraded revelation box star with CSS clip-path + glow")
else:
    changes.append("WARNING: Could not find revelation-box::before CSS")

# ============================================================
# 7. VENUE-SPECIFIC SVG DECORATIONS (via CSS ::after on venue titles)
# ============================================================

# Add subtle SVG-like decorations using CSS after venue tint blocks
venue_decorations = """
/* ===== VENUE SVG DECORATIONS ===== */
/* Ronnie Scott's - musical note motif */
tw-passage[tags~="venue-ronnies"] .venue-title::after {
  content: '♪';
  display: block;
  font-size: 0.5em;
  letter-spacing: 0.5em;
  opacity: 0.2;
  margin-top: 0.2em;
  color: #8a7aaa;
}
/* Colony Room - absinthe drip motif */
tw-passage[tags~="venue-colony"] .venue-title::after {
  content: '◆  ◆  ◆';
  display: block;
  font-size: 0.35em;
  letter-spacing: 0.3em;
  opacity: 0.2;
  margin-top: 0.3em;
  color: #7a9a6a;
}
/* Trisha's - rouge/lipstick motif */
tw-passage[tags~="venue-trishas"] .venue-title::after {
  content: '—  ✧  —';
  display: block;
  font-size: 0.4em;
  letter-spacing: 0.3em;
  opacity: 0.25;
  margin-top: 0.3em;
  color: #b08090;
}
/* Coach and Horses - pub sign motif */
tw-passage[tags~="venue-coach"] .venue-title::after {
  content: '⏤⏤⏤';
  display: block;
  font-size: 0.3em;
  letter-spacing: 0.2em;
  opacity: 0.2;
  margin-top: 0.3em;
  color: #c8a060;
}
/* The French - bistro divider */
tw-passage[tags~="venue-french"] .venue-title::after {
  content: '·  ·  ·';
  display: block;
  font-size: 0.5em;
  letter-spacing: 0.5em;
  opacity: 0.25;
  margin-top: 0.2em;
  color: #d4a574;
}
/* Copper's Cellar - cold stone motif */
tw-passage[tags~="venue-cellar"] .venue-title::after {
  content: '▪  ▪  ▪';
  display: block;
  font-size: 0.3em;
  letter-spacing: 0.4em;
  opacity: 0.15;
  margin-top: 0.3em;
  color: #7a8a9a;
}"""

# Insert after the last venue tint block
insert_after = """tw-passage[tags~="venue-coach"] {
  background: linear-gradient(180deg,
    rgba(50, 40, 25, 0.3) 0%,
    rgba(60, 50, 30, 0.2) 50%,
    rgba(50, 40, 25, 0.3) 100%);
  border-left: 2px solid rgba(200, 160, 100, 0.3);
}"""

if insert_after in content:
    content = content.replace(insert_after, insert_after + venue_decorations)
    changes.append("Added venue-specific decorative motifs under titles")
else:
    changes.append("WARNING: Could not find venue-coach CSS for insertion point")

# ============================================================
# 8. ALBA TRACKER — Add dawn gradient SVG bar
# ============================================================

old_alba = """.alba-tracker {
  background: linear-gradient(135deg, #2a2318 0%, #1f1a14 100%);
  border: 1px solid #8b7355;
  border-left: 3px solid #d4a574;
  padding: 0.8em 1.2em;
  margin: 0.8em 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  color: #e8d5b7;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.4),
    0 0 20px rgba(212, 165, 116, 0.1),
    inset 0 1px 0 rgba(255,255,255,0.05);
}"""

new_alba = """.alba-tracker {
  background: linear-gradient(135deg, #2a2318 0%, #1f1a14 100%);
  border: 1px solid rgba(139,115,85,0.5);
  padding: 0.8em 1.2em;
  margin: 0.8em 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  color: #e8d5b7;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.4),
    0 0 20px rgba(212, 165, 116, 0.1),
    inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}
.alba-tracker::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(180,140,80,0.3) 10%,
    rgba(212,165,116,0.6) 30%,
    rgba(244,199,122,0.8) 50%,
    rgba(212,165,116,0.6) 70%,
    rgba(180,140,80,0.3) 90%,
    transparent 100%);
  filter: drop-shadow(0 0 4px rgba(212,165,116,0.6));
}
.alba-tracker::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(0deg, rgba(255,215,150,0.03) 0%, transparent 40%);
  pointer-events: none;
}"""

if old_alba in content:
    content = content.replace(old_alba, new_alba)
    changes.append("Enhanced alba tracker with dawn gradient bar")
else:
    changes.append("WARNING: Could not find alba-tracker CSS")

# ============================================================
# 9. DREAM SEQUENCE — Wavy SVG-like borders
# ============================================================

old_dream = """.dream-sequence {
  background: linear-gradient(135deg, #0a0a14 0%, #14141e 50%, #0a0a14 100%);
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 1.5em;
  margin: 0.5em 0;
  position: relative;
  box-shadow:
    0 0 30px rgba(80, 80, 150, 0.2),
    inset 0 0 50px rgba(100, 100, 180, 0.05);
  animation: dreamPulse 4s ease-in-out infinite;
}"""

new_dream = """.dream-sequence {
  background: linear-gradient(135deg, #0a0a14 0%, #14141e 50%, #0a0a14 100%);
  border: none;
  border-radius: 0;
  padding: 1.8em 1.5em;
  margin: 0.5em 0;
  position: relative;
  box-shadow:
    0 0 30px rgba(80, 80, 150, 0.2),
    inset 0 0 50px rgba(100, 100, 180, 0.05);
  animation: dreamPulse 4s ease-in-out infinite;
  border-image: repeating-linear-gradient(
    90deg,
    rgba(106,106,170,0.4) 0px,
    rgba(106,106,170,0.1) 4px,
    transparent 4px,
    transparent 8px
  ) 1;
  border-width: 1px 0;
  border-style: solid;
}"""

if old_dream in content:
    content = content.replace(old_dream, new_dream)
    changes.append("Added dashed/ethereal borders to dream sequences")
else:
    changes.append("WARNING: Could not find dream-sequence CSS")

# ============================================================
# 10. GUIDED LINKS — SVG chevron arrow
# ============================================================

old_guided = """tw-passage .guided-link {
  display: inline-block;
  margin: 0.4em 0;
}"""

new_guided = """tw-passage .guided-link {
  display: inline-block;
  margin: 0.4em 0;
  padding-left: 0.2em;
}
tw-passage .guided-link::before {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 5px solid #d4a574;
  margin-right: 0.4em;
  vertical-align: middle;
  opacity: 0.6;
  filter: drop-shadow(0 0 3px rgba(212,165,116,0.5));
  animation: chevronPulse 2s ease-in-out infinite;
}
@keyframes chevronPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}"""

if old_guided in content:
    content = content.replace(old_guided, new_guided)
    changes.append("Added pulsing chevron arrows to guided links")
else:
    changes.append("WARNING: Could not find guided-link CSS")

# ============================================================
# 11. QUEST BOX — Add ornate top border
# ============================================================

old_quest = """.quest-box {
  background: linear-gradient(135deg, #1a1815 0%, #252018 50%, #1a1815 100%);
  border: 2px solid #8b7355;
  border-top: 3px solid #d4a574;
  padding: 1em 1.5em;
  margin: 1em 0;
  text-align: center;
  box-shadow: 0 0 15px rgba(212, 165, 116, 0.2);
}"""

new_quest = """.quest-box {
  background: linear-gradient(135deg, #1a1815 0%, #252018 50%, #1a1815 100%);
  border: 1px solid rgba(139,115,85,0.4);
  border-top: none;
  padding: 1.2em 1.5em;
  margin: 1em 0;
  text-align: center;
  box-shadow: 0 0 15px rgba(212, 165, 116, 0.2);
  position: relative;
  animation: questGlow 3s ease-in-out infinite;
}
.quest-box::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px; right: -1px;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    #8b7355 5%,
    #d4a574 20%,
    #f4c77a 50%,
    #d4a574 80%,
    #8b7355 95%,
    transparent 100%);
  filter: drop-shadow(0 0 4px rgba(212,165,116,0.6));
}
.quest-box::after {
  content: '';
  position: absolute;
  bottom: -1px; left: -1px; right: -1px;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(139,115,85,0.4) 20%,
    rgba(139,115,85,0.4) 80%,
    transparent 100%);
}"""

if old_quest in content:
    content = content.replace(old_quest, new_quest)
    changes.append("Added ornate glowing borders to quest boxes")
else:
    changes.append("WARNING: Could not find quest-box CSS")

# ============================================================
# WRITE THE FILE
# ============================================================

with open(twee_path, "w", encoding="utf-8") as f:
    f.write(content)

print("=== SVG UPGRADE RESULTS ===")
for c in changes:
    print(f"  ✓ {c}" if "WARNING" not in c else f"  ⚠ {c}")
print(f"\nApplied {sum(1 for c in changes if 'WARNING' not in c)} of {len(changes)} upgrades")
