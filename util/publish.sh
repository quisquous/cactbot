BASE=$(dirname "$0")/../
BIN=$BASE/bin/x64/Release
OUT=$BASE/publish/cactbot-release/
OUT_ADDON=$OUT/OverlayPlugin/addons/
OUT_HTML=$OUT/OverlayPlugin/cactbot

rm -rf $OUT
mkdir -p $OUT_ADDON/
mkdir -p $OUT_HTML/

cp -r $BIN/CactbotOverlay.dll $OUT_ADDON/
cp -r $BASE/ui/ $OUT_HTML/
cp -r $BASE/resources/ $OUT_HTML/
cp $BASE/*.md $OUT/

# manually copy readme due to avoid local user/ files
mkdir -p $OUT_HTML/user/
cp $BASE/user/README.txt $OUT_HTML/user/
cp $BASE/user/*-example.* $OUT_HTML/user/
