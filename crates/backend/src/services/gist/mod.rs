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

pub mod common;
pub mod create;
pub mod load;

#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::gist::create::route_gist_create;
    use actix_web::{
        test,
        web,
        App,
    };
    use std::env;

    #[actix_rt::test]
    async fn test_gist() {
        if env::var("CI") != Ok("true".to_string()) {
            return
        }

        let github_token = env::var("GITHUB_GIST_TOKEN")
            .expect("CI tests must provide a `GITHUB_GIST_TOKEN`");

        assert_eq!(1, 2);
    }
}
