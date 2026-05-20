# HANDOFF — 2026-05-20

Long polish session after the previous Carthage / 16-note pass. Broke into roughly four chunks: (1) a fresh playtest-note batch from Dr Quill, (2) a deep audit (5 parallel research agents) of the whole .twee, (3) systematic fixes from that audit, (4) Dean Street hub cleanup + lily-pip system + Name-Your-Book rebuild.

---

## Playtest-note batch (4 items)

1. **Sway animation — Maritime Interlude only.** The drunk-vision `dssDrunkMid` enchant in the `:: header` passage fired on every passage when sobriety dropped below 35. Originally restricted to Green Sea passages, then corrected (Dr Quill) to **`Maritime interlude` only**. Coach + cow ride + everywhere else are now still.

2. **Toilet pipes overlay shrunk.** `.coach-plumbing-intro` now uses `display: flex; align-items: center; justify-content: center;` with the SVG capped at `min(58vh, 88vw)`. No longer fills the whole portrait viewport.

3. **Centre Point click sounds + softer footsteps.**
   - Typewriter-tick suppressed for any tw-link inside `.ending-pane` (Alba Complete / Alba Incomplete) via `if (link.closest('.ending-pane')) return;` in the global click handler.
   - Cobble footstep reverb softened: delay `0.075 → 0.055`, feedback `0.42 → 0.22`, output `0.55 → 0.32`. Same impact, much less echo tail.

4. **Alba reveal at Dawn + Marvell verse alignment.**
   - `.alba-final` `text-align: center → right`.
   - Reveal timings 6/8/10s → **2/3.5/5s**.
   - New `.alba-credit` block at 6.5s: italic, left-aligned, 0.78em, "'Alba' by Ezra Pound".
   - Marvell quote in lily memory 2 (LINE 2 Oxford): added `text-align:right;` to the inline style on the `.quest-box`.

---

## Big audit (5 parallel research agents)

Ran a deep, broad audit covering narrative+state, JS layer, CSS, minigames, 3D+audio. Findings consolidated into a triaged list. Most actionable items fixed (below); a handful intentionally left.

### State / narrative
- **`$lilyCallReturn`** now initialised to `"Dean Street"` in `:: StoryInit` and `:: Start` — was set only when a phone ring fired, could leave a savegame in a state where `(go-to: $lilyCallReturn)` hit `undefined`.
- **`$bookTitle`** initialised to `"Untitled Manuscript"` in same two places — was set only in `Name Your Book`, referenced widely.

### Minigame
- **Cow ride skip detection** refactored. Was round-tripping `$cowRideDone`/`$cowRideWon` booleans through hidden DOM spans rendered by `(print:)`. Now reads `Harlowe.API_ACCESS.STATE.variables.cowRideDone/cowRideWon` directly; orphan `cow-data-won` / `cow-data-done` spans removed.
- **Bare `dssAudio.stopBed`** inside the cow game → `window.dssAudio.stopBed` (consistency, no functional change).

### 3D scene memory hygiene — biggest piece
Added three shared helpers at top of the JS section, just before the first scene IIFE:
- `window._dssBindScene(wrapId, scene, renderer, camera)` — registers the resize listener + tracks the trio in `window._dssThreeRegistry`.
- `window._dssDisposeWrap(wrapId)` — full teardown: removes resize listener, traverses the scene calling `.dispose()` on every geometry / material / textured map (map/normalMap/specularMap/emissiveMap/alphaMap/aoMap/bumpMap/displacementMap/envMap/lightMap/metalnessMap/roughnessMap), disposes the renderer (incl. `renderLists.dispose()` + `forceContextLoss()` so GPU buffers release immediately), removes the wrap div.
- `window._dssDisposeThreeScene(scene, renderer, resize)` — underlying helper.

