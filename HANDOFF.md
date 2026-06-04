> **▶ NEXT SESSION — START HERE.** Loop: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`, port 8923) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** — it's now **~50 MB** (all audio is base64-embedded); grep it instead.
>
> **⚠ THE big gotcha this session:** `window.Harlowe` / `window.Engine` are **`undefined`** in this build. You **cannot** read or write Harlowe state from JS via `window.Harlowe.API_ACCESS` — it silently no-ops. **Reads:** have a passage `(print:)` the value into a hidden DOM element, read its `.textContent`. **Writes:** a JS-side flag, or route through a `(set:)`+`(go-to:)` result passage. (This caused 6 bugs this session — all fixed. Detail in memory `project_harlowe_not_exposed.md`.)
>
> **State at handoff:** big session — **Dido's Lament** music shipped (composed → MIDI → humanised → embedded as a `pyre`-tagged ambient bed); the **`window.Harlowe` footgun** found + 6 bugs fixed; the **Green Sea / Pillars progression** repaired (was unreachable); the Dido pyre passage rewrites; and the remaining **audit follow-ups**. **All synced, committed, pushed** — live build verified at **https://www.samquill.com/Dream-Street-Shuffle-Game/Dream%20Street%20Shuffle.html** (200, ~50 MB, new build).
>
> **Real-play checks pending (optional, none blocking):**
> 1. **Audio mix by ear** — the Dido's Lament bed (`didos-lament`, volume **0.40**) over the pyre, and carthage-melody now carrying over the Green Sea Approach render. Tag wiring verified; only the *level* wants ears.
> 2. **Waltz → stat change feel** — verified structurally + via the proven result-passage pattern; a real waltz playthrough confirms the morale/sob move feels right.
> 3. **Pong single-opponent sigil** (carried from prior handoff, still not done) — should show only `$opponent`, needs a live match.

# HANDOFF — 2026-06-03 (PM) — playthrough-notes pass (7 items)

Worked through Dr Quill's latest playthrough notes. All synced + verified booting clean (preview `dss`, no console errors); **not yet committed** (he commits via GitHub Desktop).

1. **Matchbox double-popup leaving the French** — the overlay lives in **Dean Street** (`$visited's French` + `$hasMatches is false`). Made the reveal idempotent with a session flag `window._dssMatchPopupDone` (reset in both StoryInit blocks alongside `_dssSawPentangle`); a second emission/script-run can no longer show a second popup.
2. **Sigil on Red passages** — Red was present in **You speak to the poet** (`[outdoor]`) but it wasn't tagged `char-red`, so the corner sigil dropped out mid-conversation (At the Corner → poet → LINE 1 = on-off-on). Added `char-red` there. **NB:** the "old friend / eldest of the children" in the Green Sea (LINE 2) is a *different* character, NOT Red — do not tag LINE 2 `char-red`. Also **muted sigil colour**: `.dss-sigil` now `filter: saturate(0.8) …`.
3. **Carthage "wake from the dream"** — removed the early-exit wake from the pre-page Carthage shore branches (first-visit + visited-pyre-no-page), funnelling to **Approach the pyre** (= get Page 93). Wake now only appears once you HAVE the page (to return it in London). Also closed a latent soft-lock (leaving the pyre empty-handed + returning previously left only "wake").
4. **Typewriter sentence pauses on ALL passages** — the engine already applied `SENTENCE_PAUSE` after `.!?` to every typewriter page, but at **200ms** it was imperceptible. Raised to **500ms** so the reflective passages (After the call, After Aoife, The dark pass, Cow ride…, etc.) breathe like the opening. (tw-fast paragraphs still skip it.)
5. **Copper punch counter** — a failed counter scored **0**, which capped your best-case remainder at 4 < the 5 needed to win, so one failed counter = guaranteed loss and there was never a reason to risk one. Changed failed counter to **+1** (a graze, like a block): a single failed counter is now recoverable (1+2+2 = 5), so it's a real gamble for the perfect/margin. Win ≥5 / perfect ≥9 unchanged.
6. **Text fix** — LINE 2 "He speaks…" line corrected to Dr Quill's version ("roars on round, as his sister winds a trick, but you hear this:").
7. **Dido music in the Green Sea** — added `'green-sea'` to the `didos-lament` bed's tags so the lament plays across **LINE 2** (the bar) and **LINE 2 Oxford** (the memory cut-away), layering over the quiet green-sea field recording (same pattern as lament-over-cicadas at Stay in Carthage). Level still **0.40** — a candidate for an ears check.

