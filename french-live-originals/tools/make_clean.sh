#!/bin/bash
# Rebuild tools/clean/ (mono float sources) from the raw phone files, then: python3 recipes.py [name ...]
# Needs numpy + scipy (the system /usr/bin/python3 has them). Renders land in tools/out/.
cd "$(dirname "$0")"; mkdir -p clean out; eval "$(grep -E '^(BAR|OUTS|GENTS)=' polish.sh)"
for pair in "143:BAR:french-bar-raw-rec143" "144:OUTS:french-outside-raw-rec144" "144:BAR:french-outside-raw-rec144" "145:GENTS:french-stairs-gents-raw-rec145" "145:BAR:french-stairs-gents-raw-rec145"; do
  IFS=: read n c f <<< "$pair"; ch="${!c}"
  ffmpeg -v error -y -i "../$f.m4a" -ac 1 -ar 48000 -af "$ch" -c:a pcm_f32le "clean/rec${n}_${c}.wav" && echo "clean/rec${n}_${c}.wav"
done
