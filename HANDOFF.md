# HANDOFF — 2026-05-11 (session 2)

Long session. Started with playthrough notes from Dr Quill, escalated into a full game audit (twice — first audit missed JS-side wiring; second pass corrected and went deeper), then worked methodically through every actionable item.

## Playthrough fixes (early in the session)

- **Lily ring spacing**: added `$phoneCallReturnsAt`, gated all 5 venue Lily-1 rings with `($returns - $phoneCallReturnsAt) >= 1`. No more Aoife→Lily back-to-back.
- **Pillars critic option after Aoife**: dropped the lily-not-taken "back to Dean Street" branch from "Entering The Pillars of Hercules". Critic option now appears immediately after the Aoife call. Flower hint and Dean Street recovery still cover the lily-skipped case.
- **Donkey coin's Carthage uses removed**: stripped the Toss-the-Donkey flip widget from Carthage shore + the `or $hasCoin is true` Green Sea bypass on three gates. Coin's sole remaining utility is the Colony Door hex (first-time-always-Left).
- **Lily-glimpse fade restored (was typewriter)**: removed the LILY-GLIMPSE TYPEWRITER JS block. CSS `lilyFadeIn` 2.5s animation does the reveal. Lily chime (`dssAudio.lilyChime`) still fires on click — was always wired, just masked by the removed typewriter ticks.
- **Name Your Book page height**: bumped `.book-naming-tw` min-height 380px → 480px to match The Night Ahead. Title input stays at top.
- **Outdoor traffic ambience on Soho transitions**: tagged `[outdoor]` onto five interlude passages (After the call, After the painter, After Cecil Court, After the music, Dream to Dean). They now run the brown-noise + car-horn + sparse-drip bed, same as the Red loop.
- **Dawn Rule SVG top redrawn**: replaced the half-sun with Ripley's Wheel-style Sol — 9 long tapered ray wedges + 3 short rays at 12/4/8 o'clock (the equilateral fire-sigil hidden in Sol), concentric inner rings, central dot, soft halo. Warm dawn palette (`#ecceae` / `#f4d4b0`) instead of the wheel's gold. ViewBox 70 → 110 to fit full sun above horizon. Lily flourishes and horizon line preserved.

## Audit — pass 1, pass 2 (corrections), then fixes

The first audit missed a lot of JS-side wiring (notebook builder reading flags via `(if:)` in Build Notebook, plus localStorage for napkin drawing). Second pass caught:
- `$hasDrawing` IS wired — the actual canvas drawing of Benito is saved to `localStorage['dss_napkin']` and rendered into the notebook EFFECTS tab `<img class="nb-napkin-img">`.
- `$sawMemory1/2/3` surface as a MEMORIES section in the LILLIES notebook tab.
- The Donkey is structural (Colony Door hex), not decorative.
- **The fetch-glimpse at Dean Street** (line 28599): gated on `$wasBeaten AND $visitedInterval`, shows a haunting doppelganger prose block on every Dean Street return once both flags are set. Reward for the LOSING player. Completely missed in pass 1.

### Audit fixes applied (all six items, including the one intentionally skipped)

1. **Lackland soft-lock** — `$hasTrishaMatchbook is true` was closing Lackland's even when the matchbook came from the Copper fight, not Lackland's PP. A Pillars-first player who took the Donkey-forced Left at Colony and won the fight with the critic's password would lose access to haunt5 (Game) and haunt9 (Sorting), making the 12-haunt Ripley's Wheel reveal unreachable. Most natural play order triggered it. **Fixed**: Dean Street row now gates on `$haunts contains $haunt5` instead. Player can re-enter Lackland's to play PP regardless of where the matchbook came from. [Dean Street](Dream Street Shuffle.twee:28651).

2. **Aoife "Hang up" double-charged Pillars sobriety** — `The phone call` didn't set `$resumingFromCall`, so the Pillars entry block re-ran on the bounce-back: -9 sob + "If you pass the Pillars' threshold…" prose, both shown twice. **Fixed**: `The phone call` now `(set: $resumingFromCall to true)` at the top. [The phone call](Dream Street Shuffle.twee:32184).

