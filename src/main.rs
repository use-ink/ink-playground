use std::path::Path;

use change_json::ChangeJson;
use clap::{App, Arg};

mod change_json;
mod crate_graph_json;
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
            Arg::with_name("INPUT")
                .help("Sets the input file to use")
                .required(false)
                .index(1),
        )
        .get_matches();

    let path = matches.value_of("INPUT").unwrap_or("./Cargo.toml");
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
            println!("{}", text);
        }
        Err(_) => {}
    }
}
