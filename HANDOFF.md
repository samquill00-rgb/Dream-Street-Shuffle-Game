# HANDOFF — 2026-05-13

Long session continuing from 2026-05-12 (Tree of Life + Lightning Flash + OPUS work).
Today: progression-gating bug hunt, Pillars-passage fix, header back button on 3D approach scenes, stat-label rendering bug nailed via Chrome MCP, plus a sweep of layout polish.

---

## Big bug found via Chrome MCP — stat label class attribute

**Single most important thing this session.** Was tearing my hair out for over an hour trying to make ALBA the same size as MORALE / SOBRIETY. Eventually Dr Quill installed Chrome MCP for me, and within a minute of `getComputedStyle()` I found the actual problem.

**Root cause:** Harlowe **does not evaluate `(if:)` macros embedded inside an HTML `class="..."` attribute.** The markup
```
<span class="stat-label(if: $haunts's length >= 12 or $opusViaTree is true)[ stat-label-opus]">...</span>
```
rendered to the DOM with the *literal Harlowe expression* as part of the class string. So `.stat-label` CSS never applied to MORALE or SOBRIETY. They inherited from `.stat-bars` (0.8em). ALBA had a clean static `class="stat-label"` and picked up the CSS correctly. Every size-tweak I made to "fix ALBA" was the wrong direction — ALBA was the only one being styled.

**Fix:** restructured so the conditional wraps the whole element:
```
(if: $haunts's length >= 12 or $opusViaTree is true)[<span class="stat-label stat-label-opus">OPUS</span>](else:)[<span class="stat-label">MORALE</span>]
```
Duplicates a tiny bit of markup but it's the only reliable way. Same for SOBRIETY/STATE.

Saved to memory as `project_harlowe_class_attr.md` so this never wastes hours again. **Lesson for future:** any layout mystery in DSS, inspect computed styles in Chrome MCP *before* touching CSS. The source can lie.

---

## Progression-gating bug — Colony Room "Back to" link

Dr Quill spotted: after first French visit, Dean Street showed "→ Back to The Colony Room — there was something you missed" before he'd ever been to Colony.

**Root cause** (long-standing, pre-dates my edits): the conditional chain on Dean Street for the Colony link was:
- `(if: ... haunts contains haunt1 ...)` → "Try the Colony Room"
- `(else-if: ... visited's French and tookLily4 is false)` → "Back to The Colony Room"
- `(else-if: ... visited's French)` → "[NOT NOW]"

The middle branch had no check for whether Colony had actually been visited — it fired purely on "you've been to French and lily 4 isn't taken yet." Players who hadn't gotten `$haunt1` yet (which requires a *second* French visit to approach the artists) and hadn't been to Colony saw the "Back to" prompt incorrectly.

**Fix:** added `$visited's Colony is true` to both the "Back to" and "[NOT NOW]" branches:
```
(else-if: ... $visited's French is true and $visited's Colony is true and $tookLily4 is false)
(else-if: ... $visited's French is true and $visited's Colony is true)
```
Now no Colony link appears until either $haunt1 is collected (which unlocks via the first branch) or Colony has actually been visited.

