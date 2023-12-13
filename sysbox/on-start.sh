#!/bin/bash

relative_dirname="$(dirname -- "${BASH_SOURCE[0]}")"
bash_dir_path="$(cd -- "${relative_dirname}" && pwd)"

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull inner images
${bash_dir_path}/../scripts/ink-compiler.sh -c pull --docker_user_name radhezeeve

# start backend server
/app/target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder /app/packages/playground/dist
