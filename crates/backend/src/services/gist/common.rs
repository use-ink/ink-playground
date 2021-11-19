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

//! This module contains backend services. Often one service will finally map to
//! one route. But this is not necessarily the case, thus they're defined route
//! agnostic (E.g. the compile module does not know that's mapped to the
//! "/compile" route in the end)

use hubcaps;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub struct Gist {
    pub id: String,
    pub url: String,
    pub code: String,
}

pub fn from_github_gist(gist: hubcaps::gists::Gist) -> Option<Gist> {
    let code = gist
        .files
        .get(GIST_FILENAME)
        .and_then(|file| file.content.as_ref())?;

    Some(Gist {
        id: gist.id,
        url: gist.url,
        code: code.to_string(),
    })
}

pub fn github(token: &str) -> hubcaps::Result<hubcaps::Github> {
    hubcaps::Github::new(
        GITHUB_AGENT_NAME,
        hubcaps::Credentials::Token(token.to_string()),
    )
}

pub const GITHUB_AGENT_NAME: &str = "The Rust Playground";
pub const GIST_FILENAME: &str = "playground.rs";
