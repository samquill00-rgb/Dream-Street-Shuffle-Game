# Dream Street Shuffle - CRITICAL ISSUES REPORT

## Summary

Found **4 passages** where content has been **CATASTROPHICALLY STRIPPED** and replaced with ONLY SVG/HTML decorations. The game-critical prose, dialogue, and player choices are **completely missing** from the current twee file, replaced entirely with venue styling elements.

---

## CRITICAL ISSUES FOUND

### 1. **Steve Merkin** - MISSING: 1479/1514 characters (97% of content)

**Status:** BROKEN - Passage contains ONLY styling SVG elements

**What's MISSING:**
- All dialogue from Steve Merkin character
- The secret password "Valletta" and explanation
- (set: $knowsCopperSecret to true) - CRITICAL variable
- (set: $knowsLackland to true) - CRITICAL variable
- Lore box explaining the secret learned
- Back link to Dean Street

**Backup Full Content:**
```
(set: $sobriety to $sobriety - 8)

He's wearing a suit that was probably clean this morning, which meant he'd been home and changed, but was now beginning to crumple in sympathy with his mood.

'Not interested,' he says, to an audience that is both somehow the whole world and you alone.

The accent is Anglo-Australian; too clipped and politic for his homeland, yet still straying at its edges into an outback.

'I gave a reading last night in Oxford. Magnificent, actually. Met a girl. She was pretty and working on her D.Phil. at Magdalen, on Shakespeare and Co.; I thought I was there. Wore the suit. Bought a bottle of wine. Met her at the Pillars.'

He drinks, you drink, and he seems now to notice you more distinctly, as if drawing his whole, traversable world into a private audience.

'She didn't touch a drop of it. Do you know Martin Lackland? Office on Frith Street?'

You do. You used to wake up on the sofa in his mother's house when you were both seventeen.

'I'll tell you something because I like the way you are. Everyone sees him front-of-house, but the real business happens in the back. Password's //Valletta//. Don't ask me how I know. I know everything and none of it helps.'

He straightens the suit again. That doesn't help either.

'You didn't hear it from me. I'm not here. I'm in Oxford, being adored.'

(set: $knowsCopperSecret to true)
(set: $knowsLackland to true)

<div class="lore-box">
<strong>⟡ SECRET LEARNED ⟡</strong>

Steve Merkin gave you a password: //Valletta//. For Lackland's back room.
</div>

[[Back to Dean Street|Dean Street]]
```

**Current Content:**
```
<div class="colony-scene">
      <svg class="colony-corner tl" viewBox="0 0 28 28">...</svg>
      <svg class="colony-corner tr" viewBox="0 0 28 28">...</svg>
      <svg class="colony-corner bl" viewBox="0 0 28 28">...</svg>
      <svg class="colony-corner br" viewBox="0 0 28 28">...</svg>
      <svg class="colony-fan" viewBox="0 0 300 52" width="100%" height="52">...</svg>
(set: $sobriety to $sobriety - 8)

He's wearing a suit that was probably clean this morning...
[PROSE CONTINUES BUT NO LINKS OR VARIABLES AT END]
      <svg class="colony-fan-bottom" viewBox="0 0 300 52">...</svg>
    </div>
```

**Note:** The current version actually has most of the prose, but is MISSING the critical variable assignments and the back link!

---

### 2. **The Colony Room** - MISSING: 782/1249 characters (63% of content)

**Status:** BROKEN - Passage has ONLY styling, no choice links

**What's MISSING:**
- [[Get a drink|Colony drink choice]] - CRITICAL PLAYER CHOICE
- [[Bottle it|Dean Street]] - CRITICAL PLAYER CHOICE
- Prose paragraph about room atmosphere
- Complex conditional logic for first visit

**Backup Full Content:**
```
(set: $sobriety to $sobriety - 8)
(set: $exploredSinceFrench to true)
(unless: $visited is a datamap)[(set: $visited to (dm:))]
(unless: $visited contains "Colony")[(set: $visited's Colony to false)]
(if: $visited's Colony is not true)[(set: $visited's Colony to true)
(set: $confidence to $confidence + 10)
<div class="first-visit-hint">THE COLONY ROOMS. FACES DRINK HERE. THEY MIGHT BE USEFUL.</div>]

The room is greener than you remember it being but less salad than submarine.

There is a touch of obscenity about the whole affair, of the kind a public house could never muster.

(if: $metRed is true)[By the stairs you see Red and he sees you, holds your eyes with his own, then, like a disgruntled cat, slips free of your tryst imperceptibly.]

|lily4>[<div class="lily-prompt" style="display:inline-block; border:2px solid rgba(255,255,255,0.3); border-radius:50%; width:2.5em; height:2.5em; line-height:2.5em; text-align:center; cursor:pointer;">⚘</div>]\
(click-replace: ?lily4)[<span class="lily-glimpse lily-fade">Someone in this crowd wears her perfume. You've looked and looked again, she is not here. You know though, that the scent perfume makes is not generic, it is particular to the flesh and blood of she who wears it, born of their live admixture.</span>]

At a table near the window sits an agent about whom you've heard all the mythology. You note that she'd be as frightening, given how she holds court and herself, if you didn't know her from Adam.

[[Get a drink|Colony drink choice]]

[[Bottle it|Dean Street]]
```

