# HANDOFF — 2026-05-11 (session 2)

Long session. Started with playthrough notes from Dr Quill, escalated into a full game audit (twice — first audit missed JS-side wiring; second pass corrected and went deeper), then worked through every actionable item.

## What shipped this session

### Playthrough fixes (early)
- **Lily ring spacing**: added `$phoneCallReturnsAt`, gated all 5 venue Lily-1 rings with `($returns - $phoneCallReturnsAt) >= 1`. No more Aoife→Lily back-to-back.
- **Pillars critic option after Aoife**: dropped the lily-not-taken "back to Dean Street" branch from "Entering The Pillars of Hercules". Critic option now appears immediately after the Aoife call. Flower hint and Dean Street recovery still cover the lily-skipped case.
- **Donkey coin's Carthage uses removed**: stripped the Toss-the-Donkey flip widget from Carthage shore + the `or $hasCoin is true` Green Sea bypass on three gates. Coin's sole remaining utility is the Colony Door hex (first-time-always-Left).
- **Lily-glimpse fade restored (was typewriter)**: removed the LILY-GLIMPSE TYPEWRITER JS block. CSS `lilyFadeIn` 2.5s animation does the reveal. Lily chime (`dssAudio.lilyChime`) still fires on click — was always wired, just masked by the removed typewriter ticks.
- **Name Your Book page height**: bumped `.book-naming-tw` min-height 380px → 480px to match The Night Ahead. Title input stays at top.
- **Outdoor traffic ambience on Soho transitions**: tagged `[outdoor]` onto five interlude passages (After the call, After the painter, After Cecil Court, After the music, Dream to Dean). They now run the brown-noise + car-horn + sparse-drip bed, same as the Red loop.
- **Dawn Rule SVG top redrawn**: replaced the half-sun with Ripley's Wheel-style Sol — 9 long tapered ray wedges + 3 short rays at 12/4/8 o'clock (the equilateral fire-sigil hidden in Sol), concentric inner rings, central dot, soft halo. Warm dawn palette (`#ecceae` / `#f4d4b0`) instead of the wheel's gold. ViewBox 70 → 110 to fit full sun above horizon. Lily flourishes and horizon line preserved.

### Audit — pass 1, pass 2 (corrections), then fixes

The first audit missed a lot of JS-side wiring (notebook builder reading flags via `(if:)` in Build Notebook, plus localStorage for napkin drawing). Second pass caught:
- `$hasDrawing` IS wired — the actual canvas drawing of Benito is saved to `localStorage['dss_napkin']` and rendered into the notebook EFFECTS tab `<img class="nb-napkin-img">`.
- `$sawMemory1/2/3` surface as a MEMORIES section in the LILLIES notebook tab.
- The Donkey is structural (Colony Door hex), not decorative.
- **The fetch-glimpse at Dean Street** (line 28599): gated on `$wasBeaten AND $visitedInterval`, shows "*You see him then: yourself, walking ahead of you down Greek Street toward Centre Point*" on every Dean Street return once both flags are set. Reward for the LOSING player. Completely missed in pass 1.

### Audit fixes applied (all six items)

1. **Lackland soft-lock** — `$hasTrishaMatchbook is true` was closing Lackland's even when the matchbook came from the Copper fight, not Lackland's PP. A Pillars-first player who took the Donkey-forced Left at Colony and won the fight with the critic's password would lose access to haunt5 (Game) and haunt9 (Sorting), making the 12-haunt Ripley's Wheel reveal unreachable. Most natural play order triggered it. **Fixed**: Dean Street row now gates on `$haunts contains $haunt5` instead. Player can re-enter Lackland's to play PP regardless of where the matchbook came from. [Dean Street](Dream Street Shuffle.twee:28651).

2. **Aoife "Hang up" double-charged Pillars sobriety** — `The phone call` didn't set `$resumingFromCall`, so the Pillars entry block re-ran on the bounce-back: -9 sob + "If you pass the Pillars' threshold…" prose, both shown twice. **Fixed**: `The phone call` now `(set: $resumingFromCall to true)` at the top. [The phone call](Dream Street Shuffle.twee:32184).

