#!/bin/bash
RAW="$1"; OUT="$2"; mkdir -p "$OUT"
# per-source clean-up chains (mono)
BAR="highpass=f=80:p=2,bandreject=f=100:t=h:w=4,bandreject=f=100:t=h:w=10,equalizer=f=200:t=q:w=1.2:g=-8,equalizer=f=140:t=q:w=1.5:g=-4,afftdn=nr=8:nf=-45:tn=1,equalizer=f=2000:t=q:w=1.0:g=4,equalizer=f=4000:t=q:w=1.0:g=6,highshelf=f=5000:g=10"
OUTS="highpass=f=100:p=2,bandreject=f=100:t=h:w=6,equalizer=f=160:t=q:w=1.2:g=-7,equalizer=f=250:t=q:w=1.5:g=-4,afftdn=nr=8:nf=-48:tn=1,equalizer=f=2000:t=q:w=1.0:g=3,equalizer=f=4000:t=q:w=1.0:g=6,highshelf=f=5000:g=10"
GENTS="highpass=f=100:p=2,equalizer=f=130:t=q:w=1.0:g=-8,equalizer=f=200:t=q:w=1.4:g=-6,afftdn=nr=10:nf=-55:tn=1,equalizer=f=2000:t=q:w=1.0:g=4,equalizer=f=4000:t=q:w=1.0:g=6,highshelf=f=5000:g=6"
STAIR="highpass=f=70:p=2,bandreject=f=100:t=h:w=6,equalizer=f=200:t=q:w=1.4:g=-6,afftdn=nr=8:nf=-45:tn=1,equalizer=f=2000:t=q:w=1.0:g=4,equalizer=f=4000:t=q:w=1.0:g=6,highshelf=f=5000:g=10"
# subtle decorrelated stereo: different all-pass pairs per side (no delay, mono-compatible), then a touch of width
STEREO="asplit[x][y];[y]allpass=f=500:w=0.5,allpass=f=2000:w=0.5,allpass=f=6000:w=0.5[s];[x][s]join=inputs=2:channel_layout=stereo,pan=stereo|c0=c0+0.28*c1|c1=c0-0.28*c1"
lufs() { ffmpeg -hide_banner -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/^ *I:/{i=$2} /^ *Peak:/{p=$2} END{print i, p}'; }
finish() { # wav, target, out
  read cur pk < <(lufs "$1"); gain=$(echo "$2 - $cur" | bc -l)
  ffmpeg -y -hide_banner -loglevel error -i "$1" -af "volume=${gain}dB,alimiter=limit=-1.5dB:attack=5:release=80:level=false" -c:a aac_at -b:a 128k -movflags +faststart "$3"
  read fin fpk < <(lufs "$3"); d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$3")
  printf "%-34s %8.3fs  I=%s LUFS  peak=%s dBFS  gain %+.1f dB\n" "$(basename "$3")" "$d" "$fin" "$fpk" "$gain"; rm -f "$1"
}
loop() { # src, start, end, xf, chain, target, out
  B=$(echo "$3 - $2 - $4" | bc -l)
  ffmpeg -y -hide_banner -loglevel error -i "$1" -filter_complex "[0:a]atrim=start=$2:end=$3,asetpts=PTS-STARTPTS,$5,asplit[s1][s2];[s1]atrim=start=$B,asetpts=PTS-STARTPTS[tail];[s2]atrim=end=$B,asetpts=PTS-STARTPTS[body];[tail][body]acrossfade=d=$4:c1=qsin:c2=qsin,$STEREO[out]" -map "[out]" -c:a pcm_s16le "$OUT/_t.wav"
  finish "$OUT/_t.wav" "$6" "$OUT/$7"
}
oneshot() { # src, start, end, fade, chain, target, out
  FO=$(echo "$3 - $2 - $4" | bc -l)
  ffmpeg -y -hide_banner -loglevel error -i "$1" -filter_complex "[0:a]atrim=start=$2:end=$3,asetpts=PTS-STARTPTS,$5,afade=t=in:d=$4,afade=t=out:st=$FO:d=$4,$STEREO[out]" -map "[out]" -c:a pcm_s16le "$OUT/_t.wav"
  finish "$OUT/_t.wav" "$6" "$OUT/$7"
}
loop    "$RAW/rec143.wav"  0.0  78.2   3.0 "$BAR"   -30.2 "the-french-pub-live.m4a"
loop    "$RAW/rec145.wav" 20.0  67.032 3.0 "$GENTS" -33.3 "the-gents-french-live.m4a"
loop    "$RAW/rec144.wav"  4.0  79.0   3.0 "$OUTS"  -31.0 "the-french-outside-live.m4a"
oneshot "$RAW/rec145.wav"  0.0  19.5   0.4 "$STAIR" -30.0 "the-french-stairs-down-live.m4a"
oneshot "$RAW/rec145.wav" 89.5 102.0   0.4 "$STAIR" -30.0 "the-french-stairs-up-live.m4a"
