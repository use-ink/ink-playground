// Copyright 2018-2021 Parity Technologies (UK) Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

use anyhow::Result;
use change_json::ChangeJson;
use std::{
    fs,
    path::Path,
};
mod cli;
mod load_change;
use crate::{
    cli::{
        CmdCreate,
        Opts,
        SubCommand,
    },
    load_change::LoadCargoConfig,
};
use clap::Clap;
use project_model::CargoConfig;

fn to_abs_path(path: &str) -> Result<vfs::AbsPathBuf> {
    let path = Path::new(&path);
    Ok(vfs::AbsPathBuf::assert(
        if path.is_absolute() {
            path.to_path_buf()
        } else {
            std::env::current_dir()?.join(path)
        },
    ))
}

fn main() {
    let cargo_config: CargoConfig = Default::default();
    let load_cargo_config = LoadCargoConfig {
        load_out_dirs_from_check: false,
        with_proc_macro: false,
        prefill_caches: false,
    };
    let opts: Opts = Opts::parse();

    match opts.subcmd {
        SubCommand::CmdCreate(CmdCreate {
            manifest_path,
            output,
        }) => {
            println!("Creating .json file, using: {:?}", manifest_path);
            let manifest_path = to_abs_path(&manifest_path)
                .expect("Cannot convert `manifest_path` to absolute path.");
            let output =
                to_abs_path(&output).expect("Cannot convert `output` to absolute path.");
            let res = load_change::load_change_at(
                &manifest_path,
                &cargo_config,
                &load_cargo_config,
                &|_| {},
            );
            let change = res.unwrap_or_else(|err| {
                panic!("Error while creating change object: {}", err)
            });
            let json = ChangeJson::from(&change);
            let text = serde_json::to_string(&json).unwrap_or_else(|err| {
                panic!("Error while parsing ChangeJson object to string: {}", err)
            });
            fs::write(output, text).expect("Unable to write file");
        }
    }
}

#[cfg(test)]
mod tests {
    use change_json::ChangeJson;

    use super::*;

    #[test]
    fn test_parsing_change_json() {
        // given
        let manifest_path = env!("CARGO_MANIFEST_DIR");
        let manifest_path = to_abs_path(manifest_path)
            .expect("Cannot convert `manifest_path` to absolute path.");
        let cargo_config = CargoConfig::default();
        let load_cargo_config = LoadCargoConfig {
            load_out_dirs_from_check: false,
            with_proc_macro: false,
            prefill_caches: false,
        };

        // when
        let change = load_change::load_change_at(
            &manifest_path,
            &cargo_config,
            &load_cargo_config,
            &|_| {},
        )
        .unwrap_or_else(|err| {
            panic!("Error while creating Change object: {}", err);
        });

        // then
        let json = ChangeJson::from(&change);
        let text =
            serde_json::to_string(&json).expect("serialization of change must work");
        let _json: ChangeJson =
            serde_json::from_str(&text).expect("deserialization of change must work");
    }
}
