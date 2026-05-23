# HANDOFF — 2026-05-21

A long polish session, mostly Dr Quill playing through and sending fine edits, plus one significant architectural change: a **new asymptotic stat system** that replaces fixed `± N` deltas with proportional changes. Supersedes the 2026-05-20 handoff.

---

## The big architectural change: asymptotic stats

The 64 sites where `$confidence` / `$sobriety` adjusted by fixed `± N` are gone. They've been replaced with two custom Harlowe macros in StoryInit:

```harlowe
(set: $statGain to (macro: num-type _v, num-type _n, [
  (output-data: (round: (min: 100, _v + (100 - _v) * (_n / 50))))
]))
(set: $statLoss to (macro: num-type _v, num-type _n, [
  (output-data: (round: (max: 0, _v - _v * (_n / 50))))
]))
```

**How it behaves:**
- **Gains** scale with HEADROOM (`100 - current`). Chips +10 at 80 conf only nudges to ~84, but at 30 conf lifts to ~44.
- **Losses** scale with CURRENT. A drink at 80 sob bites hard; at 25 it barely shifts.
- **At the midpoint (50/50)**, the new system produces the same delta as the old fixed values — that's the balance point.
- **Divisor `/50`** controls intensity. Dr Quill liked the *"go harder"* tuning that's currently in play; if everything feels too mild/wild later, change the divisor in those two macro lines and the whole game retunes in one place.

All 64 passage-level sites converted via a Python regex pass — pattern `(set: $stat to $stat + N)` → `(set: $stat to ($statGain: $stat, N))`. Backup `.twee` saved as `Dream Street Shuffle.twee.bak-flat-stats` at the project root.

**JS-side gates also routed through the same curve.** Two helpers added at the top of UserScript:
```js
window.dssStatGain = function(v, n) { ... };
window.dssStatLoss = function(v, n) { ... };
```
Notebook liver-eat (`+22 / +40`) and notebook cigarette-light (`+6`) now go through these. Waltz scoring uses the same formula inline.

**Confidence cap raised from 90 to 100.** The 90 cap was a fixed-delta-era guardrail; the asymptotic curve does the natural ceiling work now.

---

## Stat-touching mechanic changes

- **Chippy** ([.twee:32983](Dream Street Shuffle.twee:32983)): boost moved from passage entry to the **"Eat" click**, so the bar-flash lands on Dean Street return rather than silently on chippy entry.
- **French drinks, Colony champagne, Pillars champagne, Cellar drinks** all already applied sobriety loss. **The Empty Glass (whisky with John Curtis)** was the only drink site missing — added `(set: $sobriety to ($statLoss: $sobriety, 8))`.
- **Cecil Court Waltz scoring** ([.twee:32904](Dream Street Shuffle.twee:32904)): each note's hit accuracy now contributes to a 0-1 score (Perfect ≤60ms = 1.0, Good ≤150ms = 0.75, Late ≤220ms = 0.5, Miss = 0). Score maps to morale ±20 and sobriety ±10 deltas (linear around 0.5 neutral). Bypasses the +0.5/-0.5 dead zone so a "competent but fumbled" waltz costs nothing.
- **Punching-game loss** ([.twee:10362](Dream Street Shuffle.twee:10362)): on defeat, the "Now, fuck off" narrative is suppressed and the player auto-advances to Fight Defeat after 1s. Win path unchanged.

---

## Lore-seen system (re-introduced, different mechanism)

The previous session **removed** the localStorage-based lore persistence per Dr Quill's call. **This session re-introduced it** because he asked for lore boxes that stay open on revisits — but with a key design tweak: they appear *slightly greyed* on auto-expand, so the player sees they're "already uncovered".

**Implementation:**
- `window.dssSeenLore` — a JS `Set` populated by the click handler when the player opens a LORE link. **Session-only**: page reload resets, by design.
- On every passage swap, a 250ms delayed callback finds tw-links containing "LORE" whose title is in the Set, programmatically dispatches a click via `MouseEvent`, then tags the newly-revealed `.lore-box` with `.lore-seen` (`opacity: 0.62; filter: saturate(0.7);`).
- Auto-expand suppresses the unravel sound and the click-tick via a `data-auto-expand="1"` attribute the click handlers check.

