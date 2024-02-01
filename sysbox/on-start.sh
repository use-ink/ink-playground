#!/bin/bash

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull inner images
/app/scripts/ink-compiler.sh -c pull --docker_user_name radhezeeve

# start backend server
/app/target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder /app/packages/playground/dist --versions_file_path /app/config/versions.json
