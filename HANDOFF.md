# HANDOFF — 2026-05-20 (late)

Long polish day. Two halves. First half: a fresh playtest-note batch + a 5-agent deep audit + the major bug-fix pass that came out of it (state init, 3D scene disposal, lily-pip system, Name Your Book rebuild). Second half: a second playtest round Dr Quill ran himself, with finer prose / UX edits as he went. This handoff supersedes the earlier 2026-05-20 file.

---

## First-half summary (carried over from the morning pass)

Recap of what landed before the second playtest. Details preserved in case the next session needs them.

### Playtest-note batch (4 items)
- **Sway only on Maritime Interlude.** The `dssDrunkMid` enchant in `:: header` is now gated to `(passage:)'s name is "Maritime interlude"` instead of firing whenever sobriety < 35. Coach, cow ride, everywhere else: still.
- **Toilet pipes overlay shrunk.** `.coach-plumbing-intro` flex-centres an svg capped at `min(58vh, 88vw)`.
- **Centre Point silent click + softer footsteps.** Typewriter-tick suppressed for `link.closest('.ending-pane')`. Cobble reverb softened: delay `0.075 → 0.055`, feedback `0.42 → 0.22`, output `0.55 → 0.32`.
- **Alba dawn reveal.** `.alba-final` text-align center→right. Reveal timings 6/8/10s → 2/3.5/5s. New `.alba-credit` at 6.5s — italic, left-aligned, 0.78em, "'Alba' by Ezra Pound". Marvell verse in lily memory 2 right-aligned.

### Deep audit + actioned fixes
Five parallel research agents covered narrative+state, JS, CSS, minigames, 3D+audio. The actioned slice:
- **`$lilyCallReturn` / `$bookTitle`** fallback inits added to StoryInit + Start (prevents `(go-to: undefined)` crashes from edge-case savegames).
- **Cow ride skip detection** reads `Harlowe.API_ACCESS.STATE.variables` directly instead of round-tripping booleans through `(print:)` DOM spans. Orphan spans removed.
- **`window.dssAudio.stopBed`** consistency fix in the cow game.
- **3D scene memory hygiene** — biggest piece. Three shared helpers at the top of the JS section: `_dssBindScene(wrapId, scene, renderer, camera)`, `_dssDisposeWrap(wrapId)`, `_dssDisposeThreeScene(...)`. All 12 Three.js approach scenes refactored: inline anonymous resize listener → one-line `_dssBindScene` call; manual wrap removal → `_dssDisposeWrap` (which traverses + disposes every geometry, material, textured map (map/normalMap/specularMap/emissiveMap/alphaMap/aoMap/bumpMap/displacementMap/envMap/lightMap/metalnessMap/roughnessMap), disposes renderer, force-context-loss, removes resize listener, removes wrap div). FH + CH had missing cleanup branches → added.
- **`.phone-ringing` click-blocking backdrop** via `tw-story:has(.phone-ringing)::before` — transparent fixed layer at z-index 98999.
- **`tw-link:focus-visible`** outline for keyboard nav.
- **Pending pip opacities** `0.22 → 0.38` across `.hp-pending`/`.op-pending`/`.pp-pending`/`.al-pending`/`.qp-pending`.

Removed dev cheats: `window.dssCollectAllLilies` + `window.dssTestPentangle` globals deleted. Cheat logic inlined into the debug menu's "reveal pentangle" button so that path still works.

