#!/bin/sh

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull inner images
docker pull achimcc/ink-backend:latest
docker tag achimcc/ink-backend ink-backend

# start backend server
/app/target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder /app/packages/playground/dist

