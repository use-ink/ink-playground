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

use clap::Clap;

#[derive(Clap, Clone)]
#[clap(
    version = "0.1",
    author = "Achim Schneider <achim@parity.io>",
    about = "ink! playground backend"
)]
pub struct Opts {
    #[clap(short = 'p', long = "port", default_value = "8080", env = "PORT")]
    pub port: u16,

    #[clap(short = 'h', long = "host", default_value = "localhost", env = "HOST")]
    pub host: String,

    #[clap(short = 'f', long = "frontend_folder")]
    pub frontend_folder: Option<String>,

    #[clap(short = 'g', long = "github_token", env = "GITHUB_GIST_TOKEN")]
    pub github_token: Option<String>,

    #[clap(short = 'd', long = "dev_mode")]
    pub dev_mode: bool,
}
