#!/bin/zsh
# finish.sh <wav> <target LUFS> <out.m4a> [<out.mp3>] : level a render to a target integrated loudness, write AAC (and an mp3 preview)
WAV="$1"; TGT="$2"; OUT="$3"; MP3="$4"
L=$(ffmpeg -nostats -i "$WAV" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E '^\s+I:' | awk '{print $2}')
G=$(python3 -c "print(round(($TGT)-($L),1))")
ffmpeg -y -v error -i "$WAV" -af volume=${G}dB -c:a aac -b:a 192k -movflags +faststart "$OUT"
[ -n "$MP3" ] && ffmpeg -y -v error -i "$WAV" -af volume=${G}dB -c:a libmp3lame -q:a 2 "$MP3"
echo "$(basename "$OUT"): wav $L LUFS, gain ${G} dB, out $(ffmpeg -nostats -i "$OUT" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E '^\s+I:' | awk '{print $2}') LUFS, $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT") s"
