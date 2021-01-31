#!/bin/sh
for i in `seq 1 400`
do
    echo "$i":
	curl http://localhost:3000/job/$i
done