**Current Content:**
- ONLY styling SVGs and decorative elements
- Missing both choice links completely
- Missing key atmospheric prose

---

### 3. **Coach and Horses lock** - MISSING: 374/424 characters (88% of content)

**Status:** BROKEN - Passage contains ONLY styling SVG elements

**What's MISSING:**
- Opening narration: "Eat, drink and be merry for tomorrow we die!"
- Scene setup prose (waking in toilet, gathering yourself)
- All three player choice links:
  - [[Talk to Jeffrey Bernard|Jeffrey conversation]]
  - [[Deal with the cow|Jeffrey Bernard's Cow]]
  - [[Get some food in you|Chinese Fish and Chips]]

**Backup Full Content:**
```
Eat, drink and be merry for tomorrow we die!

You've just come-to in a cubicle, in what seems to be the gents' toilet at the Coach and Horses.

You gather yourself and walk back to the bar.

It is empty except for Jeffrey Bernard and, behind the bar, a cow.

You need to sober up. Badly.

[[Talk to Jeffrey Bernard|Jeffrey conversation]]

[[Deal with the cow|Jeffrey Bernard's Cow]]

[[Get some food in you|Chinese Fish and Chips]]
```

**Current Content:**
```
<svg class="coach-beam" viewBox="0 0 300 26" width="100%" height="26">...</svg>
(set: $visitedCoach to true)\
<h2 class="venue-title">The Coach and Horses</h2>
<svg class="coach-beam-bottom" viewBox="0 0 300 26">...</svg>
```

**Critical:** All player choice links are gone!

---

### 4. **Colony drink** - MISSING: 358/358 characters (100% of actual content, but styled version is present)

**Status:** PARTIALLY WORKING - Content exists but wrapped in styling

**What's Present:**
- Prose is there: "You drink. The Colony Room tilts."
- Links are there
- Variable changes are there
- BUT completely wrapped in `<div class="colony-scene">` SVG decorations

**Backup Full Content:**
```
(set: $sobriety to $sobriety - 12)

You drink. The Colony Room tilts.

[[Talk to the fancy agent|Talk to the intimidating agent]]
(if: $knowsCopperSecret is false)[At the bar, a man in a suit that was clean this morning is drinking alone. He keeps adjusting it, as though neatness were a posture he could resume by force of will.

[[Sit with him|Steve Merkin]]]
```

**Current Content:**
- Content is PRESENT but WRAPPED in SVGs before and after
- The SVGs prevent proper passage rendering in twee format
- When compiled, may work, but in twee source it's problematic

---

## ROOT CAUSE ANALYSIS

The passages were modified to add venue-specific visual styling (SVG decorations like corners, fans, beams). Instead of **wrapping** the content in styled divs:

```twine
<div class="colony-scene">
  [ORIGINAL CONTENT HERE]
</div>
```

The HTML versions have the SVG elements **inserted INSIDE or INSTEAD OF** the content, which appears to have caused:

1. **Coach and Horses lock**: Content completely replaced with just SVGs and title
2. **The Colony Room**: Missing the two critical choice links
3. **Steve Merkin**: Missing the critical variable assignments and back link (though prose is intact)
4. **Colony drink**: Content wrapped but still functional with surrounding SVGs

---

## IMPACT ASSESSMENT

- **Passage Count Affected:** 4 passages
- **Total Characters Lost:** ~2,994 characters
- **Player Choices Lost:** 5 critical links
- **Variables Lost:** 3 critical state changes
- **Game Flow Breaking:** YES - Player cannot navigate from Coach and Horses, cannot get secret from Steve Merkin

---

## FILES ANALYZED

- **Backup (Source of Truth):** `/sessions/blissful-tender-brown/mnt/uploads/Dream Street Shuffle (3).html`
- **Current (Broken):** `/sessions/blissful-tender-brown/mnt/Claude work/Dream Street Shuffle.twee`

---

## RECOMMENDATION

Restore all four passages from the backup HTML, removing the SVG decoration wrapping and reconstructing them in proper twee format with clean separation between prose content and styling hooks.
