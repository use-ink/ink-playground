use clap::Clap;

const DEFAULT_PATH: &str = "./Cargo.toml";
const DEFAULT_OUTPUT: &str = "./change.json";

#[derive(Clap)]
#[clap(
    version = "0.1",
    author = "Achim Schneider <achim@parity.io>",
    about = "Extract Crate Data to JSON for rust analyzer"
)]
pub struct Opts {
    #[clap(subcommand)]
    pub subcmd: SubCommand,
}

#[derive(Clap)]
pub enum SubCommand {
    #[clap(about = "Create .json file for Rust Crate")]
    CmdCreate(CmdCreate),
}

#[derive(Clap)]
pub struct CmdCreate {
    #[clap(short = 'i', long = "input", default_value = DEFAULT_PATH)]
    pub path: String,
    #[clap(short = 'o', long = "output", default_value = DEFAULT_OUTPUT )]
    pub output: String,
}
