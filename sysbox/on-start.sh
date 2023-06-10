#!/bin/sh

# dockerd start
# dockerd > /var/log/dockerd.log 2>&1 &
# sleep 2

# pull inner images
# docker pull achimcc/ink-compiler:latest
# docker tag achimcc/ink-compiler ink-compiler

# start backend server

# Temporary solution: start Webserver directly
/app/target/release/backend --port "$ACTIX_PORT --host $ACTIX_HOST --frontend_folder /app/packages/playground/dist