3. **Lily phone calls now mandatory** — Aoife was already forced at Pillars first-entry (its overlay is the only branch shown until you've answered). Lily Call 1 and the Dual Ring were NOT forced — the ringing div sat at the top of each venue passage, but the rest of the venue's links were still clickable below, so a deliberate player could dodge every lily call. With the calls being the emotional spine of the night, Dr Quill wanted them mandatory. **Fixed**: rewrote all five venue passages (Coach, Pillars, Ronnie's, Colony, French) with a `(if: _lilyRing) ... (else-if: _dualRing) ... (else: venue content)` chain. Decoration SVGs and venue titles stay outside the gate (always visible); the ringing phone is now the only interactive element when active. Side benefit: the Coach-unreachable soft-lock for careful + call-ignoring players is closed — the dual ring forces the crash to Coach as soon as conditions are met. The `← BACK` header link still works as an out for players who really want to walk away.

4. **The Interval was orphaned for page-quest players** — only reachable via `Dido → Sub umbras: watch her burn → Stay in Carthage → Wake suddenly → The Interval`. Players following the practical page-rescue path would never see it (or the fetch-glimpse it unlocks). Dr Quill's intent: the Interval is the reward for surrender, not for broader access — but once the page is rescued, the surrender path should become the guided/only option at Dido. **Fixed**: Dido's exits now branch on `$hasMissingPage OR $returnedPage`. Pre-rescue: standard Green Sea / shore / wake / sub umbras options. Post-rescue/return: standard exits hidden; only `[[Sub umbras: watch her burn|Stay in Carthage]]` as a `guided-link`. The Green Sea remains reachable from Carthage shore directly, so alba2-not-yet players aren't locked out. [Dido](Dream Street Shuffle.twee:28675).

5. **Coach map marker** — `_hVisited` used `$cowRideWon`, so falling off the cow didn't tick the Coach as visited on the notebook map. **Fixed**: now `$cowRideDone`. [Build Notebook](Dream Street Shuffle.twee:32543).

6. **Donkey hex history across reloads** — flagged but **intentionally skipped**. `_coinGateHistory` lives on `window` and resets on page reload, so a player reloading after first-tossing could re-trigger the "first always heads" rule. But the Colony Door auto-redirects to The Colony Room once `$visited's Colony` or `$metSalvu` is true, so the history is never actually consulted in normal play. Genuine edge case, not worth the persistence machinery.

### Polish/refinements at the end of the audit

- **Lackland prose now path-aware**: "You were sent here by Jeffrey?" was an old assumption from the Coach-route. Now branches: Davy if `$metDavy`, Jeffrey if `$cowRideDone`, fallback "You were sent here, then?". [Martin Lackland's Office](Dream Street Shuffle.twee:29288).
- **Coach Retch on resume-bounce when sobriety ≤ 15**: tight edge case where a `$coachUrgent` crash + simultaneous lily-1 ring would skip the Retch link on the bounce-back, leaving the player to ride the cow at 0 sobriety. Added a low-sob Retch link to the resume branch so they can recover. Players bouncing through Coach without actually crashing don't see the link.

---

## State variables added this session

- `$phoneCallReturnsAt` — `-999` in init, set to `$returns` in The phone call. Gates Lily 1 ring with 1-return spacing after Aoife.

## Architecture notes for future sessions

### Venue ring forcing pattern

All five "phone may ring" venues (Coach and Horses lock, Entering The Pillars of Hercules, Ronnie Scott's, The Colony Room, The French) now use this pattern:

```harlowe
:: Venue [tags]
[venue-specific entry bookkeeping like $coachUrgent setter]
(set: _lilyRing to ($lilyCount >= 1 and $hadLilyCall1 is false and $hadPhoneCall is true and ($returns - $phoneCallReturnsAt) >= 1 [and venue-visited check if applicable]))
(set: _dualRing to ($lilyCount >= 2 and $hadLilyCall1 is true and $hadDualRing is false and ($returns - $lilyCall1ReturnsAt) >= 2 [and venue-visited check if applicable]))

[SVG decoration that always renders]
[venue title]
[venue-specific bookkeeping like $afterMidnight setter]

(if: _lilyRing)[(set: $lilyCallReturn to "Venue")<div class="phone-ringing">...accept link to Lily phone call 1</div>]
(else-if: _dualRing)[(set: $lilyCallReturn to "Venue")<div class="phone-ringing">...accept link to The dual ring</div>]
(else:)[
  [all interactive venue content — lily glimpse, prose, drinks, NPC encounters, etc.]
]
```

If a new venue gets a phone-ring trigger, follow this template.

### Dido exits gate

```harlowe
(if: $knowsAboutPage is true and $hasMissingPage is false)[page-rescue prompt + link]

(if: $hasMissingPage is true or $returnedPage is true)[
  guided-link: Sub umbras → Stay in Carthage
]
(else:)[
  Green Sea / shore / wake exits + Sub umbras as standard option
]
```

### Lackland row gate

The `Go to Lackland's Office` / `DONE FOR TONIGHT` / `NEED A WORD` ladder on Dean Street now gates on `$haunts contains $haunt5` (i.e. PP played), not `$hasTrishaMatchbook`. The matchbook can come from PP Defeat vs Jack OR from Copper fight victory with the critic's password; only the haunt itself signals "Lackland's content actually played."

### Lily call architecture

- Aoife call (`The phone call`) — forced at Pillars first entry; sets `$hadPhoneCall`, `$phoneCallReturnsAt`, `$resumingFromCall`.
- Lily call 1 — forced at any of the five venues if `$lilyCount >= 1`, `$hadPhoneCall is true`, `($returns - $phoneCallReturnsAt) >= 1`, and (for non-Coach venues) the venue has been visited before. Sets `$hadLilyCall1`, `$lilyCall1ReturnsAt`, `$resumingFromCall`, `$pendingLilyBreath`.
- Dual ring — forced at any of the five venues if `$lilyCount >= 2`, `$hadLilyCall1 is true`, `$hadDualRing is false`, `($returns - $lilyCall1ReturnsAt) >= 2`, and (for non-Coach venues) the venue has been visited. Sets `$hadDualRing`, `$crashedAfterDualRing`, clamps sobriety to 8 and confidence to 18, forces `(go-to: "Coach and Horses lock")`.
- Stay in Carthage uses its own Lily 1 prompt with the "phone rings far off — across some distance the night cannot measure" framing. Already used if/else gating; no fix needed.

---

## Memories saved (none today)

Today's session was a fresh combination of bug-fixing and design audit; nothing surfaced that wasn't already in memory or wasn't session-specific.

---

## Possible next threads

- **Lackland prose pass**: now that the referral line is path-aware, the rest of the Lackland office prose ("This isn't bad. Have you got a job? A wife?…") still assumes a particular tone. Worth a re-read in light of the two paths.
- **Maritime "no present horizon" cosmetic**: when a player reaches Maritime pre-critic AND pre-beermat, both `[Yes → Approach The Pillars]` AND `//There is no present horizon.//` render together. The horizon line is meant to dim the absent Carthage option, but next to the active Pillars link it reads as contradictory. Could rephrase or hide entirely when other exits are present.
- **The fetch-glimpse at Dean Street** (gated on `$wasBeaten AND $visitedInterval`) is currently a single static prose block. Could be elaborated — perhaps the fetch's distance changes with each return, or the prose escalates as the alba completes. Worth thinking about for the late-game atmospheric layer.
- **`$pendingLilyBreath` → "After the call"** mechanism only fires for Lily call 1, not Aoife. Worth considering whether Aoife should also have a Dean-Street-bounce reflection passage. Currently the player goes from Aoife → Pillars critic (or back to Dean Street) without an interlude.

---

## Files of note

- `Dream Street Shuffle.twee` — 130 passages, unchanged count. Source of truth.
- `Dream Street Shuffle.html` — synced via `python3 sync_html.py`. NEVER READ DIRECTLY.
- `sync_html.py` — no changes this session.

---

## Audit at end of session

- Lackland row gate fixed (haunt5 instead of matchbook)
- Aoife double-charge fixed
- Five venues consistently force lily/dual rings
- Dido guided to Interval post-rescue
- Coach map marker on cowRideDone
- Lackland prose path-aware
- Coach low-sob Retch on resume-bounce

Net effect: the soft-lock paths are closed. The lily phone calls are mandatory. The Interval is reachable by players who've earned it. The Coach is reachable structurally. The Ripley's Wheel reveal is achievable on a single playthrough without trap fork choices.

Ready for playtest.
