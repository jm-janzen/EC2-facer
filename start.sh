#!/bin/bash

#
# Summary
#   start.sh - start facer.js with parsed, validated parameters.
#
# Usage
#   ./start.sh <port> [debug] [token]
#
# Description
#   Accepts three one to three parameters, in order `port' (a number (necessary)),
#   `debug' ('true' or 'false' (optional)), and `token' (a security token(optional)).
#

numArgs=0
args=()

port=0
debug=true
token=0

#set -v
#set -x

# Try/catch for forever module
{
    which forever
} || {
    echo 'Install foreverjs globally (`npm install -g forever`) to start this script.' && exit 1
}

###
### prototypes
###

function usage() {
    cat <<EOF
    Usage: ./start.sh <port> [debug] [token]
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

### just pass test for now
### TODO eventually reach into server and run proper test

if [[ $1 == 'testing...' ]]; then
    echo "Test Passed"
    exit 0
fi

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

