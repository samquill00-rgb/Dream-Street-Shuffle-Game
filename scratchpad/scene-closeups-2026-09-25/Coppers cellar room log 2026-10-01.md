# Copper's Lair as a room, with close-ups — 2026-10-01

Fifth room overall, first of the six built on this branch (`claude/remaining-rooms-dkn0fw`). Built from the existing Copper's Lair approach scene (the cellar under the Colony: block walls with their drips, concrete floor, joists and pipes, one bare bulb on its wire, the table at the far end, the chesterfield on its rug, the puddle) and from what the passage says.

## Where it sits
Top of the passage **Turn to Copper**, under the PR #10 rule: the passage's words sit on the translucent panel over the room, centred low, scrolling when long; the room stays clickable through them. The drawn bulb (`cellar-bulb-wrap`) and the cellar light that used to sit under the words are gone; the `cellar-scene` wrapper stays (other passages share its styles) and is flattened under the room.

## The close-ups and what they hold
- **Copper** (standing in front of you): the card offers the passage's own choices, "Say nothing" and, once the crossing is open, "Give him Red's name" and "Give him John's name". Those links are hidden from the panel while an object holds them.
- **Ashton Granger** (at the table, twirling her hair): the card offers "Break the agreement. Look at her." while the passage offers it. Once a crossing is made she is an inspection.
- **Quiet Frankie**, **the bulb**, **the stairs**, **the chesterfield**: inspections, each with one pink `[Sam: …]` line on the card for Dr Quill to rewrite.
- **The password box** (when he knows the words) stays in the panel, and a press on it through the room focuses it.

## Verified (headless Chromium; Safari not run)
Desktop walk at 1280×900: 26 checks, 0 fails, no JS errors, including the approach scene landing in the room and the password box focusing through the room. Phone walk at 390 wide: 25 checks, 0 fails. Reduced-motion walk at 1280: 25 checks, 0 fails. Script `cu_routes.py`.

Every check runs in headless Chromium against a local http server; Safari was not run. The four earlier rooms (French, Colony, Pillars, Ronnie's) were not re-walked on this branch; their phone and reduced-motion batch is still owed.

Scripts and room sources: `scratchpad/scene-closeups-2026-09-25/rooms-2026-09-30/` in the repo (`room_kit.js`, `xx_room.js`, `apply_rooms.py`, `five_routes.py`, `cu_routes.py`, `diag.py`).

## Mine, flagged
No lettering was invented for this room. The six card lines are pink placeholders.

## For Dr Quill to weigh
- Whether the stairs should stay an inspection or carry a way back up (the passage has none).
- The cellar is lit for the figures to read against the walls; it can go darker if he wants the bulb to do more of the work.
