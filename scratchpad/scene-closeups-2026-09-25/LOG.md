# Inside the French, with close-ups — 2026-09-25, 01:42 to 03:25 UTC

Branch `claude/scene-closeups-pe93vp`, one commit on top of `claude/strangers-loop-2026-09-25-iuew5q` (which was not merged; that branch already contains main 3aae110, so merging this one brings the strangers loop with it). Screenshots in this folder under `inside-the-french-2026-09-25/`.

## Where it came from
The Oliver Twist files (`fagins-den-scene.src.js`, the "MYST LAYER") do it like this: a list of hotspots, each with the mesh to hit, a camera position and target, and a label; a raycast on pointer move gives a hover halo and a pointer cursor; a click tweens the camera (smoothstep, about 1.5 s) into the position and shows a caption card at the foot of the screen; a click anywhere steps back to the idle view. Visit and leave hooks let an object react (the strongbox lid opens). Carried over as-is, with the tween driven by real time so it takes the same 1.5 s at any frame rate.

## What is built
A new passage, **Inside the French** (tag `venue-french`, so the French bed plays and the header exit shows), between the exterior approach and The French. The approach's ENTER THE FRENCH now lands here; the bar, or the TO THE BAR button, goes on into The French exactly as before (the hidden `·` link is clicked; the `$frenchApproached` flag still travels). The room is built to Sam's photo: the counter running away on the left with cream panels, brass rail and three pump handles; the back bar with mirror, three shelves of bottles, the till and the telephone; the frieze of caricature prints under an ochre ceiling; the rust-red back wall with the row of eight framed photographs over a dark dado; the blue door at the back right; red stools; red patterned carpet; two globe lamps. Three barely-there figures stand at the bar (pale, additive, breathing slowly). Dust in the lamp light. Courier caption "THE FRENCH HOUSE, DEAN STREET" and a hint "LOOK CLOSER AT WHAT CATCHES YOUR EYE" that fades after nine seconds.

Five things to click (the words on the cards are pink placeholders, Sam's to write):
1. **The photographs** on the back wall: seven faces and one frame gone pale (the trace).
2. **The telephone** behind the bar, the one that rings for Lily, off duty.
3. **The glass on the bar**, half drunk, with the wet ring beside it where the last one stood.
4. **The blue door** to the stairs: when looked at, a line of light appears under it.
5. **The bar** itself: the camera pushes in and the scene fades to black into The French (same as the button).

Hover: warm halo sprite and a pointer cursor (mouse only; on touch a tap goes straight in). Click anywhere to step back. Reduced motion: no tween, no breathing, cuts.

## Play
One extra click per visit to the French (the bar or the button). The passage logic in The French (phone rings, lily, visits count, drinks, the Stranger, the artists, the novelist) is untouched; the interior only sits in front of it.

## Verified (headless Chromium, software GL; Safari not run)
1280×900 and 390×780, and 1280 under prefers-reduced-motion: all four close-ups open with their card, step back, the bar leads to The French, the wrap is disposed, 0 JS errors. Portrait uses a wider lens (78°) from further back so the telephone is in frame.

## Not done / for Sam
- The hover halo is faint at play size; the cursor carries most of the signal. Could be louder.
- The lamp glow sprites hardly read; the globes themselves are lit.
- The frieze prints are procedural caricatures, not the real prints.
- The window on the right wall (with the plant) is out of frame in the idle view.
- Whether the door's line of light, or the phone, should tie to game state (a pending Lily call) is a design call for Sam.
- Tools: repo `scratchpad/scene-closeups-2026-09-25/fi_shot.py` (run from `scratchpad/audit-2026-09-16` with `PYTHONPATH=.`, needs `python3 -m http.server 8777` in the repo root) and `fi_scene.js` (the scene source as spliced into the UserScript between the French approach and the Coach block).