Probably similar bugs lurk for other venue "Back to" links if any don't check `$visited's X is true`. Worth a sweep next time Dr Quill spots one.

---

## Pillars passage — threshold prose

Dr Quill: "I can't see the threshold prose in playthrough."

**Root cause:** the prose
> If you cross the threshold of the Pillars you've already made your choice.
>
> Whatever more you choose comes out in the wash:

was wrapped inside the `(else:)` hook for `(if: $resumingFromCall is true)`. So it only displayed on visits NOT from a phone call. Returns from Lily / Aoife phone calls skipped it. Also the wording was "pass the Pillars' threshold" — Dr Quill remembered it as "cross the threshold of the Pillars".

**Fix:** moved the prose *outside* the `(else:)` (the conditional now only sets sobriety/confidence side-effects), and changed wording to "cross". Prose now shows on every visit to Pillars.

---

## DONE FOR TONIGHT → NOT NOW

Dr Quill: "DONE FOR TONIGHT" implied the *whole night* was over, which was misleading when other venues still had haunts to collect.

Replaced everywhere it appeared as a venue completion marker (French / Colony / Ronnie's / Lackland's hub links + French at-passage). All now say "[NOT NOW]" — local to the venue, not terminal.

---

## Defensive guards in Build Notebook

Added at the top of Build Notebook:
```
(unless: $haunts is an array)[(set: $haunts to (a:))]
(unless: $visited is a datamap)[(set: $visited to (dm:))]
(unless: $alba is an array)[(set: $alba to (a:))]
(unless: $haunt1 is a string)[(set: $haunt1 to "The Sketch") ... (set: $haunt12 to "The Crown")]
```
Protects against any save-state corruption that would otherwise make the HAUNTS section render empty (all 12 conditionals silently failing because `$haunts contains $haunt1` errored on bad input). Only fires when state is actually missing; never wipes collected haunts.

---

## Hebrew gating per-venue

Previously the Tree-of-Life Reveal showed ALL Hebrew names on the map regardless of progress. Wrong — should only show for venues actually visited.

**Fix:** removed Hebrew text element from each venue's *unvisited* state block (8 venues × 1 state each). Hebrew only renders in here / visited states. Symbolic venues handled separately:
- Centre Point Hebrew (`כתר`) gated on `$visitedCentrePoint is true` (set in Approach Centre Point passage)
- Cecil Court Hebrew (`מלכות`) gated on `$knowsCecilCourt is true`

Da'at remains notebook-only as before. Lightning Flash still fires correctly when all 10 sefirot are visited.

---

## Back button on 3D Approach scenes

The full-screen Three.js Approach scenes had no back button — players could only proceed forward. Added a fixed-position back link (`.approach-back` class, top-left, italic uppercase to match the existing BACK style) to these passages:

- Approach The French
- Approach The Pillars
- Approach Lacklands Office
- Approach The Ginger Light
- Approach The Colony Room
- Approach Ronnie Scott's
- Approach Trisha's
- Cecil Court Approach
- Approach Chinese Fish and Chips

**Skipped:**
- Approach The Coach (Dr Quill's explicit exclusion — the cow-ride pre-roll)
- Approach Coppers Lair (cellar fight setup — feels like a point of no return, not added)
- Approach Centre Point (endgame Dawn approach, not added)

---

## Header / stat-bar layout polish

After the class-attribute bug fix:
- All three stat labels (MORALE / SOBRIETY / ALBA) now identical: 0.65em, Playfair Display, 400 weight, 0.1em letter-spacing
- `margin-left: -4px` on `.stat-label` — small leftward nudge from the bar (was tried at -12px, dialed back per Dr Quill). Margin doesn't affect grid column positions, so the cigarette bars stay put
- BACK / NOTEBOOK header: gap increased from 0.5em → 1.8em for breathing room
- Back button itself shrunk: font-size 0.85em → 0.7em, margin-left 1.4em → 0.6em
- SOBRIETY cigarette ember: shrunk and pulled inward (`right: -9px width 20 height 30` → `right: 0px width 12 height 20`) so it sits cleanly inside the bar-fill end and doesn't clash with the gray-ash cigarette body

## Stat delta flash (+12 / -9) made more noticeable

Dr Quill: the "+12" / "-9" pop-ups that fly up next to a changing stat were too quick and easy to miss. Tuned:
- Total duration 2.4s → **4.5s** (hangs around almost twice as long)
- Peak at 7%: scale 1.4 + brightness 1.6 (single emphatic flash)
- Settles back to scale 1 by 22%, then sits clearly visible for ~2.25 seconds
- Drifts up and fades from 72% → 100%

CSS: `.stat-delta` animation + `@keyframes stat-delta-drift`.

---

## Other small things

- `pentangle-aligned-preview.html` and `bell-preview.html` previews are still up to date with the live game (sefirot-aligned pentangle, B+D hybrid bell, Lightning Flash CSS, LBRP backdrop, etc.).
- Chrome MCP is now connected and working — see memory note for how I'll use it on future bugs.

---

## State of the live code at session close

All changes synced to `Dream Street Shuffle.html`. Commit pending.

---

## Memories updated/added today

- `project_harlowe_class_attr.md` (new) — the class-attribute trap that ate this session.
- `feedback_use_chrome_mcp.md` (new) — Dr Quill has had Claude in Chrome installed for weeks. **Just open it and use it** for any DSS visual/runtime question. Don't ask permission, don't propose blind CSS fixes first.
- `MEMORY.md` — index updated.

---

## Open threads for next session

- **Other venues may have the same "Back to X" bug** as Colony — any `(else-if:)` that fires on "French visited + lily not taken" without checking the destination venue was actually visited. Sweep when Dr Quill spots another.
- **Hobson-adjacent prose** — Dr Quill mentioned text to be restored before the Hobson verse in the Pillars passage. The threshold prose is fixed (visible on every visit now). If there's *additional* prose Dr Quill wanted before the verse, it wasn't found in git history — he'll need to paste it when he finds it.
- **Three pillars** (Mercy / Severity / Mildness) — still banked as the next major occult addition, tied to Pillars of Hercules thematic. See `project_three_pillars.md`.

---

## Things considered and intentionally NOT done

- Removing the Coach approach back button (per Dr Quill).
- Adding back button to Approach Centre Point or Approach Coppers Lair (endgame / point-of-no-return).
- Re-pitching Da'at on the map, Page 47/93, book-as-true-name, I Ching (all permanently off the table — see `project_esoteric_layer.md`).

---

## Map generator (2026-05-13)

`generate_map.py` writes two writer's-eye-view files from the .twee:
- `GAME-MAP.md` — every passage with tags, prose preview, choices out (with player-facing text), incoming links, returns (A↔B), cycles, orphans, dead-ends.
- `GAME-MAP.html` — interactive vis-network graph. Click a node → side panel. Search box. Re-run the script to refresh.

Both files regenerate from scratch — never edited by hand.

## Astral-objects assets — banked for future esoteric use

While testing `GAME-MAP.html`, the force-directed graph rendered the game's structure as a beautiful astral / constellation object — Dean Street as the radiant hub, venues arranged like satellites. Dr Quill took two screenshots and wants them set aside for possible inclusion in the game later.

**Action for Dr Quill:** drag the two screenshots into the project folder. Suggested names:
- `astral-map-1-diffuse.png` — the softer, undirected one
- `astral-map-2-radiant.png` — the one with gold beams from Dean Street

Possible uses (his call): visual on the title/end screen, an esoteric-layer reveal element, or a Sefirot/Tree-of-Life adjacent moment. Fits the same aesthetic family as the Three Pillars work already banked. Do not commit to a use — bank only.

---

## Header layout iteration (2026-05-13, later)

Polishing pass on the .stat-bars header — finalised after experimentation. **Current canonical state:**

- Card centred: `transform: translateX(-50%)` (a 55px right-shift was tried and reverted — Dr Quill wanted it centred above everything else).
- `.stat-pct` is now `text-align: right; padding-left: 0; display: block;` — so the "70%" sits flush with NOTEBOOK's right edge (was inboard before).
- `.alba-count` is now `text-align: right;` — same alignment.
- Grid columns in `.stat-group` and `.alba-strip`: third column narrowed from `3em → 1.8em` so labels + bars shift right toward the percentages.
- `.stat-label` (both MORALE/SOBRIETY/ALBA and `.alba-strip .stat-label`): `margin-left: 14px` (was `-4px`) — labels sit closer to the bars.
- `.header-links`: `gap: 42px` — places the BACK arrow tip aligned with the *left* end of the rolled-note (i.e. the start of the cigarette filter). NOTEBOOK is right-flush; that's the right-hand limit.
- Powder line on MORALE bar lifted slightly: the "Bright white core" gradient stops shifted from 30/36/41/46/54/59/64/70 to 22/28/33/38/46/51/56/62 (only the linear gradient — the clumps untouched).

If header alignment looks "off" after a change, the source of truth is this list.

## Numbered-list rule baked into CLAUDE.md

Dr Quill flagged a pattern: when he sends multi-item messages, items occasionally got skipped. New CLAUDE.md section ("Notes batching") makes it a rule: every multi-note message → immediate TodoWrite list before work starts. Future sessions inherit this.

## 12-item batch fixes (2026-05-13, evening)

Worked through a numbered list. All synced.

1. **Punching scoring:** threshold lowered 6 → 5 (JS + Copper's dialogue + UI line). Counter is now viable to attempt — a failed counter can be recovered with one more counter + one dodge.
2. **French-first gating:** verified, no change needed. After meeting Red, French is the only main venue link. Pillars/Colony/etc. all gated behind `$visited's French is true`.
3. **Cecil Court waltz ignored mute:** the waltz used a plain `<audio>` element bypassing dssAudio's gain nodes. Now checks `dssAudio.isMuted()` at start AND polls every 250ms so toggling mute mid-game works.
4. **"What book?" → "Which book?"** — single text fix.
5. **Header off-centre:** reverted the 55px right shift from earlier in the session (Dr Quill wanted it centred above page content).
6. **Pit music notes:** bumped from 6→10 notes, alpha 0.5→0.9, larger font, gold glow shadow, allowed to drift higher above the pit before clipping. (Code was always there — just too faint.)
7. **Pentagram morale boost:** +12/+8 → +25/+15 morale/sobriety across all 5 lily-completion sites.
8. **Haunt window:** `coachUrgent` haunt threshold raised from 3 → 10 — player can now collect most haunts before low sobriety locks them into the Coach ending.
9. **Fish-and-chips popup:** full canvas redraw — newspaper with Daily Mirror headline + halftone photo block + body-text dashes + vinegar drips + crinkled batter with salt grains + varied chips with edge browning + Sarson's bottle.
10. **"Home's cold;" → "Home's cold,"** — punctuation fix.
11. **"reach the things" → "find the things"** on Dean Street (both returns=1 and returns>1 branches).
12. **Midnight 23.11.73 → 24.11.73 transition:** new mechanic. When `$returns >= 7`, sets `$midnightJustPassed = true`. On that visit, the date animates (gold flare via `.scene-date-flip` class) and `dssAudio.distantBell()` chimes after 350ms. Flag clears after one display. **Action for Dr Quill if he wants prose at the moment:** there's a comment marker in the Dean Street passage right after the date `<span>` — insert a line of prose there.

