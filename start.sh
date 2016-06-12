#!/bin/bash

numArgs=0
port=0
debug=0
token=''

#set -v
#set -x

# check for forever module
ls /usr/local/lib/node_modules | grep 'forever' 1>/dev/null \
    || $(echo 'Install foreverjs globally (`npm install -g forever`) to start this script.' && exit 1;)

###
### prototypes
###

function usage() {
    cat <<EOF
    Usage: ./start.sh <PORT> <DEBUG> [TOKEN]
EOF
    exit 1
}
function parseArgs() {
    local result=1

    if [[ $# -gt 2 ]]; then     # Using port, debug, token
        result=0
    elif [[ $# -gt 1 ]]; then   # Using port, debug
        result=0
    elif [[ $# -gt 0 ]]; then   # Using port
        result=0
    fi

    return "$result"
}
function validateArgs() {
    local result=0

    ### TODO validate contents of arguments

    return "$result"
}

###
### main
###

printf "[start.sh]: Parsing Arguments...";
parseArgs $@
success=$?
if [[ $success -gt 0 ]]; then
    printf "fail\n"
    usage
else
    printf "success\n"
fi

printf "[start.sh]: Validating Arguments..."
validateArgs "$#"
success=$?
if [[ $success -gt 0 ]]; then
    printf "fail\n"
    usage
else
    printf "success\n"
fi


### TODO validate port & token parms
### TODO add parm for debug_mode

echo "Starting facer.js on port $1"

forever -w --minUptime 1000 --spinSleepTime 1000 facer.js $1 $2

