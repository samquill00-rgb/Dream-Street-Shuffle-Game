# HANDOFF — 2026-05-11 (session 2)

Long session. Started with playthrough notes from Dr Quill, escalated into a full game audit (twice — first audit missed JS-side wiring; second pass corrected and went deeper), worked methodically through every actionable item, then Dr Quill played through and surfaced more issues, all fixed before close.

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

### Audit fixes applied

1. **Lackland soft-lock** — `$hasTrishaMatchbook is true` was closing Lackland's even when the matchbook came from the Copper fight, not Lackland's PP. A Pillars-first player who took the Donkey-forced Left at Colony and won the fight with the critic's password would lose access to haunt5 (Game) and haunt9 (Sorting), making the 12-haunt Ripley's Wheel reveal unreachable. **Fixed**: Dean Street row now gates on `$haunts contains $haunt5` instead. Player can re-enter Lackland's to play PP regardless of where the matchbook came from. [Dean Street](Dream Street Shuffle.twee:28651).

2. **Aoife "Hang up" double-charged Pillars sobriety** — `The phone call` didn't set `$resumingFromCall`, so the Pillars entry block re-ran on the bounce-back: -9 sob + "If you pass the Pillars' threshold…" prose, both shown twice. **Fixed**: `The phone call` now `(set: $resumingFromCall to true)` at the top. [The phone call](Dream Street Shuffle.twee:32184).

3. **Lily phone calls now mandatory** — Aoife was already forced at Pillars first-entry. Lily Call 1 and the Dual Ring were NOT forced — the ringing div sat at the top of each venue passage, but the rest of the venue's links were still clickable below, so a deliberate player could dodge every lily call. **Fixed**: rewrote all five venue passages (Coach, Pillars, Ronnie's, Colony, French) with a `(if: _lilyRing) ... (else-if: _dualRing) ... (else: venue content)` chain. Decoration SVGs and venue titles stay outside the gate (always visible); the ringing phone is now the only interactive element when active. Side benefit: the Coach-unreachable soft-lock for careful + call-ignoring players is closed.

4. **The Interval was orphaned for page-quest players** — only reachable via `Dido → Sub umbras: watch her burn → Stay in Carthage → Wake suddenly → The Interval`. Players following the practical page-rescue path would never see it. **Fixed**: Dido's exits now branch on `$hasMissingPage OR $returnedPage`. Pre-rescue: standard exits. Post-rescue/return: only the Sub umbras guided-link. The Green Sea remains reachable from Carthage shore directly, so alba2-not-yet players aren't locked out. [Dido](Dream Street Shuffle.twee:28675).

5. **Coach map marker** — `_hVisited` used `$cowRideWon`, so falling off the cow didn't tick the Coach as visited on the notebook map. **Fixed**: now `$cowRideDone`. [Build Notebook](Dream Street Shuffle.twee:32543).

6. **Donkey hex history across reloads** — flagged but **intentionally skipped**. The Colony Door auto-redirects once `$visited's Colony` or `$metSalvu` is true, so the history is never actually consulted in normal play. Edge case, not worth the persistence machinery.

### Polish / prose refinements

