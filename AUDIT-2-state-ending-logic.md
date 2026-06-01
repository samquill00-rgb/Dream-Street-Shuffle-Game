# AUDIT 2 — Game-State & Ending-Logic Correctness + Save Compatibility

**Scope:** static, read-only audit of `Dream Street Shuffle.twee` (46,298 lines, 135 passages). No game files were edited; `sync_html.py` was not run; no git.

## Executive summary

The state machine is in good health. I inventoried **105 distinct `(set:)` variables** (109 distinct `$`-references; the 4 extras — `$hauntN`, `$seenLore`, `$stat`, `$tookLilyN` — are all inside source comments, not real variables). Every variable is initialised in `StoryInit`, and the `header` passage runs a per-passage back-fill/heal pass plus stat re-clamp on every navigation.

**Findings by severity:** 0 Critical, 0 High, 4 Medium, 6 Low. The Medium items are all *dead state* (variables set but never read) — harmless to players today, but they mislead future editing and one (`$ppScore`/`$oppScore`) signals that the Pong score never round-trips into Harlowe state. **Ending reachability is sound: every reachable game state routes to an ending.** Alba-complete logic is computed identically in all four places it appears. Stat clamps are consistent everywhere. The Tarot biasing matches its comments exactly.

---

## Dead / uninitialised state

**[S1] Medium — `$ppScore` / `$oppScore` are dead; Pong score lives only in JS locals**
Location: set at StoryInit (105–106), `Start` reset (36755–36756), and the two challenge links (38109–38110). The PP Pong game (`:: PP Pong`, 32542+) tracks score in **JavaScript locals** `playerScore`/`oppScore` (declared 32578) and routes win/loss by clicking hidden `#pp-go-win` / `#pp-go-lose` Harlowe links (`endGame()`, 32738+). The Harlowe `$ppScore`/`$oppScore` are written to 0 and **never read anywhere**.
Consequence: none for players (the game works via JS), but the Harlowe vars are misleading dead state and the score is invisible to any save/Tarot logic. By contrast `$opponent` *is* used: it is injected into JS via `<span id="pp-data-opponent">(print: $opponent)</span>` (32543) and read in `Fight`/matchbook branches.
Recommendation: delete `$ppScore`/`$oppScore` (StoryInit, Start, both challenge links), or — if you ever want the win to matter to the Tarot/notebook — write the JS result back into a Harlowe var in `endGame()`. Keep `$opponent`.
Confidence: Confirmed.

**[S2] Medium — `$albaRevealed` set but never read**
Location: StoryInit (11), `Start` reset (36673), set true in `LINE 1` (34719) and `DBG Complete` (38138). No read site exists.
Consequence: pure dead state. The ALBA strip in the header derives its display from `$alba contains $alba1…` (38244–38245), not from this flag.
Recommendation: remove all four sets.
Confidence: Confirmed.

**[S3] Medium — `$cowRideWon` set but never read**
Location: StoryInit (60), set true on the cow-ride win (36570) and `DBG Complete` (38154), reset in `Start` (36710). No read site. Note: the *sibling* flag `$cowRideDone` **is** read (header notebook map, 38280) — so only the "won" outcome is dead, the "done" outcome is live.
Consequence: winning vs merely completing the cow ride has no downstream effect. If that's intended (the ride is flavour), the var is just dead; if a win was *meant* to matter, this is a missing hook.
Recommendation: remove `$cowRideWon`, or wire it into the Tarot/notebook if a win should be rewarded. Verify intent with Dr Quill before deleting (it may be a planned hook).
Confidence: Confirmed (dead); intent Suspected.

**[S4] Medium — `$drankAtFrench` set but never read**
Location: StoryInit (54), reset in `Start` (36704), set true by all three French drink links (38115–38117). No read site. (The companion flags `$lastDrink` and `$justDranked` *are* read — drink popup + stat-delta logic — so only `$drankAtFrench` is dead.)
Consequence: dead state; "has the player ever drunk at the French" is tracked but never consulted.
Recommendation: remove, unless a future branch needs it.
Confidence: Confirmed.

