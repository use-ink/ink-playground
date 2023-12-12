#!/bin/bash

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull inner images
versions=($(cat ../config/versions.json | jq -r '.[]'))
for version in "${versions[@]}"; do
  docker pull radhezeeve/ink-compiler:${version}
  docker tag radhezeeve/ink-compiler:${version} ink-compiler:${version}
done

# start backend server
/app/target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder /app/packages/playground/dist
