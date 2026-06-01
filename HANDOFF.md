> **▶ NEXT SESSION — START HERE.** Big polish/UX session (2026-06-01). Loop unchanged: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`, port 8923) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** (3MB compiled artifact) — grep it instead.
>
> **Where we were when the session paused:** mid-triage of the `aesthetic-suggestions.md` backlog with Dr Quill (the agreed "next ~1.5h" plan, see below). He wants to **finish as much as possible while in the loop**, then leave the pure-solo work (regression audit, dead-code sweep) for last. **v2-expansion is deliberately held for a dedicated session.**
>
> **Pending HIS real-play confirmation** (debug-jump can't verify these — see "⚠ Debug-jump" below):
> 1. **Rising-number deferral** (NEW this session) — does the floating "+N" stat delta now wait politely behind popups/modals instead of getting lost? (e.g. the +12 on entering The French, behind the primer.)
> 2. **Stats primer** now fires on **first entering The French** (not first Dean Street) — flows OK?
> 3. **Title** is 2.2em — reads "large" enough across his window widths? (Bigger needs a structural fix — see notes.)
> 4. Carried trio: **Pong** last point winnable · **liver-tip** auto-fire (#30) · **matchbox** popup.

# HANDOFF — 2026-06-01 (polish/UX: title, date, primer relocation, rising-number deferral, OPUS colour)

A long in-the-loop session with Dr Quill. All items applied, synced, verified where possible; he commits.

### Completed this session
- **Matchbox SVG cut-off** — `MATCHES` was overflowing its label panel (the **M** poked off the left edge, the **S** ran under the red striker). Shrank it: `font-size` 11→10, `letter-spacing` 2→1, recentre `x` 44→45. Fixed in **both** copies (the Dean St pop-up `match-svg` ~34187 and the notebook-inventory `nb-inv-matchbox` ~38416). Verified in a standalone before/after render.
- **`me amigo` → `mi amigo`** — the El Rocío pilgrimage line in the painter passage (`.twee:37123`). (NB: separate from the murky playtest **#11** "mi amigo" note, which is still parked.)
- **"looking for a light"** — the liver-tip "typo" was **already correct** in source; the prior handoff had mis-filed it. No change.
- **Date restored under the subtitle** — the diegetic date had been deliberately stripped out of the hub header in an earlier pass (it only flashed during the midnight flip). Now `23.11.73` (Dr Quill confirmed **dots**, year **73**) renders **persistently UNDER** the `<span class="scene-location">Dean Street, Soho, London.</span>` line (~34184), flipping to `24.11.73` after midnight and carrying the `scene-date-flip` gold-flare animation on the midnight visit. CSS: `.scene-location` margin-bottom 1.2em→0.12em, `.scene-date` margin-bottom 0.25em→1.2em (both hub-only).
- **Title size** — `<h1 class="game-title">DREAM STREET SHUFFLE</h1>` (`.twee:34130`). Went 1.7em → 2.8em (Dr Quill wanted it "large") → **2.2em (final)**. 2.8em **broke the layout**: the gas-lamp SVG floats right and `sizeLamp()` (~12513) auto-sizes it to the **full page height**; at 2.8em "SHUFFLE" (longest word) was wider than the ~246px column left of the lamp, so it couldn't fit beside the full-height float and **cleared to the bottom of the page** (the "lamp splits the title" bug Dr Quill hit). 2.2em fits beside the lamp on narrow windows too. **Bigger than 2.2em needs a structural fix** (trim the lamp's float width, or shrink the title responsively).
- **Stats primer relocated** — the **Morale & Sobriety** modal (`dssShowStatsModal`) used to fire on **first Dean Street arrival**; Dr Quill said it broke the opening. Coin overlay squats on visit 2, the haunt modal squats on The Empty Glass — so it now fires on **first entering The French** (`.twee:36959`, gated `$visited's French is false and $statsExplained is false`, 600ms), where confidence jumps **+12** and the bars visibly move, making "you can see where you stand" land. Old hub trigger removed.
- **Primer text (Dr Quill's rewrite)** — paragraph 2 now foregrounds the bar names: *"One measure's your **MORALE**… The other's your **SOBRIETY**; how straight you can remain."* (`.twee` ~3380). (Caps are his; apostrophe tidied "The other 's"→"The other's".)
- **Rising-number deferral (NEW system)** — Dr Quill: when a stat change coincides with a popup/modal, the rising "+N" gets lost behind it. Fix: a small controller appended to the **header** (~38288) **pauses every `.stat-delta` at render** and only plays it once all overlays clear. `up()` watches `.dss-rules-overlay, #coin-overlay, #match-overlay, #cig-overlay, #eat-overlay, .venue-hint-box` + `window._drinkPopupOpen`. Timing: no overlay → plays ~750ms; an overlay appears → ~1.2s after the **last** one closes (handles the French +12+primer AND the Empty Glass drink-popup→haunt-modal triple). Added `#eat-overlay` id to `EatPopup._build` (~10028) for detection. Graceful: `try/catch`, 25s safety timeout, `.stat-delta` starts at opacity 0 so worst case is a missing number, never broken UI. Mechanism verified (pause holds at currentTime 0 / opacity 0; resume plays full 5.2s rise); **end-to-end timing is a real-play check**.
- **Orphaned `@keyframes` cleanup** (aesthetic backlog C5) — removed **13 unused** keyframes (`blueGlow, borderGlow, dssDrunkLow, dualRingPulse, guidedPulse, powder-flicker, powder-glint, questGlow, softGlow, starPulse, vhMist1/2/3`). 175→162, −2.6KB. Each verified to appear ONLY in its own definition (no JS/dynamic refs). Zero visual change.
- **A2 OPUS stat-bar polish** — the OPUS-state "100%" → bright cream **`#f4edd8`** (Dr Quill picked "cream, no separator" from a 4-up mockup). Needed a **specificity bump** to `.stat-pct.pct-opus` (~39385) because the plain `.pct-opus` was being silently overridden by the later `.stat-pct` base rule (which is also why the real "100%" was already a soft tan `#e8d5b7`, not the gold the audit assumed). A2's other two points (bar-height/centreline mismatch; "rows touch") were **already fixed** in source.

### THE PLAN for the next ~1.5h (agreed with Dr Quill — in-the-loop first, solo last)
1. **Sweep the rest of `aesthetic-suggestions.md`** — fast "you call it, I implement + verify" items. Was mid-triage. Triage notes so far: **A1 lily = LEAVE ALONE** (his standing instruction); **A2 done**; **A3/A4/A5** mostly no-change; **C5 keyframes done**; **D5 (cecil-rule dedupe) already done** in a prior session. Still to walk through with him: **B1** (passage opening rhythm), **B2** (notebook tab glyphs), **B3** (drink-popup choreography), **B4** (Ginger Light breathing), **B5** (Centre Point ladder type-on + vignette), **C1** (text-shadow density), **C1b** (Alba lines font — Georgia vs Playfair, weight), **C2** (palette CSS vars — NB most hexes are in SVG `fill=`/`stroke=` **attributes** where `var()` doesn't apply, so payoff is limited), **C3** (font-quoting consistency), **C4** (haunt bg gradients near-identical), **D1** (pent breathing), **D5b** (dawn corners ×4 dedupe — low payoff, endgame), **D6** (map SMIL→CSS), **D7** (map pulse `12;32`→`12;22`), **F** (Dawn corners). Most are small "consider" picks.
2. **Title size revisit** — if he wants >2.2em, do the structural fix.
3. **Parked notes #11 / #36** — quick decisions to close (see below).
4. **He steps away → SOLO:** regression/bug-hunt audit + dead-code sweep (orphaned CSS classes/unused helpers, same risk-free treatment as the keyframes), leave a ranked list.

### Still open / parked
- **Audio (6, needs his music files):** #4 hold chord into verse · #5 hear Aoife · #14 Dido's Lament · #19 pub music w/ Lackland · #29 one voice for the calls · #35 Stravinsky/Parker/Ronnie Scott's. (He's not writing music right now.)
- **#11** — references an **in-copyright poem** ("Sebastian… / mi amigo", murky Sarah-note); parked on intent.
- **#36** — "Cecil Court at the end" — no clear intent (it's a mid-game venue); parked.
- **v2-expansion** — held for a dedicated session: Chariots-of-the-Gods dream worlds, Three Pillars portal hub at the Pillars of Hercules, Himalayas first (see memory `project_v2_expansion_direction`).

### Key technical notes (NEW this session)
- **Rising-number deferral controller** lives in the **header passage** (runs every passage). If a new overlay/popup type is ever added, add its root selector to the controller's `up()` check or its "+N" deltas will play behind it.
- **OPUS "100%" colour** must be set on `.stat-pct.pct-opus` (specificity) — plain `.pct-opus` is overridden by the later `.stat-pct { color:#e8d5b7 }` base.
- **Gas-lamp `sizeLamp()`** (~12513) stretches the lamp to full page content height; the title flows in the **narrow column left of it**. Any widening of the title risks the longest word clearing below the lamp on narrow viewports. **2.2em is the safe ceiling** without a structural change.
- **Stats primer** is now the ONLY `dssShowStatsModal` call site (`.twee:36959`); the hub trigger is gone. Gate uses `$statsExplained` (still init in StoryInit + healed in Dean Street).

### ⚠ Debug-jump is unreliable for verification (confirmed again)
`#dss-debug-jump=PassageName` + reload leaves the game **half-initialised**: MORALE shows 75% not 70%, venue links are missing, and `$prevConfidence` is unset so **stat-delta "+N" never renders**. Top-level scripts fire but nested-in-`(if:)` ones are flaky. **Confirm overlay timing / stat changes / venue flow in a REAL playthrough** (Title → BEGIN → … → Dean Street → To The French …). This matches the standing rule from prior handoffs.

---

## Carried over (still relevant)

### Verification workflow that works
- Preview MCP `preview_start` config `dss` (port **8923**), serving the compiled `.html`.
- Jump: `window.location.hash = '#dss-debug-jump=' + encodeURIComponent('Passage Name'); window.location.reload();` — must be a real reload. (But see ⚠ above — half-init state.)
- Read state: `document.querySelector('tw-passage').textContent`. `window.Harlowe`/`window.Engine` are **not** exposed — can't set Harlowe vars from JS; use a temp `(set: $flag to true)<!-- TEMP-TEST-REMOVE -->` + sync to test gated branches.
- Grep the compiled `.html` to confirm edits survive the build; passage scripts are HTML-entity-encoded (`'`→`&#x27;`, `"`→`&quot;`, `<`→`&lt;`) — grep encoded forms or unquoted substrings.

### Harlowe / DOM gotchas
- **`tw-link` vs `tw-expression`** — bracket links render `<tw-link>`, `(link:)` macros render `<tw-expression>`.
- Macros **don't evaluate inside `class="…"`** — wrap the whole element in `(if:)`, don't embed in the class string.
- **`(click-replace:)` is one-shot but its named `tw-hook` lingers** in the DOM — guard JS that reacts to those hooks (root cause of the old lily double-pick bug).
- **Body-level overlays persist across passage transitions** — tear down via a MutationObserver keyed on the launch passage leaving the DOM.
- **`Failure: Trisha's`** is NOT orphan — referenced by JS, don't prune.
- **`dssSpawnMotes`** accepts `{noScroll:true}`.
- Reusable body-level info modals: `dssShowHauntsModal()`, `dssShowStatsModal()` (gold-on-dark, dismiss via click-anywhere/✕).

### Stats system (banked reference)
Morale (`$confidence`) & sobriety (`$sobriety`) are a **mood/consequence** system, not a health bar: **no death**; asymptotic gains/losses clamp 0..100; **endings don't read them** (White/Black = Alba lines + final wake/sleep; Complete/Incomplete = whether all 3 Alba lines were caught). They DO shape the Tarot draw (low sob→Devil, low conf→Tower, ~34448), NPC reactions, recovery nudges (both <30 → "bad way"), the give-up exit (conf ≤5), and visual tone. The primer frames them as "the temperature of your night."

### ⚠ WebGL caveat
If 3D scenes show HTML overlays only, check `chrome://gpu/` / hardware accel / restart. The CLIMB IT fallback at Centre Point lets the ending play through regardless.
