# Dream Street Shuffle — Playtest Feedback

**Date:** 16 March 2026
**Tester:** Claude (automated playthrough)
**Build:** Current .html as of session
**Paths tested:** Opening → Red → Alba Revealed → Dean Street hub → The French → The Pillars of Hercules → Literary Critic → Colony Room → Lackland's Office (password system) → Table Tennis scene → Carthage approach → Green Sea 3D (standalone)

---

## BUGS

### 1. Coin Acquisition Modal Cannot Be Dismissed
**Severity: HIGH**
**Location:** Dean Street hub, first return after Alba Revealed

When the Donkey coin is found, a modal appears with "COIN ACQUIRED" and a "Toss it" button. After tossing, the button changes to "Toss again" — but there is **no close button, no X, no "Done" or "Keep it" button**. Clicking outside the modal does nothing. Pressing Escape does nothing. The modal floats over the game text without a full-screen backdrop, so the player can scroll and see content behind it, but the modal follows and overlaps everything.

The only way to dismiss it is via browser developer tools. A regular player would be completely stuck.

**Fix:** Add a "Keep it" or "Done" button that closes the modal after the first toss. Or add click-outside-to-close behaviour + an X button.

---

### 2. Morale Can Go Negative
**Severity: MEDIUM**
**Location:** Various passages mid-to-late game

Morale was observed dropping below 0% (to -25% and -41% in testing). This looks like a display/logic bug — the percentage text shows a negative number and the cigarette bar visual breaks down at these values.

**Fix:** Clamp morale to a minimum of 0% (or whatever the intended floor is). Consider what happens narratively at 0% morale — does the game end? Does something trigger?

---

### 3. Sobriety Increases When Entering Pubs
**Severity: LOW (possibly intentional?)**
**Location:** Entering The French (54% → 62%), entering Colony Room (similar jump observed)

Sobriety *increased* on entering drinking establishments, which is counter-intuitive. If this is intentional (perhaps representing "sobering up" from the cold night air on the walk there?), it's confusing without explanation. If it's a bug in the stat calculation, the sign may be flipped somewhere.

---

## TYPOS & GRAMMAR

### 4. "accumulaton" → "accumulation"
**Location:** Line 12223 of .twee — the Red passage (first meeting on Dean Street)
**Context:** "...he is an accumulaton, mostly, of scents..."
**Fix:** Change to "accumulation"

### 5. "it's" → "its" (possessive)
**Location:** Line 13290 of .twee — Pillars of Hercules intro (the sea storm passage)
**Context:** "The broiling waters shred your ship till it's leaf-tobacco, toss it like a stub."
**Fix:** "its leaf-tobacco" — possessive "its", not the contraction "it's"

---

## UX / DESIGN ISSUES

### 6. Coin Gate Links Look Clickable But Aren't
**Severity: MEDIUM**
**Location:** Any passage with the "Flip the Donkey" coin gate (e.g., Talk to the critic, Maltese Gangsters, The Set, etc.)

When a coin gate is active, the two option links (e.g., "Try Dean Street again" / "Head for the night bus") appear as normal coloured link text, but clicking them does nothing — they're disabled pending the coin flip. There is no visual indication that they are disabled. They look identical to active links.

**Suggestion:** Either grey them out visually, add a subtle "locked" indicator (a small coin icon?), or add a brief text cue like "The Donkey will decide..." above the options before the coin button appears.

### 7. No Visual Feedback When Stats Change
**Severity: LOW**
**Location:** Throughout the game

When morale or sobriety changes, the numbers in the top bar update silently. The player has to actively watch the percentages to notice. There's no flash, colour change, animation, or notification.

**Suggestion:** A brief pulse/glow on the stat bar when it changes (green flash for increase, red for decrease) would help players feel the impact of their choices.

### 8. Dean Street Hub Text Doesn't Change on Return Visits
**Severity: LOW**
**Location:** Dean Street hub passage

Every time you return to Dean Street, you see the same opening text: "A heavy afternoon lingers in rainfall on the pavements though the sky has cleared now and the newborn night is cut with moonshine." This repetition weakens immersion on the 3rd, 4th, 5th return.

**Suggestion:** Add variant descriptions for return visits — perhaps reflecting the time of night progressing, the player's current state, or callbacks to what just happened.

### 9. Visited Link Colour Is Too Similar to Unvisited
**Severity: LOW**
**Location:** Dean Street hub "Where now?" links

Visited links turn a muted purple while unvisited are gold. The distinction is visible but subtle — on some monitors or in some lighting conditions, a player might not notice. This is a minor point but worth flagging since the visited/unvisited distinction is important for navigation.

---

## STRUCTURAL / NARRATIVE OBSERVATIONS

### 10. The French Has Only One Path
**Observation, not a bug.**
The French currently offers a single linear sequence: enter → meet John St. John → accept drink → haunt collected → back to Dean Street. There's no branching choice inside The French itself. Every other venue seems to have at least some decision point. Consider whether "The French" could benefit from a choice (refuse the drink? talk to someone else at the bar? explore upstairs?).

### 11. Pacing of Early Game
The opening typewriter sequence is atmospheric but quite long — several paragraphs of text before any interaction. Players who are replaying (or impatient) may want a way to skip or speed through. Consider a "click to reveal all" option for the typewriter passages, or a shorter intro on replay.

### 12. The Green Sea 3D Scene Looks Great
The Tunisian bar scene with the horseshoe arch door, tile panels, bougainvillea, and café tables is visually striking. The sign is prominent and readable. The simplified windows work well. This scene has a distinctly different visual personality from the London scenes, which is perfect for the Carthage setting.

---

## THINGS THAT WORK WELL

(You said focus on problems, but a few quick positives to calibrate:)

- The writing is exceptional throughout — vivid, sensory, period-appropriate
- The 3D scene transitions are smooth and atmospheric
- The notebook system is well-organised with clear tabs
- The coin flip mechanic is a clever and thematic way to handle branching
- The password system (learning "Valletta" in the Colony Room, using it at Lackland's) is excellent hidden content design
- The haunt collection system creates a satisfying sense of progression
- The "Alas, I kiss you Jane" text on the Alba page is perfectly positioned and faded

---

*End of playtest feedback.*