Intentionally skipped from the audit punch-list:
- Start / StoryInit duplicate-init consolidation (medium-risk-to-touch / low payoff; defensive `(unless:)` guards make duplication safe).
- Cow ride music tempo cap (by design per Dr Quill).
- `[NEED A WORD]` / `[FIND PAGE 93 — //CARTHAGE//]` bracket hints (actionable info pips don't cover).

### Carthage audio + tags
- `:: The coast of Carthage` and `:: Carthage shore` tagged `[carthage-cicadas dream]` → `[dream]` triggers `windFarnell()` underneath the cicadas bed.
- `:: Stay in Carthage` tagged `[carthage-cicadas pyre]` → `[pyre]` triggers `fireFarnell()`.
- `windFarnell` initially boosted (master 0.20→0.32, low-howl 0.55→0.85, secondary LFOs, amplitude-breathing layer). Later toned back down — see second-half summary.
- `fireFarnell` boosted: master `0.12 → 0.24`, denser crackle (`0.0001 → 0.00028`), two parallel filter bands (220Hz lowpass body + 900Hz bandpass crackle), violent flicker envelope.
- `_stopAmbient()` now explicitly `.stop()`s any `lfo` / `lfo2` / `ampLfo` oscillators on the previous bed.

### Critic page-turn rebuild
- Flip duration 1.2s → 0.6s. Narration delay 1600ms → 750ms. Aftermath gate 900ms → 500ms. Mote delay 1500ms → 1100ms. Left-page fade-swap 400ms → 220ms.
- Direction alternates per click: `directions = ['forward', 'back', 'forward', 'back']`. Backward flip spawns the page at `left: 0` with `transform-origin: right center` and rotates to `+178°`. Text and box-shadow direction flip accordingly.

### Other small first-half items
- Waltz count-in 3-2-1 → **1-2-3**.
- "Lie down beside her" hidden in Dido when page visible but uncollected (push toward grabbing the page).
- "//You must not, yet, go any deeper inland.//" line removed from Dido.
- Approach back buttons added to Approach The Coach, Approach Coppers Lair, Green Sea Approach.
- "You're here to find one" → "**You need** to find one hidden in the night" (Night Ahead Part Two).

### Dean Street hub cleanup + lily-pip system
- Verbose hints removed from 6 hub links ("— there was something you missed" etc.). The greyed-out `[NOT NOW]` / `[CLOSED]` brackets removed from the four lily-tracked venues (French / Pillars / Colony / Ronnie's).
- New `.lp` pip class: pale lilac `❀` filled, `❁` outlined. Visibility gated on `$lilyHintShown is true`. Mapping: `$tookLily1`→chippy, `$tookLily2`→Pillars, `$tookLily3`→Ronnie's, `$tookLily4`→Colony, `$tookLily5`→French. Inserted on every relevant hub branch (first-visit, Back-to, NOT NOW / CLOSED).

### Name Your Book rebuilt
Switched from the bespoke `.book-naming-tw` container + `tw-passage[tags~="book-naming"]` selector to the standard `.typewriter-page typewriter-static` pattern used by every other typewriter passage. **Initial wrapper class was `.nb-page` — collided with the notebook UI's own `.nb-page` class** (notebook polls it every interval to force-style as a full-screen dialog, which is what caused the flash-on-and-off bug Dr Quill spotted). Renamed wrapper to **`.book-naming`** (and `.nb-page .*` rules in the stylesheet → `.book-naming .*`). Now stable, no flash, no jump on entry.

### `.claude-draft` style introduced
Bright-pink left border + faint pink wash. Wraps any prose Claude has drafted but Dr Quill hasn't yet revised. Per-prose, not per-passage. Defined at [.twee:37610](Dream Street Shuffle.twee:37610).

---

## Second-half pass (afternoon playtest polish)

This is the more interesting part — Dr Quill playtested himself and sent finer prose / UX edits. In rough order:

### Colony Room flow rebuilt around Davy Merkin

Dr Quill's 1970s-Soho friend pointed out that the Colony Room admitted no-one alone — you had to be a member or with one. So:

- **`:: The Colony Room Door`** is now a **pure router** (no prose, no choice on its own):
  1. `$visited's Colony is true` → straight to `:: The Colony Room`
  2. `$metDavy is true` → straight to `:: The Colony Room`
  3. `$metSalvu is true` → `:: Colony Member` (Davy outside)
  4. otherwise (first visit) → original two-doors prose ("On which do you knock?") with the existing `coinGate("Left","Right",true)` — `firstAlwaysHeads:true` still forces Left → Maltese → Salvu on the first toss. Coin gate is now **unconditional** (no `(if: $hasCoin is true)` wrapper) since the game design ensures the player always has the Donkey by this point.
- **`:: Colony Member`** (new outdoor passage, Dr Quill's prose): Davy outside on Dean Street, glass in hand from a nearby pub, single paragraph. Link: `[[Drink with Davy Merkin|Davy Merkin]]` → goes **straight to the existing `:: Davy Merkin` table scene** inside the Colony (skipping the Colony Room interior on first entry).
- **`:: The Colony Room`** — first-visit doorman prose is gone. The atmospheric "greener than you remember it being… crepuscular gravity" prose stays for `_firstColony`. Subsequent visits show the new line: **"The room is as you left it. A little too much like you left it."** (replaced "The room receives you as it always has").
- Player flow now: 1st approach → coin → Salvu (cellar). 2nd approach → Davy outside → straight into the table scene + Lackland-tip monologue. 3rd approach onward → straight into The Colony Room interior, no doorman, no member.

### Prose / typography edits (Dr Quill's pen)
- **Painter's speech** ([.twee:36168](Dream Street Shuffle.twee:36168)): straight quotes `"This is mine,"` → curly `"This is mine,"`.
- **Cellar perfect-score win** ([.twee:33510](Dream Street Shuffle.twee:33510)): AI prose stripped (the leather-bound notebook gift that wasn't tied to any mechanic). Rewritten by Dr Quill:
  > Copper looks down at his gloves as if they wrapped someone else's hands.
  >
  > Quiet Frankie's smiling.
  >
  > 'Not bad at all,' says Copper. 'Tell whoever sent you that they did a fine job. Very funny.'
- **`:: Standing`** ([.twee:33416](Dream Street Shuffle.twee:33416)): "leaning **his** knackered frame" → "leaning **its** knackered frame" (now refers to the door, not John).
- **`:: The dark pass`** ([.twee:33433](Dream Street Shuffle.twee:33433)): "like he wants to speak to John, who doesn't want to speak" → "like **Red** wants to speak to John, who doesn't want to speak **to anybody**".
- **`:: Colony Member`** dialogue: collapsed to one paragraph, punchier — "'Come upstairs. We'll drink.'"
- **Editor's note in Great Ham lore-box** ([.twee:33433](Dream Street Shuffle.twee:33433)): now styled as a footnote via new `.editors-note` class. 0.86em italic Crimson Text in muted parchment-amber, top rule, small-caps "Editor's note" label. Replaced the original Harlowe-bold `''Editor's note:''` prefix.
- **`:: Carthage shore`** ([.twee:36610](Dream Street Shuffle.twee:36610)): "flat as a landed coin-toss" → "flat as a landed coin".

### UX / interaction polish
- **Lore-box persistence layer removed.** The localStorage-backed auto-expand system was making Watkins (and presumably others) auto-open on revisits. Dr Quill said: revert to click-to-open every time. Removed at [.twee:31436](Dream Street Shuffle.twee:31436). A one-time `localStorage.removeItem('dss-lores-opened')` wipes any state from playthroughs that had the persistence enabled. Comment at the site notes git history for re-enabling if ever wanted.
- **Critic page-turn motes** ([.twee:36906](Dream Street Shuffle.twee:36906)): the password "I said hello" box's motes were spawning from below the fold (the aftermath was off-screen when the spawn fired). Added `aftermath.scrollIntoView({behavior: 'smooth', block: 'center'})` when the aftermath reveals — by the time motes spawn (1.1s later) the box is on-screen and they lift naturally.
- **Painter napkin fade-out** ([.twee:36515](Dream Street Shuffle.twee:36515)): after Done is clicked, the framed portrait now pauses 1.5s, then fades to opacity 0 over 0.85s, then navigates. No more snap-disappear.
- **Cecil Court Waltz auto-start** ([.twee:32700](Dream Street Shuffle.twee:32700)): drops the "press a key or click here to begin" prompt. A 450ms `setTimeout` after the canvas mounts sets `running = true; startedAt = performance.now(); startAudio()`. The pgGen / `running || ended` guards prevent stale-passage firing.
- **Notebook DEPLOY buttons** ([.twee:40817](Dream Street Shuffle.twee:40817)): text now `#ffffff` and `font-weight: 700`. Hover state stays white, border darkens to amber.
- **Wind toned back down** ([.twee:1166](Dream Street Shuffle.twee:1166)). Dr Quill said the morning's intensification was too much. Now: master `0.32 → 0.22`; low howl `0.85 → 0.60`; mid whistle `0.78 → 0.68`; high sibilance `0.34 → 0.30`; primary LFO sweep `±520 → ±320Hz`; primary LFO freq `0.10 → 0.12Hz`; secondary low-howl LFO kept at `±50Hz` (was ±90); **amplitude-breathing LFO removed entirely** (it was the loudest contributor). Wind still has presence but doesn't dominate.

### Carthage Green Sea gating
- "Try The Green Sea" (Dido passage, [.twee:33340](Dream Street Shuffle.twee:33340)) and "Go to The Green Sea" (Carthage shore, [.twee:36635](Dream Street Shuffle.twee:36635)) now require `($hasMissingPage is true or $returnedPage is true)` in addition to the existing 3-haunts gate. Forces the order: pyre first (grab Page 93), then Green Sea.

### Page 93 SVG redrawn for realism
Old illustration was cartoony — curling/trapezoid edge with a visible corner "fold", uniform stroked lines for "text", flame-tip wisps at the bottom corners. Rebuilt at [.twee:34248](Dream Street Shuffle.twee:34248):
- Clean rectangle, slight `rotate(-1.4°)` tilt, drop shadow behind for depth.
- Paper grain via `<feTurbulence>` fractal-noise filter at 60% opacity.
- Spine shadow strip on the left edge (page weight / binding implication).
- 30 short word-blocks of varying widths arranged into two paragraphs with paragraph-indent — reads as typeset prose rather than cartoon "lines."
- Naturalistic burn at bottom: two irregular dark bands fading up plus four small singed bite-marks. No more flame-tip wisps.
- "47" page number preserved (esoteric layer reference) but smaller / less front-and-centre.
- Warm flame-glow from below kept.

### Memory 3 relocated
- Was at `:: LINE 3` (the dawn / Centre Point alba-3 moment). Dr Quill felt it crowded the dawn. Moved to `:: The Interval` ([.twee:36058](Dream Street Shuffle.twee:36058)), gated on `(if: $sawMemory3 is false)` so it only fires once. Now plays after the Lily-on-the-stairs encounter.
- New memory rhythm: M1 = After the call (St Giles in the rain), M2 = LINE 2 Oxford (Marvell green thought), M3 = The Interval (her on the bed / "burn Troy after Troy"). Three distinct emotional beats spread across the night, none at the dawn.

---

## State of the live code

All today's changes synced to `Dream Street Shuffle.html` (132 passages). `sync_html.py` unchanged. No new MP3/M4A swaps.

Major structural shifts in this session:
- **Colony flow has a real gatekeeper.** First-visit always lands at Salvu via rigged coin. Second-visit threads through Davy outside → straight to the Davy Merkin table scene. Third-visit onward is direct. Removes the "two doors, hope you pick right" friction for return visits.
- **Carthage pyre/shore now have layered procedural ambience.** Cicadas bed + wind (shore/coast) or fire (pyre/Stay) — wind now restrained, fire still substantial.
- **3D scenes can be re-entered without leaking GPU memory.** Disposal layer covers all 12 Three.js scenes.
- **Lily collection is iconified on the hub.** Pale-lilac pips track each venue's lily.
- **Lore-boxes are click-to-open every visit again.** Persistence layer removed.
- **Name Your Book renders cleanly** (class collision with the notebook fixed).

---

## Memories added/updated today

No new memory files written this session.

---

## Open threads for the next session

- **`Dream to Dean` and `Failure: Trisha's`** — narrative audit verified both are reachable. Could still be deleted if Dr Quill chooses.
- **`Eat Shelleys Liver`** orphan passage still in the file.
- **Title screen BEGIN link** still bare text per earlier handoff.
- **Audit punch list — partial follow-through.** The five-agent audit raised 60+ items, ~10 of the high-impact ones actioned. Remaining lower-priority items (z-index arms race, dead CSS class candidates, minor minigame edge cases) sit on the punch list if another sweep is wanted.
- **Three Pillars (Mercy/Severity/Mildness)** still banked.
- **Astral-map screenshots banked 2026-05-13** — still uncommitted to a use.
- **`[NEED A WORD]` / `[FIND PAGE 93 — //CARTHAGE//]` / Cecil Court `[CLOSED]` / Trisha's `[CLOSED]`** brackets left intact (actionable info pips don't cover). Could be stripped if Dr Quill wants total minimalism on the hub.
- **Page 93 SVG** redrawn for realism — if it still reads too stylised in play, next polish steps would be more naturalistic edge irregularity (slight wavy edges) or a second turbulence layer for foxing / aging spots.

---

## Things considered and intentionally NOT done

- **Lily pip on every conditional warning grub link** (low-confidence / low-sobriety branches). Pips appear on main navigation lines only; conditional warning prompts stay clean.
- **Stripping `[NEED A WORD]` / `[FIND PAGE 93]`** — actionable info no pip currently covers.
- **Cow ride music tempo cap** — by design.
- **Start / StoryInit init duplication** — defensive guards make it safe; refactor risk > payoff.
- **Lore-box persistence** — explicitly removed today; previous design intent reversed by Dr Quill. Git history has the implementation if it ever needs to come back.
- **Naming the man at the Colony door anything other than Davy Merkin** — same character as the inside-Colony Davy who gives the Lackland password.
- **Memory 3 in a fourth location** — three memories spread across phone-call / alba-2 / Interval are now the canonical placements.
