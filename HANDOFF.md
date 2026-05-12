# HANDOFF — 2026-05-12

Long session. Started with another playthrough pass by Dr Quill, then a deep map redesign (restoring the labelled venue layer that had quietly atrophied), then a full Phase 1 / Phase 2 / Phase 3 design pass for a new sefirot-on-the-map mechanic, with previews iterated to spec.

---

## Bug fixes + tuning (early session)

### Playthrough findings
- **Carthage pyre lily call removed** — lily calls now only ring in pub venues, not in the dream layer (Stay in Carthage).
- **"After the call" typewriter restored** — was static, now animates char-by-char.
- **Alba counter premature lighting on cow ride** — removed eager `$alba3` sets from Cow ride success/fail and LINE 3 entry; alba3 now only sets inside the *Closer* click. Bug fix carried over: The Interval now properly awards alba3 + `$sawMemory3` when Lily speaks the line (haunts ≥ 11), and Carthage shore sets `$visitedCarthage = true` on entry (was only set at "Dream to Dean" — players who took the Sub umbras path silently missed this flag, leaving Pillars row open after a complete loop). [Dean Street:28643](Dream Street Shuffle.twee:28643).
- **Failed Copper counter** now scores 1 (was 0) so one slip doesn't doom the fight.
- **Colony Room** — single "Get a drink with the man at the bar" link replaces the two parallel options.
- **Notebook header** — back and notebook links swapped (← BACK on left, NOTEBOOK on right).
- **Pong scoring** — restructured as proper table tennis. First to 11, must win by 2 (deuce rules). Call-out subtitle uses "love" for 0, "deuce" at 10–10, "advantage you / advantage [opponent]", "match point — [side]". Rally-driven serve-speed escalation capped at 6 so the longer match doesn't outrun the player.
- **Colony Room gated on haunt1** — forces a second French visit before Colony opens. Updated haunt-opens advertisements: haunt4 now reads "The Pillars opens"; haunt1 (THE SKETCH) now adds "The Colony Room opens".
- **Morale rebalance** — cap → 90 (was 100), hub attrition bumped (returns 2-3: -2→-3; 4-5: -3→-5; 6+: -5→-8). Big reward gains cut: Eat Shelley's Liver +40→+22, Fight Victory Perfect totals +48→+30, Lackland's +22→+14, PP Victory +22→+14, O'Flatterly's Gift +22→+14, etc.
- **Fetch glimpse disabled** — three-tier alba-count fetch text wrapped in `(if: false)[...]` at [Dean Street:28619](Dream Street Shuffle.twee:28619) so it doesn't fire; preserved for future restoration.
- **Audit-pass nitpicks fixed** — *spendthrift draft* → *spendthrift draught* at The Interval; *Tir'd with all these* curly apostrophe applied; haunt1-12 init block in Start passage consolidated (StoryInit is now canonical; Dean Street's defensive `(unless: $haunt1 is a string)` heal remains as fallback).

### LBRP polish (notebook map)
- **Color**: gold (`#f5d070`) → silver (`#d8e0ec`).
- **Opacity baseline**: 0.30 → 0.65 (settled state). Animation peak unchanged (0.95).
- **Drop-shadow** strengthened for legibility on the dark base.