3. **Lily phone calls now mandatory** — Aoife was already forced at Pillars first-entry (its overlay is the only branch shown until you've answered). Lily Call 1 and the Dual Ring were NOT forced — the ringing div sat at the top of each venue passage, but the rest of the venue's links were still clickable below, so a deliberate player could dodge every lily call. With the calls being the emotional spine of the night, Dr Quill wanted them mandatory. **Fixed**: rewrote all five venue passages (Coach, Pillars, Ronnie's, Colony, French) with a `(if: _lilyRing) ... (else-if: _dualRing) ... (else: venue content)` chain. Decoration SVGs and venue titles stay outside the gate (always visible); the ringing phone is now the only interactive element when active. Side benefit: the Coach-unreachable soft-lock for careful + call-ignoring players is closed — the dual ring forces the crash to Coach as soon as conditions are met. The `← BACK` header link still works as an out for players who really want to walk away.

4. **The Interval was orphaned for page-quest players** — only reachable via `Dido → Sub umbras: watch her burn → Stay in Carthage → Wake suddenly → The Interval`. Players following the practical page-rescue path would never see it (or the fetch-glimpse it unlocks). Dr Quill's intent: the Interval is the reward for surrender, not for broader access — but once the page is rescued, the surrender path should become the guided/only option at Dido. **Fixed**: Dido's exits now branch on `$hasMissingPage OR $returnedPage`. Pre-rescue: standard Green Sea / shore / wake / sub umbras options. Post-rescue/return: standard exits hidden; only `[[Sub umbras: watch her burn|Stay in Carthage]]` as a `guided-link`. The Green Sea remains reachable from Carthage shore directly, so alba2-not-yet players aren't locked out. [Dido](Dream Street Shuffle.twee:28675).

5. **Coach map marker** — `_hVisited` used `$cowRideWon`, so falling off the cow didn't tick the Coach as visited on the notebook map. **Fixed**: now `$cowRideDone`. [Build Notebook](Dream Street Shuffle.twee:32543).

6. **Donkey hex history across reloads** — flagged but **intentionally skipped**. `_coinGateHistory` lives on `window` and resets on page reload, so a player reloading after first-tossing could re-trigger the "first always heads" rule. But the Colony Door auto-redirects to The Colony Room once `$visited's Colony` or `$metSalvu` is true, so the history is never actually consulted in normal play. Genuine edge case, not worth the persistence machinery.

### Polish / prose refinements

- **Lackland prose now path-aware**: "You were sent here by Jeffrey?" was an old assumption from the Coach-route. Now branches: Davy if `$metDavy`, Jeffrey if `$cowRideDone`, fallback "You were sent here, then?". [Martin Lackland's Office](Dream Street Shuffle.twee:29288).
- **Coach Retch on resume-bounce when sobriety ≤ 15**: tight edge case where a `$coachUrgent` crash + simultaneous lily-1 ring would skip the Retch link on the bounce-back, leaving the player to ride the cow at 0 sobriety. Added a low-sob Retch link to the resume branch so they can recover. Players bouncing through Coach without actually crashing don't see the link.
- **Maritime "no present horizon" cosmetic**: the dead-end else clause used to render alongside an active "Yes → Pillars" link, reading as flat contradiction. Removed; pre-critic players now see just the Yes option cleanly. Post-everything cases still show "Your business at the Pillars is finished."
- **Dido return prose (Dr Quill's text)**: post-page-rescue Dido now greets the player with *"You're back. Carthage was always meant for you. What you took from the fire is yours; there is nothing else here. Lily is in her valley. Lie down beside me, now."* Echoes the first-visit "Stay" beats but reframes as final offer.
- **Fetch glimpse three-tier (Dr Quill's text)**: the Dean Street fetch-glimpse (gated on `$wasBeaten + $visitedInterval`) now escalates by `_albaCount`:
  - alba=1: *"Someone's at the other end of Greek Street, looking just like you. Before you look, he's gone."*
  - alba=2: existing prose (unchanged) — *"You see him then: yourself, walking ahead of you…"*
  - alba=3: *"You see him then, your double, your fetch, walking your walk down or else up Greek Street. Centre Point is there, where you're going together."*
  - Distance → recognition → company.
- **After Aoife reflection passage added** (Dr Quill's text): mirrors Lily's "After the call" interlude. Fires once on first Dean Street return after `$hadPhoneCall AND $metCritic AND !$sawAoifeReflection`. Prose: *"You remember that Aoife rang; her voice cold from the cold flat. The baby small in her little arms, crying. You'd promise her the world, if only you could."* Typewriter-static, [outdoor]-tagged (so the traffic bed plays under it). New passage; `_backHide` updated.

## State variables added this session

- `$phoneCallReturnsAt` — `-999` in init, set to `$returns` in The phone call. Gates Lily 1 ring with 1-return spacing after Aoife.
- `$sawAoifeReflection` — `false` in init, set to `true` when the After Aoife passage fires. One-shot guard.

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

(if: _lilyRing)[(set: $lilyCallReturn to "Venue")<div class="phone-ringing">…accept link to Lily phone call 1</div>]
(else-if: _dualRing)[(set: $lilyCallReturn to "Venue")<div class="phone-ringing">…accept link to The dual ring</div>]
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
- After-Aoife reflection fires once on first Dean Street return after both `$hadPhoneCall` AND `$metCritic` are true. After-Call (Lily) reflection fires once on the next Dean Street return after `$pendingLilyBreath` is set.
- Stay in Carthage uses its own Lily 1 prompt with the "phone rings far off — across some distance the night cannot measure" framing. Already used if/else gating; no fix needed.

---

## Memories saved (none today)

Today's session was a combination of bug-fixing, design audit, and Dr Quill writing his own prose for the new beats. Nothing surfaced that wasn't already in memory or wasn't session-specific.

---

## Things considered and intentionally NOT changed

- **The Interval not broadened beyond the Sub umbras path** — by design. It's the reward for surrender. The Dido guided-exit handles the discoverability concern without flattening the design.
- **The opening corridor's rigidity** (Title → Start → Night Ahead → Dean Street → Ginger Light → Red → LINE 1 → Night Ahead Part Two → Name Your Book → Dean Street) — Aoife and alba1 are forced. Design intent.
- **The Lackland office prose beyond the referral line** — generic and works for both Davy and Bernard paths. No further edits needed.
- **`$hasDrawing` localStorage edge case** (cleared mid-game gives a broken img in notebook) — defensive fix would be small but rare-case.
- **Cow ride re-entry edge case** — if `$coachUrgent` re-fires after a player has done the cow ride, they can re-ride. LINE 3's `(set: $alba to $alba + (a: $alba3))` would append alba3 again, but all `contains` checks are dedup-safe. Cosmetic data only.

---

## Possible next threads (for the playtester)

- **The Aoife reflection** — added this session, will fire ONCE on first Dean Street return post-critic + post-Aoife. Worth seeing it land in playthrough.
- **The Dido return prose** — fires when revisiting the pyre after rescuing the page. Should feel like she's been waiting.
- **The fetch-glimpse three-tier** — needs a long playthrough (must lose to Copper + visit the Interval) to see all three stages. Each fires on Dean Street returns at the appropriate `_albaCount`.
- **The forced lily/dual ring pattern** — five venues, all gated. Should feel inevitable but never break flow. Check the Coach's `$coachUrgent` + simultaneous lily-ring case especially — that was tightest.
- **The Lackland soft-lock fix** — best test: take the Pillars-first path, get the critic password, Donkey forces Left at Colony, win the fight with password, get matchbook. Now check that Lackland's link in the hub still says "Go to Lackland's Office" until you've actually played PP.

---

## Files of note

- `Dream Street Shuffle.twee` — **131 passages** (was 130 at session start, +1 for After Aoife). Source of truth.
- `Dream Street Shuffle.html` — synced via `python3 sync_html.py`. NEVER READ DIRECTLY.
- `sync_html.py` — no changes this session.

---

## Audit at end of session

Net effect:
- Soft-locks are closed.
- The lily phone calls are mandatory.
- The Interval is reachable for players who've earned it (and the prose acknowledges their return).
- The Coach is reachable structurally.
- The Ripley's Wheel reveal is achievable on a single playthrough without trap fork choices.
- New atmospheric layer: After-Aoife reflection, three-tier fetch-glimpse escalation, Dido return-voice.

Ready for Dr Quill's playthrough.
