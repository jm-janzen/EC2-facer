#!/bin/sh -e

./node_modules/forever/bin/forever facer.js --minUptime 1000 --spinSleepTime 1000