### Esoteric layer additions
- **LBRP** (gold → now silver) sits below the pentagram on the notebook map.
- **Gawain endless-knot** ("And the English call it everywhere, as I hear, the endless knot.") added on the Centre Point 3D overlay (Dawn Approach White/Black), gated on `$lilyCount >= 5`.
- **Eclipse** for Alba Incomplete: when alba is not complete, Dawn passage swaps Dawn Rule SVG top for new `Dawn Rule SVG eclipse` (dark disc + corona ring + diamond-ring bead "marriage ring" + stars). Triggered conditionally via `_albaComplete` set at top of Dawn.
- **Shelley's Liver** — Promethean quote flash. When eagle finishes feeding (`eatProgress >= 1`), a gold caps line **"There is no part of me that is not of the Gods."** fades up inside the LiverPopup card. Post-eat hold extended 700ms → 2500ms so it's readable. Global low-stat hint in the header: when `$hasLiver && ($confidence < 10 or $sobriety < 10)`, a pulsing gold tip appears beneath the alba-hint reading *'You're running on fumes. Remember: Shelley's liver in your notebook.'*
- **Tarot at Trisha's** — state-determined three-card spread. Hard exclusion: the **Hanged Man is never drawn** (preserves the Madame Sosostris callback). Card 1 = where you've come from (Fool/Empress/Lovers/Magician/Hierophant/World); Card 2 = where you are (Devil/Tower/Death/Magician/Chariot/Moon/Wheel); Card 3 = what awaits (Star/Sun/Judgement/Temperance/High Priestess/Justice/Strength). Dedupe guard at end. Each card has a minimal RWS-style SVG illustration; preview at `tarot-preview.html`. OPUS / STATE label swap on the gold stat bars when `$haunts's length >= 12`.

---

## The map redesign — Phase 1

**Crucial discovery mid-session**: the labelled three-state venue map was never actually stripped. The code (`Build Notebook` passage, lines ~32650-32683) already had three-state rendering (here / visited / unvisited) for nine venues — Pillars, Coach, Trisha's, Ronnie's, Colony, French, Lackland's, Cecil Court, Ginger Light. I'd told Dr Quill earlier that labels had been removed, which was wrong. They'd been there all along, just dim in their unvisited state.

### Phase 1 changes applied to the live map
- **All 9 existing venue labels retained** with three-state pattern (here = pulsing bright; visited = medium amber; unvisited = small dim grey).
- **Chinese Fish and Chips added as 10th venue** — labelled simply "Chippy" on the map (full prose name preserved everywhere else). Detection via passage-name match.
- **Four atmospheric street lamps removed** (the radial gradient circles at 230/370, 490/370, 100/200, 360/520) plus the three corner light-pools. They were scene-setting, not venue markers.
- **Cecil Court converted to symbolic anchor** at (280, 668) — mirrors Centre Point at (280, 70). ▼ CECIL COURT label below the dot, ▲ CENTRE POINT above. The three-state rendering is gone for Cecil Court; it's now a static anchor.
- **Soho Sq shrunk** (160×62 → 95×38) and nudged down + right (340,62 → 360,78), trees scaled, label moved to (408, 131).
- **Venue label fonts** reduced from 16/15 to 13/12 for legibility.
- **Vertical street lines** now start at y=160 (was y=135-140), so they don't crash through the WARDOUR/DEAN/FRITH/GREEK labels at y=146-148.
- **WARDOUR** label → **WARDOUR ST** for consistency with the other vertical street labels.
- **OLD COMPTON ST** label dropped from y=380 to y=392 to clear the horizontal street line at y=370.

### Venue positions (live code, final after Phase 1)
| Venue | Position | Label side |
|---|---|---|
| Centre Point (symbolic) | (280, 70) | label above |
| Pillars of Hercules | (510, 250) | left |
| Trisha's | (470, 200) | right |
| Colony Room | (230, 250) | right |
| Chippy | (100, 250) | right |
| Ronnie Scott's | (340, 305) | left |
| Ginger Light | (230, 370) | right, label ABOVE marker (y=-12) to clear OLD COMPTON ST |
| Lackland's | (100, 430) | right |
| Coach & Horses | (490, 460) | left |
| The French House | (230, 470) | right |
| Cecil Court (symbolic) | (280, 668) | label below |

Preview saved as `map-phase1-preview.html`.

---

## Sefirot mapping — Phase 2 (preview only; NOT yet wired into live)

Dr Quill agreed to map the 10 sefirot of the Tree of Life onto venues so the Tree's geometry is *approximately drawn* over Soho. After several iterations the mapping locked in as:

