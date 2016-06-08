#!/bin/bash -e

# check for forever module
ls /usr/local/lib/node_modules | grep 'forever' 1>/dev/null \
    || $(echo 'Install foreverjs globally (`npm install -g forever`) to start this script.' && exit 1;)

if [[ $# -lt 2 ]]; then
    cat <<EOF
    Usage: ./start.sh <PORT> <TOKEN>
EOF
    exit 1
else
    ### TODO validate port & token parms
    ### TODO add parm for debug_mode

    echo "Starting facer.js on port $1"

    forever -w --minUptime 1000 --spinSleepTime 1000 facer.js $1 $2
fi

