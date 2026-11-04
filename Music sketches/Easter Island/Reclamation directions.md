# The Reclamation — minigame music (2026-11-04, take 2, from Sam's "Easter island atmosphere" form)

Take 2 (Sam: "There is no main melody and that sounds bad. Make the focal point rhythmic and harmonic"): no lead line.
The breath-horn call (E B E F E B) is the CHORD CYCLE, Em Bm Em F, the F the menace. The bass riff's rhythm is the hook
(x . x x . x . x in eighths with octave pickups). A square lead runs chord tones as 16ths, a saw hits the chords on the
off-beats, Sam's thumb-piano figure runs in 16ths on a chip pluck (every note up a semitone over F), the night harmonics
E G A B are slow chord bells, the stone fifths E2 B2 are the pad floor, and his Dreamscape gesture (B C# D# E) is a
pad wash in the half-time section, never a tune.

150 BPM, 4/4, 36 bars + a hit = 59 s. Loop for the game: bars 5–36 (6.4 s to 57.6 s); intro bars 1–4 once on "Take the rifle".

Form: intro 1–4 (stone fifths, the bass riff finds its feet) · A 5–12 (the riff on Em Bm Em F, square arps, off-beat stabs, drive) ·
B 13–20 (G Am Em F, the thumb piano running, four-on-the-floor, arps up an octave from bar 17) · C 21–28 (half-time: the
cluster wash and the harmonics bells; then the drive back on the call) · break 29–32 (bass and drums on the call, thumb piano
alone, bar 32 on F) · build 33–36 (arps climbing, every stab, snare build on F then E) · bar 37 one hit.

Tracks (GM fallbacks in the file): square lead (80), saw lead (81), synth bass (38), pad (89), thumb piano (108), bell (92),
drums ch 10 (kick 36, snare 38, hat 42/46, crash 49, timbale 65). Preview is the synth approximation in tools/render_reclaim.py.
Rebuild: `cd tools; python3 compose_reclaim.py "../Reclamation.mid"; python3 render_reclaim.py "../Reclamation.mid" "../Reclamation (preview).wav"`;
then `ffmpeg -i "Reclamation (preview).wav" -af volume=-7.6dB -c:a aac -b:a 192k reclamation-music.m4a` (-19.9 LUFS) beside the html.
