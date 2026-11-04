# Ezekiel — the theme, five times (2026-11-04, Sam: "increasingly maximalist and glittery", Rustie as the reference)

Sam's Dream Street theme (the 21-note Bluebird lead from his Logic experiment, at half speed with its own timings) stated
five times over its organ foundation (Am for eight bars, F two, E two, Am four), each statement bigger than the last.
120 bpm, 4/4; one statement = 16 bars = 32 s. Intro 2 bars, statements bars 3-82, a tail. 171 s in all.
Game loop: statements IV-V, bars 51-82 (100 s to 164 s): the player hears the whole build once, then stays in the glitter.

I   (4-36 s)   the theme on organ, the wheel bells begin at bar 9 (G F E every 0.75 s; C B G# A E every 1.25 s from bar 13).
II  (36-68 s)  low brass under the long notes, a sub pulse on the roots, bells doubled, hats; the first glitter arp in the last four bars; riser and snare build.
III (68-100 s) halftime drums (kick 1, snare 3), supersaw pads sidechained to the kick, the theme doubled on an FM glass lead an octave up, glitter arp in 16ths through two octaves.
IV  (100-132 s) LOOP START: supersaw stabs, trap hats with 32nd rolls, clap on the snare, the glass lead in octaves, bells at four times density, glitter in 32nds.
V   (132-164 s) the top: octave sub, lead two octaves up as well, both glitters, bell cascades on every bar; riser, snare build, LOOP END.

Tracks: organ foundation (19), theme organ (19), bells (14), brass (61), sub (38), supersaw (90), glitter arp (98), FM glass lead (88),
risers (102), drums ch 10 (kick 36, snare 38, clap 39, hats 42/46, crash 49). The preview is the numpy synth in tools/render_max.py.
Rebuild: `cd tools; python3 compose_ezekiel_max.py "../Ezekiel (max).mid" "../Ezekiel theme variation.mid"; python3 render_max.py "../Ezekiel (max).mid" "../Ezekiel (max preview).wav"`;
then `ffmpeg -i "Ezekiel (max preview).wav" -af volume=-6.0dB -c:a aac -b:a 192k ezekiel-music.m4a` (-20.3 LUFS) beside the html.
Superseded on the same night: the plain shortened loop (tools/shorten_loop.py, "Ezekiel theme variation (game).mid"), kept for reference.
