#!/bin/bash


set -eu
set -o pipefail
set -o nounset

command=""
docker_user_name=""
specific_version=""

relative_dirname="$(dirname -- "${BASH_SOURCE[0]}")"
bash_dir_path="$(cd -- "${relative_dirname}" && pwd)"

pull() {
  versions=($(cat ${bash_dir_path}/../config/versions.json | jq -r '.[]'))
  for version in "${versions[@]}"; do
    docker pull ${docker_user_name}/ink-compiler:${version}
    docker tag ${docker_user_name}/ink-compiler:${version} ink-compiler:${version}
  done
}


build() {
  versions=($(cat ${bash_dir_path}/../config/versions.json | jq -r '.[]'))
  cd ${bash_dir_path}/../docker
  for version in "${versions[@]}"; do
    docker build --tag ink-compiler:${version} -f Dockerfile.compiler-${version} .
  done
}

push() {
  versions=($(cat ${bash_dir_path}/../config/versions.json | jq -r '.[]'))
  for version in "${versions[@]}"; do
    docker tag ink-compiler:${version} ${docker_user_name}/ink-compiler:${version}
    docker push ${docker_user_name}/ink-compiler:${version}
  done
}

build_specific() {
  cd ${bash_dir_path}/../docker
  docker build --tag ink-compiler:${specific_version} -f Dockerfile.compiler-${specific_version} .
}

pull_specific() {
  docker pull ${docker_user_name}/ink-compiler:${specific_version}
  docker tag ${docker_user_name}/ink-compiler:${specific_version} ink-compiler:${specific_version}
}

push_specific() {
  docker tag ink-compiler:${specific_version} ${docker_user_name}/ink-compiler:${specific_version}
  docker push ${docker_user_name}/ink-compiler:${specific_version}
}

usage() {
  echo "USAGE" 
  echo "Execute docker related commands"
  echo "options:"
  echo "-c --command       : command to execute (pull, build, push, build_specific, push_specific)"
  echo "--docker_user_name : docker image to pull and push from)"
  echo "--specific_version : ink specific version, used to build, pull and push specific ink compiler image)"
}

check_blank_args() {
  if [ -z "${1:-}" ]; then
    echo "Arguments are not passed correctly, refer the following:"
    usage;
    exit 1;
  fi
}

while [ "$#" -ge 1 ]; do
  case "$1" in
    -c|--command)
      shift;
      check_blank_args "${1:-}"
      command=$1
    ;;
    --docker_user_name)
      shift;
      check_blank_args "${1:-}"
      docker_user_name=$1
    ;;
    --specific_version)
      shift;
      check_blank_args "${1:-}"
      specific_version=$1
    ;;
    *)
      usage;
      exit 1
    ;;
  esac;
  shift;
done;

case ${command} in
  "pull")
    pull
  ;;
  
  "build")
    build
  ;;
  
  "push")
    push
  ;;
  
  "pull_specific")
    pull_specific
  ;;

  "build_specific")
    build_specific
  ;;
  
  "push_specific")
    push_specific
  ;;  

  *)
    echo "wrong command"
    exit 1;
  ;;
esac
