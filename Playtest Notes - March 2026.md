# Dream Street Shuffle — Playtest Notes

**Date:** 17 March 2026
**Tester:** Claude (automated playthrough)
**Version:** Current build
**Path taken:** Dean Street → The French → The Pillars of Hercules → The Colony Room → Cecil Court → Doorway (dead end)

---

## CRITICAL ISSUES

### 1. Dead End — "A Doorway on Dean Street" passage
**Severity: GAME-BREAKING**

When morale drops low enough, a prompt appears on the Dean Street hub: "You're feeling worn down. There's a quiet doorway nearby." Clicking "Step into the doorway" leads to a passage that shows only the title "Dream On" and a completely blank/black page. There are no links, no text, and no way to continue or go back. The player is permanently stuck and must restart the entire game. This passage is marked `[placeholder]` in the source.

**Recommendation:** Either hide this option until the passage is written, or add a temporary "Back to Dean Street" link so players aren't trapped.

### 2. Revisitable Venues — No Change on Return
**Severity: MEDIUM**

All venues remain fully clickable on the Dean Street hub even after visiting them. The French, The Pillars of Hercules, and Try the Colony Room all show the same link text after visiting. Cecil Court does shorten from "Visit the antiquarian in Cecil Court" to just "Cecil Court" after the first visit (good!), but the other three don't change.

If revisiting is intended, the passages should ideally acknowledge the return ("You're back at The French..."). If revisiting isn't intended, the links should be greyed out, removed, or marked as visited. Currently it's ambiguous whether the player is meant to revisit or not.

### 3. Placeholder Passages Still in Game
**Severity: HIGH**

The following passages from the Writer's Brief are still placeholders:

