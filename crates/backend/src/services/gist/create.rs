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

use crate::services::gist::common::{
    from_github_gist,
    github,
    Gist,
    GIST_FILENAME,
};
use actix_web::{
    web::Json,
    HttpRequest,
    HttpResponse,
    Responder,
};
use futures::future::{
    ready,
    Ready,
};
use hubcaps::{
    self,
    gists::{
        Content,
        GistOptions,
    },
};
use serde::{
    Deserialize,
    Serialize,
};
use std::collections::HashMap;
use ts_rs::TS;

// -------------------------------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------------------------------

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
pub struct GistCreateRequest {
    pub code: String,
}

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum GistCreateResponse {
    Success(Gist),
    Error(String),
}

#[derive(Debug)]
enum Error {
    GitHubError(hubcaps::Error),
    MalformattedGist,
}

// -------------------------------------------------------------------------------------------------
// CONST
// -------------------------------------------------------------------------------------------------

const GIST_DESCRIPTION: &str = "Code shared from the Rust Playground";

// -------------------------------------------------------------------------------------------------
// IMPLEMENTATIONS
// -------------------------------------------------------------------------------------------------

impl Responder for GistCreateResponse {
    type Error = actix_web::Error;
    type Future = Ready<Result<HttpResponse, actix_web::Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();

        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

pub async fn route_gist_create(
    github_token: String,
    req: Json<GistCreateRequest>,
) -> impl Responder {
    let gist_result = create_gist(github_token.as_ref(), &req.code).await;

    match gist_result {
        Err(error) => {
            println!("{:?}", error);
            GistCreateResponse::Error("Gist creation failed".to_string())
        }
        Ok(gist) => GistCreateResponse::Success(gist),
    }
}

async fn create_gist(github_token: &str, code: &str) -> Result<Gist, Error> {
    let gist = github_create_gist(github_token, code)
        .await
        .map_err(Error::GitHubError)?;

    from_github_gist(gist).ok_or(Error::MalformattedGist)
}

async fn github_create_gist(
    token: &str,
    code: &str,
) -> hubcaps::Result<hubcaps::gists::Gist> {
    let github = github(token)?;

    let file = Content {
        filename: None,
        content: code.to_string(),
    };

    let files = HashMap::from([(GIST_FILENAME.into(), file)]);

    let options = GistOptions {
        description: Some(GIST_DESCRIPTION.into()),
        public: Some(false),
        files,
    };

    github.gists().create(&options).await
}
