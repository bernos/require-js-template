#! /bin/bash
MAJOR=0
MINOR=0
POINT=1
OUT=src/js/libs/piewpiew/piewpiew-backbone-$MAJOR.$MINOR.$POINT.min.js

echo "/* piewpiew-backbone library v$MAJOR.$MINOR.$POINT */" > $OUT


uglifyjs -nc src/js/libs/piewpiew/piewpiew-backbone.js >> $OUT