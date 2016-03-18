#!/bin/sh -e

forever -w --minUptime 1000 --spinSleepTime 1000 facer.js

