# The French: the room is the passage's own navigation — 2026-09-26, 01:40 to 03:30 UTC

Branch `claude/scene-closeups-pe93vp`, commit 0cc96ba on top of Astra's graphics lift (d244293 "updates"). The lift is on this branch only; PR #1 merged the branch before it, so main has the plain room. Merging this branch brings the lift and the navigation together. Screenshots in `french-room-navigation-2026-09-26/`.

## What changed
- The room now sits inside **The French** itself (`<div id="fi-container">` just above the French rule), between the title and the passage's own text. There is no separate "enter the pub" step any more: ENTER THE FRENCH lands on The French with the room. `Inside the French` stays only as a forward (`(go-to: "The French")`, tag `system`) for anything that still points there.
- Clicks drive the passage's own links. When the camera pushes in, the card shows the passage's currently rendered links as buttons, in their own words; pressing one clicks the real Harlowe link, so its `(set:)`s, `(go-to:)` and `(replace:)` run exactly as before. Nothing about the game state is decided in JavaScript.
  - **The bar**: "Get a drink at the bar" when the passage offers it (second genuine visit, venue not exhausted); otherwise the pink inspection line.
  - **The telephone**: the two ringing choices when the phone rings ("Accept the call" / "I'm not here", or "Accept the call" / "Turn and leave" for the dual ring), with Sam's ringing line above them; after a refusal, "Back to the street"; otherwise the pink inspection line. The game's own ringing modal still appears over the room as before, so the card is a second way to the same links.
  - **The man at the bar** (second stool): "Approach" (the Stranger, or the novelist later) or "Approach the artists", whichever the passage has rendered.
  - **The painter** (fourth stool): "Sketch him on a napkin" when that link exists.
  - A figure with no path offered is not clickable at all (the tap falls through to the counter). Photographs, glass and blue door stay inspections with their pink lines.
- The figures got a slim unseen hit body (a 0.2 m cylinder) so a tap on the counter beside a figure is the counter's; their sprites are unchanged, still faint traces. The bar's halo point moved to a clear stretch of counter between the two.
- The room is 100vw wide, 66% of the viewport tall on desktop and 56% on a phone (min 300 px), so the arrival prose and all the passage's links stay readable and clickable below it; the header's EXIT TO THE STREET stays above it.
- Removed: the TO THE BAR button, the fade-to-black curtain and the `goIn` route (the room no longer leads anywhere by itself).

## Gates retained (all in Harlowe, untouched)
FrenchVisits only increments on `$frenchApproached`; `_lilyRing` / `_dualRing` priority; drink on `_fc >= 2` and not both haunts; Stranger not haunt4; artists haunt4 and not haunt1; sketch haunt1 and not hasDrawing; novelist haunt1 and not haunt2; exhausted NOT NOW with "Leave the French" and the Colony link; flower/lily5; drink return via `$justDranked`/`$lastDrink`; lighter offer on `$inisToldOfPillars` and `$keyLighter is "seed"`; Ezekiel residue.

## Verified (headless Chromium, software GL; Safari not run)
`scratchpad/scene-closeups-2026-09-25/fi_routes.py` at 1280×900, 390×780 and 1280 with prefers-reduced-motion set before the page loads: 0 fails each, 0 JS errors.
- First arrival: the man at the bar offers Approach → The Stranger at the French; the bar is an inspection; the room is disposed on leaving.
- Second genuine visit: the bar offers the drink → Which drink at the French?; the painter offers the sketch; the man at the bar offers Approach (novelist).
- Exhausted: no figure clickable, NOT NOW, "Leave the French" and the Colony link below the room.
- Lily ring: telephone card shows Accept / I'm not here with Sam's line; refusal stays in The French, its (replace:) runs, the telephone then offers Back to the street; Accept → Lily phone call 1. No encounter link exists while it rings (no bypass).
- Dual ring: Accept / Turn and leave; Turn and leave → The Fetch.
- Drink return with `$justDranked`: the popup hook renders, no drink link (so no visit counted), room still mounted. Flower: the lily below the room is clickable and the glimpse line appears. Lighter offer renders.
- Inside the French forwards; ENTER THE FRENCH lands on The French with the room.
- Phone size: the man, the painter, the bar and the telephone are all in frame and were tapped at genuine viewport points. The blue door and the right-hand photographs are at the frame edge in portrait (inspections only).
- Keyboard: the passage's own links keep tabindex 0 below the room, so everything the card offers is also reachable without the room.

## For Sam
- The five pink card lines (photographs, telephone off duty, glass, door, bar with no drink) and the three hotspot names shown in Courier ("the man at the bar", "the painter") are placeholders.
- Whether the telephone card should exist at all while the game's own ringing modal already appears; the card is harmless but doubles it.
- The figures are faint at play size on a phone; the hover halo is mouse-only.
- Next scenes are Sam's to name; the pattern (container in the venue passage, hotspots that press the passage's own links by their text) copies across.
