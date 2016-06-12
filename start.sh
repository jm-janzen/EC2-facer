#!/bin/bash

numArgs=0
args=()

port=0
debug=0
token=0

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
    numArgs=$#

    if [[ $# -gt 2 ]]; then     # Using port, debug, token
        port=$1
        debug=$2
        token=$3

        result=0
    elif [[ $# -gt 1 ]]; then   # Using port, debug
        port=$1
        debug=$2

        result=0
    elif [[ $# -gt 0 ]]; then   # Using port
        port=$1

        result=0
    fi

    args=($port $debug $token)

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

printf "[start.sh]:\tParsing Arguments...";
parseArgs $@
success=$?
if [[ $success -gt 0 ]]; then
    printf "fail\n"
    usage
else
    printf "success\n"
fi

printf "[start.sh]:\tValidating Arguments..."
validateArgs "$port" "$debug" "$token"
success=$?
if [[ $success -gt 0 ]]; then
    printf "fail\n"
    usage
else
    printf "success\n"
fi


### TODO validate port & token parms
### TODO add parm for debug_mode

printf "[start.sh]:\tStarting facer.js (PORT: $port, DEBUG: $debug)\n"

forever -w --minUptime 1000 --spinSleepTime 1000 facer.js "${args[@]}"