**Why window-level not Harlowe state**: the previous attempt used a Harlowe `$seenLore` array, but pushing to it from JS didn't propagate reliably across passage navigations (Harlowe's state-snapshot model). A `Set` is simpler and avoids the round-trip. The `$seenLore` Harlowe init lines are left in StoryInit/Start as harmless no-ops in case we ever switch back.

---

## Carthage audio fix

The previous handoff noted that `[dream]` was supposed to be removed from Carthage passages, but it actually wasn't — `:: The coast of Carthage` and `:: Carthage shore` still carried both `[carthage-cicadas dream]`, which made the procedural windFarnell bed fire underneath the cicadas. Dr Quill noticed the howling wind was still there in Carthage.

Fixed by removing `[dream]` from both. The carthage-cicadas bed plays independently via its tag-registered lifecycle. `Stay in Carthage` keeps `[pyre]` for the fire bed.

---

## The Interval — one-shot guard

The Interval scene could be entered twice — once via Carthage (Page 93 path) and again via Green Sea (alba2 path). Both passages have "Wake from this dream" → `The Interval`. Dr Quill said this should only play once.

Added `(if: $visitedInterval is true)[(go-to: "Dean Street")]\` at the top of `:: The Interval`. Second-visit links land directly at Dean Street, the Interval lily-window scene only plays once.

---

## Beermat fully cut from the game

The "Clegg beermat" item — previously won from Percy Ritson at Pong, used to gate O'Flatterly's shop dialogue — is gone. Dr Quill's reasoning: single-play audience, the Great Ham telling the player to visit Cecil Court is enough.

Removed from:
- `$hasCleggBeermat` variable init (StoryInit + Start)
- PP Victory / PP Defeat (no more Percy-specific beermat handout)
- Critic's judgement (Cecil Court knowledge stays, no beermat handed over)
- O'Flatterly's shop entry (was gated on `$hasCleggBeermat`, now unconditional → just `[[The Great Ham sent me|O'Flatterly introduction]]`)
- O'Flatterly's quest description (Carthage hint stripped)
- Dean Street Cecil Court conditional (`FIND PAGE 93 — //CARTHAGE//` flourish dropped)
- Pillars exit (Carthage door) — now gated on `$metCritic` alone
- Notebook inventory (beermat row removed)
- Dead `.nb-inv-beermat` CSS class removed

**Knock-on**: PP Victory and PP Defeat both now hand out the **Trisha's matchbook** from *either* opponent (`(if: $opponent is "Jack Curtis")[...](else:)[...]`), each with a voice-appropriate line. Single-play means both Pong paths must yield the prize.

---

## Prose / dialogue edits

- **Red speaking to player** ([.twee:37212](Dream Street Shuffle.twee:37212)): "Like a tiger in the Taiga, moving strong and low through heavy blizzard…" → "Like a tiger that moves in the Taiga…" Dialogue restructured: "'I need to sell a book.' / 'What's the trouble, cock?' / 'I need to sell a book.' / 'Don't look so merly. Things turn up.'" Plus "smiling and then retreating", "wore the very same".
- **Red on his perfume sentence** ([.twee:37220](Dream Street Shuffle.twee:37220)): rewrite with "the very same" replacing "wore it".
- **Red's tip on the work** ([.twee:33802](Dream Street Shuffle.twee:33802)): "Forget the work" → "Forget the book", and "it's no way to live" → "It's no way to live" (capitalised).
- **"He is a skeleton"** (French novelist branch) → "He is skeletal".
- **"their office"** (John St. John line) → "their makeshift office".
- **Dean Street manuscript line** ([.twee:33258](Dream Street Shuffle.twee:33258)): "It will help you find the things you really need" → "Let it help you find the things you need".
- **Aoife/ghost passage** in Night Ahead Part Two ([.twee:36282](Dream Street Shuffle.twee:36282)): rewrote to "She's why you're here again, all told; you'd say that to yourself if you could stomach it." Stray opening AND closing speech marks removed (it's interior thought, not dialogue).
- **Donkey coin popup** ([.twee:33347](Dream Street Shuffle.twee:33347)): "Pocket it" → "Toss it and pocket it".
- **Phone-call duplicate line** ([.twee:36931 area](Dream Street Shuffle.twee:36931)): "Through the fumes, vapours and drink, you recognise a man." removed from the Aoife phone-call popup. It still appears in the next passage (line 33382) where it belongs.
- **Marvell verse** ([.twee:34000](Dream Street Shuffle.twee:34000)): swapped from `.quest-box` (with right-align inline) to `.verse` class. Green-colored "green" spans preserved for wordplay.

---

## Visual / styling

- **Verse styling restyled** ([.twee:40047](Dream Street Shuffle.twee:40047)): dusty gold (`#c8a874`), hairline left border, slight letter-spacing, italic Crimson Text, 30em max-width, **left-aligned** (initially centered; Dr Quill clarified later that the original intent was left). Affects all three verse blocks (Spenser/Yeats fragment at the Spanish artist, Marvell at LINE 2 Oxford, Aemilianus/Virgil at Carthage shore).
- **Alba next-link delay** ([.twee:39329](Dream Street Shuffle.twee:39329)): new `.alba-link-fade` CSS class with `opacity: 0; animation: albaLinkFadeIn 1.4s ease-out 4.6s forwards;`. Wraps four next-links across LINE 1 / LINE 2 / LINE 3 so the link doesn't appear until after the "THE FIRST/SECOND/THIRD LINE OF THREE" counter has finished its fade-in.
- **Notebook stat spacing** ([.twee:39078](Dream Street Shuffle.twee:39078)): `.alba-strip { margin-top: 2px }` to make MORALE→SOBRIETY and SOBRIETY→ALBA visually even (the SOBRIETY ember pseudo-element extends below the bar, throwing off the apparent gap).
- **VICTORY box centered** ([.twee:42048](Dream Street Shuffle.twee:42048)): `text-align: center` on `.pp-score`.
- **Mote spawn scroll-into-view** ([.twee:8418-8485](Dream Street Shuffle.twee:8418)): both the main collection-box reveal logic and the `dssSpawnMotes` helper now check if the box is outside the viewport; if so, `scrollIntoView({behavior: 'smooth', block: 'center'})` and wait 550ms before spawning. Fixes the "motes from below the page" issue Dr Quill spotted on THE DEBT haunt.

---

## Audio fixes (other than the Carthage wind)

- **BEGIN click silent** ([.twee:11625](Dream Street Shuffle.twee:11625)): `if (txt === 'BEGIN') return;` added to the typewriter-tick skip list.
- **Page-turn sound rewritten** ([.twee:643](Dream Street Shuffle.twee:643)): the critic's `pageRustle()` was a sharp 1600Hz highpass burst that sounded like glass breaking. Now: 1.1s envelope with 100ms gentle attack and long decay, band-passed 700-5200Hz (papery not hissy), with a soft low whump underneath (105Hz→55Hz sine) for physical weight.
- **O'Flatterly shop bell — once per phase** ([.twee:8292-8307](Dream Street Shuffle.twee:8292)): was gated by `window._heardOflatterlyBell` so it played only once ever. Now tracks `window._heardOflatterlyBellPhases.pre` and `.post`, where "post" = `$returnedPage is true`. The brass clapper rings again the first time the player steps in with the returned page in hand.

---

## Lily phone call 1 — Sonnet 66 reliability fix

The Sonnet 66 fragment ("Your tongue is cauterised on 66, its heat, which you dare not speak: //Tir'd with all these, from these would I be gone, Save that, to die, I leave my love alone.// You both hang up, each leaving the other alone.") wasn't reliably appearing. Dr Quill said he waited and missed it, or it didn't trigger.

Root cause: the original `<span>` had blank lines inside, which Harlowe was parsing into paragraph breaks, breaking the span. The CSS `lily-fade-late` animation-delay also had a tight 10s timing.

**Fix** ([.twee:37138-37140](Dream Street Shuffle.twee:37138)):
- Converted `<span>` to `<div>` with `<br>` tags and `<em>` for italics — keeps the markup intact.
- Wrapped the entire div in Harlowe's `(after: 11s)[...]` macro so the element only enters the DOM at 11s; the `lily-fade` animation then runs from element-birth (no timing race).
- Hang-up link pushed from `(after: 10s)` to `(after: 15s)`.
- Auto-redirect pushed from `(after: 16s)` to `(after: 28s)` — ~14.5s reading window.

---

## State of the live code

All today's changes synced to `Dream Street Shuffle.html` (132 passages). `sync_html.py` unchanged. Backup `.twee` from before the asymptotic stat refactor saved as `Dream Street Shuffle.twee.bak-flat-stats`.

**Major structural shifts in this session:**
1. **Stats are now asymptotic, end-to-end.** Both Harlowe macros and JS helpers use the same `/50` curve. Single knob to retune intensity.
2. **Lore boxes stay open on revisit, greyed.** Window-level Set, no persistence beyond session.
3. **Trisha's matchbook universally available** from any Pong opponent.
4. **Beermat cut entirely** from the game state and visible UI.
5. **The Interval is one-shot.**
6. **Carthage no longer has the procedural wind layer** — cicadas (and fire on Stay) only.

---

## Memories — no changes this session

No new memory files written. The earlier "Drafting in DSS character voice" / "Don't add or suggest DSS prose unless structurally necessary" / "Always reason from the source" instructions still govern.

---

## Open threads for the next session

Carried forward from previous handoffs:
- `Dream to Dean` and `Failure: Trisha's` — still reachable, could still be deleted.
- `Eat Shelleys Liver` — orphan passage still in the file.
- Title screen `BEGIN` link styling — still bare text.
- Five-agent audit punch list — ~50 lower-priority items remain (z-index, dead CSS, edge cases).
- Three Pillars (Mercy/Severity/Mildness) still banked.
- Astral-map screenshots banked 2026-05-13 — still uncommitted to a use.
- `[NEED A WORD]` / Cecil Court `[CLOSED]` / Trisha's `[CLOSED]` hub brackets left intact.

New from this session:
- **Verse alignment** is now left across the board. If a specific verse later wants centered or right-aligned, it'll need an explicit inline override or a sub-class.
- **Asymptotic curve tuning** — the `/50` divisor in `$statGain` / `$statLoss` is the single retuning knob. Currently feels harder/more reactive than the fixed-delta era. If certain events end up too weak or too brutal at certain stat ranges, that's where to look.
- **Lily phone call 1 timing** — Dr Quill should verify the 28s auto-redirect window is generous enough on his next playthrough. Hang-up link at 15s gives him an out.
- **Lore-seen `Set` is session-only** — a page reload starts the player with no lore opened. Acceptable per the single-play design.
- **Page 93 SVG** — still flagged in the previous handoff as possibly needing more naturalistic edge irregularity if it reads stylised in play.

---

## Things considered and intentionally NOT done

- **Touching `Start` / StoryInit init duplication** — still defensive guards make it safe, refactor risk > payoff.
- **Lore-box persistence in localStorage** — this session uses an in-memory `Set` instead. The previous session removed localStorage entirely; we did not re-add it (page reload resetting is fine for single-play).
- **Naming the Great Ham "Ian Hamilton" in the O'Flatterly entry** — Dr Quill flagged that players who skip the optional lore wouldn't know that name. Changed to "The Great Ham sent me" since every player has at least seen the lore link's title.
- **PP Defeat handing out the matchbook** — confirmed intentional; single-play philosophy says don't gate content on a skill check.
- **Confidence cap above 100** — kept at 100. The asymptotic curve handles the soft ceiling; 100 is the hard belt-and-braces.
- **Backfill compatibility for old saves** — Dr Quill confirmed none exist.
