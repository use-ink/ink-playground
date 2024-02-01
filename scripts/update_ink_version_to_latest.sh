#!/bin/bash

set -eu
set -o pipefail

relative_dirname="$(dirname -- "${BASH_SOURCE[0]}")"
bash_dir_path="$(cd -- "${relative_dirname}" && pwd)"

config_path=${bash_dir_path}/../config
ink_versions_list_path=${config_path}/ink_versions.json

contract_dir=${bash_dir_path}/../crates/contract
cd ${contract_dir}

ink_latest_version=$(cat ${ink_versions_list_path} | jq -r '.[0]')
cargo install cargo-edit
cargo set-version --package contract "${ink_latest_version}"
cargo add --package contract ink@${ink_latest_version}
cargo add --package contract --dev ink_e2e@${ink_latest_version}