**[S5] Low — `$sawMemory2` set but its display is never gated by it (vestigial one-shot)**
Location: set true in `LINE 2 Oxford` (34757); the memory-photo-2 block (34758–34759) renders **unconditionally**, with no `(if: $sawMemory2 is false)[…]` wrapper. Contrast `$sawMemory1` (37896) and `$sawMemory3` (36979), which both correctly gate their photo behind their flag.
Consequence: the flag is dead, and the memory re-shows on every visit to `LINE 2 Oxford` rather than once. Low impact because that passage sits in a linear, one-shot dream sequence reached by a `(link:)` and is not normally re-entered.
Recommendation: either wrap the memory-2 block in `(if: $sawMemory2 is false)[(set: $sawMemory2 to true)…]` to match memory 1/3, or delete the flag if the repeat is acceptable.
Confidence: Confirmed.

**Note (not a finding):** `$visitedInterval` and `$wasBeaten` were flagged as low-read by the count, but both are live — `$visitedInterval` gates the interval-skip `(go-to: "Dean Street")` (36964) and `$wasBeaten` adds the "Death" card to the Tarot pool (34502). The prior session's audit correctly kept both.

---

## Ending reachability & consistency

**Checked and sound — every state reaches an ending.** Routing traced in full:

- **Win path:** Dean Street shows `[[The dawn is coming|The Fetch]]` whenever `_towerReady` (all three alba lines collected) — 34170. The Fetch → `Approach Centre Point` (32519). There, `(if: ($alba contains $alba1) and …$alba2 and …$alba3)` routes to **Alba Complete** (32542), → `Dawn Approach White` → `White page` → ("PLUS. ULTRA.") → **Dawn**.
- **Incomplete / sleep path:** `Approach Centre Point` else-branch → **Alba Incomplete** → `Dawn Approach Black` → `Black page` → **Dawn**.
- **Give-up exits:** `[[Give up on the night|No more]]` appears when `$confidence <= 5` (34219); `No more` → `Black page` → Dawn (34971).
- **Forced "coach-urgent" ending:** when `$coachUrgent` is true and `_towerReady` is false, Dean Street offers only `[[The Coach and Horses|Approach The Coach]]` (34171–34173). `Approach The Coach` → `Coach and Horses lock` (which clears `$coachUrgent`, 33705) → `[[Give up. Sleep here.|Alba Incomplete]]` (33815-area) → Dawn. Reachable.

**[S6] Medium-consistency — `_albaComplete` is computed identically in all four locations.** Verified the boolean is the same everywhere:
- `Approach Centre Point` (32542): `($alba contains $alba1) and (…$alba2) and (…$alba3)` — routes Complete/Incomplete.
- Dean Street `_towerReady` (34145): same expression — gates the win link.
- `Dawn` `_albaComplete` (34035): same — gates the alba-line display + the "Dawn Rule top vs eclipse" SVG.
- `Shana Reads` `_albaCount` (34470) and header `_ac` (38245): count form, with `_albaCount >= 3` ⇔ all three. The Tarot's `(if: _albaCount >= 3)` (34511) agrees with the boolean form.
No contradiction found. Confidence: Confirmed.

**Underlying-data check:** `$alba1/2/3` are set to fixed strings at StoryInit (16–18) and at every reset (`Start` 36679–36681; `DBG Complete` 38137 builds the array directly). The array is populated with `(a: $albaN)` using the *same* live values (34718, 34745, 34769). `LINE 3` re-sets `$alba3` to its identical literal immediately before adding it (34764) — redundant but harmless. So `$alba contains $albaN` is always a like-for-like comparison. Confidence: Confirmed.

---

## Tarot logic

**Checked and sound.** `:: Shana Reads` (34468+). The three weighted pools match their comments exactly:
- **Card 2 (where you are):** `$sobriety < 30` → adds 5× **The Devil**; `$confidence < 30` → 5× **The Tower**; `$wasBeaten` → 4× **Death** (34500–34502). Matches the spec ("low sob→Devil, low conf→Tower, beaten→Death").
- **Card 3 (what awaits):** `_albaCount >= 3` → 6× The Star; `$haunts's length >= 12` → 5× The Sun; `>= 9` → 4× Judgement; etc.
- **Dedup (34522–34523):** runs Card 2 first (`_c2 is _c1` → fall back to Wheel of Fortune), then Card 3 (`_c3 is _c1 or _c3 is _c2` → fall back to Strength). Order is correct: because the C3 check runs *after* C2 may have been rewritten to Wheel, a C3==Wheel collision is still caught. Fallbacks are safe — Strength only ever lives in the C3 pool, and Wheel is the C2 base, so neither fallback can re-collide. Confidence: Confirmed.