---

# HANDOFF — 2026-06-03 (Dido's Lament + window.Harlowe footgun + Green Sea fix + audit follow-ups)

A long session: a new music feature, a systemic JS-state bug, a flow-logic repair, and the last of the audit. Everything is committed, pushed, and live.

---

## Completed this session

### Dido's Lament — composed, humanised, embedded
- Pulled the **melody + ground bass** of Purcell's "When I am laid in earth" (public-domain; cross-checked vs IMSLP + a faithful MIDI), built a clean 2-track MIDI, then a **humanised** version (micro-timing jitter, dynamic shaping, agogic lean on long notes, end ritardando). Reference files sit in the project folder (`Dido's Lament (melody + ground bass).mid` and `…humanised).mid`) — for Dr Quill's own scoring, not part of the build.
- His bounced **`didos-lament.mp3`** is embedded by `sync_html.py` and registered as an ambient bed: `registerAmbientBed({label:'didos-lament', tags:{pyre:1}, volume:0.40, duckVolume:0.12})`. Plays across the three `[pyre]` passages (**Dido, Rescue the page, Stay in Carthage**) and **carries over between them** (bed engine never restarts a playing bed).
- Made the pyre **dry**: the audio dispatcher's `inPyre` branch now calls `ambientOff()` (was `fireFarnell()` — the fire crackle), and `Stay in Carthage` lost its `carthage-cicadas` tag. Only the lament plays at the pyre now.

### `window.Harlowe` footgun — 6 bugs fixed (the big one)
`window.Harlowe`/`window.Engine` are `undefined`, so 6 spots reading/writing state via `window.Harlowe.API_ACCESS` silently did nothing:
- **Dawn Ripley's Wheel** showed no haunt names → Dawn now prints `#dss-haunt-data` (pipe-joined `$haunts`); `dssOpusReveal` reads it. **Verified end-to-end: all 12 names + alchemical stations render.**
- **Waltz** lost its morale/sobriety result → now routes through Harlowe result passages **`Waltz Result Up`/`Down`** (apply `$statGain`/`$statLoss`, then `(go-to:)` O'Flatterly's). Buckets: `score >0.65` → up, `<0.35` → down; magnitudes **±14 morale, +6/−8 sob** — tunable.
- **Cow-ride skip-if-played** (`#cow-state-data`), **O'Flatterly shop-bell phase** (the `.shop-bell-marker` now prints the phase), **map-pentangle re-reveal** (`window._dssSawPentangle` session flag, reset in Start + StoryInit), **debug reveal-pentangle tool** (clears the flag).
- The fix pattern is in memory (`project_harlowe_not_exposed.md`) and `AUDIT-INDEX.md`.

### Green Sea / Pillars progression — repaired (was unreachable)
- **Intended:** Pillars visit 1 → the Great Ham (critic); visit 2 → Carthage, grab **Page 93** from Dido's pyre, return it to O'Flatterly in Cecil Court; visit 3 → **The Green Sea**.
- **Bug:** the Dean Street Pillars re-entry link was gated on the *optional* `$tookLily2` — skip that flower and you were permanently locked out → Green Sea unreachable. Loosened to `$metCritic is true and $knowsAboutPage is true and not ($alba contains $alba2)` (keeps the Cecil-first order; closes once the Green Sea is done).
- Removed dead links: the impossible "Try The Green Sea" in `Dido`, and a dead `(else-if:)` in `Maritime interlude`.
- **Verified end-to-end** with a temporary `(set:)` flag forcing the post-page state, then walking Dean St → Pillars → Maritime → Carthage shore → **the Green Sea bar**. No soft-locks (every state keeps an exit). Temp passage removed afterward.
- **Green Sea Approach** retagged `[dream green-sea]` → `[carthage-shore]` so **carthage-melody carries over its 3D render** (no wind, no seaside on the approach; seaside resumes at the bar / LINE 2). Note: `[dream]` was only firing the wind + a node-colour in the passage-map graph — *not* a scene tint.
- **Carthage shore**: removed the "Wake from this dream" from its Green-Sea branch (flows straight on).

