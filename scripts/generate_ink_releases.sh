relative_dirname="$(dirname -- "${BASH_SOURCE[0]}")"
bash_dir_path="$(cd -- "${relative_dirname}" && pwd)"
config_path=${bash_dir_path}/../config
ink_versions_list_path=${config_path}/ink_versions.json

# This is provide stable version of Ink
curl -s https://crates.io/api/v1/crates/ink | jq '[ .versions[] | { num } |  .num ] | map(select(. != "0.0.0")) | map(select(index("-") < 0))' > $ink_versions_list_path