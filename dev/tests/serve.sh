#!/bin/sh
# Serves the built site the way GitHub Pages does: http://localhost:8791/hamtercocol/next/ (pictures from /hamtercocol/img/, the 3D map from /hamtercocol/map-app/).
# Run from the repo root after `cd web && npm run export`.
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
SRV=${TMPDIR:-/tmp}/hh-srv
mkdir -p "$SRV/hamtercocol"
ln -sfn "$ROOT/img" "$SRV/hamtercocol/img"
ln -sfn "$ROOT/web/out" "$SRV/hamtercocol/next"
ln -sfn "$ROOT/map-app" "$SRV/hamtercocol/map-app"
cd "$SRV" && exec python3 -m http.server 8791
