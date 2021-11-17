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

use actix_web::{
    web::Json,
    Error,
    HttpRequest,
    HttpResponse,
    Responder,
};
use futures::future::{
    ready,
    Ready,
};
use serde::{
    Deserialize,
    Serialize,
};
use ts_rs::TS;

// -------------------------------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------------------------------

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
pub struct GistCreateRequest {
    code: Code,
}

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum GistCreateResponse {
    Success(Gist),
    Error(GistError),
}

pub type Code = String;

pub type GistError = String;

pub type GithubApiStrategy = fn(gh_token: &str, Code) -> GistCreateResponse;

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub struct Gist {
    pub id: String,
    pub url: String,
    pub code: Code,
}

pub const GH_API: GithubApiStrategy = |token, req| {
    GistCreateResponse::Success(Gist {
        id: "22".to_string(),
        url: "".to_string(),
        code: "".to_string(),
    })
};

// -------------------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// -------------------------------------------------------------------------------------------------

impl Responder for GistCreateResponse {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();

        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

// -------------------------------------------------------------------------------------------------
// ROUTE
// -------------------------------------------------------------------------------------------------

pub async fn route_gist_create(
    gist_api_strategy: GithubApiStrategy,
    github_token: &str,
    req: Json<GistCreateRequest>,
) -> impl Responder {
    gist_api_strategy(github_token, req.code.to_string())
}

// -------------------------------------------------------------------------------------------------
// TEST
// -------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        test,
        web,
        App,
    };

    const GH_API_MOCKED: GithubApiStrategy = |_, code| {
        GistCreateResponse::Success(Gist {
            id: "65278657821".to_string(),
            url: "foo".to_string(),
            code,
        })
    };

    #[actix_rt::test]
    async fn test_gist_create_success() {
        let mut app = test::init_service(App::new().route(
            "/",
            web::post().to(|body| route_gist_create(GH_API_MOCKED, "gh_token", body)),
        ))
        .await;

        let req = GistCreateRequest {
            code: "foo".to_string(),
        };
        let req = test::TestRequest::post()
            .set_json(&req)
            .uri("/")
            .to_request();

        let res: GistCreateResponse = test::read_response_json(&mut app, req).await;

        assert_eq!(
            res,
            GistCreateResponse::Success(Gist {
                id: "65278657821".to_string(),
                url: "foo".to_string(),
                code: "foo".to_string(),
            })
        );
    }
}
