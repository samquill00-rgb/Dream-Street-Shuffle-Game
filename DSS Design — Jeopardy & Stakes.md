# DSS Design — Jeopardy & Stakes

*Status: PARKED — design exploration, not yet implemented. (2026-06-19, from a thinking session.)*
*Premise: testers say it's "less a game than an interactive short story." True. This is how we might add jeopardy without breaking the literary tone.*

---

## 1. Why it currently reads as a short story (mechanically)

- **The stats can't really hurt you.** `$statLoss`/`$statGain` are *asymptotic* (a percentage of the current value), so `$confidence` and `$sobriety` decay gently and bounce off the floor — sobriety literally rebounds to 5 if you're under 10 haunts. Venue gains outpace the hub attrition. You'd have to *try* to fail. No pressure = no tension.
- **Choices are gathering, not dilemmas.** Visiting venues, collecting flowers / haunts / alba-lines is all *additive*. Nothing is mutually exclusive, scarce, or lost. You can have everything if you just keep walking.
- **The night is infinite.** You can lap Soho forever; `$returns >= 7` only changes flavour text. Nothing is *burning down*.

Net: the player never feels the thing a game needs — *that this choice costs me that one.*

## 2. The reframe (important)

The goal is **not** "can you lose" — that's arcade, and it would cheapen the tone. The goal is **"does your night MATTER"**: do your choices produce a *meaningfully different ending*? A short story has one fixed trajectory; a game has *yours*. Right now the outcome is near-binary (made the poem / didn't) and the *path* barely shades it. More jeopardy = more consequential paths = a **spectrum of earned endings**.

Failure here should read as **tragic / bittersweet**, not a frustrating "game over." The bleak ending, not the brick wall.

## 3. Keystone idea — make the dawn a CLOCK

This is *the* one, because it isn't a bolted-on mechanic — it's what an aubade *is*: a song about dawn coming to end the night. Right now the dawn arrives only when *you* finish the poem (you control it). **Invert it: the dawn comes on its own, and you're racing it.** Give the night a finite budget of moves (we already count `$returns`).

What it produces:
- Every venue / drink / flower **costs time you can't get back**.
- You **can't do everything** — all 5 Lily flowers + all 12 haunts + the poem? The sky lightens first.
- A *range* of endings: make the dawn whole and triumphant / scrape it raw / miss it and go home with nothing / lost to Lily or to drink before it comes.
- The most thematically perfect pressure possible for this exact piece.

It can be **generous** (a long night) and still completely change the *feel*, because now the night is *spending itself*. Calibration, not conversion.

## 4. Supporting levers (stack on the clock)

- **Drink as a real gamble, not a cushion.** You *need* to drink to loosen up and be let into Soho — but make low sobriety genuinely bite: too drunk to *hear the voice* (miss an alba line), worse/blurred choices, a real crash. The Soho dipsomania made mechanical — a dial you must ration under time pressure.
- **Lily as a siren with a price, not free morale.** Right now her flowers are pure upside (+morale) and the dual ring is the only cost. Make pursuing her *cost the night* throughout — each flower draws you deeper, burns time, risks the homecoming. Then the central tension (the real wife vs the ghost) becomes a *gameplay* tension: safe-and-plain vs beautiful-and-doomed.
- **Let the floor be tragic.** The Fetch / the jump from Centre Point already sits there as a death-drive motif. Let despair (bottomed confidence) actually pull you there, so the spread runs from triumphant dawn to the bleakest ending and the good one is *earned*.
- *(Maybe)* the money premise — he's here to *sell the book* for a cold flat with no food — is currently un-mechanised. A provision/stakes dimension could raise the real-world cost of failing. Possibly over-complicates; note for later.

## 5. The one caution

The contemplative, short-story quality is also what people *love*. This is a **calibration, not a conversion** — enough weight that choices feel consequential, not a twitchy survival game. The dawn-clock is the safest lever because it can stay generous while still making the night *spend itself*.

---

## 6. Where the code lives (for when we implement)

- **Stat curves:** `$statLoss` / `$statGain` macros (StoryInit, ~line 126). Sharpening these is how you make stats bite.
- **Hub attrition + the `$returns` counter:** "Dean Street" passage. `$returns` increments in the body; attrition scales with it (`returns 2–3`, `4–5`, `6+`). This is the natural home for a dawn-clock (turn budget) and the "small hours" flavour escalation.
- **Endings:** `Dawn` (win), `Alba Incomplete`, `No more` → `Black page`, `Coach and Horses lock`. The endgame chain is `_towerReady → The Fetch → Approach Centre Point → Alba Complete/Incomplete → Dawn Approach → White/Black page → Dawn`. A spectrum of endings would branch here based on *how* the night went (time left, stats, which thread).
- **Alba lines (the win condition):** `$alba1` (LINE 1, via Red/Ginger Light), `$alba2` (LINE 2, Green Sea), `$alba3` (LINE 3, via the cow-ride at the Coach). Gating any of these behind state (e.g. too drunk to get `$alba3`) is how drink/time become win-critical.
- **Lily thread:** 5 flowers (`$tookLily1–5`, pentacle bonus at 5), the call escalation (`_lilyRing` → "Lily phone call 1" → `_dualRing` → crash to Coach lock). The flowers' pure-upside `(set: $confidence ...)` is where a *cost* would go.
- **The Fetch / Centre Point:** the death-drive motif, currently a near-miss; could become a real bleak ending off bottomed confidence.

## 7. Open questions to settle when developing

1. **How long is the night?** Pick a `$returns` budget (generous — e.g. 12–15 laps?) and decide what "the sky lightens" forces.
2. **Hard deadline or soft?** Does the dawn *end* the night (forced to an ending), or just tighten (greying out options, raising costs)?
3. **What gets gated by state?** Which alba line(s) can be *lost* to drink/time, so neglect can cost the win?
4. **How many endings, and what's the spread?** Map the spectrum from triumphant dawn → scraped → missed → lost-to-Lily → the jump.
5. **Does Lily's pull need a visible meter,** or stay diegetic (flowers/calls)?
6. **Keep it generous** — playtest that the *feel* changes without the contemplation being lost.
