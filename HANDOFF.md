> **▶ NEXT SESSION — START HERE.** Loop unchanged: edit `.twee` → `python3 sync_html.py` → verify via preview MCP (config `dss`, port 8923) → **never git** (Dr Quill commits via GitHub Desktop). **Never read the `.html`** (~3MB compiled artifact) — grep it instead.
>
> **State at handoff:** a big night. Two major new systems shipped — the **typewriter rework** and the **character-sigil system** — plus a **mute fix**, the **Dawn petal-flood** (and a runaway-storm fix it exposed), and the remaining **audit follow-ups**. Everything is synced, **committed, and pushed**. (Re-confirmed at the start of the following session: the petal-storm **runaway fix is verified present in source** — the one-time `stormStarted` guard + observer-disconnect — so that bug is settled.)
>
> **Pending Dr Quill's real-play confirmation** (debug-jump half-inits and can't fire these cleanly):
> 1. **Petal flood look** at the *real* Dawn ending — the **runaway is confirmed fixed (verified in source)**; the only unconfirmed thing is the *visual density/feel* of the flood (debug-jump can't fire it). Optional eyeball, not a blocker; `FLOOD_MAX` (1600) is a one-number tune.
> 2. **Pong sigil** — should show *only* the opponent you're facing (Jack's blue *or* Percy's amber), not both. Needs a live match (sets `$opponent`).

# HANDOFF — 2026-06-02 (typewriter rework + character sigils + mute / petal fixes)

A long, productive session, almost entirely on two new systems plus polish. Dr Quill drove the design throughout; drafted art/code iterated live in the preview.

---

## Completed this session

### Typewriter rework — global, all `.typewriter-page` passages
Replaced the old character-by-character type-out (which forced reading at the machine's pace) with a **paragraph-at-a-time** reveal:
- Each paragraph types out over **~2–2.5s**, with the per-character speed *derived* from paragraph length and **clamped 34–110ms/char** so individual keystroke clicks stay audible (Lea's note — you can hear the keys).
- A **slight beat (~200ms) between sentences** (after `.`/`!`/`?`, mid-paragraph only).
- **Varied pauses between paragraphs** (base 1500ms ± jitter) so the rhythm isn't metronomic. Cursor restored; blinks through the pause.
- Two **authoring markers** (in use in The Night Ahead): `<span class="tw-fast">…</span>` = an unusually quick snap (e.g. "Soho, London."); `<span class="tw-pause" data-ms="600"></span>` = a custom beat at a point (e.g. before the warehouse line). Both reusable anywhere.
- Reverted an earlier hard paragraph-break on the warehouse line — it's one paragraph again, with a `tw-pause` for the beat.

### Character sigils — NEW system (`window.dssSigils`)
A gently-pulsing Art-Nouveau **sigil in the bottom-left** while you're "with" a character; fades in/out per scene; **stacks vertically** when more than one is present.
- **13 characters**, each = bronze-on-dark **cartouche frame + emblem (their "sign") + monogram + per-character colour**, no name (illegible at corner size).
- **Hand-drawn brush letterforms** (Red's "R" iterated to final). Multi-letter monograms are **side-by-side, NOT entwined** (Dr Quill vetoed interlacing).
- Presence is **per-passage**: a passage tagged `[char-<id>]` shows that mark. Doubles by tagging two: **Beaten** (John + Salvu), **The dual ring** (Aoife + Lily). **PP Pong** is *dynamic* — shows only `$opponent` via an inline `<span data-sigil="…">` marker.
- Colours spread so scene-sharing characters read apart (e.g. **John = teal vs Salvu = copper** in the cellar).

### Mute fix
The outdoor **traffic** ambient kept washing in after muting: its output gain is **LFO-modulated**, so zeroing the gain's *base* value couldn't silence it (the LFO swung it back — the "repeating wave"). Now `setMuted` **disconnects the ambient's output node** on mute and reconnects on unmute. Mute is truly silent everywhere now.

### Dawn petal flood + runaway fix
- After "THE END" has had time to be read (**~10s**, `FLOOD_AT`), the storm escalates to a **flood of WHITE petals** (new `.dawn-petal.flood` class; `FLOOD_MAX` 1600; bigger batches, faster spawn).
- **Runaway bug fixed (pre-existing, amplified by the flood):** the dawn trigger's MutationObserver re-fired `startPetalStorm` on every petal-add → cascading storms (saw 14,596 petals in testing). Added a `stormStarted` one-time guard + disconnect the observers when the storm starts. Normal single-storm behaviour is unchanged; this just prevents multiplication.

### Audit follow-ups (from the AUDIT-*.md reports)
- **Dean Street coach-funnel fallback** (N5/S7) — additive escape link for the theoretical `$coachUrgent && !$metRed` dead-end.
- **Lackland's Back Door** — visible "Step back" link (N1) so it's never a hidden-only exit.
- **Modal a11y batch** (S1/S2/S3/F3/M1) — shared `window.dssModalA11y` helper: `role="dialog"`/`aria-modal`/`aria-labelledby`, focus in/return, Escape, plus 44px touch targets + `:focus-visible` rings on close glyphs.
- **Reduced motion** — the CSS kill-switch was added then **removed at Dr Quill's request**; the *whole* topic is **parked for first-draft stage** (he has separate plans). There is currently **no** `prefers-reduced-motion` handling. Decisions logged in `AUDIT-INDEX.md`.

### Smaller fixes (earlier in the session)
- **Alba header jewel** now lights the moment you catch a line, **synced with the gong** (revelation boxes carry `data-alba="1/2/3"`; the flash-observer lights the matching `#stat-bars-lifted .alba-jewel`).
- **Glass smash** at The Empty Glass now lands **~2s after you close the haunts explainer** (new `hauntsmodal:closed` event), not while it's still up.
- **Dean Street link relabelled "The Chippy"** (the action "get some grub" stays in the word-to-the-wise popup). Confirmed there was never a "grab" typo.
- **Matchbox popup** now routes through `dssDeferIfBusy` (defers behind hard overlays).
- **Pong** stale comments corrected (the difficulty climb is the serve-speed ramp, not a phantom updateAI ramp).

---

## New systems — technical notes (read before touching)

- **`window.dssSigils`** (sigils): data-driven. `CHARS` object holds per-character `{stops, emb, mono}`; the registry is *built* from it via shared helpers `_grad`/`_frame`/`_emb`/`_L` (letter paths)/`_mono`. Driven once per passage from the nav handler (~line 8904) via `dssSigils.update(tags)`, which also merges inline `[data-sigil]` markers. `#dss-sigil-corner` is `flex-direction:column` (vertical stack), width 92px, fades via `.dss-sigil-in`. **To add/edit a character:** edit `CHARS` + add a letter to `_L` if needed + tag the scenes `[char-<id>]`. Multi-letter monograms = side-by-side in `_mono` (duo/trio); **don't entwine**.
- **Typewriter** (`typewriterEffect`, ~line 11993): tunables at the top of the reveal block — `TARGET_MS` 2300, `MIN/MAX_CHAR_MS` 34/110, `SENTENCE_PAUSE` 200, `PARA_PAUSE` 1500, `PARA_JITTER` 1300, `FAST_CHAR_MS` 6. Markers: `tw-fast` (class), `tw-pause` (class + `data-ms`).
- **`window.dssModalA11y(overlay, card, labelEl, closeFn, opts)`** — shared modal a11y; `opts.escape:false` / `opts.returnFocus:false` for special cases (the minigame-rules modal uses both).
- **Petals** (`startPetalStorm`, ~line 32554): `stormStarted` guard (must stay — prevents the cascade); `FLOOD_AT`/`FLOOD_MAX` control the flood; `.dawn-petal.flood` = the white variant.

## Still open / parked / real-play checks
- **Petal-flood look** + **Pong single-opponent** — the two real-play checks in the banner above.
- **Sigils:** only each character's *primary* scene(s) are tagged; secondary scenes (Davy's tip, more O'Flatterly/cellar beats) can be added. Player gets no sigil (deliberate).
- **Typewriter:** long passages (The Night Ahead) still roll up through the fixed paper sheet — acceptable; flagged only if a specific page feels cramped.
- **Reduced motion:** whole topic parked for first-draft stage (see above).
- **Dead-state vars** (`$ppScore`/`$oppScore`, `$cowRideWon`, `$albaRevealed`, `$drankAtFrench`) left in place — possible future hooks, Dr Quill's call.
- **Carried from prior handoff:** Pong last-point-winnable (real-play feel) · liver-tip auto-fire (#30) — not touched this session. (Matchbox popup: done.)

---

## Carried over (still relevant)

### Verification workflow that works
- Preview MCP `preview_start` config `dss` (port **8923**), serving the compiled `.html`. (It stops when idle — just `preview_start` again.)
- Jump: `window.location.hash = '#dss-debug-jump=' + encodeURIComponent('Passage Name'); window.location.reload();` — must be a real reload. **⚠ Half-inits the game** (missing venue links, `$prevConfidence` unset, endgame triggers like the Dawn petal storm don't fire). Confirm timing / endgame / stat flow in a **real playthrough**.
- Read state: `document.querySelector('tw-passage').textContent`. `window.Harlowe`/`window.Engine` are **not** exposed — can't set Harlowe vars from JS; use a temp `(set: $flag to true)<!-- TEMP-TEST-REMOVE -->` + sync, OR inject a test DOM node via `preview_eval`.
- Grep the compiled `.html` to confirm edits survive the build; passage markup is HTML-entity-encoded in `<tw-passagedata>` (`"`→`&quot;` etc.) — but the UserScript/UserStylesheet body is plain. Grep accordingly.

### Harlowe / DOM gotchas
- **`tw-link` vs `tw-expression`** — bracket links render `<tw-link>`, `(link:)` macros render `<tw-expression>`.
- Macros **don't evaluate inside `class="…"`** — wrap the whole element in `(if:)`.
- **Body-level overlays persist across passage transitions** — tear down via a MutationObserver keyed on the launch passage leaving the DOM. (The sigil corner is intentionally persistent and reconciled per-passage instead.)
- **`Failure: Trisha's`** is NOT orphan — referenced by JS, don't prune.
- Reusable body-level info modals: `dssShowHauntsModal()`, `dssShowStatsModal()` — route through the popup serializer AND now `dssModalA11y`.
- **Font-quoting:** CSS stylesheet = single quotes; JS inline-style strings = double quotes; never normalise double→single inside single-quoted JS strings (SyntaxError).

### Stats system (banked reference)
Morale (`$confidence`) & sobriety (`$sobriety`) are a **mood/consequence** system, not a health bar: **no death**; clamp 0..100; **endings don't read them**. They DO shape the Tarot draw (low sob→Devil, low conf→Tower; `$wasBeaten`→Death), NPC reactions, recovery nudges, the give-up exit (conf ≤5), and visual tone (OPUS at 12 haunts).

### ⚠ WebGL caveat
If 3D scenes show HTML overlays only, check `chrome://gpu/` / hardware accel / restart. The CLIMB IT fallback at Centre Point lets the ending play through regardless.
