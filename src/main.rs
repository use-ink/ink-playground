use clap::{Arg, App};

fn main() {
    let matches = App::new("Trait Extractor")
                          .version("0.1")
                          .author("Achim S. <achim@parity.io")
                          .about("Extract Crate Data to JSON for rust analyzer")
                          .arg(Arg::with_name("INPUT")
                               .help("Sets the input file to use")
                               .required(true)
                               .index(1))
                          .get_matches();

    let path = matches.value_of("INPUT").unwrap_or("./Cargo.toml");

    println!("Your input path: {}", path);
}