Every one of the **12 Three.js approach scenes** (Ginger Light, French, Coach, Pillars, Lackland, Carthage, Colony, Ronnie's, Copper's Lair, Trisha's, Centre Point, Chinese Fish & Chips) refactored:
- Their inline anonymous `addEventListener('resize', …)` block → single `window._dssBindScene('xx-wrap', scene, renderer, camera);` call.
- Their cleanup-branch `wrap.parentNode.removeChild(wrap)` → `window._dssDisposeWrap('xx-wrap');`.
- French + Coach also had **missing** cleanup branches in their `setInterval` watchers — fixed in this session before the disposal layer landed.
- Verified: `grep -c "window.addEventListener('resize', function"` returns 0; `grep -c "_dssBindScene"` returns 13 (1 helper + 12 scenes).

### Visual / accessibility
- **`.phone-ringing` click-blocking backdrop** via `tw-story:has(.phone-ringing)::before` — transparent fixed layer at z-index 98999 that intercepts clicks. The visual darkening from the 9999px box-shadow stays; clicks no longer fall through.
- **`tw-link:focus-visible`** outline (1px dashed amber, 3px offset) for keyboard navigation.
- **Pending pip opacities** `.hp-pending` / `.op-pending` / `.pp-pending` / `.al-pending` / `.qp-pending` bumped `0.22 → 0.38` (now legible without losing the "you haven't been here yet" feel).

### Removed dev cheats
- `window.dssCollectAllLilies` and `window.dssTestPentangle` globals deleted. The lily-cheat logic inlined into the debug menu's "reveal pentangle" tool button so that path still works.

### Intentionally skipped
- **Start / StoryInit duplicate-init consolidation** — both contain the same long `(set:)` chain. Agent rated medium-risk to touch with low payoff; defensive `(unless:)` guards everywhere make duplication safe.
- **Cow ride music tempo cap** — by design per Dr Quill (escalating playback rate is intended).
- **`[NEED A WORD]` / `[FIND PAGE 93 — //CARTHAGE//]`** bracket hints kept (actionable info pips don't cover).

---

## Carthage audio intensification

Dr Quill wanted howling wind on the shore + crackling fire at the pyre. Two-part change.

**Passage tags rerouted:**
- `:: The coast of Carthage` and `:: Carthage shore` now carry `[carthage-cicadas dream]`. The `[dream]` tag triggers `windFarnell()` in the audio handler at line ~8255. Cicadas bed continues underneath, wind layered on top.
- `:: Stay in Carthage` now carries `[carthage-cicadas pyre]`. The `[pyre]` tag (checked first) triggers `fireFarnell()`.
- `:: Dido` already had `[dream pyre]` — fire wins, no change.

**`windFarnell` made more howling:**
- Master gain `0.20 → 0.32`. Low-howl gain `0.55 → 0.85`, mid-whistle `0.65 → 0.78`, high sibilance `0.30 → 0.34`.
- Primary gust LFO: slower (`0.13Hz → 0.10Hz`), bigger sweep (`±280 → ±520Hz`).
- New secondary slow LFO (`0.043Hz`, `±90Hz`) on the low-howl band — non-periodic feel.
- New amplitude-breathing LFO (`0.078Hz`, `±0.08` gain) — whole bed swells and recedes.

**`fireFarnell` made more intense:**
- Master gain `0.12 → 0.24`.
- Flicker envelope sharper (`0.7+0.3 → 0.65+0.42`).
- Crackle event probability `0.0001 → 0.00028` (~3× as many pops), randomised duration (18-40ms) and amplitude (0.55-1.0) so each crackle reads distinct.
- Replaced single 600Hz bandpass with **two parallel filter bands**: low rumble at 220Hz (burning-body weight) + bandpass at 900Hz (bright crackle).

**Cleanup hardening:** `_stopAmbient()` now explicitly `.stop()`s any `lfo` / `lfo2` / `ampLfo` oscillators on the previous bed.

---

## Critic page-turn rebuild

- Flip duration `1.2s → 0.6s`. Narration delay `1600ms → 750ms`. Aftermath gate `900ms → 500ms`. Mote delay `1500ms → 1100ms`. Left-page fade-swap `400ms → 220ms`. Total click-to-verdict-ready halved.
- **Direction now alternates**: `directions = ['forward', 'back', 'forward', 'back']`. Clicks 1 & 3 flip forward (right page lifts to the left), clicks 2 & 4 flip backward (left page lifts to the right, `transform-origin: right center`, `rotateY(178deg)`). Each spawned page renders the correct side's text (left- vs right-anchored) and the box-shadow direction flips too.

---

## Waltz minigame

Count-in changed from **3-2-1 → 1-2-3** at `drawCountIn` ([.twee:32634](Dream Street Shuffle.twee:32634)) — the way a musician counts in. Beat timing and audio unchanged; only the displayed numeral sequence inverts.

---

## Dido / Carthage pyre — gating + prose

- **"Lie down beside her" suppressed** when the page is visible but uncollected. Wrapped the relevant link in `(unless: $knowsAboutPage is true and $hasMissingPage is false)[…]`. Player gets only the "Reach into the flames" / "Wake from this dream" options until they grab the page.
- **Removed** the redundant `//You must not, yet, go any deeper inland.//` text from the Dido passage's no-haunts branch.

---

## Lore-box persistence

New section at [.twee:31409](Dream Street Shuffle.twee:31409). Mechanics:
- On click of any `⟡ ... ⟡` tw-link, the link's text is saved to `localStorage['dss-lores-opened']`.
- On every passage render, a MutationObserver finds any matching link, hides it (`visibility: hidden`), and synthetically clicks it so Harlowe's `(link:)` expands it in place. Player sees the lore box already open.
- `dataset.loreExpanded` flag prevents double-firing.
- Cleared along with the rest of `localStorage` by the Dawn Play Again button.

---

## Approach back buttons

Audit found 3 missing. All `[3D approach]` passages now have `<div class="approach-back">(link-undo: "← BACK")</div>` except the two intentional exceptions (Carthage shore, Approach Centre Point):
- Added: **Approach The Coach**, **Approach Coppers Lair**, **Green Sea Approach**.

---

## Name Your Book — rebuilt to the typewriter-page pattern

After two failed attempts at fixing the "appears low then jumps up" FOUC (`[tags~="book-naming"]` and then `:has(.book-naming-tw)` selectors), Dr Quill asked for a complete rebuild matching every other typewriter-page passage in the file.

- Passage now uses `<div class="typewriter-page typewriter-static nb-page">` — same cream-paper container as Night Ahead, After the call, Cow ride success, etc. `typewriter-static` opts out of the type-on reveal so the input is interactive immediately.
- Dropped the `[book-naming]` tag, the `:has(.book-naming-tw)` global rules, and all the custom `.book-naming-tw` CSS.
- The SVG wine/burn decoration is preserved inside the typewriter-page wrapper.
- New `.nb-page .nb-input` / `.nb-page .nb-subtitle` / `.nb-page .nb-link-row` rules at [.twee:37659](Dream Street Shuffle.twee:37659) handle the input textarea styling, the subtitle line, and the greyed-out "Back to Dean Street" link until the player types.
- Trade-off: cream paper now sits ~92px from the viewport top (standard tw-passage padding for the stat-bar area, which is hidden on this passage). **No jump.**

---

## Dean Street hub — lily pip system + verbose-hint strip

**Verbose hint text removed** from 6 navigation links:
- `[[Back to The French — there was something you missed|…]]` → `[[Back to The French|…]]`
- `[[The Pillars — there was someone you wanted to talk to|…]]` → `[[To The Pillars|…]]`
- `[[Back to The Pillars — there was a flower you missed|…]]` → `[[Back to The Pillars|…]]`
- `[[Back to The Colony Room — there was something you missed|…]]` → `[[Back to The Colony Room|…]]`
- `[[Back to Ronnie Scott's — there was something you missed|…]]` → `[[Back to Ronnie Scott's|…]]`
- `[[Back to the chippy — there was something you missed|…]]` → `[[Back to the chippy|…]]`

These weren't a recent regression — they predated the current session per `git log -S`. Possibly removed in an earlier uncommitted session, possibly remembered-but-not-executed.

**New `.lp` (lily pip) class** at [.twee:37597](Dream Street Shuffle.twee:37597). Pale-lilac (`rgba(196,168,212,…)`) so it's visually distinct from the existing amber haunts, copper objects, slate-blue passwords, gold alba, sage quests. Icons: `❀` filled (collected), `❁` outlined (pending). Visibility gates on `$lilyHintShown is true` — pips only appear after the player has encountered their first lily (matches the discovery-then-track rhythm of `$hauntExplained`).

**Mapping**:
- `$tookLily1` → chippy
- `$tookLily2` → The Pillars
- `$tookLily3` → Ronnie Scott's
- `$tookLily4` → The Colony Room
- `$tookLily5` → The French

Lily pips inserted on **all** navigation branches for these five venues (first-visit, Back-to, NOT NOW / CLOSED).

**Bracketed venue-state hints stripped** from the four lily-tracked venues (per Dr Quill's "icons alone" request):
- `The French [CLOSED]` → `The French`
- `The Pillars [NOT NOW, LOOK ELSEWHERE]` → `The Pillars`
- `The Colony Room [NOT NOW]` → `The Colony Room`
- `Ronnie Scott's [NOT NOW]` → `Ronnie Scott's`

The greyed-out venue name + filled `❀` pip now conveys "you've done this, nothing left here." Lacklands' `[NEED A WORD]`, Cecil Court's `[FIND PAGE 93 …]`, Trisha's `[CLOSED]` left alone since they convey info pips can't.

---

## Phone-ringing popup shape

- First pass: `border-radius: 6px → 50% / 42%` (elliptical, oval bubble feel).
- Final pass (Dr Quill request): `→ 36px` — chunky rounded square, "more like beermats." Padding/sizing unchanged.

---

## Other small fixes / prose / tags

- Prose: "You're here to find one hidden in the night" → "**You need** to find one hidden in the night" (Night Ahead Part Two).
- Lily memory 2 (LINE 2 Oxford) Marvell quote now `text-align: right;` inline.

---

## State of the live code

All today's changes synced to `Dream Street Shuffle.html`. `sync_html.py` unchanged. No new MP3/M4A swaps.

Memory leak path through the 12 3D approach scenes is now fully closed (renderer disposal, scene-graph teardown, resize-listener removal, force-context-loss). Phone-call popup intercepts clicks correctly. Carthage shore + pyre have their own howling-wind and crackling-fire procedural beds layered with the cicadas. Lily collection is iconified on the Dean Street hub. Name Your Book uses the same typewriter-page pattern as every other monospace passage and no longer jumps.

---

## Memories added/updated today

No new memory files written this session. Existing memories about voice-draft style, prose discipline, esoteric layer, and 3D atmosphere toolkit remain valid.

---

## Open threads for the next session

- **`Dream to Dean` and `Failure: Trisha's`** still flagged as suspected orphan passages by the narrative audit, but verified by the agent as actually reachable. Could still be deleted if Dr Quill chooses.
- **`Eat Shelleys Liver`** orphan passage still in the file.
- **Title screen BEGIN link** still bare text.
- **Cecil Court CLOSED / Trisha's CLOSED / Lackland's NEED A WORD / FIND PAGE 93** bracketed hints still present — Dr Quill could ask for any of these stripped later.
- **Audit punch list — partial follow-through.** The five-agent audit raised 60+ items; the actioned set was ~10 items covering the high-impact ones. Remaining lower-priority items (z-index arms race, dead CSS class candidates, minor minigame edge cases) sit on the punch list if Dr Quill wants another sweep.
- **Three Pillars (Mercy/Severity/Mildness)** still banked, no commits this session.

---

## Things considered and intentionally NOT done

- **Lily pip on every conditional warning grub link** (low-confidence / low-sobriety / low-both branches). The pips appear on the main navigation lines; conditional warning prompts stayed clean.
- **Stripping `[NEED A WORD]` / `[FIND PAGE 93]`** from Lackland's / Cecil Court — they convey actionable info no pip currently covers.
- **Cow ride music tempo cap** — by design.
- **Start / StoryInit init duplication** — defensive guards make it safe; refactor risk > payoff.
