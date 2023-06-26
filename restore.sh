#!/bin/bash

MONGODB_URL=$1
DATABASE=$2
DUMP_PATH=$3

mongorestore --uri="$MONGODB_URL/$DATABASE" --nsInclude="$DATABASE" $DUMP_PATH