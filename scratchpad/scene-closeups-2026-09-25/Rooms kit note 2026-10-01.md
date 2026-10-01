# The room kit — what the six later rooms share — 2026-10-01

The four rooms built in September (French, Colony, Pillars, Ronnie's) each carry a full copy of the room machinery in the UserScript. The six rooms built on 2026-10-01 (Coach and Horses, Trisha's, Lackland's office, the Chippy, Copper's cellar, O'Flatterly's) call one shared block, `window.dssRoomKit(spec)`, so each room is only its geometry and its close-ups. The kit replicates Ronnie's machinery exactly: the wrap sized to the window, the renderer and the outside scenes' composer, the grain and varnish textures, the environment cube, the mirror, the ghosts, the hover halo and the resting glow (`window.DSS_RESTGLOW`), the card, the words panel (`window.dssRoomProse`), the camera tweens and the pick. Nothing about the game is decided in it: a room finds the passage's own links by their wording and presses them from the card, so every gate stays Harlowe's.

Two things found on the way, for whoever builds next:
- The Chippy's room id is `cf`. `cc-wrap` belongs to the Cecil Court approach, which deletes any element of that id whenever its own container is absent; the first Chippy build mounted and vanished for that reason.
- The audit harness renders rooms 1280×360, the real page about 1280×565, so an object that is in view in the harness can be out of view on the page and vice versa. `diag.py` projects every hotspot with the page's aspect; every clickable in the six rooms sits inside the frame at both.

Sources: `scratchpad/scene-closeups-2026-09-25/rooms-2026-09-30/` in the repo.
