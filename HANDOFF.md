# HANDOFF — 2026-05-25 (playtest-prep session)

Short session, working from Dr Quill's playthrough notes. 14 items landed, all synced. Draft is being sent to playtesters; the codebase should be in a stable shipping state.

---

## Items completed this session

### Stat / interface polish

1. **Stat-change indicators (=10 / −20) made far more visible** — `.stat-delta` bumped from 0.78em → 1.25em, weight 800, stacked glow shadows, peak scale 1.9× in the drift animation. Around [Dream Street Shuffle.twee:39261]. *(He couldn't see them.)*
2. **Flower hint glows harder** — `lilyBreath` halo widened (7px → 16/34/56px stacked drop-shadows), cycle shortened (3s → 2.6s), and `lilyInvite` now plays twice on first render and scales 1.20×. `.lily-prompt::after` text pulses brighter too. Around [Dream Street Shuffle.twee:42807].

### Bug fixes from his notes

3. **No more page-jump after the Great Ham book closes.** Root cause: `dssSpawnMotes` was calling `box.scrollIntoView` whenever the box was off-screen, which yanked the viewport down the moment the critic's password item-box revealed (~500ms after `aftermath.classList.add('revealed')`). Added a fourth `opts` arg with `{noScroll:true}` opt-out and threaded that through the critic-aftermath spawn. Around [Dream Street Shuffle.twee:8588] and [Dream Street Shuffle.twee:37250].
4. **"You seem hungry."** — `"Are you hungry?"` → `"You seem hungry."` in the wordToTheWisePopup. [Dream Street Shuffle.twee:33653].
5. **Happy chime on correct password deploy.** New procedural `passwordSuccess()` function (D5 → F#5 → A5 sine arpeggio + octave shimmer), exposed in dssAudio API, called from `checkCopperPwd` and `checkLacklandPwd` on correct match. [Dream Street Shuffle.twee:2651], [31799], [31810].
6. **Verse restyled** — `.verse` now non-italic, weight 600, brighter colour `#e6c894`, explicit `text-align:left`. `.alba-final` flipped from `text-align:right` to `text-align:left` so the Dawn block reads left-aligned too. [Dream Street Shuffle.twee:40413], [38438].
7. **ALBA lines use single quotes.** `<em>"$alba1"</em>` → `<em>'$alba1'</em>` at lines 34211, 34235, 34259.
8. **Cow-ride mini-game auto-starts.** Added a 250ms `setTimeout` at the end of the cow-game IIFE that bypasses the CLICK TO START title screen and drops the player straight into the practice round. [Dream Street Shuffle.twee:36069].
9. **"Meet yourself" passage reordered.** "Follow him" link now comes directly after the opening line; the contemplative "You can leave now…" line and the "Not yet" link now appear together below as a conditional block. [Dream Street Shuffle.twee:33533].

### Centrepoint scene rework

10. **Centrepoint caption replaced** with **"Every man and every woman is a star."** (Crowley). Old caption was a tiny grey monospace `CENTRE POINT, NEW OXFORD STREET, LONDON` at 40% opacity — Dr Quill called it "weird corner text". Now an italic gold serif line, 17px, 92% opacity, gentle glow, fade-in at 2.6s. Positioned via `left:0; right:0; text-align:center` so it can't drift to a corner. [Dream Street Shuffle.twee:29278].
11. **Astral constellation re-centred.** The pentagram-like cluster was anchored on Dean Street pinned to (500, 500) in the SVG viewBox, but most night passages live south of Dean Street in editor coords (cellar/fight/pyre), so the cluster median was ~y=665 — pushing the shape off-screen. Added a bounding-box recentring pass that translates all nodes so the actual layout midpoint lands at (500, 500). Confirmed in Chrome: x-range 84→916, y-range 71→929, perfectly symmetric. [Dream Street Shuffle.twee:9144].

### French + Pong

12. **French final loop "What have you got to lose?" restored** with `[[Nothing|The novelist]]` and `(link: "Everything")` wrapped in `<div class="french-lose-choices">` — stacked, centred, italic, slightly larger. [Dream Street Shuffle.twee:32392]. CSS at [44747].
13. **Pong ball base speed** bumped `3.2` → `4.4` (~38% faster off the first serve). Rally escalation cap (+0.25×min(rallyCount,6)) and per-hit ×1.05 accel unchanged; ball still caps at 7. [Dream Street Shuffle.twee:32091].

### Regression he caught + the audit that found a second one

14. **Step-into-the-night link "dead on the page" during typewriter animation.** Root cause: `typewriterEffect` at [Dream Street Shuffle.twee:11562] only hid `tw-expression` elements (the `(link:)`-macro form). It missed `tw-link` (the bare `[[bracket]]` form), so bracket-style links rendered immediately with their text getting typed in around them. Fix: `linkEls` query now grabs `tw-expression, tw-link`, and `collectTextNodes` also skips `TW-LINK` so its text doesn't get queued. This affects every `.typewriter-page` passage that ends in a `[[bracket]]` link (~dozen of them: The Night Ahead, Night Ahead Part Two, The dark pass, etc).

**Then I caught myself making the SAME bug again.** The audit (a general-purpose subagent walking through all 14 edits) found that the new `.french-lose-choices tw-link {…}` CSS only styled `tw-link`, leaving the `(link: "Everything")` macro at default. Extended selector to `.french-lose-choices tw-link, .french-lose-choices tw-expression`. Also pre-emptively tightened the `typewriter-static` reveal branch at [11745] to query both. Both at the same line areas.

---

## Patterns to remember (from this session)

- **`tw-link` vs `tw-expression`** is the blind spot. Harlowe renders bracket links as `<tw-link>` directly, but `(link:)` macros as `<tw-expression>`. Any JS or CSS that hides/styles/iterates one needs to do both. This is the *third* incident of this class of bug (typewriter, French choices, typewriter-static branch all hit it). If you see a selector that says only `tw-expression` or only `tw-link`, ask whether the other form could appear in the same context.
- **`dssSpawnMotes` now accepts opts** — `{noScroll:true}` skips the `scrollIntoView`. Use whenever motes shouldn't yank the viewport.
- **Astral re-centring pass** at [Dream Street Shuffle.twee:9144] runs after the radial layout. If you change passage editor positions and the constellation looks lopsided again, that's still doing its job — the bounding-box midpoint is forced to (500, 500) on every reveal.
- **Cow-ride auto-start** is a `setTimeout` checking `phase === 'title'` at the end of the IIFE. If the title screen is ever wanted back, that's the gate.

## State of the live code

132 passages. .twee → .html sync clean. Audit found zero TODO/FIXME markers, zero broken Harlowe brackets, zero missing CSS classes, zero orphan passage references in the edits this session. Draft is shippable.

---

## Carried over from prior HANDOFFs (still relevant)

- **Cigarettes mechanic** — pattern is side-effect-on-document-body visual driven by stat-delta check in header. Still working as designed.
- **Carthage 3D-shore melody layer** — `carthage-shore` tag, registered ambient bed, working.
- **`Failure: Trisha's`** is NOT orphan — referenced by JS. Don't prune.
- **`window.Harlowe.API_ACCESS` is unreliable** — use stat-delta check in header for triggering visuals from `(set:)` + `(go-to:)` flows.
- **Harlowe doesn't evaluate macros inside `<script>` tags** — use the span-then-read pattern (write to hidden span, read `textContent` from JS).
- **Side-of-screen visuals on `document.body`** persist across passage navigation in Harlowe.

## Open / parked

- **Three Pillars (Mercy/Severity/Mildness)** — banked.
- **Astral-map screenshots** — banked.
- **Cigarette popup function** (`window.showCigarettePopup`) — dead code, debug paths only. Pruneable.
- **Title-screen BEGIN** — kept as is.
- **Flower retakeable at The French** — was flagged in previous HANDOFF; no playtester report yet to confirm.

---

**Next session:** wait for playtester feedback. The draft is in a stable state.
