#!/bin/bash
# 2026-11-14 (Sam: "process the sounds how you like and add reverb"): his five phone recordings (voice-originals/New Recording 154-158.m4a).
# 154 is the Tony Adams chant for the coin toss (tony-adams-chant.m4a); 155-158 are odd shouts for the pubs' hubbub, cut into one sheet
# (pub-calls.m4a, 4.5 s a slot). Each: silence trimmed, high-passed, a synthetic room (decaying noise as the impulse) mixed under it,
# then levelled to -24 LUFS. Run from the project folder; needs ffmpeg.
set -e
W="${1:-/tmp/voice-clips}"; mkdir -p "$W"
ffmpeg -hide_banner -loglevel error -y -f lavfi -i "anoisesrc=d=1.3:c=white:r=48000:a=0.6:s=11" -f lavfi -i "anoisesrc=d=1.3:c=white:r=48000:a=0.6:s=29" \
  -filter_complex "[0][1]amerge=inputs=2,highpass=f=250,lowpass=f=4200,afade=t=in:d=0.012,afade=t=out:st=0.012:d=1.28:curve=exp,volume=0.5" "$W/ir.wav"
proc() { # in out wet lowpass [semitones: the pitch moved with its formants, so the voice is not his]
  ST="${5:-0}"; R=$(python3 -c "print(2 ** ($ST / 12))")
  ffmpeg -hide_banner -loglevel error -y -i "$1" -af "aformat=channel_layouts=stereo,aresample=48000,asetrate=$(python3 -c "print(48000 * $R)"),aresample=48000,atempo=$(python3 -c "print(1 / $R)"),silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.08,areverse,highpass=f=95,lowpass=f=$4,afade=t=in:d=0.01,apad=pad_dur=1.3" "$W/dry.wav"
  ffmpeg -hide_banner -loglevel error -y -i "$W/dry.wav" -i "$W/ir.wav" -filter_complex "[0]asplit[d][s];[s][1]afir=dry=0:wet=1[w];[d][w]amix=inputs=2:weights='1 $3':normalize=0,alimiter=limit=0.9" "$W/wet.wav"
  I=$(ffmpeg -hide_banner -i "$W/wet.wav" -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | awk '{print $2}')
  G=$(python3 -c "print(round(-24.0 - ($I), 2))")
  D=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$W/wet.wav")
  ffmpeg -hide_banner -loglevel error -y -i "$W/wet.wav" -af "volume=${G}dB,alimiter=limit=0.95,afade=t=out:st=$(python3 -c "print(max(0, $D - 0.25))"):d=0.25" "$2"
  echo "$1 -> $2: was $I LUFS, gain $G dB, $(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$2") s"
}
# then (Sam: "With the chant, just take the second half of it"; "not to cut off the very end"; "like a whole stadium in unison"): the
# recording is two halves with a pause between (1.5 to 4.7 s, 5.5 to 9.5 s). The second alone, run on a second past its last word, and
# multiplied into a terrace by tools_crowd.py, then levelled to -24 LUFS with a long fade on the bowl's tail.
python3 tools_crowd.py "voice-originals/New Recording 154.m4a" 5.40 10.45 "$W/crowd.wav" "$W"
I=$(ffmpeg -hide_banner -i "$W/crowd.wav" -af ebur128 -f null - 2>&1 | grep -E '^\s+I:' | tail -1 | awk '{print $2}')
D=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$W/crowd.wav")
ffmpeg -hide_banner -loglevel error -y -i "$W/crowd.wav" -af "volume=$(python3 -c "print(round(-24.0 - ($I), 2))")dB,alimiter=limit=0.95,afade=t=out:st=$(python3 -c "print($D - 1.2)"):d=1.2" "$W/tony.wav"
echo "chant: crowd was $I LUFS, $D s"
ffmpeg -hide_banner -loglevel error -y -i "$W/tony.wav" -c:a aac -b:a 160k tony-adams-chant.m4a
N=0; IN=""; FC=""
# 2026-11-14 (Sam: "process the pub voices to make them sound more anonymous, perhaps pitch shift them"): each shout a different stranger, two lower, two higher, each with its own top end
STS=(-3.5 2.5 -5 1.5); LPS=(4200 5600 3600 5000); J=0
for k in 155 156 157 158; do proc "voice-originals/New Recording $k.m4a" "$W/c$k.wav" 0.6 ${LPS[$J]} ${STS[$J]}; J=$((J+1)); IN="$IN -i $W/c$k.wav"; FC="$FC[$N]apad=whole_dur=4.5,atrim=end=4.5[a$N];"; N=$((N+1)); done
ffmpeg -hide_banner -loglevel error -y $IN -filter_complex "${FC}[a0][a1][a2][a3]concat=n=4:v=0:a=1" -c:a aac -b:a 144k pub-calls.m4a
