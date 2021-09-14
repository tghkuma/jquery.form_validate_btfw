#!/usr/bin/env bash

cd "$(dirname "$0")" || exit

# UglifyJS 3版
# install: npm install uglify-js -g
#uglifyjs -c -m -o js/jquery.btfw.form_validate.min.js --source-map -- js/jquery.btfw.form_validate.js

# webpack4版
# install: npm install webpack webpack-cli -g
#webpack js/jquery.btfw.form_validate.js -o js/jquery.btfw.form_validate.min.js --mode="production" --devtool source-map

# webpack5版
# install: npm install webpack webpack-cli -g
webpack --entry ./js/jquery.btfw.form_validate.js --output-path ./js --output-filename jquery.btfw.form_validate.min.js --mode="production" --devtool source-map