## Open threads for next session

- **Music notes in the carry-tray pits** — code is now boosted (10 notes, brighter), but I never navigated through Ronnie's to verify with my own eyes. Worth a real playthrough confirmation.
- **The fish-and-chips popup redraw** — I haven't seen the result in-browser; it's a substantial canvas rewrite, may need taste-level adjustments after Dr Quill sees it.
- **Midnight transition prose** — mechanic ready, prose intentionally left to Dr Quill. Marker is in Dean Street passage.
- **Three pillars** (Mercy / Severity / Mildness) — still banked.

## Session 2026-05-14 — polish pass

Long minigame + popup + title polish session, mostly driven live in Chrome MCP.

### Ronnie's bar minigame (carry + pour)

- **Music ignored mute** (same class of bug as Cecil Court waltz). `_jazzMiniEl` was a raw `<audio>` element bypassing `dssAudio`'s gain nodes. Fixed in three places: `startBarGame`, `_startCarryTransition`, and the passage-navigation `MutationObserver` that disposes the element. Each now sets `.muted` at creation and starts a 250ms polling `setInterval` so mid-game toggles take effect; the watcher is cleared when the audio dies.
- **Pour leniency** — the target oscillation amplitude was wider than the entire pass zone, making perfect-pour scoring nearly chance. Widened the scoring zones (perfect ±0.04 → **±0.07**, pass ±0.10 → **±0.16**), slowed and reduced the oscillation, and **added a visible tolerance band** in the glass (green inner = perfect, amber outer dashed edges = pass). Later bumped erraticism slightly with a 4th high-frequency harmonic so the line still twitches unpredictably without the amplitude making it unfair.
- **Removed vestigial UI**: the completed-drinks sidebar still drew ✓/✗ marks for a finish-question that no longer exists. Stripped them — sidebar now just shows the pour accuracy mark (★/◐/○).
- **Wild Turkey label**: replaced the "WT" text on the bourbon bottle with a small turkey silhouette in profile (tail fan, body, neck, beak, wattle, legs) drawn in `_drawBottle` when `lab === 'WT'`. Other bottles keep their text labels.
- **Drink popup**: said "band tightens" → "**band plays on**" when all three drinks reach the stage.

