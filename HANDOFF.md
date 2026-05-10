# HANDOFF — 2026-05-10

A long playthrough-feedback pass: 18 items raised across two messages, all touched. Plus a structural gating audit that surfaced one real dead-end (Pillars) and prompted the lily-revisit safety net. Plus a small CSS fix for the wine-stain double-ring.

---

## Playthrough fixes (in order surfaced)

### Drink with him
The smash sound at "The Empty Glass" is unique to that passage — anchored to the narrative line "He drops it; it smashes." All other drink popups share `glassClink + pour + sip + swallow` only. No edit; just confirmed intentional.

### Word to the Wise popups self-fade
Modal hint popups now auto-dismiss after 5.5s with a 0.8s opacity transition. Click and Esc still dismiss instantly. [Dream Street Shuffle.twee:2890](Dream Street Shuffle.twee:2890)

### Critic book widget
Each "Wait." click now spawns a fresh `.critic-book-flip` element on the stage and animates from 0° → −178°. Sidesteps the class-toggle race that was leaving subsequent flips visually inert (the original `remove → void offsetWidth → add` pattern wasn't reliably resetting the transition state). Pages stack — visually reads as a real page-turn each click. [Dream Street Shuffle.twee:31661](Dream Street Shuffle.twee:31661)

### Colony Room sneak text
First-entry now opens with "At the top of the stairs, the doorman lifts an eyebrow. You drop the name of the friend who brought you here once before. He gives you the briefest of nods and lets you pass." — the membership question lands. [Dream Street Shuffle.twee:30782](Dream Street Shuffle.twee:30782)

### Perfect Score (9-point fight)
Fight engine now exposes the score via `window._lastFightScore` and routes a 9-point win to a new `Fight Victory Perfect` passage. End-screen reads PERFECT SCORE rather than STANDING. New prose: Copper looks at his own hands "as if they belonged to someone else"; Quiet Frankie folds his arms and grins; Salvu branch presses both the matchbook AND a small leather-bound notebook into your hand "for the road." +26 confidence, +8 sobriety on the Salvu path. [Dream Street Shuffle.twee:8703](Dream Street Shuffle.twee:8703), new passage at [:28166](Dream Street Shuffle.twee:28166)

### Copper "shouts" → "calls after you"
Standing passage: "Copper shouts" → "Copper calls after you — half-genial, half-mocking". [Dream Street Shuffle.twee:28083](Dream Street Shuffle.twee:28083)

### "Through the Pillars" link rename
Dean Street's `Seek the coast — through The Pillars` link (the post-critic Carthage path) renamed to **"Walk west — beyond the gates"** to drop the venue-name confusion. [Dream Street Shuffle.twee:27971](Dream Street Shuffle.twee:27971)

### Carthage hint at Maritime "Seek the shore"
The Maritime interlude's "Seek the shore" now leads with an italic anticipation:
- With beermat: *"A beer-mat hand, in your pocket: Carthage Short Hercules' Pillars."*
- Without: *"Somewhere out past the breakers, an older shore."*

[Dream Street Shuffle.twee:28608](Dream Street Shuffle.twee:28608)

### Reach into flames return path
`Rescue the page` now returns to **Carthage shore** rather than straight to "Dream to Dean". Player picks "Wake from this dream" themselves — preserves the choice. [Dream Street Shuffle.twee:29031](Dream Street Shuffle.twee:29031)

### Double haunt at Isis
THE FEEDING (haunt10) was firing on a 2.4s delay after THE DELIVERY (haunt6) at `O'Flatterly's Gift`, reading as "two haunts at once". THE FEEDING moved earlier in the arc — now collected at `O'Flatterly's quest` (when Inis first sets the Page-93 quest). THE DELIVERY stays at the page-return. [Dream Street Shuffle.twee:28717](Dream Street Shuffle.twee:28717)

### Critic line gating in the Pillars
After meeting the critic, the entire "Through the fumes, vapours and drink, you recognise a man." block + lore-expand + greyed-out `[DONE FOR TONIGHT]` is now hidden. Pillars cleanly drops the thread. [Dream Street Shuffle.twee:28063](Dream Street Shuffle.twee:28063)

### Phonecalls in succession
The dual ring required `($returns - $lilyCall1ReturnsAt) >= 2` only at the Coach lock; the four venue triggers (Pillars, French, Colony, Ronnie's) didn't have the spacing gate. Added at all four. Result: two Dean Street returns minimum between Lily call 1 and the dual ring — i.e. ~1–2 venue trips of breathing room.

### "And the tears…" line timing
The dual ring's final fading line (`.lily-fade-very-late`) was set to fade in at 22s, but the hang-up button also appeared at 22s and the auto-go fired at 32s — players were hanging up before it landed. Bumped to: hang-up appears at 28s, auto-go at 40s. ~6s of clear visibility before the link is offered, ~16s before forced exit. [Dream Street Shuffle.twee:31790](Dream Street Shuffle.twee:31790)

### Lacklands office front
Couldn't reproduce the bypass — every link to `Martin Lackland's Office` routes through `Approach Lacklands Office` (the 3D scene), and the Davy Merkin path (which sets `$knowsCopperSecret`) only exits to Dean Street. The 3D approach uses a 300ms poller. Flagged back; awaiting a click-by-click repro from Dr Quill if it recurs.

### Beermat after ping pong
PP Defeat (and PP Victory's matched copy) now gates the beermat acquisition behind `$hasCleggBeermat is false and $hasMissingPage is false and $returnedPage is false`. If the player has already done the Cecil Court arc by another path, Percy gives a knowing nod instead — *"You've got the lay of it already," says Percy Ritson, recognising what's already in your pocket. He nods, like one finished man to another.* [Dream Street Shuffle.twee:28723](Dream Street Shuffle.twee:28723), [:28929](Dream Street Shuffle.twee:28929)

### Morale attrition (the big balance fix)
Before: confidence stuck near 100 by mid-game because gains (+12, +18, +22) far outpaced drops (−6, −9). Added passive bleed in the Dean Street hub keyed off `$returns`:

- returns 2–3: −2 confidence
- returns 4–5: −3 confidence
- returns 6+: −4 confidence

Compounds: ten returns ≈ −28 cumulative passive drag. Venue gains still keep the player ahead unless they're genuinely circling. The clamps below already prevent it from going negative. [Dream Street Shuffle.twee:27913](Dream Street Shuffle.twee:27913)

### Shelley's liver — bird animation + sobriety
The `Eat Shelleys Liver` passage was firing `(go-to: "Dean Street")` synchronously while the popup setTimeouts were still pending — bird animation was getting torn down or never showing, and the +18 sobriety set silently. Two fixes:

1. `LiverPopup._fadeOut` now dispatches a `liverpopup:closed` custom event on close.
2. The Twee passage stages a hidden `[[·|Dean Street]]` link, runs the popup directly (not via setTimeout), and a small script binds a one-time listener that clicks the link when the popup closes. 25s safety fallback in case the popup never closes.

The +22 confidence and +18 sobriety sets stay; they were correct, just looked broken because the popup never showed. [Dream Street Shuffle.twee:27356](Dream Street Shuffle.twee:27356)

### Last Lily memory
Parked per Dr Quill — wants to revisit later.

---

## Structural gating audit + fixes

Triggered by Dr Quill's note: *"the gating is still a mess. Especially towards the end game. Passages and routes shut down before it is possible to collect everything from them."*

### Pillars dead-end bug (introduced + fixed in same session)
The earlier critic-line gating edit ([above](#critic-line-gating-in-the-pillars)) accidentally left the `Entering The Pillars of Hercules` passage with **no exit link** when both `$hadPhoneCall` and `$metCritic` were true. Player would land in the pub with the verse and nowhere to click. Fixed: when both flags are true, the passage now lands on:

> The room hums on without you. Your business here is finished.
>
> [[Back to Dean Street|Dean Street]]

[Dream Street Shuffle.twee:28072](Dream Street Shuffle.twee:28072)

### Lily revisit safety net (the structural fix)
Each of the four lily-bearing venues that closes mid-game now offers a **"back to X — there was something you missed"** link in the Dean Street menu when its lily is still uncollected. Mirrors the existing Chippy/Lily 1 pattern.

| Venue | Lily | Closes when… | Revisit |
|---|---|---|---|
| Chippy | 1 | `$hadChippy` | (already existed) |
| The Pillars | 2 | `$metCritic AND $visitedCarthage AND $alba contains $alba2` | added — [:27972](Dream Street Shuffle.twee:27972) |
| Ronnie Scott's | 3 | `$completedSetlist` | added — [:27978](Dream Street Shuffle.twee:27978) |
| The Colony Room | 4 | `$knowsRonnies AND $knowsCopperSecret` | added — [:27975](Dream Street Shuffle.twee:27975) |
| The French | 5 | haunts 1+2+4 collected | added — [:27967](Dream Street Shuffle.twee:27967) |

All gated on `$coachUrgent is false` — once sobriety hits zero and the night collapses to the Coach, lily collection stops being possible. Same as the Chippy revisit. **Open question for Dr Quill**: whether to lift the `$coachUrgent` gate so lily revisits remain accessible right up to the dawn.

### Closures NOT touched (because they're safe)
- **Cecil Court** — closes on `$returnedPage`. Haunt6 (THE DELIVERY) fires *before* the closure flag, on the same passage. No missable lily inside.
- **Trisha's** — closes on `$metShana`. Haunts 8 + 11 fire on the linear flow inside Trisha's; metShana is set on entry to Approach Shana, but the flow funnels you through Verdict → After Shana before exit.
- **Lackland's** — gated by `$knowsCopperSecret` rather than closed; no lily.

---

## Wine stain — double-ring → single-ring
The two `typewriter-page` SVG overlays (Night Ahead big stain + Night Ahead Part Two smaller stain) were each drawing **three** concentric circles: outer red, inner darker overlay at the same radius, AND a smaller-radius fainter ring inside. The third circle (`r="79"` and `r="65"` respectively) was the new inner ring that had appeared. Removed in both instances; back to single-ring look. [Dream Street Shuffle.twee:30898](Dream Street Shuffle.twee:30898), [:30921](Dream Street Shuffle.twee:30921)

---

## Open / parked

- **Last Lily memory** — Dr Quill parked it; will revisit.
- **Lacklands 3D office front** — couldn't repro; awaiting click-by-click path.
- **`$coachUrgent` gating on lily revisits** — currently blocks them; ask Dr Quill if he wants them to survive the Coach trigger.
- **Dual ring spacing tuning** — currently `>= 2` returns of cooldown after Lily call 1. Easy knob to tighten (`>= 1`) or relax (`>= 3`). Awaiting playtest feedback.
- **Morale attrition curve** — −2 / −3 / −4 step. Curve might need flattening or steepening once Dr Quill plays through it.

---

## Possible next threads

- **Critic's-judgement holding-beat** (rolled over from prior handoff) — one sentence between "Have you tried America?" and the password-deflection.
- **Alba Incomplete ending re-build** (rolled over) — give the loss-state its own renunciation-shape rather than just absence.
- **Spanish Artist expansion** (rolled over) — let Benito's permission-to-write line carry more weight.
- **Cow ride mid-tier playtest** (rolled over).
- **Heartbeat on dual ring's Lily side** (rolled over).
- **Lackland record-skipping + bar photo** (rolled over from earlier "fun additions").
- **General Dr Quill audit pass** (rolled over) — clean walkthrough.

---

## Files of note

- `Dream Street Shuffle.twee` — 147 passages now (+1 for Fight Victory Perfect)
- `Dream Street Shuffle.html` — synced via `python3 sync_html.py`
- `~/.claude/projects/.../memory/feedback_preserve_choices.md` — still load-bearing; lily revisit pattern is the latest expression of it
