use std::{fs, path::Path};

use change_json::ChangeJson;
use clap::{App, Arg};

mod load_change;
mod reload;

use load_change::load_workspace_at;
use project_model::CargoConfig;

use crate::load_change::LoadCargoConfig;

fn main() {
    let matches = App::new("Trait Extractor")
        .version("0.1")
        .author("Achim S. <achim@parity.io>")
        .about("Extract Crate Data to JSON for rust analyzer")
        .subcommand(
            App::new("create")
                .about("Create .json file for Rust Crate")
                .arg(
                    Arg::with_name("path")
                        .help("Path to Cargo.toml, defaults to ./Cargo.toml")
                        .takes_value(true)
                        .short("i")
                        .long("input")
                        .multiple(false) 
                        .required(false), 
                )
                .arg(
                    Arg::with_name("output")
                        .help("Output path for .json file, defaults to ./change.json") 
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
            let path = matches.value_of("path").unwrap_or("./Cargo.toml");
            println!("Creating .json file, using: {}", path);
            let path = Path::new(path);
            let output_path = matches.value_of("output").unwrap_or("./change.json");
            let output_path = Path::new(output_path);
            let res = load_workspace_at(path, &cargo_config, &load_cargo_config, &|_| {});
            if let Ok((change, _, _)) = res {
                let json = ChangeJson::from(&change);
                let text = serde_json::to_string(&json).expect("serialization of change must work");
                fs::write(output_path, text).expect("Unable to write file");
            }
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
        let (change, _vfs, _proc_macro) =
            load_workspace_at(path, &cargo_config, &load_cargo_config, &|_| {}).unwrap();
        let json = ChangeJson::from(&change);
        let text = serde_json::to_string(&json).expect("serialization of change must work");
        let json: ChangeJson =
            serde_json::from_str(&text).expect("deserialization of change must work");
        let _change = json.to_change();
    }
}
