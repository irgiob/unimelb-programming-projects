#!/bin/bash

cat commands | cut -d',' -f5- | grep allocate | sed 's/task/testcases\/task/' | while read line; do
    out=$(echo "$line" | awk -F"-f" '{print $2}' | cut -d' ' -f2 | sed 's/input/output/' | sed 's/.txt/.out/')
    echo "$line | diff - $out"
done

for f in $(ls task7/*); do
    s=$(echo "$f" | cut -d"_" -f3 | cut -c 2)
    echo "./allocate -p $s -f testcases/$f"
done