- **Lackland prose now path-aware**: "You were sent here by Jeffrey?" was an old assumption from the Coach-route. Now branches: Davy if `$metDavy`, Jeffrey if `$cowRideDone`, fallback "You were sent here, then?". [Martin Lackland's Office](Dream Street Shuffle.twee:29288).
- **Coach Retch on resume-bounce when sobriety ≤ 15**: tight edge case where a `$coachUrgent` crash + simultaneous lily-1 ring would skip the Retch link on the bounce-back. Added a low-sob Retch link to the resume branch.
- **Maritime "no present horizon" cosmetic**: removed the dead-end else clause that used to render alongside an active "Yes → Pillars" link.
- **Dido return prose (Dr Quill's text)**: post-page-rescue Dido now greets with *"You're back. Carthage was always meant for you. What you took from the fire is yours; there is nothing else here. Lily is in her valley. Lie down beside me, now."*
- **Fetch glimpse three-tier (Dr Quill's text)**: the Dean Street fetch-glimpse now escalates by `_albaCount`:
  - alba=1: *"Someone's at the other end of Greek Street, looking just like you. Before you look, he's gone."*
  - alba=2: existing prose (unchanged).
  - alba=3: *"You see him then, your double, your fetch, walking your walk down or else up Greek Street. Centre Point is there, where you're going together."*
- **After Aoife reflection passage** (Dr Quill's text): mirrors Lily's "After the call" interlude but in Aoife's voice. Fires once on first Dean Street return after `$hadPhoneCall AND $metCritic AND !$sawAoifeReflection`. Prose: *"You remember that Aoife rang; her voice cold from the cold flat. The baby small in her little arms, crying. You'd promise her the world, if only you could."* `[outdoor]`-tagged (traffic bed under prose), uses typewriter type-on animation (not static like Lily's).

## Late playthrough fixes (Dr Quill played, found these)

- **"The Pillars [DONE FOR TONIGHT]" → "[NOT NOW, LOOK ELSEWHERE]"** — the post-critic-and-lily greyed message on Dean Street now reads more naturally as a steering rather than a finality.
- **"Walk west — beyond the gates" → just "The Pillars"** — the post-critic / tookLily2 / knowsAboutPage hub link no longer flags the Maritime/Carthage route explicitly. Player figures out the route themselves.
- **Lily call 1 trailing quote typo** — `'sonnets.''` → `'sonnets.'` in Lily's first line. Extra speech mark removed.
- **Approach The French visit counter** — `$frenchApproached` was being set AFTER the drink-detour redirect, so the drink-detour visit didn't count. Fixed by moving the `(set: $frenchApproached to true)` BEFORE the `(go-to: "Which drink at the French?")` check. Visit counter now matches player's perception of "this is my third time here". [Approach The French](Dream Street Shuffle.twee:27569).
- **alba3 bug + recovery** — the cow ride sent the player to LINE 3, but LINE 3 only added `$alba3` to the array inside the "Closer" click. A player who navigated away (back button, reload, etc.) without clicking Closer silently lost the alba credit and would be unable to complete. **Fixed (belt-and-braces)**: `(if: $alba is an array and not ($alba contains $alba3))[(set: $alba to $alba + (a: $alba3))]` added to THREE places — LINE 3 entry, Cow ride success, Cow ride fail. Any player who reaches the cow gets credit automatically, regardless of whether they engage with the Closer revelation. **Plus recovery path**: loosened the Dean Street Pillars-row gate to also re-open when alba3 is missing — `($visitedCarthage is false or not ($alba contains $alba2) or not ($alba contains $alba3))`. A player who got stuck on the old bug can now return to Carthage → Dido → Sub umbras → Stay in Carthage → Interval, which awards alba3 at haunts ≥ 11. [LINE 3](Dream Street Shuffle.twee:29128), [Cow ride success](Dream Street Shuffle.twee:30949), [Cow ride fail](Dream Street Shuffle.twee:30964), [Dean Street](Dream Street Shuffle.twee:28643).
- **French visit intro now branches structurally** — was using `(enchant: ?frenchIntro, ...)` to dim the original intro on returns 2+, but with the visit-2 prose ("A man cannot step into the same pub twice") sitting right below, the dimmed intro read as a contradiction (visit 2 prose says it's not the same pub; the intro right above re-describes the same pub). Restructured: visit 1 shows the original intro alone, visit 2 shows "A man cannot step..." alone, visit 3+ shows "There is always a third." alone. No enchant needed. Cleaner break per return. [The French](Dream Street Shuffle.twee:31318).
- **After Aoife typewriter** — initially copied `typewriter-static` from "After the call" by mistake. Removed so After Aoife now types out character-by-character (matches After the painter / After Cecil Court / After the music). "After the call" remains static by design.

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

### alba3 trigger — belt-and-braces

The third alba line is set in three places, each guarded by `(if: $alba is an array and not ($alba contains $alba3))`:
- LINE 3 entry — for any player who reaches LINE 3 by any path
- Cow ride success — for the win path
- Cow ride fail — for the throw path

The "Closer" link inside LINE 3 still does its own set (harmless duplicate; `contains` is dedup-safe).

### Hub Carthage gate — recovery for missing alba3

The Dean Street Pillars row's "Walk west" branch now also fires when `$alba` doesn't contain `$alba3`:

```harlowe
(else-if: ... $tookLily2 is true and $knowsAboutPage is true and 
  ($visitedCarthage is false or not ($alba contains $alba2) or not ($alba contains $alba3))
)[[[The Pillars|Maritime interlude]]
```

So a player who somehow lost alba3 credit can return to Carthage and find it via The Interval (haunts ≥ 11 path). Normal play unaffected — players with alba complete won't see the link.

### Lily call architecture

- Aoife call (`The phone call`) — forced at Pillars first entry; sets `$hadPhoneCall`, `$phoneCallReturnsAt`, `$resumingFromCall`.
- Lily call 1 — forced at any of the five venues if `$lilyCount >= 1`, `$hadPhoneCall is true`, `($returns - $phoneCallReturnsAt) >= 1`, and (for non-Coach venues) the venue has been visited before. Sets `$hadLilyCall1`, `$lilyCall1ReturnsAt`, `$resumingFromCall`, `$pendingLilyBreath`.
- Dual ring — forced at any of the five venues if `$lilyCount >= 2`, `$hadLilyCall1 is true`, `$hadDualRing is false`, `($returns - $lilyCall1ReturnsAt) >= 2`, and (for non-Coach venues) the venue has been visited. Sets `$hadDualRing`, `$crashedAfterDualRing`, clamps sobriety to 8 and confidence to 18, forces `(go-to: "Coach and Horses lock")`.
- After-Aoife reflection fires once on first Dean Street return after both `$hadPhoneCall` AND `$metCritic` are true (uses `$sawAoifeReflection`).
- After-Call (Lily) reflection fires once on the next Dean Street return after `$pendingLilyBreath` is set.
- Stay in Carthage uses its own Lily 1 prompt with the "phone rings far off — across some distance the night cannot measure" framing.

### French visit-count prose

```harlowe
(if: _fc <= 1)[original intro prose alone]
(else-if: _fc is 2)[A man cannot step into the same pub twice...]
(else:)[There is always a third.]
```

No enchant. Each visit gets its own line, exclusive of the others.

---

## Memories saved (none today)

Today's session was a combination of bug-fixing, design audit, prose passes (Dr Quill writing his own beats for the new content), and a final playthrough that surfaced more issues. Nothing surfaced that wasn't already in memory or wasn't session-specific.

---

## Things considered and intentionally NOT changed

- **The Interval not broadened beyond the Sub umbras path** — by design. It's the reward for surrender. The Dido guided-exit handles the discoverability concern without flattening the design.
- **The opening corridor's rigidity** (Title → Start → Night Ahead → Dean Street → Ginger Light → Red → LINE 1 → Night Ahead Part Two → Name Your Book → Dean Street) — Aoife and alba1 are forced. Design intent.
- **The Lackland office prose beyond the referral line** — generic and works for both Davy and Bernard paths. No further edits needed.
- **`$hasDrawing` localStorage edge case** (cleared mid-game gives a broken img in notebook) — defensive fix would be small but rare-case.

---

## Files of note

- `Dream Street Shuffle.twee` — **131 passages** (was 130 at session start, +1 for After Aoife). Source of truth.
- `Dream Street Shuffle.html` — synced via `python3 sync_html.py`. NEVER READ DIRECTLY.
- `sync_html.py` — no changes this session.

---

## Audit at end of session

Net effect:
- Soft-locks closed (Lackland, alba3, Coach unreachable).
- Lily phone calls mandatory at all five venues.
- Interval reachable for players who've earned it; Dido return acknowledges what was taken.
- Recovery path open if alba3 is somehow missing (back to Carthage → Stay → Interval).
- New atmospheric layer: After-Aoife reflection, three-tier fetch-glimpse escalation, Dido return-voice.
- Visit-count prose at French now exclusive per return rather than dimmed-and-stacked.
- Playthrough by Dr Quill confirmed everything else holds up.

Ready for next round.
