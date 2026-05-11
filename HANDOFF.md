# HANDOFF — 2026-05-11

Long session. Dr Quill went from "play through and tell me what's broken" all the way to "I'm sending this to a playtester" — went through stat tuning, the parked-music wiring, big new content (the waltzing minigame), and a polish-everything pass on the late game. Audit at end was clean.

---

## What shipped

### NEW: Cecil Court Waltz minigame
A guitar-hero-style waltz between Watkins and O'Flatterly's. Player walks up the street, marks chalked on the pavement scroll toward them, hit on the beat.

- **Music: `the-cecil-court-waltz.m4a`** — 90 BPM, 3/4 time, 32 seconds, 16 bars. Composed by Dr Quill.
- **Structure**: 2 bars intro + 1 bar count-in (visual `3/2/1`) + 12 bars dance + 1 bar outro with a single final RIGHT-step echo on the downbeat.
- **Dance pattern**: 6 bars LDR (natural turn), 2 bars RDL (variation), 4 bars LDR, then the final echoed RIGHT on bar 16 beat 1.
- **Visual**: street viewed in perspective (vanishing point at top centre), cobblestones scrolling DOWN at the same `PIXELS_PER_MS` as the marks — world is fixed, camera moves up the street. Six small coloured pools of light scroll past (red, green, blue, violet, warm-red, teal — the bigger teal at 23s leads into the destination amber). Destination amber blooms in over the last 8s and the cobblestones decelerate via a cubic ease-out so by the end you're standing still inside O'Flatterly's amber.
- **Feedback**: gold ripple ring + 10-spark burst on hit. Per-lane procedural triangle-wave ding — F major triad (LEFT F5, DOWN A5, RIGHT C6) so a clean LDR bar reads as an arpeggio over the music.
- **Lives at** [Dream Street Shuffle.twee:27620–28006](Dream Street Shuffle.twee:27620), CSS at [37725](Dream Street Shuffle.twee:37725).

### Music wired in
- **`the-cecil-court-waltz.m4a`** — for the waltz (above).
- **`the-interval-radio.m4a`** — new ambient bed at volume 0.28, tag `interval-radio`. The Interval passage retagged from `[piano-bed]` to `[interval-radio]` so the piano-eoin track stays reserved for the Centre Point → Dawn arc. Registered in `dssAudio` [Dream Street Shuffle.twee:1525–1538](Dream Street Shuffle.twee:1525).
- **`the-pongmini-loop.m4a`** — fresh version, same filename, drop-in.

### Stats overhaul
- **Floating delta indicator**: every passage change with a stat shift floats a `+N` (gold) or `−N` (red) up from the top-right of the relevant bar and fades over ~2.4s. So every cost/reward is legible. [header passage](Dream Street Shuffle.twee:32463), CSS at [33759](Dream Street Shuffle.twee:33759).
- **Dean Street passive drain** (per-visit): −2/−1, −3/−2, −5/−3 (morale/sobriety) at visit-counts 2-3, 4-5, 6+. Originally morale-only −2/−3/−4; my first pass overshot to −5/−4 through −11/−9 (too punishing); current is the moderated version.
- **Liver = lifeline**: bumped +22/+18 → **+40/+40**. Notebook button is now a native Harlowe link (was unreliable `Engine.go` from JS, which never fired cleanly after the dialog teardown). "Inspect" button removed; "Eat it" is the only action. Eagle popup fires + auto-returns to Dean Street on close.
- **Retching**: regular retch +22 sobriety / +12 morale (was +12 / 0). Crashed-after-dual-ring retch unchanged at +32/+22.
- **Pentacle reveal** (5th lily): +12 morale, +8 sobriety + atmospheric text block + the wheel reveal.

### Game difficulty pass
Dr Quill said "harder than now but not so hard that perfect score is automatic". Cow was already fine — only nudged.

- **Fight counter chance**: `0.45 + sob/285` → `0.22 + sob/340`. At full sobriety: 80% → 51%. Perfect score (3 counters): 51% → 14%.
- **Pong AI**:
  - Jack Curtis: 100ms→75ms react, 3.2→4.4 paddle speed, ±20→±12 noise
  - Percy Ritson: 50ms→35ms react, 5→6.2 paddle speed, 15%→30% accurate-prediction roll
- **Bar (Ronnie's)**: pour tolerance perfect 0.05→0.04, close 0.12→0.10 (eased back from a tighter pass after Dr Quill said Ronnie's stood out as too hard); carry scrollSpeed 180→200.
- **Cow ride**: speed curve `[1.4, 1.9, 2.5, 3.3, 4.4, 5.8, 7.4, 9.4]` (was `[1.3, 1.7, 2.2, 2.9, 3.8, 5.0, 6.5, 8.5]`). ~10% across.

### Pillars flow rework (significant)
Several iterative passes ending in this clean shape:

- **Phone call exit** is now `[[Hang up|Entering The Pillars of Hercules]]` (was direct-to-critic). Player gets to come back to the pub.
- **Entering The Pillars of Hercules** ladder: if no phone call yet → ringing prompt; if phone done but lily not taken → italic "*There is a flower at the threshold. Take it before anything else.*" + back-to-Dean (no critic option); if lily taken but critic not met → critic option appears; if both done → "Your business here is finished."
- **Dean Street → Pillars** ladder now five states:
  1. Phone done, critic not met → "The Pillars — there was someone you wanted to talk to"
  2. First time, critic not met → "To The Pillars of Hercules"
  3. **Critic + lily + page-quest known** (no Carthage done) → **"Walk west — beyond the gates"** → Maritime → Carthage path
  4. Critic met, lily not taken → "Back to The Pillars — there was a flower you missed"
  5. **Critic + lily both done, no page quest yet** → greyed `[DONE FOR TONIGHT]`
- **Critic's monologue** now drops the "And if you see Copper, tell him I said hello" line if `$metSalvu is true` (you've already done the Copper loop), and the PASSWORD LEARNED item doesn't appear in the notebook in that case either. [Dream Street Shuffle.twee:32189](Dream Street Shuffle.twee:32189).

### Davy / Copper plumbing fix
Pre-existing latent bug: `$knowsCopperSecret` is set both by Davy AND by St. John's Word (after a fight loss). If you went the fight route first, you had the password but the Davy link was hidden everywhere. Fix:

- New variable **`$metDavy`** initialised in StoryInit, set to true at top of Davy Merkin passage.
- Both Davy-link sites (Colony Room main menu, Colony drink passage) now gate on `$metDavy is false` instead of `$knowsCopperSecret is false`.
- New direct **"Sit with the man at the bar"** link on Colony Room main (was previously hidden behind Get-a-drink → drink-choice).

### Lackland's three-state gate
Used to stay open indefinitely once unlocked. Now:
- Pre-password: greyed `[NEED A WORD]`
- Active: "Go to Lackland's Office" — when password known AND `$hasTrishaMatchbook is false`
- Post-content: greyed `[DONE FOR TONIGHT]` — once `$hasTrishaMatchbook is true` (i.e. back room done)

### Dawn redesign
- **Cooler palette**: pre-dawn slate (`#161a26`) → cool mauve → dusty rose → faint warm hint at horizon (`#cea8a0`). Old `#d69068` over-orange gone.
- **Two new SVG decorations** as Display passages:
  - **`Dawn Rule SVG top`** — horizon line + 3-arc rising sun + faint sun-rays + lily-of-the-valley flourishes on both ends.
  - **`Dawn Rule SVG bottom`** — quieter petal-strand echo above the colophon.
- **End-state summary box** (at 12s): "HAUNTS · N of 12" / "FLOWERS · N of 5".
- **"Play again" button** (at 30s) — clears the auto-save in localStorage filtered to the story IFID and reloads.
- **Wheel gate** simplified: now just `$haunts's length >= 12` (no alba requirement). To make the haunt path independent of alba, THE CROWN haunt moved from `Alba Complete` to **`The Fetch`**, and only auto-awards if `$haunts's length >= 11` (so the player has genuinely gathered the other eleven). Wheel only fires if you've actually completed the haunt thread.

### Carthage shore
- **Page icon** on the pyre-approach link: `○` if known but not grabbed, `●` if grabbed.
- **`$visitedPyre`** tracks first visit to Dido (set at the top of that passage). On return, "Approach the pyre" link becomes **"Back to the pyre"** — same destination, different framing.
- **Dido passage reordered**: page rescue → Try Green Sea → exits → **"Sub umbras: watch her burn"** (the commit) last. The commit lands as the climactic choice.

### Word-to-the-Wise popups — ALL THREE of them
There were three popup functions sharing the "A WORD TO THE WISE" header that I'd been fixing piecemeal:
- `wordToTheWisePopup` — was the only one I'd touched. Fade made uniform, 3.5s autodismiss.
- `venueHintPopup` — the "if a venue is still open" hint. Had **no autodismiss and no fade animation at all**. Now matches.
- `moraleWarningPopup` — dead code, never called, same bugs. Fixed for future-proofing.

All three now: start at opacity 0 → fade in 0.55s → sit ~2.4s → fade out 0.55s. Inner box uses `.wtw-no-enter` to disable its per-element `vhEnter` animation so the cadence is driven entirely by the overlay opacity.

Stat-low popup logic also tightened:
- Popups only fire if their recommended action is still available
- Text adapts to what's offered (e.g. "Get some grub at the chippy" only if chippy still open)
- "Should have gone to the gents earlier" — restored after I'd over-rewritten it; the gents/doorway pissing connection is the intent