No stat is read by the *endings* themselves — only by the Tarot draw and NPC reactions, as the design notes state. Confirmed.

---

## Gating-condition bugs

**[S7] Low / Suspected — Dean Street has no branch for `$metRed is false AND $coachUrgent is true`**
Location: 34166 shows the Ginger-Light intro link only when `$metRed is false AND $coachUrgent is false`; 34169 opens the main venue block only when `$metRed is true`. If a player had `$metRed = false` while `$coachUrgent = true`, **no** forward link would render on Dean Street (a soft dead-end).
Why it's only Suspected/Low: `$coachUrgent` is set true only at 34143, which requires `$sobriety <= 0 AND $haunts's length >= 10`. Reaching 10 haunts requires deep exploration that is gated behind meeting Red at the Ginger Light, so `$metRed` is effectively always true by the time 10 haunts are possible. I could not construct a real playthrough that reaches the bad state, hence Suspected.
Recommendation: add a defensive `(if: $coachUrgent is true and $metRed is false)[[[The Coach and Horses|Approach The Coach]]]` fallback, or assert `$metRed` is set true wherever haunts can pass 9.
Confidence: Suspected.

**Checked and OK — the word-to-the-wise `(else-if:)` chain (34177–34184)** does not shadow incorrectly. It is a single `(if:)/(else-if:)` chain keyed on descending stat thresholds (`conf<30 & sob<30` → `conf<40` → `sob<40`) with `$returns >= 3` and `$had*` guards. A player who is low on both stats but has already eaten/rested simply gets no nudge — intended, not a bug; other venue links remain available.

**Checked and OK — venue-link `(else-if:)` ladders (34185–34217)** for French/Pillars/Colony/Ronnie's/Cecil/Trisha's: each ladder's earlier conditions are strictly narrower or mutually exclusive with later ones (`not (haunt set)` vs `(haunt set) and …`), so no else-if is dead. Spot-traced the French and Pillars ladders end-to-end.

**Checked and OK — haunt-count thresholds.** Header background tiers use `>= 12 / >= 9 / >= 6 / >= 3` in descending `(if:)/(else-if:)` order (38220–38223) — correct, no overlap. The "OPUS" stat-bar state triggers at `>= 12` consistently (38232, 38237). `$haunts` can hold at most 12 (`$haunt1..12`), and the 12th ("The Crown") is added at The Fetch gated on `length >= 11 and not contains $haunt12` (34009) — correct off-by-one (you need 11 others, then Crown makes 12).

---

## Save compatibility

**Checked and largely sound.** The `header` passage (38203+) heals on **every** passage: `$knowsCecilCourt`, `$alba` (array), `$haunts` (array), `$haunt1..12` (string-check → full re-seed if StoryInit never ran), `$confidence`/`$sobriety` (with `is a number` guards + re-clamp 0..100), and `$prevCigsTonight`. `(savegame: "auto")` is taken here when `$returns >= 1` and not on an excluded passage (38209–38210). The lazy-key pattern for the datamap (`(unless: $visited contains "Trishas")[(set: …)]`, `…"FrenchVisits"…`) is robust — keys are always guarded with `contains` before access (38043–38044, 36922–36926, 38276).

**[S8] Low — header reads `$alba contains $alba1` without healing `$alba1/2/3`**
Location: header alba strip (38244–38245) and hint (38247) read `$alba1/2/3`; these are only guaranteed by StoryInit (16–18). There is no `(unless: $alba1 is a string)` back-fill anywhere.
Consequence: a save predating the *original* StoryInit (i.e. before the very first build) would compare `$alba contains 0`, mis-rendering the ALBA jewels/count. In practice the alba lines have been in StoryInit since line 16 from the start, so only an implausibly ancient save is affected.
Recommendation: add `(unless: $alba1 is a string)[(set: $alba1 to "As cool as the pale wet leaves")(set: $alba2 to "of lily-of-the-valley")(set: $alba3 to "She lay beside me in the dawn.")]` to the header heal block, alongside the existing `$haunt1` heal.
Confidence: Suspected (low real-world exposure).

**[S9] Low — Dean Street's own `$visited's French` reads assume the 4 base keys exist**
Location: Dean Street venue block reads `$visited's French/Colony/Ronnies` (34158, 34176, 34188–34196) after the local heal at 34121, which only re-creates `$visited` if it is *not a datamap*. If a save held a datamap that was somehow missing the "French" key, those bare accessors would error.
Consequence: practically unreachable — StoryInit always creates all four keys (French/Pillars/Colony/Ronnies) and nothing deletes them; the venue passages themselves use `(unless: $visited contains …)` guards. Flagging only for completeness.
Recommendation: optionally mirror the venue passages' `contains`-guard pattern in the Dean Street block, or trust StoryInit. No action likely needed.
Confidence: Suspected (low).

