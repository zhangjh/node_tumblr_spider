#!/bin/bash
ps -ef | grep redis | grep -v grep
if [ $? -ne 0 ];then
    sudo service redis-server start
fi

if [ $? -ne 0 ];then
    echo "redis does not start"
    exit 1
fi

node main.js 