| Sefira | Hebrew | Venue | Map pos |
|---|---|---|---|
| Keter (Crown) | כתר | Centre Point | (280, 70) — top centre |
| Chokmah (Wisdom) | חכמה | Trisha's | (470, 200) — upper right |
| Binah (Understanding) | בינה | Chippy | (100, 250) — upper left |
| Chesed (Mercy) | חסד | Pillars of Hercules | (500, 250) — mid right |
| Gevurah (Severity) | גבורה | Ronnie Scott's | (340, 305) — mid (later swap, see note) |
| Tiferet (Beauty) | תפארת | Colony Room | (230, 250) — left mid |
| Netzach (Victory) | נצח | Coach & Horses | (490, 460) — lower right |
| Hod (Glory) | הוד | Lackland's | (100, 430) — lower left |
| Yesod (Foundation) | יסוד | The French House | (230, 470) — lower mid |
| Malkuth (Kingdom) | מלכות | Cecil Court | (280, 668) — bottom centre |
| Da'at (hidden) | דעת | The Ginger Light | unmarked on map |

**Crucial swap late in design**: Ginger Light's Hebrew was given to Ronnie's (Gevurah moves from Ginger Light → Ronnie's), and Ronnie's old Hebrew Tiferet went to Colony Room. So Ginger Light remains *unmarked* on the map — it's the hidden Da'at, fitting the "Red sells you the alba1 ('Forget the work. Try this.')" transgression / threshold theme.

### Map colour scheme for Phase 2
- **Venue English names**: silver (`#d8e0ec`) — was amber.
- **Hebrew on map**: red (`#c83828`), opacity 0.88. Bumped from font-size 13 to 15 (slightly bigger per Dr Quill's request).
- **Hebrew in notebook list**: red ink (`#a02818`) on parchment.
- **Ginger Light marker** distinct from others — inner circle `#d4682a` (ginger orange) with ginger-tinted outer glow rings.
- **Pillars and Trisha's** "across the road" effect: Pillars at (500, 250) west-of-Greek-line, Trisha's at (480, 200) east-of-Greek-line. Heights staggered (Trisha's higher than Pillars per Dr Quill's request — closer to Soho Sq).
- **French House** moved up from (230, 500) → (230, 470) per request.

Preview saved as `map-phase2-preview.html`.

---

## Phase 3 — the toggle (preview only; NOT yet wired into live)

Dr Quill's final design call: Hebrew sefirot **should not always show**. They should be hidden by default; the map is the normal map. A new TREE OF LIFE notebook tab carries the sefirot list plus a button — **Reveal on the map** — that toggles Hebrew labels in/out with a fade.

Preview implementation (interactive):
- Map starts plain (CSS `.seph { opacity: 0 }`)
- Tree of Life tab has the sefirot list on parchment (Hebrew + English + venue, all 10 sefirot)
- Below the list, a pastel-pink Hebrew-only Da'at row (no English, no venue) — `style="color:#e8a8c0;"` — at the foot, with **no explanatory text**. The hidden eleventh.
- Reveal button toggles `.tree-on` class on the map SVG → `.tree-on .seph { opacity: 0.88 }` with 0.9s fade transition.
- Button text flips: "Reveal on the map" ↔ "Hide from the map".

Preview saved as `map-phase3-preview.html`. **This is the spec Dr Quill is committing now.**

---

## State of the live code (.twee) at session close

**Phase 1 is LIVE**: the map has 10 labelled venues with three-state rendering, Cecil Court as symbolic anchor, no street lamps, smaller fonts, WARDOUR ST label, Soho Sq shrunk + nudged, all the position fixes.

**Phase 2/3 are NOT YET LIVE**: no Hebrew labels on the live map, no Tree of Life notebook tab, no toggle button. All of that lives only in the preview files for next session to implement.

---

## Stage 3 plan (next session — implement Phase 2/3 in live code)

1. **Add Hebrew sefirot `<text>` elements to each venue's three-state block** in the live Build Notebook map SVG. Class `seph` with `font-family='David', 'SBL Hebrew', 'Times New Roman', serif`, font-size 15, fill `#c83828`, opacity initially 0.
2. **Add a new TREE tab** to the notebook tab strip (`FINDS | EFFECTS | LILLIES | POEM | TREE | MAP` — order TBD; perhaps insert TREE before MAP).
3. **Build the Tree of Life panel** in the Build Notebook passage. Lists 10 sefirot in canonical order with Hebrew (right column), English bold, venue right-aligned italic. Pastel-pink Da'at row at the bottom with Hebrew only.
4. **Add the Reveal button** — clicking it should toggle a class on `.soho-map svg` (e.g. via `window.dssToggleSefirot()` JS function that flips between adding/removing `tree-on` on the map SVG). Persist state via Harlowe variable `$sefirotShown` so toggling sticks across tab switches.
5. **CSS**: `.seph { opacity: 0; transition: opacity 0.9s ease; }` and `.soho-map svg.tree-on .seph { opacity: 0.88 }`.
6. **Notebook map already has the venue labels** (Phase 1 done) so the Hebrew labels just slot in alongside English. Check positioning per venue — Phase 2 preview used `x=18 y=22` (right) or `x=-18 y=22 text-anchor=end` (left); some venues (Ginger Light) use different positioning because of the y=-12 English offset.
7. **Centre Point and Cecil Court**: their Hebrew goes outside the three-state block (since they're symbolic). For Centre Point, Hebrew BELOW dot (`x=0 y=22 text-anchor=middle`). For Cecil Court, Hebrew ABOVE dot (`x=0 y=-14 text-anchor=middle`).
8. **Ginger Light**: NO Hebrew on the map (it's Da'at, hidden). Just the English label.
9. **Toggle button styling** in the preview is: dark brown background, gold serif italic, all-caps tracked. Active state: brighter gold + red shadow.

---

## Files of note

- `Dream Street Shuffle.twee` — **132 passages**. Source of truth.
- `Dream Street Shuffle.html` — synced via `python3 sync_html.py`. **NEVER READ DIRECTLY.**
- `sync_html.py` — no changes this session.
- `map-phase1-preview.html` — current live state of the map (no Hebrew).
- `map-phase2-preview.html` — Phase 2 design reference (Hebrew always visible).
- `map-phase3-preview.html` — Phase 3 design reference (toggle button, the spec to wire up).
- `tarot-preview.html` — 19 Major Arcana RWS-style preview from earlier in the session.
- `dark-sun-preview.html` — Sol Niger vs Eclipse comparison (Eclipse chosen for Alba Incomplete).
- `sefirot-map-preview.html` — abandoned mid-design (replaced by Phase 2 preview).

---

## Memories saved this session

- `feedback_no_unrequested_prose.md` — Don't add or suggest DSS prose unless structurally necessary. Dr Quill writes the prose himself; even suggestions for atmospheric/connector prose read as window-dressing. Only flag a gap when a mechanic literally can't work without text.

---

## Things considered and intentionally NOT changed

- **Pillars stays at (490, 200)** through some swap iterations but ultimately at (500, 250) for Phase 2. Live code has (510, 250). Trisha's at (470, 200) live, (480, 200) Phase 2. Treat the Phase 2 numbers as the spec target for Stage 3 wiring.
- **Map viewBox** stayed at 0 0 560 700 throughout — no widening despite Trisha's label being close to the right edge.
- **Pentagram polygon points** unchanged — symbolic 5-point figure at (280,70), (490,200), (490,450), (230,500), (100,250). These don't move when venues do.
- **Lily-bell markers at pentagram corners** also at the pentagram points, not at venue positions. They're independent of venue layout.

---

## Audit at end of session

Net effect:
- Big map upgrade: labels back, fonts smaller, geography corrected, four lamps gone, Soho Sq shrunk, Cecil Court symbolised.
- Esoteric layer significantly deepened: LBRP silver-polished, Gawain endless-knot at Centre Point, eclipse for Alba Incomplete, Promethean liver flash, low-stat liver hint global, state-determined RWS-style tarot at Trisha's.
- Sefirot mapping fully specced in Phase 2/3 previews, toggle UX agreed, ready to wire into live in next session.
- Multiple smaller fixes / polish items completed.

Ready for the next round.
