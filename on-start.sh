#!/bin/sh

dockerd > /var/log/dockerd.log 2>&1 & 
./target/release/backend --port 4000 --host 0.0.0.0 --frontend_folder packages/playground/dist