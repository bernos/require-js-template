#! /bin/bash

#-----------------------------------------------------------------------------
# piewpiew-core
#-----------------------------------------------------------------------------
MAJOR=0
MINOR=0
POINT=1
IN=src/js/libs/piewpiew/piewpiew-core.js
OUT=src/js/libs/piewpiew/piewpiew-core-$MAJOR.$MINOR.$POINT.min.js

echo "/* piewpiew-core library v$MAJOR.$MINOR.$POINT */" > $OUT

uglifyjs -nc $IN >> $OUT

#-----------------------------------------------------------------------------
# piewpiew-backbone
#-----------------------------------------------------------------------------
MAJOR=0
MINOR=0
POINT=1
IN=src/js/libs/piewpiew/piewpiew-backbone.js
OUT=src/js/libs/piewpiew/piewpiew-backbone-$MAJOR.$MINOR.$POINT.min.js

echo "/* piewpiew-backbone library v$MAJOR.$MINOR.$POINT */" > $OUT

uglifyjs -nc $IN >> $OUT