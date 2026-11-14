#!/bin/bash
# 2026-11-14 (Sam: "process the sounds how you like and add reverb"): his five phone recordings (voice-originals/New Recording 154-158.m4a).
# 156 is an odd shout for the pubs' hubbub (155, 157 and 158 were dropped at Sam's word, to be recorded again), in a sheet
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
# The Tony Adams chant (New Recording 154, its second half made a stadium by tools_crowd.py) was taken out of the game the same night at
# Sam's word. To make it again: python3 tools_crowd.py "voice-originals/New Recording 154.m4a" 5.40 10.45 out.wav
# 2026-11-14 (Sam: "process the pub voices to make them sound more anonymous, perhaps pitch shift them"): each shout a different stranger, two lower, two higher, each with its own top end
# then (Sam: "I only like pub shout two, the others need to be redone so I'll do them tomorrow"): 156 alone for now, up 2.5 semitones;
# add the new takes here as further slots (4.5 s each) and raise PUB_CALLS_N in the game to match
proc "voice-originals/New Recording 156.m4a" "$W/c156.wav" 0.6 5600 2.5
ffmpeg -hide_banner -loglevel error -y -i "$W/c156.wav" -af "apad=whole_dur=4.5,atrim=end=4.5" -c:a aac -b:a 144k pub-calls.m4a
