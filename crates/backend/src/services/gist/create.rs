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
    Responder,
};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct GistCreateRequest {}

pub struct GistCreateResponse {}

pub type Code = String;

pub type GistError = String;

pub type ApiStrategy = fn(Code) -> Result<Gist, GistError>;

pub struct Gist {
    pub id: String,
    pub url: String,
    pub code: Code,
}

pub const GH_API: ApiStrategy = |req| {
    Ok(Gist {
        id: "22".to_string(),
        url: "".to_string(),
        code: "".to_string(),
    })
};

pub async fn route_gist_create(
    gist_api_strategy: ApiStrategy,
    req: Json<GistCreateRequest>,
) -> impl Responder {
    "ok"
    // Gist {
    //     id: "22".to_string(),
    //     url: "".to_string(),
    //     code: "".to_string(),
    // }
}
