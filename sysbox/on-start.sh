#!/bin/sh

# dockerd start
dockerd > /var/log/dockerd.log 2>&1 &
sleep 2

# pull inner images
docker pull paritytech/ink-ci-linux:ae24bd7a-20221109
docker tag paritytech/ink-ci-linux:ae24bd7a-20221109 ink-compiler

docker run --volume cache:/usr/local/cargo/registry --volume /builds:/builds --workdir /builds/contract/  ink-compiler cargo contract build
docker run --volume cache:/usr/local/cargo/registry --volume /builds:/builds --workdir /builds/contract/  ink-compiler cargo contract test
# start backend server
/app/target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder /app/packages/playground/dist