### Visual polish
- **Critic's book widget**: page-fronts now have SVG word-marks (broken dashes in varying widths, two distinct patterns for left/right page) — actually reads as words.
- **Wine stain on typewriter pages**: restored CSS wine ring on all `.typewriter-page::after`; **Night Ahead** and **Night Ahead Part Two** now carry a `[night-ahead]` tag and `tw-story[tags~="night-ahead"]` suppresses the small CSS ring so they only show their inline-SVG big ring (no duplication).
- **Motes**: collected-thing motes now spawn from the **centre** of the haunt/item/page box (was the top-right corner offset, which read as haphazard).
- **Lily-glimpse typewriter**: lily-glimpse spans now type out character-by-character. Initial version flattened `textContent` which destroyed the Sonnet 66 verse formatting in the Lily phone call; current version walks the DOM tree and types text nodes in order, leaving `<i>`/`<br>` structure intact.
- **Plus Ultra timing**: pushed from 10s → 14s on White/Black page, so it lands as the SVG bells finish blooming rather than mid-bloom.
- **Green thought**: text now actually rendered in green (with extra green on the word "green" itself).
- **French intro prose** dimmed on return visits via `|frenchIntro>` hook + `(enchant: ?frenchIntro, ...)` — same pattern as Dean Street's `|deanIntro>`. So the intro text is kept (full first visit, dimmed thereafter) and the "A man cannot step into the same pub twice…" / "There is always a third." beats layer on top.
- **Doorway music continuity**: Dean Street Doorway tagged `[outdoor hub]` so music stays running on the bounce (was tagged `[outdoor]` alone, which stopped + restarted the music every doorway use).
- **Back-one button** in header: native Harlowe `(link-undo:)`, hidden on Title / cutscenes / minigames / phone calls.
- **Save-state link on Title** belt-and-braces: a JS check on `localStorage` keys (filtered to the story IFID) before showing, in addition to the Harlowe `(savedgames:)` check.

### Race condition pattern (note for future inline scripts)
Several inline `<script>` blocks in passage bodies were silently failing because Harlowe runs them synchronously during render, BEFORE the MutationObserver microtask increments `_passageGen` for the new passage. So `var pgGen = window._passageGen` captures the stale value, the MO bumps it, and any `if (window._passageGen !== pgGen) return` guard then aborts.

The fix pattern (same as `showDrinkPopupSafe` in `dssAudio`):
```javascript
(function(){
  setTimeout(function(){
    var pgGen = window._passageGen;     // captured AFTER MO has fired
    setTimeout(function(){
      if (window._passageGen !== pgGen) return;
      // ... payload
    }, MS);
  }, 0);
})();
```

Applied this session to: the Dawn wheel reveal, the dual-ring 2nd heartbeat + bell, the Cecil Court Waltz frame loop. Watch for it whenever an inline `<script>` snapshots `_passageGen` synchronously.

---

## Memories saved (none today)

Today's session was largely tactical — didn't surface anything that wasn't already covered in the existing memory files.

---

## Open / parked

Empty. PP music was the last parked item from the prior handoff and Dr Quill shipped his composition this session. All four parked items resolved or punted.

---

## Possible next threads (for the playtester)

- **The Trisha's gate** stays narrow by design: needs matchbook (from Lackland → PP victory vs Jack) AND liver (from O'Flatterly → page returned), then closes permanently on meeting Shana. Dr Quill said the small window was OK for now — flag if the playtester misses it entirely.
- The **`$haunt5` indicator** on the Dean Street Pillars row is a pre-existing visual oddity: it shows the PP haunt ("The Game") in the Pillars row rather than the actual Pillars haunt ("THE REFUSAL" = `$haunt2`). Not touched. Worth a future audit but it's just an icon, not a gameplay bug.
- **Lackland front-office prose** opens with "You were sent here by Jeffrey?" — assumes the Davy referral. Dr Quill considered making Lackland reachable earlier (and we built it, then reverted). The line stays narratively-grounded as long as Davy comes first, which is the default ordering. Flag only if a playtest path reaches Lackland cold.

---

## Files of note

- `Dream Street Shuffle.twee` — **130 passages** (was 128 at session start: +1 `Cecil Court Waltz`, +2 `Dawn Rule SVG top/bottom`, −1 reverted Lackland passage that was never added). Sources of truth.
- `Dream Street Shuffle.html` — synced via `python3 sync_html.py`. ~44 MB with all audio embedded as base64.
- `sync_html.py` — added two new `AUDIO_EMBEDS` entries: `__DSS_WALTZ_DATA_URI__` and `__DSS_INTERVAL_RADIO_DATA_URI__`.

---

## Audit at end of session

- 0 broken `[[link|target]]` references
- 0 unattached `(if:)/(unless:)/(else-if:)/(else:)` changers (3 false positives in JS comments)
- 0 variables referenced but never set
- All recently-added passages present
- All apostrophe-target links resolve
- All audio files present in folder + embedded
- `sync_html.py` produces no warnings

Clean. Ready for playtest.
