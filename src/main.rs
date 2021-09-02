use clap::{App, Arg};

mod crate_graph_json;
mod load_cargo;
mod reload;

use load_cargo::load_workspace;

fn main() {
    let matches = App::new("Trait Extractor")
        .version("0.1")
        .author("Achim S. <achim@parity.io")
        .about("Extract Crate Data to JSON for rust analyzer")
        .arg(
            Arg::with_name("INPUT")
                .help("Sets the input file to use")
                .required(true)
                .index(1),
        )
        .get_matches();

    let path = matches.value_of("INPUT").unwrap_or("./Cargo.toml");
    load_workspace(ws, cargo_config, load_config, progress);

    println!("Your input path: {}", path);
}
