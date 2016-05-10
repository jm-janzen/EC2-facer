#!/bin/sh -e

# check for forever module
ls /usr/local/lib/node_modules | grep 'forever' 1>/dev/null \
    || $(echo 'Install foreverjs globally (`npm install -g forever`) to start this script.' && exit 1;)

echo 'Starting facer . . .'
forever -w --minUptime 1000 --spinSleepTime 1000 facer.js $1

