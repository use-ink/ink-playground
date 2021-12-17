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

//! This module contains the compile service of the backend. It receives a
//! string of Rust source code and returns the result of compiling the code.
//! For security reason we run the compilation inside a Docker container.
//! In order to ease testing, the service is parameterized by a compile
//! strategy. This allows easy mocking.

pub use sandbox::{
    CompilationRequest,
    CompilationResult,
    Sandbox,
};

use futures::future::{
    ready,
    Ready,
};

use actix_web::{
    web::Json,
    HttpRequest,
    HttpResponse,
    Responder,
};

use serde::{
    Deserialize,
    Serialize,
};

use ts_rs::TS;

use sandbox;

// -------------------------------------------------------------------------------------------------
// IMPLEMENTATION
// -------------------------------------------------------------------------------------------------

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
pub struct RustFormatRequest {
    pub code: String,
}

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RustFormatResponse {
    Success(String),
    Error(String),
}

impl Responder for RustFormatResponse {
    type Error = actix_web::Error;
    type Future = Ready<Result<HttpResponse, actix_web::Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();

        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

pub async fn route_format(req: Json<RustFormatRequest>) -> impl Responder {
    let format_result = 1;

    // match compile_result {
    //     Ok(result) => {
    //         let compile_result = serde_json::to_string(&result).unwrap();
    //         HttpResponse::Ok().body(compile_result)
    //     }
    //     Err(err) => {
    //         eprintln!("{:?}", err);
    //         HttpResponse::InternalServerError().finish()
    //     }
    // }
    RustFormatResponse::Success("formatted code".to_string())
}