**[S10] Low — heal block omits many newer flags, relying on Harlowe's truthiness of unset vars**
Location: dozens of boolean flags (`$cowRideDone`, `$completedSetlist`, `$knowsRonnies`, `$metShana`, `$visitedCarthage`, `$visitedPyre`, the `$sawMemory*`, `$tookLily*`, etc.) are *not* individually back-filled in the header; only a curated subset is (Dean Street 34104–34114; header 38207). For a save made before such a flag existed, `(if: $unsetFlag is true)` is simply false — which is the correct/safe default for every one of these "have I done X yet" flags, so unset == not-done == correct.
Consequence: none observed — the back-fill is *complete enough* precisely because the un-healed flags all default-false-is-safe. The only risk would be a flag whose unset state should mean *true*; I found none.
Recommendation: no change required. Documenting that the heal logic is deliberately partial and safe.
Confidence: Confirmed (assessed complete).

---

## Stat clamps

**Checked and sound.** All `$confidence`/`$sobriety` mutations either go through the clamping macros `$statGain`/`$statLoss` (defined 121–122 with internal `(min: 100, …)` / `(max: 0, …)` + `(round:)`) — 58/66 confidence sets and 36/45 sobriety sets — or are explicit literal sets / deliberate clamps. I grep-verified there is **no raw unclamped arithmetic** (`$confidence to $confidence + N`) anywhere. The non-macro sets are all intentional: fixed init (70), narrative ceilings (`if $sobriety > 8 set to 8`, 37960–37961), the pentacle bonus via macros, debug-only `to 90` (38172–38173, in the debug-jump-only `DBG Complete`), and the floor rule `$sobriety <= 0 → 5` (34143). The header re-clamps both stats to 0..100 on every passage (38212) with `is a number` guards. The JS-side `window.dssStatGain/Loss` (131–137) mirror the same `/50` curve and clamps. Confidence: Confirmed.

---

## Checked and OK (summary)

- Variable inventory: 105 set-vars, all initialised in StoryInit; the 4 apparent "read-but-never-set" names are comment text only.
- Ending reachability: win / sleep / give-up / coach-urgent paths all terminate at an ending; no orphaned dead-end state found.
- Alba-complete logic identical across Approach Centre Point, Dean Street `_towerReady`, Dawn `_albaComplete`, Shana `_albaCount`, header `_ac`.
- Tarot stat-biasing matches its comments; dedup order is correct and fallbacks cannot re-collide.
- Stat clamps consistent; no raw arithmetic; header re-clamps every passage.
- `$visited` datamap lazy keys (Trishas, FrenchVisits) always `contains`-guarded before access.
- Haunt count off-by-one (Crown at length 11→12) and background tier thresholds correct.
- `$wasBeaten`, `$visitedInterval`, `$cowRideDone`, `$opponent` confirmed *live* (don't delete).
- DBG passages (`DBG Complete`, `DBG Matchbook`) reachable only via the JS debug panel — not normal play.

---

## Top 3 to fix first

1. **[S1]** Remove dead `$ppScore` / `$oppScore` (or write the Pong result back into Harlowe state if a win should matter) — the only finding that hints at a missing design hook rather than pure cruft.
2. **[S3]** Confirm intent on `$cowRideWon`, then either delete it or wire the win into the Tarot/notebook — it's the dead flag most likely to be a forgotten reward hook.
3. **[S5]** Gate the memory-photo-2 block behind `$sawMemory2` to match memory 1/3 (or delete the flag) — the one place where set-state and display are out of step.

(Lower-effort cleanup: delete `$albaRevealed` and `$drankAtFrench` [S2/S4]. Defensive hardening: add the `$metRed`/`$coachUrgent` fallback [S7] and the `$alba1` heal [S8].)
