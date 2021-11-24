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
    use crate::services::gist::{
        common::Gist,
        create::{
            route_gist_create,
            GistCreateRequest,
            GistCreateResponse,
        },
        load::{
            route_gist_load,
            GistLoadRequest,
            GistLoadResponse,
        },
    };
    use actix_web::{
        test,
        web::post,
        App,
    };
    use std::env;
    use tokio_compat_02::FutureExt;

    #[actix_rt::test]
    async fn test_gist() {
        if env::var("CI") != Ok("true".to_string()) {
            return
        }

        let github_token = env::var("GITHUB_GIST_TOKEN")
            .expect("CI tests must provide a `GITHUB_GIST_TOKEN`");

        let github_token2 = github_token.clone();

        let mut app = test::init_service(
            App::new()
                .route(
                    "gist/create",
                    post().to(move |body| route_gist_create(github_token.clone(), body)),
                )
                .route(
                    "gist/load",
                    post().to(move |body| route_gist_load(github_token2.clone(), body)),
                ),
        )
        .await;

        let code = "sample code".to_string();

        // Create Gist

        let req = GistCreateRequest { code };

        let req = test::TestRequest::post()
            .set_json(&req)
            .uri("/gist/create")
            .to_request();

        let res: GistCreateResponse =
            test::read_response_json(&mut app, req).compat().await;

        let id = match res {
            GistCreateResponse::Success(Gist {
                id,
                url: _,
                code: _,
            }) => Ok(id),
            GistCreateResponse::Error(error) => Err(error),
        };

        assert!(id.is_ok(), "{}", id.expect_err(""));

        // Load Gist

        let req = GistLoadRequest { id: id.expect("") };

        let req = test::TestRequest::post()
            .set_json(&req)
            .uri("/gist/load")
            .to_request();

        let res: GistLoadResponse =
            test::read_response_json(&mut app, req).compat().await;

        let id = match res {
            GistLoadResponse::Success(Gist {
                id,
                url: _,
                code: _,
            }) => Ok(id),
            GistLoadResponse::Error(error) => Err(error),
        };

        assert!(id.is_ok(), "{}", id.expect_err(""));
    }
}