### Carry-tray game — pit fall and bounce

New mechanic: hitting a pit no longer just wobbles. The player now falls *into* the pit on a physics-based curve (gravity 1600, max depth 62px), pauses ~0.06s at the bottom, then takes a sharp upward kick (initial velocity -560) and overshoots groundY by ~28px before settling. Scroll pauses during the fall so the player stays over the pit. New state on `carryPhase`: `pitFalling`, `pitFallPhase` ('fall'|'bottom'|'rising'), `pitFallY`, `pitFallVel`, `pitFallBottomT`, `pitFallObs`. After bouncing out, the wobble system kicks in normally (or drops a glass if already wobbling) and `invulnTimer = 1.4` prevents the same pit from re-firing.

**Sound effects added throughout the carry game**:
- Edge of pit: `dodgeWhoosh()`
- Bottom of pit (impact): `muffledThud() + glassClink()`
- Bounce kick: `dodgeWhoosh()`
- Regular obstacle hit (wobble): `muffledThud() + glassClink()`
- Glass-loss hit: `punchImpact() + glassClink()`

All routed through `dssAudio` so they respect mute and layer naturally over the jazz-mini track.

### Boxing instructions simplified

The 4-row dense table on the `Fight starts` passage was hard to parse. Now a clean 3-row colour-coded table:

| COUNTER (red) | click Copper | 3pts, risky |
| DODGE (green) | click the glove's side | 2pts |
| BLOCK (amber) | click below | 1pt |

Dropped the redundant "Caught = 0" row and the footer line (Copper's dialogue at the top covers it).

### Pong rebalanced

Multiple iterations:
1. First-to-11 with deuce → **first-to-5** with deuce.
2. Then experimented with **rubber-banded score** so the match always reached 2-2 deuce, then a single sudden-death rally decided it. *Five points total.* But that was visibly fixed (score didn't follow the ball) — easy for any attentive player to spot.
3. **Final state: AI rubber-band**, not score rubber-band. The score is honest (whoever wins the rally gets the point), but the AI's paddle speed, prediction noise, and reaction time scale dynamically based on `oppScore - playerScore`. When AI is ahead by 1, its paddle goes ×0.55, noise ×1.55, reaction ×1.5. When behind by 1, ×1.45, noise ×0.45, reaction ×0.55. Bias zeroes once both players hit 2 (deuce), so the sudden-death rally is honest. End condition: first-to-3, win-by-1 (the next real point after deuce decides it).

Also tweaked Percy's dialogue on the `Watch the decider` passage to justify the player's choice between Jack and Percy — "*'House rules,' says Percy Ritson, 'winner plays the stranger.' He turns to you. 'Unless the stranger fancies an easier task, in which case I'll take you off Jack's hands.'*" — previously the dialogue contradicted itself (winner-plays-stranger but you can pick either).

### Midnight transition — re-gated

Yesterday's mechanic kept the date flash + Big Ben chime but had no big text announcement. Today: changed the trigger from `$returns >= 7` to **`$tookLily5 is true AND $visited's Pillars is true`** so midnight fires only once the French is shut *and* the first Pillars visit is done. Dr Quill confirmed it's fine for midnight to fire late — November nights are long, and the game is in a dream world anyway.

The old `<!-- MIDNIGHT TRANSITION: add prose here -->` comment was also removed since Dr Quill confirmed no announcement is wanted.

### Fish-and-chips popup — many iterations

Reshaped from a flat blob to a **proper rolled-cone cornet**: tapered point at the bottom, wide flared opening at the top, with abstract newsprint dashes inside (no readable text — "Daily Mirror" headline removed). Also:
- **Removed the Sarson's vinegar bottle** entirely.
- **Chips repositioned** so they cluster densely *at and above* the cone opening — nothing visible "through" the opaque paper. ~19 chips with varied lengths (8–19px) so the pile reads as natural rather than uniform-cut.
- **Fish made longer and tapered** — wide rounded "head" end on the left, narrows to a "tail" on the right. Less oval, more like a real fillet.
- **Fish drawn AFTER chips** so it sits visually on top of the pile.
- **Lowered fish ~9 units** to close the gap between fish bottom and chip tops.
- **Lowered the one floating top-crown chip** from y=-77 to y=-73 so it pokes up just behind the fish rather than levitating above it.

### Drink popup — heavy polish session

Worked on this with Dr Quill in Chrome MCP. The fish-and-chips taught us proportions; this taught us about translucency.

**Tumbler (the rocks glass used for whisky/scotch/claret/beaujolais):**
- Bigger: 40×52 → **56×76**, top width 44 → 64. Glass is now the visual focus rather than a small element.
- **Chunky crystal base block** drawn as a separate lighter trapezoid at the bottom.
- **Star-cut pattern on the base**: 6 primary rays (12px), 6 secondary rays at 30° offset, an outer ring (13×3.8 ellipse), an inner ring (5.5×1.7), brighter prismatic caps on the primary rays, central highlight dot. Reads as a heavy cut-crystal Caithness-style rocks glass.
- Vertical fluting on the body was tried but removed — too noisy at this scale.

**Whisky liquid:**
- Portion halved: `gH * 0.45 * lev` → `gH * 0.22 * lev`. A pub double sits low in the glass.
- Translucency increased: `globalAlpha 0.78` → **0.42**. The crystal-cut base reads clearly through the liquid.
- Whisky colour changed `#a05a20 → #b88438` and highlight `#c08440 → #e0b870` — more golden amber, less orange juice.
- Liquid uses a subtle gradient and the meniscus has a faint ellipse outline.

**Lips:**
- Tried smaller/duskier rose-brown ("a hint of mouth across a smoky pub") and a **profile silhouette** — both rejected (Dr Quill: *"if it's like this, I preferred the silliness of the cartoon like one before"*). Restored to original Soho-pout cartoon (lipW 120, upperH 18, lowerH 17, `#6e3a32`/`#5a2e28`). The silly cartoon plays the right role — a stylised "drink-me" icon rather than trying to depict an actual person.

### Title screen — drifting petals

Added animated falling petals as ambient decoration. Iterations:
1. **First pass**: 7 falling teardrops in blue-grey, straight-down motion — read as rain.
2. **Second pass**: shape changed to **almond/petal** with stroke outline and centre vein, pale blue (`#c0d8ec`/`#a8c4dc`). Two drift keyframes (A and B) with side-to-side sway and rotation.
3. **More horizontal drift** — increased sway range from ±28px to ±60–75px.
4. **More translucent + faster** — opacities 0.45–0.60 → **0.22–0.33**, durations 34–46s → **18–24s**, so they look like they're catching air rather than slowly sinking.
5. **More natural drift** — keyframes redone with 10 stages each, asymmetric timing, multi-revolution rotation (~1.5 turns each), so the seven petals never sync up.
6. **Reduced from 7 → 2 petals** — Dr Quill wanted them as "rare little hints". Two left, at 24% and 72%, with staggered animation delays (-3s and -15s) so they appear at different times.

CSS keyframes `dst-petal-drift-a` / `dst-petal-drift-b` live in the `<style>` block in the `Title` passage.

### Save-state debug note for next session

Harlowe's `(savegame: "auto", "Auto save")` runs on every Dean Street visit, persisting state to `localStorage`. Closing and re-opening the page **restores the last save** — it's NOT a fresh start. To test cleanly: incognito window, manually clear `localStorage` (any key with "Saved Game" in it), or reach the Dawn ending and use its "Play again" button. Dr Quill briefly thought he'd broken French gating because of this — it was just a stale save.

## Open threads for next session

- **Title BEGIN link** — still bare text. Could be polished (gold-tint, small ornament) if Dr Quill wants. He liked the rest of the title screen.
- **Other 3D approach scenes** (`cecil-court-3d-static.html`, `pillars-of-hercules-3d-static.html`, etc.) — never reviewed.
- **Coin-toss overlay** (the "Donkey" coin on return 2) — Dr Quill flagged as a candidate for polish; we never got to it.
- **Notebook page** — never reviewed.
- **Three Pillars** (Mercy / Severity / Mildness) — still banked.
- **Astral-map screenshots** — Dr Quill never confirmed filenames after dropping them in (or hasn't dropped them in yet).

## Ready for next round

Big polish session — popups (drink + fish-and-chips), minigames (pong, fight, carry), title atmosphere all advanced. Drink popup, in particular, went through several rounds of taste-level tweaking with Dr Quill in the Chrome loop.
