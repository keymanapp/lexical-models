#!/bin/bash

# todo copy multi-folder approach from keyboards repo

cd release/example/en.template/
rm -rf build/
mkdir build
cd build
../../../../node_modules/.bin/tsc --outFile ./compiler.js ../../../../tools/index.ts ../source/model.ts
node ./compiler.js
