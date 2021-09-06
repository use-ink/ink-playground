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
                        .multiple(false) // Set to true if you wish to allow multiple occurrences
                        // such as "-i file -i other_file -i third_file"
                        .required(false), // By default this argument MUST be present
                                          // NOTE: mutual exclusions take precedence over
                                          // required arguments
                )
                .arg(
                    Arg::with_name("output")
                        .help("Output path for .json file, defaults to ./change.json") // Displayed when showing help info
                        .takes_value(true) // MUST be set to true in order to be an "option" argument
                        .short("o") // This argument is triggered with "-i"
                        .long("output") // This argument is triggered with "--input"
                        .multiple(false) // Set to true if you wish to allow multiple occurrences
                        // such as "-i file -i other_file -i third_file"
                        .required(false), // By default this argument MUST be present
                                          // NOTE: mutual exclusions take precedence over
                                          // required arguments
                ),
        )
        .get_matches();

    let cargo_config: CargoConfig = Default::default();
    let load_cargo_config = LoadCargoConfig {
        load_out_dirs_from_check: false,
        with_proc_macro: false,
        prefill_caches: false,
    };
    if let Some(matches) = matches.subcommand_matches("create") {
        let path = matches.value_of("path").unwrap_or("./Cargo.toml");
        let path = Path::new(path);
        let output_path = matches.value_of("output").unwrap_or("./change.json");
        let output_path = Path::new(output_path);
        let res = load_workspace_at(path, &cargo_config, &load_cargo_config, &|_| {});
        match res {
            Ok((change, _, _)) => {
                let json = ChangeJson::from(&change);
                let text = serde_json::to_string(&json).expect("serialization of change must work");
                fs::write(output_path, text).expect("Unable to write file");
            }
            Err(_) => {}
        }
    }
}
