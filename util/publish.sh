BASE=$(dirname "$0")/../
BIN=$BASE/bin/x64/Release
OUT=$BASE/publish/cactbot-release/cactbot

rm -rf $OUT
mkdir -p $OUT

cp -r $BIN/CactbotOverlay.dll $OUT/
cp -r $BASE/ui/ $OUT/
cp -r $BASE/resources/ $OUT/
cp $BASE/*.md $OUT/

# manually copy readme due to avoid local user/ files
mkdir -p $OUT/user/
cp $BASE/user/README.txt $OUT/user/
cp $BASE/user/*-example.* $OUT/user/
