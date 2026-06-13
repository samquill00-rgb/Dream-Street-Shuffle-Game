> **▶ NEXT SESSION — START HERE.** Loop: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`, port 8923) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** — it's now **~50 MB** (all audio is base64-embedded); grep it instead.
>
> **⚠ THE big gotcha this session:** `window.Harlowe` / `window.Engine` are **`undefined`** in this build. You **cannot** read or write Harlowe state from JS via `window.Harlowe.API_ACCESS` — it silently no-ops. **Reads:** have a passage `(print:)` the value into a hidden DOM element, read its `.textContent`. **Writes:** a JS-side flag, or route through a `(set:)`+`(go-to:)` result passage. (This caused 6 bugs this session — all fixed. Detail in memory `project_harlowe_not_exposed.md`.)
>
> **⚠ Gotcha (2026-06-13):** HTML/`<script>` only render from **top-level** hooks in a passage — a `<div>`+`<script>` nested deep inside `(if:)[…]` silently does **not** render. (And grepping `document.body.innerHTML` lies — the hidden 62 MB `<tw-storydata>` source is in it, so your markup "appears" as text even when nothing rendered; check `getElementById` / `tw-passage`.) Fix: mirror the Title Continue-reveal — conditional `<div>` in a top-level hook + the `<script>` at top level.
>
> **State at handoff (2026-06-13):** Save system made **discoverable** — prominent Continue / demoted BEGIN, a "saves itself" title note, a subtle Dean-Street **"✓ Progress saved"** toast, and an honest-failure line (private mode). The autosave already worked; players just couldn't tell. ⚠ Edited the `.html` directly then **ported the changes into the `.twee`** — committed (**ahead 1, push it**); the `.html` is already pushed + live. **Repo hygiene done** (README marking this as the live repo + a redirect on the stale `Dean-Street-Shuffle` repo, both pushed). Full detail in the **2026-06-13** section below. _Earlier (2026-06-05 PM):_ **Ronnie's original music composed, wired + bounced** (`ronnies-firebird-jazz.mp3` = the full Firebird→Coltrane small-group chart: head + alto/tenor solos + piano + walking bass + his drums). Synced; the **new mp3 + `Dream Street Shuffle.html` are NOT yet committed** — commit those two in GitHub Desktop to ship. Detail in the **2026-06-05 (PM)** section below. Everything earlier is committed + pushed, incl. **Copper cellar fight rebuilt to a composure-bar system** (+ his pre-fight line updated, Dr Quill's words) and **Aoife flagged underwritten → parked** (he's writing her himself; memory `project_aoife_underwritten.md`). Full detail in the **2026-06-05** section below. Earlier same-day run: Lackland office **music** (resumes mid-phrase after pong via `resumePosition`), the **"Watch the decider" pre-pong rally**, the **Coach & Horses** as a full venue (Soho-map pulse + grimy **Victorian tile friezes** in the gents), office **Linger-only** + "Back to Dean Street". Then a tester-feedback pass: **typewriter sped up** (MIN/MAX/TARGET = 22/74/1550; "Soho, London." `FAST_CHAR_MS`=16) + a **real sentence-pause fix** (only breathe at true sentence ends — no ellipsis/decimal stalls; `_sentenceEnd` in the type loop), paragraph breaths kept at 1500/1300; **all typewriter pages now share The Night Ahead's warm aged-paper** (class base `#e3d5b4` + amber wash) **plus a fold-crease/foxing `::before` detail layer** (excludes the stain page via `:has(svg.tna-stain)`; Night Ahead keeps its bespoke wine-stain SVG); **Ham & Inis corner sigils** added (None of us likes it! → `char-ham`; Return the page + O'Flatterly's Gift → `char-inis`); **smoking no longer restarts the Dean Street music** ("Smoke one" applies effects inline + re-renders the current passage; orphan "Smoking" passage removed); and the **post-matchbook "word to the wise" popup removed**. **Sarah's notes: all done bar the music.**
>
> **Outstanding (none blocking):**
> 1. **Music to compose (Dr Quill's):** Ronnie's is **DONE** (composed, wired + bounced — see the 2026-06-05 PM section; commit `ronnies-firebird-jazz.mp3` + `.html` to ship). Remaining: the painting minigame (*Sketch the Painter*, French pub bed), the tarot (*Shana Reads*, Trisha's quiet-cafe bed) — each still on a borrowed venue bed, ready to wire on bounce.
> 2. **Audio ears-checks:** Lackland MP3 loop seam (PCM re-bounce only if the tick bugs), Dido's Lament level (0.40), carthage-melody over the Green Sea, waltz stat feel.
> 3. **Pre-commercial-release:** gate the debug menu; the Soho field-recording trip. (Details in *Still open / parked*.)
> 4. **Aoife deepening (parked, narrative):** reads as a "bad news wife" vs the fully-written Lily; Dr Quill is writing her himself — diagnosis + directions in memory `project_aoife_underwritten.md`. **Don't draft her prose unless asked.**

# HANDOFF — 2026-06-13 — Save system made discoverable (it already worked) + repo hygiene

A playtester reported "autosave wasn't working / it needs a save game option." **The autosave + Continue system already worked** — verified end-to-end in headless Chrome: it `(savegame:)`s to `localStorage` every turn, persists across closing the browser, and Continue restores. The real problem was **discoverability**: the Continue link was faint/easy to miss and nothing on-screen showed the game was saving, so a returning player clicked BEGIN (= new game) and lost progress. Fixed with four UX changes to **Title (118)** + **header (126)** — *no change to the save mechanism itself*. Already pushed + live; also ported into the `.twee` (see workflow note).

## The four changes
- **Prominent Continue / demoted BEGIN.** When a save exists, the title leads with **"CONTINUE WHERE I LEFT OFF"** (full size) and BEGIN becomes a small "Start a new game". `#dss-begin-wrap` / `#dss-continue-wrap` toggled by the title's reveal script (same localStorage/IFID gate as the old faint link, which is removed).
- **Title note:** "This game saves itself as you play — you can close it and come back whenever."
- **Dean-Street "✓ Progress saved" toast** — small, subtle, fixed bottom-right; fades in then out (~2.7s) and removes itself. `#dss-save-toast`, emitted only on the **Dean Street** passage, JS-gated on the save existing (so it appears from the **2nd** Dean Street visit on, never the first).
- **Honest failure:** if `(savegame:)` returns false (private/incognito), a one-line amber warning shows instead of failing silently — gated on the `_saved` result the autosave already captured.

## ⚠ Harlowe gotcha learned (cost ~6 test iterations)
**HTML / `<script>` only render from TOP-LEVEL hooks in a passage.** A `<div>`+`<script>` nested deep inside `(if: $returns…)[ … ]` **silently does not render** (no error, no DOM element). Don't be fooled by grepping `document.body.innerHTML` — it includes the hidden 62 MB `<tw-storydata>` *source*, so your markup "appears" there as text even when nothing rendered; check `document.querySelector('tw-passage')` or `getElementById`. The fix: mirror the **Title Continue-reveal** pattern — conditional `<div>` in a top-level hook + the `<script>` at top level (it no-ops when the div isn't present). The toast only started rendering once moved out of the nested autosave block.

## Other notes
- **`$returns` increments in the Dean Street *body*, after the header** → header autosave (gated `$returns >= 1`) first fires on the **2nd** Dean Street visit; the toast likewise. Expected.
- **Detecting the real hub in tests:** `#dean-lamp-svg` is unique to passage 45 ("Dean Street"). "A Doorway on Dean Street" / "At the Corner…" show similar text but are different passages (and `A Doorway…` is in `_hideStats`).

## ⚠ Workflow deviation this session (now reconciled)
I edited the **`.html` directly** first (didn't have the "edit `.twee` → sync" rule loaded), verified + committed; Dr Quill pushed it (live). On reading this handoff I **ported the same edits into the `.twee`** (Title + header passages) and confirmed a re-sync reproduces the committed `.html` passages **byte-for-byte** (only diff = sync's pre-existing blank-line churn). **`.twee` is committed (ahead 1 — push it); `.html` already pushed.** Source + build are consistent; next sync preserves the save UX.

## Repo hygiene — the confusion that derailed the start of this session (fixed)
The live game lives in **THIS repo** (`Dream-Street-Shuffle-Game`, served at the samquill.com link). Two decoys cost a long wild-goose chase: a stale **`Dean-Street-Shuffle`** repo still publicly served a 33-passage Jan export, and a separate **no-music Twine *desktop* draft** (different IFID, 172 passages) masquerades as current in the Twine app. Fixed:
- Added **README.md** here marking this as the live game (URL, file to edit, how to publish, decoy warning). Committed + pushed.
- Replaced the old `Dean-Street-Shuffle` repo's index.html with a **redirect** to the live game (keep its Pages **on**). Committed + pushed.
- **Reminder:** the Twine desktop draft is NOT the live game — if you open Twine and there's no music, you're in the old draft. The live source is `Dream Street Shuffle.twee` in this repo.

---

# HANDOFF — 2026-06-05 (PM) — Ronnie's music composed, wired + bounced

Ronnie's now has its finished original music — the "Parker-quoting-Stravinsky" track from the outstanding list is **DONE**. Synced; `ronnies-firebird-jazz.mp3` + `Dream Street Shuffle.html` **not yet committed** (Dr Quill pushes via GitHub Desktop).

## The track
A **C♯-minor folk-hymn melody (after Stravinsky's Firebird)** reharmonised with **Coltrane / Giant-Steps changes**, arranged as a 48-bar small-group chart: **head → alto solo → head → tenor solo → head → head-out** (V1 / V2 / V1-tritone-subs / V3 / V1 / V1; passes 5–6 settle home, 6/9 voicings). Two-horn front line — **alto** (Parker-ish) + **tenor** (Coltrane-ish) — Steinway (loose rolled Coltrane voicings), upright **walking bass grounded on the home E-axis roots through every V1** (so the piano's tritone subs read as grounded alterations, not drift), and **Dr Quill's own drums**. All composed as working `.mid` files (untracked — his scratch, not part of the build).

## Audio wiring (committed earlier this run)
- Bed **`ronnies-firebird`** (search `'ronnies-firebird'` in the `registerAmbientBed` block) plays `ronnies-firebird-jazz.mp3` on every **`venue-ronnies`** passage (club / bar-canvas results / The Set), vol **0.30**, native Web-Audio sample-loop. It **replaced** the old `jazz-ronnies` people-ambience — that bed AND its `__DSS_RONNIES_DATA_URI__` embed (`the-ronnies-jazz-ambience.m4a`) were **removed** (~1.2 MB base64 saved).
- **Bar minigame now two phases:** **pour** (Firebird bed keeps playing — *not* stopped) → **carry/platform** (jazzmini loop). `startBarGame` no longer fires jazzmini during the pour; **`_startCarryTransition`** stops the `ronnies-firebird` bed + starts jazzmini for the carry; nav-away kills jazzmini (MutationObserver) and the `venue-ronnies` tag-match restarts Firebird at Bar Canvas Win/Lose → The Set.
- `sync_html.py` `AUDIO_EMBEDS`: `__DSS_RONNIES_MUSIC_DATA_URI__` → `ronnies-firebird-jazz.mp3` (audio/mpeg); old people-ambience line deleted.

## To commit (to ship)
`ronnies-firebird-jazz.mp3` (full-band bounce — 192 CBR, joint stereo, **Overload-Protection-Only** normalize so it's level-matched to the other beds) + `Dream Street Shuffle.html` (re-synced, embed verified, 0 leftover placeholders). Commit those two in GitHub Desktop → live. Also **~21 untracked `.mid`** working files — commit as assets or add `*.mid` to `.gitignore`, his call.

## For the remaining two music pieces (painting / tarot)
The MIDI-compose loop worked well: raw-byte Python MIDI generators; he sends a MIDI, I parse + regenerate. Preferences that surfaced — **solos need real phrasing + note-length variety** (flat eighth-streams read as etudes); **drums he does himself** (offer fills/cymbal *guidance*, don't generate kit MIDI — he binned mine); head harmony — parallel 3rds/6ths/quartal/voiced all read too busy or "jarring minor", he took a **sparse 8-note common-tone counter-line** instead.

---

# HANDOFF — 2026-06-05 — Copper cellar fight → composure bars; Aoife parked

Synced (`python3 sync_html.py`) + verified in preview `dss`, no console errors; committed (Dr Quill, GitHub Desktop).

## Copper cellar fight — rebuilt to composure bars
The complaint (tester James + Dr Quill): two ways to win (dodge/counter) but each was pure win-or-lose, no middle ground. **Replaced the best-of-3 / "win 2 of 3" model entirely** — which had itself replaced the points model in the 2026-06-03 PM item #5 (now stale). New model in `window.FightGame` (.twee ~line 11011):
- **Two composure bars** (you + Copper, 0–100) drawn on the canvas top (`drawBars`/`_drawBar`, eased drain). **6 real exchanges** (`REAL_EXCHANGES`), still 3 practice first. Damage by magnitude, not flat round results.
- **Graded outcomes** (every branch unit-verified live): DODGE right+quick = CLEAN (Copper −14) · right+late = GRAZE (you −7) · wrong = CAUGHT (you −20). COUNTER is a **timing window** (telegraph t 0.50–0.82), not RNG: in-window = ★COUNTER★ (Copper −26) · mistimed = TRADE (Copper −10, you −16). BLOCK = ABSORBED (you −5). Freeze/timeout = CAUGHT (you −18).
- **Verdict:** empty his bar = **KNOCKOUT** → Fight Victory Perfect · ahead at the bell = **STANDING** → Fight Victory · your bar at 0, or behind at the bell = **DOWN** → Fight Defeat. `window._lastFightScore` = 2/1/0 (no Harlowe consumer; routing is the JS `go-fight-*` link clicks, unchanged).
- Dodge = the safe points line; **counter is the only route to a KO** (clean dodges alone can't empty him) — that's the real risk/reward. **Tunables:** `REAL_EXCHANGES`, the `handleAction` damage numbers, the counter window. `_winCount`/`_roundDotsHTML` now dead (left defined, unused).
- **UI matched:** rules popup + in-fight instructions table + the board ("EXCHANGE x OF 6" · "PUT HIM DOWN · OR LEAD AT THE BELL").

## Copper's pre-fight line — updated (Dr Quill's words)
"Fight starts" passage. Old line said "three for real / win two of the three" (now false). New: *'Three rounds to find your feet,' says Copper. 'Then it's a real fight. Drop me or outlast me. But go down yourself, and it's finished.'* — deliberately non-numeric on the real side so it survives any retune of the exchange count.

## Aoife — flagged underwritten, PARKED
Tester James: she reads as "just a bad news wife." Diagnosis (from the .twee): every Aoife line positions her *relative to the protagonist* (need/reproach/stakes), while **Lily** has full interiority (memory-photo, Shakespeare 66 / Yeats, St Giles, wit) → the present-vs-past dilemma is rigged. Directions banked in memory `project_aoife_underwritten.md` (lean: an Aoife memory-photo to parallel Lily's + a call carrying her *clarity* not her need). **Dr Quill is writing her himself — don't draft her prose unless asked.**

---

# HANDOFF — 2026-06-03 (PM) — playthrough-notes pass (7 items)

Worked through Dr Quill's latest playthrough notes. All synced + verified booting clean (preview `dss`, no console errors); **not yet committed** (he commits via GitHub Desktop).

1. **Matchbox double-popup leaving the French** — the overlay lives in **Dean Street** (`$visited's French` + `$hasMatches is false`). Made the reveal idempotent with a session flag `window._dssMatchPopupDone` (reset in both StoryInit blocks alongside `_dssSawPentangle`); a second emission/script-run can no longer show a second popup.
2. **Sigil on Red passages** — Red was present in **You speak to the poet** (`[outdoor]`) but it wasn't tagged `char-red`, so the corner sigil dropped out mid-conversation (At the Corner → poet → LINE 1 = on-off-on). Added `char-red` there. **NB:** the "old friend / eldest of the children" in the Green Sea (LINE 2) is a *different* character, NOT Red — do not tag LINE 2 `char-red`. Also **muted sigil colour**: `.dss-sigil` now `filter: saturate(0.8) …`.
3. **Carthage "wake from the dream"** — removed the early-exit wake from the pre-page Carthage shore branches (first-visit + visited-pyre-no-page), funnelling to **Approach the pyre** (= get Page 93). Wake now only appears once you HAVE the page (to return it in London). Also closed a latent soft-lock (leaving the pyre empty-handed + returning previously left only "wake").
4. **Typewriter sentence pauses on ALL passages** — the engine already applied `SENTENCE_PAUSE` after `.!?` to every typewriter page, but at **200ms** it was imperceptible. Raised to **500ms** so the reflective passages (After the call, After Aoife, The dark pass, Cow ride…, etc.) breathe like the opening. (tw-fast paragraphs still skip it.)
5. **Copper punch counter** — ⚠ **SUPERSEDED 2026-06-05** — the entire points / best-of-3 model is gone; the fight is now composure bars (see the 2026-06-05 section above). Original note: a failed counter scored **0**, which capped your best-case remainder at 4 < the 5 needed to win, so one failed counter = guaranteed loss and there was never a reason to risk one. Changed failed counter to **+1** (a graze, like a block): a single failed counter is now recoverable (1+2+2 = 5), so it's a real gamble for the perfect/margin. Win ≥5 / perfect ≥9 unchanged.
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

## ✅ Done this session (2026-06-04, committed)
- **Lackland's office music** — `lacklands-office-music.mp3` → bed `lackland-office` (vol 0.30) across the whole den (office `venue-lackland` + basement `venue-lackland-back`); cellar-pump hum kept only for the Copper's cellar. New opt-in **`resumePosition`** bed flag (`_startBed`/`_stopBed` track playback offset via the audio clock) → music **resumes mid-phrase after the pong game** instead of rewinding; no other bed affected. ⚠ Minor MP3 loop seam (encoder-priming) — judged fine for now; fix = one-off PCM re-bounce, same filename.
- **Office flow** — *Martin Lackland's Office* is **Linger-only** (Leave removed, made unconditional → no soft-lock). PP Victory/Defeat read **"Back to Dean Street."**
- **"Watch the decider" pre-pong rally** — CSS ping-pong rally (~3.4s) then result + challenge links fade in at 3.6s. Reveal uses `setTimeout`+`.dec-reveal-show`, **not** Harlowe `(after:)` — rAF/`(after:)` pause in a backgrounded eval tab (memory `project_preview_tab_backgrounded.md`).
- **Coach & Horses → full venue** — tagged `venue-coach` (Soho-map "you are here" pulse now fires); `coach-bar` bed made **manual-start-only** (no collision with the gents bed); door creak removed (you arrive via the pipes); amber theme scoped off the gents; wood-beam dividers replaced with grimy **Victorian glazed tile friezes** (`gents-tiles`/`-bottom`). Removed the unused `soho-dawn` tag.
- **Sarah's playthrough notes — all done except the music** (see open list). The carried *pong single-opponent sigil* is **dropped** — Dr Quill wants to keep the stack, not the single sigil.

## Still open / parked
- **Music still to compose (Dr Quill's):** Ronnie's (Parker-quoting-Stravinsky), the **painting minigame** (*Sketch the Painter*, on the French pub bed), the **tarot** (*Shana Reads*, on the Trisha's quiet-cafe bed). Wiring per track = drop file → `AUDIO_EMBEDS` tuple → `registerAmbientBed` + retag.
- **Audio ears-checks (none blocking):** Lackland MP3 loop seam (PCM re-bounce only if the tick bugs); Dido's Lament level (0.40); carthage-melody over the Green Sea; waltz stat feel.
- **PRE-COMMERCIAL-RELEASE:** (1) **gate the debug menu** — backtick (`` ` ``) keydown listener (.twee ~line 3653/3890) + `DBG Complete`/`DBG Matchbook` passages ship active; keep during dev, wrap behind a dev/production flag (or strip) before shipping. (2) **Replace placeholder ambience** with original Soho field recordings — non-commercial-only beds; plan + access notes in `FIELD-RECORDING-CAPTURE-LIST.md` (Pillars shut, Colony via member, Ronnie's paid/gig). Both → memory `project_audio_commercial_replacement.md`.
- **Parked / minor:** reduced-motion pass (R1); optional tunables (lightning `opacity:1.0`→~0.85, `.nb-lily-empty` 0.22→~0.3, waltz bucket thresholds); dead-state vars (`$ppScore`/`$oppScore`/`$cowRideWon`/`$albaRevealed`/`$drankAtFrench`) — possible future hooks.

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