### Dido pyre passage rewrites
- **"Sub umbras: watch her burn" → "Rest here"** (the Latin survives in the dying-words lore; legible label that doesn't tempt players to click "Wake").
- Dropped all **"Wake from this dream"** options from the Dido exits (kept the deep not-done fallback) — clean flow into the pyre beat; you wake from `Stay in Carthage`.
- Cut an AI-flavoured page-description paragraph → bare "Reach into the flames" link.
- Framing line → **"The fire must burn with you or without you."**

### Centre Point
- Lowered the "every man and every woman is a star" caption (`bottom` 150px → 115px) so it clears the rising astral constellation.

### Audit follow-ups — remaining items cleared (logged in `AUDIT-INDEX.md`)
- **Done:** S5/A2 memory-2 photo gated; S8 alba-string heal in the header; N2 `_hideStats` body-exit invariant comment; S5/A3 `aria-label` on the 7 minigame/drawing canvases; S4/A3 `aria-hidden` on the decorative tarot SVGs; M3 `touchcancel` strand fix (match-light hold + the two napkin draw canvases).
- **No-action (resolved on inspection):** N3/N4 already deleted; R2 flash audit *passes* (nothing strobes >3×/sec; lightning = max 2 flashes/burst, multi-second gaps); S9 already handled (Dean St recreates `$visited` keys); M4 stat-bar fits at 320px.
- **Deliberate / declined:** C1 faint captions, C2 minigame hints, C3 locked notebook styles (intentional low-emphasis); M3 dexterity tap/keyboard affordance **declined** (the hold is intentional tactile design); reduced-motion (R1) still **parked for first-draft**.

### Petal storm
- Confirmed by measurement it already fires at full strength (pegs `FLOOD_MAX` 1600, screen-filling) — the earlier "weak" impression was just not reaching the flood phase. Settled, no change.

---

## New systems / technical notes (read before touching)

- **Ambient-bed music (`registerAmbientBed`, ~line 2023):** tag-driven and **continuous** — a bed plays on every passage carrying its tag and **does not restart** when moving between same-tag passages. That's how the lament bridges the pyre and carthage-melody bridges Carthage shore → Green Sea Approach. `_bedShouldPlay` is a pure tag match (no carry-over magic — purely "is the tag present"). To add a bed: drop the file in the folder, add a tuple to `AUDIO_EMBEDS` in `sync_html.py`, add a `registerAmbientBed({label, dataUri, tags, volume, duckVolume})` call.
- **Procedural `_ambient` slot ≠ registered beds.** `windFarnell`/`fireFarnell`/`distantTraffic` share ONE `_ambient` slot, dispatched by tag priority `pyre > dream > outdoor` (~line 9091 in the nav handler). `ambientOff()` → `_stopAmbient()` stops **only** that procedural slot, never the registered beds. (That's why the pyre's `ambientOff()` kills the fire crackle but leaves the lament bed playing.)
- **DOM-bridge for Harlowe→JS reads:** `#dss-haunt-data` (Dawn), `#cow-state-data` (cow), the `.shop-bell-marker` text (O'Flatterly), plus the older `pp-data-opponent` / `sob-data-bar`. Print the value in the passage; read `.textContent` in JS. Macros **don't** evaluate in attributes — print into element *text*.
- **JS→Harlowe writes:** impossible directly. Use a window/session flag (`window._dssSawPentangle`) reset on Start, OR a `(set:)`+`(go-to:)` result passage (`Waltz Result Up`/`Down`).

## Still open / parked
- **PRE-COMMERCIAL-RELEASE cleanup (keep for now, gate/remove before shipping):** a **debug/playtesting menu ships active** in the build — backtick (`` ` ``) keydown listener opens a debug panel (.twee ~line 3653 / 3890), plus `DBG Complete` (bulk-grants all state + jumps to end) and `DBG Matchbook` passages. Dr Quill wants to **keep it during development** and remove/gate it later. When commercialising: wrap the backtick listener behind a dev/production flag (or strip it + the DBG passages). Surfaced by the 2026-06-03 multi-agent audit.
- **Coach & Horses now a fully-wired venue (2026-06-04).** "Coach and Horses lock" was tagged `[venue-gents]` only, so the Soho-map "you are here" pulse + venue identity never fired. Added `venue-coach` to it → map pulse works. Decoupled the side-effects: `coach-bar` bed is now MANUAL-START ONLY (empty tags) so it can't collide with the gents bed during the cubicle intro; the `venue-coach → doorCreak` door SFX was REMOVED (you arrive via the sewer-pipe animation, not a door); and the warm-amber venue theme is scoped `:not([tags~="venue-gents"])` so the gents keeps its own grimy look. The gents' wood-beam dividers (`coach-beam`/`-bottom`) were replaced with **glazed Victorian tile friezes** (`gents-tiles`/`-bottom`) — top + bottom, grimy grout, hairline cracks, tarnished-brass edge rules + central water-drop motif. Also removed the unused `soho-dawn` tag (bed still plays at Cecil Court). **Wants a foreground eyeball** of the gents tiles (brightness/grime to taste).
- **Audio licensing → original field recordings.** The ambience beds are non-commercial-only placeholders; the game is going commercial. Plan: capture original on-site Soho room tone (Zoom mic) to replace them. Full venue-by-venue capture plan + drop-in filenames + access notes in **`FIELD-RECORDING-CAPTURE-LIST.md`**. Ground truth so far: Pillars of Hercules **shut**; Colony Rooms only via a member friend (unreliable); Ronnie's paid-entry + likely gig on (needs a workaround). His own music + procedural SFX stay. (memory `project_audio_commercial_replacement.md`)
- **Music still to compose:** Ronnie's (Parker-quoting-Stravinsky, his), + two new ideas — the **painting minigame** (*Sketch the Painter*, currently on the French pub bed) and the **tarot** (*Shana Reads*, currently on the Trisha's quiet-cafe bed). Wiring per track = file → `AUDIO_EMBEDS` → `registerAmbientBed` + retag.
- **Lackland's office music — DONE & wired** (`lacklands-office-music.mp3`, bed `lackland-office`, vol 0.30; plays across the whole den — office `venue-lackland` + basement `venue-lackland-back`; cellar-pump hum removed from Lackland, kept for Copper's cellar). Also this session:
  - **Bed resume feature** — new opt-in `resumePosition: true` flag on the bed engine (`_startBed`/`_stopBed` track playback offset via the audio clock, mod buffer length). Only `lackland-office` uses it, so the music **resumes mid-phrase after the pong game** instead of rewinding. All other beds untouched.
  - **Office flow:** removed the "Leave" link from *Martin Lackland's Office* (only reachable with `$knowsCopperSecret`, so it was redundant) → **Linger only**, made **unconditional** to avoid any soft-lock now that Leave is gone.
  - **PP Victory/Defeat:** "Back upstairs" → **"Back to Dean Street"**.
  - ⚠ **Known loop seam:** a slight pause at the MP3 loop wrap (encoder-priming — the engine only trims it on the first play, not the wrap). Dr Quill judged it **acceptable for now**; fix when wanted is a one-off **PCM/WAV re-bounce** (same filename → I re-embed + sync, nothing else changes).
  - Debug test scaffolds (`ZZ TEST Lackland Music`, `ZZ TEST Decider`) removed — build back to 136 passages.
- **"Watch the decider" pre-pong rally animation — DONE.** Clicking into the decider now plays a CSS side-view ping-pong rally (~3.4s, gold-on-dark, ball volleys → smash → flash) before the result text + challenge links **fade in at 3.6s**, giving a beat of buildup before the pong game. CSS `.dec-rally`/`@keyframes decBall|decPadL|decPadR|decFlash` live in UserStylesheet; reveal is a `<div class="dec-reveal">` + inline `setTimeout(…,3600)` adding `.dec-reveal-show` (NOT Harlowe `(after:)` — see below). Verified working at the logic level (reveal fires, links render, target opacity 1).
  - ⚠ **Testing gotcha that cost a long detour:** the preview-MCP eval tab is **backgrounded** (`document.hidden`), which freezes CSS animations + rAF, so `passageFadeIn` sticks at opacity:0 (passage looks blank) and Harlowe `(after:)` never fires. `setTimeout` still works. Always check `document.hidden` before assuming a reveal is broken; foreground the tab for a true visual. (memory `project_preview_tab_backgrounded.md`)
- Audio **mix by ear** (lament level 0.40; carthage-melody over Green Sea) and **waltz stat feel** — the only real-play follow-ups.
- **Pong single-opponent sigil** — carried, still not done.
- **Reduced motion (R1)** — whole topic parked for first-draft.
- **Optional tunables** flagged but not applied: lightning's one `opacity:1.0` frame → ~0.85; `.nb-lily-empty` 0.22 → ~0.3; the waltz bucket thresholds/magnitudes.
- **Dead-state vars** (`$ppScore`/`$oppScore`, `$cowRideWon`, `$albaRevealed`, `$drankAtFrench`) left in place — possible future hooks, Dr Quill's call.

---

## Carried over (still relevant)

### Verification workflow that works
- Preview MCP `preview_start` config `dss` (port **8923**), serving the compiled `.html` (~50 MB; reloads are slow — be patient). It stops when idle — just `preview_start` again.
- Jump: `window.location.hash = '#dss-debug-jump=' + encodeURIComponent('Passage Name'); window.location.reload();` — must be a real reload. **⚠ Half-inits the game** (missing venue links, `$prevConfidence` unset, endgame triggers don't fire, **and `(go-to:)` forwarder passages stall** — e.g. a passage that's only `(set:)…(go-to:)`). Confirm timing / endgame / flow in a **real playthrough**, OR force state with a temp `(set: …)` passage that ends in a *clickable link* (not `(go-to:)`), sync, and walk it — that worked perfectly for the Green Sea verification this session.
- **`window.Harlowe`/`window.Engine` are NOT exposed** (see the banner). Read state for inspection via `document.querySelector('tw-passage').textContent`.
- Grep the compiled `.html` to confirm edits survive the build; passage markup is HTML-entity-encoded in `<tw-passagedata>` (`"`→`&quot;`, `'`→`&#x27;`) — but the UserScript/UserStylesheet body is plain. Grep with `grep -F` for literal `$`/brackets.

### Harlowe / DOM gotchas
- **`window.Harlowe` undefined → DOM bridge** (the headline — see banner + memory).
- **`tw-link` vs `tw-expression`** — bracket links render `<tw-link>`, `(link:)` macros render `<tw-expression>`.
- Macros **don't evaluate inside `class="…"` / attributes** — wrap the whole element in `(if:)`, or print values into element *text*.
- **Body-level overlays persist across passage transitions** — tear down via a MutationObserver keyed on the launch passage leaving the DOM. (The sigil corner is intentionally persistent, reconciled per-passage.)
- **`Failure: Trisha's`** is NOT an orphan — referenced by JS, don't prune.
- Reusable body-level info modals: `dssShowHauntsModal()`, `dssShowStatsModal()` — route through the popup serializer + `dssModalA11y`.
- **Font-quoting:** CSS stylesheet = single quotes; JS inline-style strings = double quotes; never normalise double→single inside single-quoted JS strings (SyntaxError).

### Stats system (banked reference)
Morale (`$confidence`) & sobriety (`$sobriety`) are a **mood/consequence** system, not a health bar: **no death**; clamp 0..100; **endings don't read them**. They DO shape the Tarot draw (low sob→Devil, low conf→Tower; `$wasBeaten`→Death), NPC reactions, recovery nudges, the give-up exit (conf ≤5), and visual tone (OPUS at 12 haunts).

### ⚠ WebGL caveat
If 3D scenes show HTML overlays only, check `chrome://gpu/` / hardware accel / restart. The CLIMB IT fallback at Centre Point lets the ending play through regardless.

### Tester link
**https://www.samquill.com/Dream-Street-Shuffle-Game/Dream%20Street%20Shuffle.html** (github.io + bare samquill.com both 301→ this www form). Tell first-time openers to **Cmd/Ctrl+Shift+R** (~50 MB build caches hard).
