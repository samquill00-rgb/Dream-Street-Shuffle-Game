# The Chinese Fish and Chips as a room, with close-ups — 2026-10-01

Built from what is written of the chippy on Greek Street: a narrow shop under strip lights, the stainless range with its fryers and hot cabinet, a menu board, a formica counter you eat at, salt and vinegar, the window onto the street and the street going past it.

## Where it sits
Top of the passage **Chinese Fish and Chips**, PR #10 layout. The two strip-light divs and the two neon tube SVGs that sat under the words are gone; the `chippy-scene` wrapper stays because it carries the flower-only dimming when the lily is still there after eating.

The room's id is `cf` (not `cc`): `cc-wrap` already belongs to the Cecil Court approach, which removes any element of that id whenever its own container is absent. The first build mounted and vanished at once for that reason.

## The close-ups and what they hold
- **Your plate** on the counter: offers "Eat." (the passage's own link, which sets the chippy flags and returns to Dean Street).
- **The window**: holds the lily while the passage offers it. The card button reads `[Sam: the lily]` in pink; pressing it presses the lily hook itself, so the sobriety gate and the lost-to-drink count are still Harlowe's. A ghost of Lily passes outside the glass. Once taken, the window is an inspection.
- **The range**, **the menu**, **the ticket**, **the empty table**, **the door**: inspections, one pink line each.

The camera stands at the back of the shop looking toward the street window, since the window is the room's point; the range and menu board are on the left wall.

## Verified (headless Chromium; Safari not run)
Desktop walk at 1280×900: 23 checks, 0 fails, no JS errors (first visit with the lily, the lily pressed from the window card and taken, Eat. landing on Dean Street; lily already taken). Phone walk at 390: 23 checks, 0 fails. Reduced-motion at 1280: 23 checks, 0 fails. Script `five_routes.py cf`.

Every check runs in headless Chromium against a local http server; Safari was not run. The four earlier rooms (French, Colony, Pillars, Ronnie's) were not re-walked on this branch; their phone and reduced-motion batch is still owed.

Scripts and room sources: `scratchpad/scene-closeups-2026-09-25/rooms-2026-09-30/` in the repo (`room_kit.js`, `xx_room.js`, `apply_rooms.py`, `five_routes.py`, `cu_routes.py`, `diag.py`).

## Mine, flagged
- Menu board: COD & CHIPS 38p, HADDOCK & CHIPS 40p, ROCK & CHIPS 35p, CHIPS 10p, SAVELOY 8p, CHICKEN CHOW MEIN 45p, SPECIAL FRIED RICE 40p, CURRY SAUCE 5p.
- Window lettering FISH & CHIPS and 中國 / 魚 薯條; an OPEN sign; the ticket's 47.
All invented, replaceable.

## For Dr Quill to weigh
- The strip lights are bright on purpose; the shots read near-white at the window end and he may want it down.
