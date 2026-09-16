# three.js r128 (npm three@0.128.0), vendored 2026-09-16

The game's 3D scenes used to fetch this library from two public CDNs
(cdnjs for `three.min.js`, jsdelivr for the post-processing add-ons). A
player offline or behind an ad-blocker got an empty canvas. These are the
same files, kept beside the game so it loads them from here.

- `three.min.js` = build/three.min.js
- `postprocessing/*.js`, `shaders/*.js` = examples/js/... (the non-module
  builds that attach to the global THREE, which is what the scenes expect)

Referenced from `Dream Street Shuffle.twee` (UserScript loaders and
`window.dssPostScriptURLs`) and from the three iframe scenes:
oxford-street-from-centre-point, cecil-court, green-sea -3d-static.html.
To upgrade, change every path in those files together; the add-ons must
match the core version.
