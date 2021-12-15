#!/bin/sh

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# start backend server
./target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder packages/playground/dist