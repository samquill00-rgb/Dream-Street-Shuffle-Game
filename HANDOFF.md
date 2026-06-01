> **▶ NEXT SESSION — START HERE.** Loop unchanged: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`, port 8923) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** (~3MB compiled artifact) — grep it instead.
>
> **State at handoff:** the **entire `aesthetic-suggestions.md` backlog is now done** (every A/B/C/D/F item applied or deliberately left), the **popup/modal race bug is fixed**, and the **dead-code audit has been actioned** (−245 lines). The last batch (audit cleanup) may be **uncommitted** — confirm it's committed+pushed before relying on the GitHub state.
>
> **Pending Dr Quill's real-play confirmation** (preview/debug-jump can't fully verify timing/endgame — see ⚠ below):
> 1. **Popup serialization** (NEW) — on first French: drink → *then* stats primer (no overlap); back to Dean St: matches → *then* "word to the wise" (no flicker). Mechanism verified; the full in-game sequence is his to confirm.
> 2. **Endgame motion** (D-items) — pent breathing, "THE END" bloom, Ripley's-Wheel Sol pulse + Ouroboros breath, Dawn-corner settle, centre-out ending wash. All bound & rendered; motion is a real-play check.
> 3. Carried trio still open: **Pong** last point winnable · **liver-tip** auto-fire (#30) · **matchbox** popup.

# HANDOFF — 2026-06-01 (backlog clearance + popup-race fix + dead-code audit)

A long session: finished the whole aesthetic backlog with Dr Quill in the loop, fixed a popup-ordering bug he hit in playtest, then (overnight, via a scheduled remote audit + this morning's cleanup) removed confirmed dead code.

### Completed this session

**B — medium polish**
- **B2** notebook active-tab **parchment edge-curl** (`.nb-tab-active::after`) — glyphs idea declined.
- **B3** drink-popup **gold bottle-glow sweep** during the pour (`.drink-pour-glow`, one-shot CSS on the card) — ripple idea declined.
- **B4** Ginger Light **halo breathing** (`.ginger-light` slow scale, 3.6s, offset from the lamp's 5s flicker). **NO RAIN** — Dr Quill vetoed it (see memory `feedback_no_rain_ginger`).
- **B5** Centre Point caption **types itself out** ("EVERY MAN AND EVERY WOMAN IS A STAR"); the vignette was already in source. Caption also raised to `bottom:150px` for clear space above CLIMB IT.
- **B1** (passage opening rhythm) — **PARKED**. Source check showed transitions already use `.typewriter-page`, so payoff is low.

**C — stylistic**
- **C1** trimmed the rising `+N` delta glow from 4→3 shadow layers (dropped the widest 46px bloom; bright core kept).
- **C1b** Alba lines → **Crimson Text small-caps**, weight 600 (was Georgia bold all-caps).
- **C2** palette **`:root` CSS vars** (`--gold-bright/warm/deep`, `--cream-light/text`, `--ink-shadow`) + converted in-stylesheet hexes to `var()`. Caveat held: most palette hexes live in SVG `fill=`/`stroke=` attrs or JS/canvas strings where `var()` can't apply, so it's a partial conversion. (`--gold-deep`/`--ink-shadow` later removed as unused — see audit.)
- **C3** font-quoting sweep (single-word unquoted; multi-word single-quoted in CSS, double-quoted in JS strings). ⚠ This bit me — see memory `project_font_quoting_js_strings`.
- **C4** the 4 near-identical **haunt bg gradients** made progressively distinct (warm brown → violet → indigo → rich-blue OPUS). Macros at the stat-bar setup (`(else-if: $haunts's length >= N)`).
- **C5** was already done a prior session (keyframe cull).

**D / F — endgame & code-shape**
- **D1** pent overlay **breathes** (`.centre-pent-overlay svg`, scale 1→1.02 over 8s).
- **D2** ending **wash spreads centre-out** (radial core grows via `background-size` in `dawnFadeWhite/Black`) instead of flat fade.
- **D3** "THE END" **blooms** (scale 0.7→1 with the fade) + thin gold rules above/below (`.ending-finis::before/::after`).
- **D4** Ripley's Wheel: **Sol pulses once** on reveal, **Ouroboros breathes** faintly forever (`.dwm-sol` / `.dwm-serpent`, `transform-box:fill-box`).
- **D5b** the 4 Dawn-corner SVGs deduped into one `<defs><g id="dawnCornerArt">` + `<use>` ×4 (−3KB). Works with the F mirror via `--dc-flip`.
- **D6** map "you are here" pulse migrated **SVG SMIL → CSS** (`.map-here-pulse` / `@keyframes mapHerePulse`).
- **D7** map pulse softened `r=12;32;12` → `12;22;12`.
- **F** Dawn corners **settle** (scale 0.88→1) alongside the fade; mirror preserved via a per-corner `--dc-flip` var so the scale composes with `scaleX(-1)` etc.

**Popup/modal race fix (bug Dr Quill hit in playtest)**
- Symptoms: drink popup + stats primer overlapping on first French; "word to the wise" flickering against the matchbox pickup on returning to Dean Street.
- Root cause: no serialization — "soft" info modals fired on fixed timers and landed on "hard" tactile overlays / each other.
- Fix: `window.dssOverlayBusy()` + `window.dssDeferIfBusy(retry)` (in UserScript, just after the stats-modal IIFE). Every soft modal (haunts/stats primers, venue hint, word-to-the-wise, morale warning) calls `dssDeferIfBusy(self)` right after its dedup guard → re-queues ~200ms later (cancels on `_passageGen` change). See memory `project_popup_serialization`.

**Dead-code audit cleanup (−245 lines total)** — from a scheduled remote read-only audit (fired 04:11 BST) + this-morning triage, every removal grep-verified against live code:
- Dead JS: `window.liverPopup`, `window.eatLiver`, `window.moraleWarningPopup`.
- Dead CSS: `--gold-deep`, `--ink-shadow`, `@keyframes shimmer`, `.alba-objective` ×2, `.alba-counter-lily`, the 5 `.liver-popup-*` classes, `.lore-mote` (base + `-1..8` + group-rule entry), `.fetch-glimpse`.
- Dead vars/clutter: `$seenLore`, `$shownChippyHint`, `'Things turn up'` phone-name, 12+3 non-existent `Fight *` array names, the orphaned **Deco Divider** passage (135→134 passages).
- Pruned the deliberately-disabled `(if: false)` **fetch-glimpse** block (Dr Quill confirmed it was an intentional deletion). **Kept** `$wasBeaten` (Tarot "Death" draw) and `$visitedInterval` (interval routing) — both live elsewhere.
- **Serializer re-point:** the dead `liverPopup` was the only creator of `#liver-popup-overlay`, which the serializer watched (a ghost). Gave the **live** `LiverPopup` `id="liver-eat-overlay"` and pointed the serializer there; dropped the dead `#morale-warn-overlay`. Now the serializer actually guards the live liver popup.

### Still open / parked
- **Audit structural note #16** — `.napkin-*` styles intentionally split (inline-canvas vs popup). Not a removal; just keep in mind if restyling the napkin.
- **Title >2.2em** — only if he wants it bigger; needs the structural fix (gas-lamp float width vs longest word "SHUFFLE"). 2.2em is the safe ceiling otherwise.
- **Audio (needs his music files):** #4 hold chord · #5 hear Aoife · #14 Dido's Lament · #19 pub music w/ Lackland · #29 one voice for the calls · #35 Stravinsky/Parker/Ronnie Scott's.
- **#11** (in-copyright poem, murky) · **#36** (Cecil Court at the end, no clear intent) — both parked.
- **v2-expansion** — held for a dedicated session (Chariots-of-the-Gods dream worlds, Three Pillars portal hub; see memory `project_v2_expansion_direction`).

### Key technical notes (this session)
- **Popup serializer** (`dssOverlayBusy`/`dssDeferIfBusy`): if you add ANY new overlay/popup type, add its root selector to BOTH `dssOverlayBusy`'s querySelector list AND the rising-number deferral controller's `up()` check (stat-bar setup `<script>`), or modals/`+N` deltas will fire on top of it.
- **Font quoting**: never normalise double→single quotes for multi-word families inside single-quoted JS inline-style strings — it terminates the JS string (`SyntaxError`). CSS stylesheet = single quotes; JS inline styles = double quotes; Harlowe `(css: "…")` = single quotes inside.
- **`--dc-flip`**: per-corner CSS var holding each Dawn corner's mirror, so the F settle-scale composes instead of clobbering it.
- **C2 var() reach is limited**: SVG `fill=`/`stroke=` attributes and canvas/JS colour strings can't use `var()` — only true CSS-property positions were converted.

### ⚠ Debug-jump is unreliable for verification
`#dss-debug-jump=PassageName` + reload leaves the game **half-initialised** (MORALE 75% not 70%, missing venue links, `$prevConfidence` unset so stat-delta "+N" never renders). Top-level passage scripts fire; nested-in-`(if:)` ones are flaky. Confirm overlay timing / stat changes / venue flow / endgame motion in a **real playthrough**.

---

## Carried over (still relevant)

### Verification workflow that works
- Preview MCP `preview_start` config `dss` (port **8923**), serving the compiled `.html`. (It stops when idle — just `preview_start` again.)
- Jump: `window.location.hash = '#dss-debug-jump=' + encodeURIComponent('Passage Name'); window.location.reload();` — must be a real reload. (See ⚠ above — half-init.)
- Read state: `document.querySelector('tw-passage').textContent`. `window.Harlowe`/`window.Engine` are **not** exposed — can't set Harlowe vars from JS; use a temp `(set: $flag to true)<!-- TEMP-TEST-REMOVE -->` + sync to test gated branches, OR inject a test DOM node via `preview_eval` to verify endgame-only CSS/elements.
- Grep the compiled `.html` to confirm edits survive the build; passage markup is HTML-entity-encoded in `<tw-passagedata>` (`"`→`&quot;`, `'`→`&#x27;`, `<`→`&lt;`) — grep encoded forms or unquoted substrings.

### Harlowe / DOM gotchas
- **`tw-link` vs `tw-expression`** — bracket links render `<tw-link>`, `(link:)` macros render `<tw-expression>`.
- Macros **don't evaluate inside `class="…"`** — wrap the whole element in `(if:)`.
- **`(click-replace:)` is one-shot but its named `tw-hook` lingers** in the DOM — guard JS reacting to those hooks.
- **Body-level overlays persist across passage transitions** — tear down via a MutationObserver keyed on the launch passage leaving the DOM.
- **`Failure: Trisha's`** is NOT orphan — referenced by JS, don't prune.
- **`dssSpawnMotes`** accepts `{noScroll:true}`.
- Reusable body-level info modals: `dssShowHauntsModal()`, `dssShowStatsModal()` (gold-on-dark, dismiss via click-anywhere/✕). Both now route through the popup serializer.

### Stats system (banked reference)
Morale (`$confidence`) & sobriety (`$sobriety`) are a **mood/consequence** system, not a health bar: **no death**; asymptotic gains/losses clamp 0..100; **endings don't read them** (White/Black = Alba lines + final wake/sleep; Complete/Incomplete = whether all 3 Alba lines were caught). They DO shape the Tarot draw (low sob→Devil, low conf→Tower; `$wasBeaten`→Death), NPC reactions, recovery nudges (both <30 → "bad way"), the give-up exit (conf ≤5), and visual tone (incl. the OPUS state at 12 haunts). Primer frames them as "the temperature of your night."

### ⚠ WebGL caveat
If 3D scenes show HTML overlays only, check `chrome://gpu/` / hardware accel / restart. The CLIMB IT fallback at Centre Point lets the ending play through regardless.
