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

use change_json::ChangeJson;
use clap::{
    App,
    Arg,
};
use std::{
    fs,
    path::Path,
};
mod load_change;
use crate::load_change::LoadCargoConfig;
use project_model::CargoConfig;

const DEFAULT_PATH: &str = "./Cargo.toml";
const DEFAULT_OUTPUT: &str = "./change.json";

fn main() {
    // let foo = format!("Path to Cargo.toml, defaults to {}", DEFAULT_PATH)[..];
    let matches = App::new("Trait Extractor")
        .version("0.1")
        .author("Achim Schneider <achim@parity.io>")
        .about("Extract Crate Data to JSON for rust analyzer")
        .subcommand(
            App::new("create")
                .about("Create .json file for Rust Crate")
                .arg(
                    Arg::with_name("path")
                        .help(&format!(
                            "Path to Cargo.toml, defaults to {}",
                            DEFAULT_PATH
                        ))
                        .takes_value(true)
                        .short("i")
                        .long("input")
                        .multiple(false)
                        .required(false),
                )
                .arg(
                    Arg::with_name("output")
                        .help(&format!(
                            "Output path for .json file, defaults to {}",
                            DEFAULT_OUTPUT
                        ))
                        .takes_value(true)
                        .short("o")
                        .long("output")
                        .multiple(false)
                        .required(false),
                ),
        )
        .get_matches();

    let cargo_config: CargoConfig = Default::default();
    let load_cargo_config = LoadCargoConfig {
        load_out_dirs_from_check: false,
        with_proc_macro: false,
        prefill_caches: false,
    };
    match matches.subcommand_name() {
        Some("create") => {
            let matches = matches.subcommand_matches("create").unwrap();
            let path = matches.value_of("path").unwrap_or(DEFAULT_PATH);
            println!("Creating .json file, using: {}", path);
            let path = Path::new(path);
            let output_path = matches.value_of("output").unwrap_or(DEFAULT_OUTPUT);
            let output_path = Path::new(output_path);
            let res = load_change::load_change_at(
                path,
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
            fs::write(output_path, text).expect("Unable to write file");
        }
        None => println!("Please enter a  subcommand!"),
        _ => println!("Your entered subcommand is invalid!"),
    }
}

#[cfg(test)]
mod tests {
    use change_json::ChangeJson;

    use super::*;

    #[test]
    fn test_parsing_change_json() {
        // given
        let path = Path::new(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .unwrap()
            .parent()
            .unwrap();
        let cargo_config = CargoConfig::default();
        let load_cargo_config = LoadCargoConfig {
            load_out_dirs_from_check: false,
            with_proc_macro: false,
            prefill_caches: false,
        };

        // when
        let change =
            load_change::load_change_at(path, &cargo_config, &load_cargo_config, &|_| {})
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
