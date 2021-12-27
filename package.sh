#!/bin/bash

files=`find src/ -name "*.js"`

rm -f packaged.js

for path in $files
do
  cat "$path" >> packaged.js
  echo $'\n' >> packaged.js
done