use std::path::Path;


use clap::{App, Arg};
use change_json::ChangeJson;

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
        .arg(
            Arg::with_name("write")
                .help("read a crate and write to a json file") // Displayed when showing help info
                .takes_value(true) // MUST be set to true in order to be an "option" argument
                .short("w") // This argument is triggered with "-i"
                .long("write") // This argument is triggered with "--input"
                .multiple(false) // Set to true if you wish to allow multiple occurrences
                // such as "-i file -i other_file -i third_file"
                .required(false) // By default this argument MUST be present
                // NOTE: mutual exclusions take precedence over
                // required arguments
                .requires("output") // Says, "If the user uses "input", they MUST
                // also use this other 'config' arg too"
                // Can also specify a list using
                // requires_all(Vec<&str>)
                .conflicts_with("read"), // Opposite of requires(), says "if the
                                           // user uses -a, they CANNOT use 'output'"
                                           // also has a conflicts_with_all(Vec<&str>)
        )
        .arg(
            Arg::with_name("output")
                .help("path to json file") // Displayed when showing help info
                .takes_value(true) // MUST be set to true in order to be an "option" argument
                .short("o") // This argument is triggered with "-i"
                .long("output") // This argument is triggered with "--input"
                .multiple(false) // Set to true if you wish to allow multiple occurrences
                // such as "-i file -i other_file -i third_file"
                .required(false) // By default this argument MUST be present
                // NOTE: mutual exclusions take precedence over
                // required arguments
                .conflicts_with("read"), // Opposite of requires(), says "if the
                                           // user uses -a, they CANNOT use 'output'"
                                           // also has a conflicts_with_all(Vec<&str>)
        )
        .arg(
            Arg::with_name("read")
                .help("read a json file") // Displayed when showing help info
                .takes_value(true) // MUST be set to true in order to be an "option" argument
                .short("r") // This argument is triggered with "-i"
                .long("read") // This argument is triggered with "--input"
                .multiple(false) // Set to true if you wish to allow multiple occurrences
                // such as "-i file -i other_file -i third_file"
                .required(false) // By default this argument MUST be present
                // NOTE: mutual exclusions take precedence over
                // required arguments
                .conflicts_with("read"), // Opposite of requires(), says "if the
                                           // user uses -a, they CANNOT use 'output'"
                                           // also has a conflicts_with_all(Vec<&str>)
        )
        .get_matches();

    let path = matches.value_of("write").unwrap_or("./Cargo.toml");
    let path = Path::new(path);
    let cargo_config: CargoConfig = Default::default();
    let load_cargo_config = LoadCargoConfig {
        load_out_dirs_from_check: false,
        with_proc_macro: false,
        prefill_caches: false,
    };

    let res = load_workspace_at(path, &cargo_config, &load_cargo_config, &|_| {});
    match res {
        Ok((change, _, _)) => {
            let json = ChangeJson::from(&change);
            let text = serde_json::to_string(&json).expect("serialization of change must work");
            let _change = json.to_change();
            // let json = ChangeJson::from(&change);
            // let new_text = serde_json::to_string(&json).expect("serialization of change must work");
            println!("{}", text);
        }
        Err(_) => {}
    }
}
