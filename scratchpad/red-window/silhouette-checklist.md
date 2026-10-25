# Simple 3D silhouette revision
- [x] Replace the portrait with flowing, simple 3D geometry.
- [x] Preserve the soft red light and restore head/body/hand movement.
- [x] Check the close-up and animation; sync and show a preview.

Implementation: code-native curved extruded silhouette with a continuous shoulder/waist/dress outline, separate curved hip arm, turned profile, one swept hair crescent, and continuous raised forearm/palm. No generated portrait, eyes, lips, jewellery or patterned dress texture. Low-contrast cheek rim and muted red room gradient/curtain folds supply the visual detail. Body sways/leans, head tilts, raised arm and palm turn toward the glass. Original appearance/withdrawal state machine and camera close-up retained. Reduced motion is stationary and visible. The red sash moved just forward of the silhouette's shallow geometry so she stays behind the window bar. Prior generated assets retained as unused references.

QA: actual-source isolated browser fixture, shared fitting helper, lower pixel ratio and shadows disabled for software WebGL. Separate body/head/arm/hand rotation changes observed with static room; present opacity .94, withdrawal to away/0, reappearance to present/.94. Escape desktop and Back phone exits passed; no page errors. Final screenshots /private/tmp/dss-window-silhouette.png and /private/tmp/dss-window-silhouette-phone.png. Production synced; full game route/postprocessing not exercised.
