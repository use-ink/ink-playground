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

use clap::{
    Parser,
    Subcommand,
};

const DEFAULT_MANIFEST_PATH: &str = "./Cargo.toml";
const DEFAULT_OUTPUT: &str = "./change.json";

#[derive(Parser, Debug, Clone)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum Commands {
    #[allow(non_camel_case_types)]
    create(CmdCreate),
}

#[derive(Parser, Debug, Clone)]
pub struct CmdCreate {
    #[arg(short = 'm', long = "manifest_path", default_value = DEFAULT_MANIFEST_PATH)]
    pub manifest_path: String,
    #[arg(short = 'o', long = "output", default_value = DEFAULT_OUTPUT)]
    pub output: String,
}
