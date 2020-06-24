#!/usr/bin/env bash

BASE=$(dirname "$0")/../
BIN=$BASE/bin/x64/Release
OUT=$BASE/publish/cactbot-release/cactbot

rm -rf "$OUT"
mkdir -p "$OUT"

cp -r "$BIN"/{CactbotOverlay.dll,CactbotEventSource.dll} "$OUT/"
cp -r "$BASE"/{ui/,resources/,*.md} "$OUT/"

# manually copy readme due to avoid local user/ files
mkdir -p "$OUT/user/"
cp "$BASE"/user/{README.txt,*-example.*} "$OUT/user/"
