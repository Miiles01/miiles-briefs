#!/bin/bash
# Renderiza composiciones a 720×1280 para la galería.  Uso: ./rr.sh Id [Id...]
# Si Remotion no encuentra Chrome: CHROME=/ruta/al/chrome ./rr.sh Id
cd "$(dirname "$0")"
mkdir -p out galeria/videos
B=${CHROME:+--browser-executable=$CHROME}
for id in "$@"; do
  npx remotion render src/index.ts $id out/$id.mp4 $B --gl=angle --log=error < /dev/null && \
  ffmpeg -nostdin -y -loglevel error -i out/$id.mp4 -vf scale=720:1280 -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart -an galeria/videos/$id.mp4 && echo "OK $id"
done