- **"A Doorway on Dean Street"** — `[placeholder]` (causes dead end, see #1)
- **"THE GREAT HAM"** — `[placeholder]` inside a lore-box div (appears when `$metCritic is true`)
- **"Centre Point"** — Contains only an asterisk `*` (effectively empty)

These need prose written before the game can be considered complete.

---

## CONSISTENCY ISSUES

### 4. "Flip" vs "Toss" Inconsistency
**Severity: LOW**

The notebook Specials tab correctly says "Toss it" (as recently changed). The coin popup also correctly says "Toss it" on its button. However, the in-passage coin gate buttons all still say **"Flip the Donkey"**. This should be changed to "Toss the Donkey" for consistency, or the notebook should revert to "Flip" — pick one and use it everywhere.

**Locations to update:** Every passage that contains a coin gate button (The Pillars, Colony Room, and any others using the `coinGate` macro).

### 5. Dean Street Hub — Atmosphere Text Doesn't Change
**Severity: LOW**

Every return to Dean Street shows the same opening text: "A heavy afternoon lingers in rainfall on the pavements though the sky has cleared now and the newborn night is cut with moonshine." Even after visiting multiple venues and having morale/sobriety drop dramatically (from 66%/66% to 19%/18%), the atmosphere description doesn't reflect the protagonist's deteriorating state. Consider adding conditional text based on morale/sobriety levels or visit count.

---

## WRITING & NARRATIVE NOTES

### 6. The French — Strong Scene
The French House scene with John St. John is well-paced. The dialogue feels authentic, the drinking mechanic works naturally, and the HAUNT COLLECTED "THE DEBT" card is a satisfying payoff. The writing about owing someone a drink — "The fact of kindness ties you to this place" — is excellent thematic work.

### 7. The Pillars of Hercules — Great Atmosphere
The storm/sea metaphor approach to Greek Street is inspired. The wave-pattern dividers reinforce the theme nicely. "NE. PLUS. ULTRA." is a dramatic moment with good typographic presentation. The literary critic scene (Clegg) has sharp dialogue and the manuscript rejection stings appropriately. The Cecil Court hint feels organic.

### 8. Aoife Phone Call — Effective Emotional Beat
The phone call at The Pillars works perfectly. The brevity is its strength — broken heating, crying baby, "Later tonight" / "Much later?" — four lines that carry enormous weight. The morale boost (to 70%) followed by immediate guilt-drop (to 58%) is mechanically clever and emotionally right.

**Note:** The phone call only triggers if the player clicked the lily-of-the-valley in the Red encounter. Players who skip that click-to-reveal won't get phone calls, which means they miss a major emotional thread. Consider whether this is intended — it rewards exploration but may leave some players without key story content.

### 9. The Colony Room — Too Many Consecutive Coin Gates
The Colony Room sequence has three coin gates in rapid succession: Left/Right door → I'm a member/Wrong door → They know me/Give it a try. On my playthrough, the coin sent me to the "wrong door" and then to Trisha's where "They do not know you" — the entire venue experience was: arrive → flip → flip → flip → one line of rejection → back to Dean Street. It felt thin compared to The French and The Pillars, which have full scenes with dialogue and character interaction.

**Recommendation:** Consider giving at least one of these coin-gate paths more narrative substance. Even on the "rejection" path, a paragraph of atmospheric description of the doorway, the street, or the protagonist's reaction would help.

### 10. Cecil Court — Excellent Writing, Missing Haunt
The Cecil Court / antiquarian scene is beautifully written. The Watkins lore is rich and relevant. The surreal moment with Blavatsky and "the Beast" waltzing is a highlight. O'Flatterly is a memorable character — the dust motes comparison to "slate-grey clouds over Willesden Junction" is perfect.

However, both choice paths show "You missed a haunt" in gold italic text. This message appears at both the "I'll keep an eye out" option AND the "I'll look for it" option. If the player is meant to collect a haunt here, it's unclear what triggers it. The message "You missed a haunt" appearing on both visible options is confusing — is there a hidden interaction I missed?

### 11. Prologue — Text Overflow
On narrower windows, the typewriter-page text clips on the right edge. Lines like "You've written a book and you've a baby at h..." are cut off. The text container may need `overflow-wrap: break-word` or the content area may need a maximum width with padding.

---

## MECHANICS & UX

### 12. Coin Toss — Working Well
The coin toss mechanic works smoothly after the recent fixes:
- Auto-toss from notebook (Specials tab) works — no intermediate "Flip" button
- Coin popup auto-closes after toss
- Coin face in notebook updates to match the result (heads/tails)
- No visible delay between popup closing and image updating
- Coin gate popups show both options clearly and auto-close after deciding

### 13. Morale/Sobriety Tracking
The stat bars are visible and update correctly. The cigarette/drink visual metaphor works well. However, at very low levels (19% morale, 18% sobriety), the bars become very small and hard to read on the dark background. Consider adding a colour change (e.g. red tint) when stats are critically low.

### 14. Notebook — Functional
The notebook button works correctly. The Specials tab shows the coin with "Toss it". Haunts tab shows collected haunts. The notebook is accessible from all passages tested.

### 15. Lore Boxes — Working Well
Both tested lore boxes (Yeats memory from Red, Watkins from Cecil Court) expand and collapse correctly. The styling is appropriate and distinct from the main text.

---

## QUEST TRACKING

### 16. ALBA Quest
The "find three poem lines before dawn" quest is introduced early and clearly. One line collected from Red: "AS COOL AS THE PALE WET LEAVES". The quest framing works well. However, through an entire playthrough of 4 venues plus Cecil Court, I only collected one of three lines. It's unclear where the other two lines can be found — are they in venues I haven't tried, or in paths the coin didn't take me to?

### 17. O'Flatterly's Missing Page (Page 47)
New quest picked up at Cecil Court — find Page 47 of O'Flatterly's manuscript, lost somewhere in Soho. Good setup, but no resolution path was visible in this playthrough. It's unclear if this connects to any existing passages.

---

## ARTWORK

### 18. Exterior Illustrations — Excellent
Both venue exteriors (The Pillars of Hercules, The Colony Room) are atmospheric and period-appropriate. The Pillars shows the Tudor-style building with the "No7 PILLARS OF HERCULES" sign, period lamp posts, and the "BOOKS & PRINTS" neighbour. The Colony Room shows the iconic red door at a dramatic angle. These add tremendous visual quality.

### 19. Decorative Elements — Effective
The wave dividers (Pillars), diamond-pattern dividers (Pillars interior), telephone-cord dividers (phone call), and pillar-column borders (Colony Room) all reinforce their respective venue atmospheres. The lantern on Dean Street is a nice recurring motif.

### 20. Coin Images — Working
Both coin faces display correctly. The new tails (quill-in-inkwell) design matches the heads coin's colour palette. Both show correctly in the notebook and in the toss popup.

---

## SUMMARY OF PRIORITIES

**Must Fix Before Release:**
1. Doorway dead end (game-breaking)
2. Write placeholder passages (Doorway, THE GREAT HAM, Centre Point)
3. "Flip" → "Toss" consistency in coin gate buttons

**Should Fix:**
4. Colony Room rejection path needs more content
5. Visited venues should be marked or acknowledged on revisit
6. Prologue text overflow on narrow windows
7. Clarify "You missed a haunt" at Cecil Court

**Nice to Have:**
8. Dean Street hub text varying with morale/visit count
9. Low-stat visual indicator on morale/sobriety bars
10. Second ALBA poem line accessibility — ensure all paths can reach at least 2 of 3 lines
