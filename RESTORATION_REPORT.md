# Dream Street Shuffle - Passage Restoration Report

**Status:** RESTORATION COMPLETE ✓  
**Date:** 2026-02-27  
**Method:** Manual restoration using original content from FIXES.txt

---

## Summary of Fixes

Two critical passages had their content completely or partially replaced with venue styling elements. The original content has been fully restored while preserving the SVG venue decorations.

---

## CRITICAL FIX #1: Coach and Horses lock

**Location:** Line 2103  
**Tag:** `[venue-coach]`  
**Status:** ✓ FIXED

### What Was Broken
- **Opening narration:** Missing "Eat, drink and be merry for tomorrow we die!"
- **Scene setup prose:** Missing toilet cubicle scene, gathering, and bar arrival
- **ALL choice links:** Completely missing
  - Talk to Jeffrey Bernard
  - Deal with the cow
  - Get some food in you

**Impact:** Player would be unable to progress from Coach and Horses

### What Was Restored
```
Eat, drink and be merry for tomorrow we die!

You've just come-to in a cubicle, in what seems to be the gents' toilet at 
the Coach and Horses.

You gather yourself and walk back to the bar.

It is empty except for Jeffrey Bernard and, behind the bar, a cow.

You need to sober up. Badly.

[[Talk to Jeffrey Bernard|Jeffrey conversation]]

[[Deal with the cow|Jeffrey Bernard's Cow]]

[[Get some food in you|Chinese Fish and Chips]]
```

### Venue Styling Preserved
- SVG coach-beam decorative element (top)
- SVG coach-beam-bottom decorative element (bottom)
- HTML venue title

---

## CRITICAL FIX #2: The Colony Room

**Location:** Line 4848  
**Tag:** `[venue-colony]`  
**Status:** ✓ FIXED

### What Was Broken
1. **Missing atmospheric prose lines:**
   - "The room is greener than you remember it being but less salad than submarine."
   - "There is a touch of obscenity about the whole affair, of the kind a public house could never muster."
   
2. **Missing conditional prose:**
   - Red character conditional encounter
   
3. **Missing choice links:**
   - [[Get a drink|Colony drink choice]]
   - [[Bottle it|Dean Street]]

**Impact:** Missing key environmental description and player navigation options

### What Was Restored
Added after the first-visit-hint:
```
The room is greener than you remember it being but less salad than submarine.

There is a touch of obscenity about the whole affair, of the kind a public 
house could never muster.

(if: $metRed is true)[By the stairs you see Red and he sees you, holds your 
eyes with his own, then, like a disgruntled cat, slips free of your tryst 
imperceptibly.]

|lily4>[<div class="lily-prompt" style="...">⚘</div>]\
(click-replace: ?lily4)[<span class="lily-glimpse lily-fade">Someone in this 
crowd wears her perfume. You've looked and looked again, she is not here. You 
know though, that the scent perfume makes is not generic, it is particular to 
the flesh and blood of she who wears it, born of their live admixture.</span>]

At a table near the window sits an agent about whom you've heard all the 
mythology. You note that she'd be as frightening, given how she holds court and 
herself, if you didn't know her from Adam.

[[Get a drink|Colony drink choice]]

[[Bottle it|Dean Street]]
```

### Venue Styling Preserved
- SVG colony-corner elements (4 corners)
- SVG colony-fan decorative element (top)
- SVG colony-fan-bottom decorative element (bottom)

---

## VERIFICATION: Steve Merkin

**Location:** Line 2168  
**Tag:** `[venue-colony]`  
**Status:** ✓ VERIFIED INTACT

This passage was originally reported as potentially broken but is actually complete:

✓ All dialogue prose intact  
✓ Critical variables present:
  - `(set: $knowsCopperSecret to true)`
  - `(set: $knowsLackland to true)`
✓ Lore box present with password information  
✓ Back link intact  
✓ Venue styling (colony-scene wrapper) preserved  

---

## All Venue-Styled Passages (18 total)

The following passages use venue styling and were checked for integrity:

1. ✓ Beaten [cellar-scene]
2. ✓ Coach and Horses lock [coach-beam] **← FIXED**
3. ✓ Colony drink [colony-scene]
4. ✓ Colony drink choice [colony-scene]
5. ✓ Copper accepts [cellar-scene]
6. ✓ Copper confronts [cellar-scene]
7. ✓ In Copper's lair [cellar-scene]
8. ✓ RS Drink Orders [ronnies-scene]
9. ✓ RS Just Listen [ronnies-scene]
10. ✓ Ronnie Scott's [ronnies-scene]
11. ✓ St. John's Word [cellar-scene]
12. ✓ Stand your ground [cellar-scene]
13. ✓ Steve Lackland [colony-scene]
14. ✓ Steve Merkin [colony-scene]
15. ✓ The Colony Room [colony-scene] **← FIXED**
16. ✓ The French [french-rule]
17. ✓ Trisha's [trishas-frame]
18. ⚠ UserStylesheet [colony-scene] (script passage)

**Result:** No additional breakage detected. All other venue passages remain intact.

---

## Technical Details

### SVG Handling
- SVG decorations are preserved on single lines as required by Harlowe/Twine
- No line breaks introduced within SVG elements
- Decorations appear before prose content (opening) and after (closing)

### Wrapper Structure
The passages now follow this pattern:
```
:: Passage Name [tags]
<opening SVG/div wrapper>
  [Additional SVG decorations]
[ORIGINAL PROSE CONTENT]
<closing SVG/div wrapper>
```

### Variables and Conditionals
- All game-critical variables restored
- Conditionals (metRed, knowsCopperSecret, etc.) verified intact
- State changes properly preserved

---

## Game Flow Impact

**Before Fixes:**
- ✗ Player stuck at Coach and Horses (no exit options)
- ✗ Incomplete Colony Room experience
- ✗ Critical story variables not being set

**After Fixes:**
- ✓ Full navigation restored
- ✓ Complete atmospheric prose
- ✓ All story variables and conditionals functional
- ✓ Venue styling preserved for immersion

---

## Files Modified

- **Source:** `/sessions/blissful-tender-brown/mnt/Claude work/Dream Street Shuffle.twee`
- **Backup Reference:** `/sessions/blissful-tender-brown/mnt/uploads/Dream Street Shuffle (3).html`
- **Original Content Source:** `/sessions/blissful-tender-brown/mnt/Claude work/FIXES.txt`

---

## Verification Checklist

- [x] Coach and Horses lock - All content restored
- [x] The Colony Room - Missing prose and links added
- [x] Steve Merkin - Verified complete
- [x] All 18 venue passages checked
- [x] No new breakage introduced
- [x] SVG formatting verified
- [x] Game variables intact
- [x] Player navigation restored

**RESTORATION STATUS: COMPLETE ✓**

The game is now fully playable with all critical passages restored.
