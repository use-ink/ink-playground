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

use actix_web::{
    web::Json,
    HttpResponse,
    Responder,
};

pub use sandbox::{
    CompilationRequest,
    CompilationResult,
    Sandbox,
};

use sandbox;

// -------------------------------------------------------------------------------------------------
// IMPLEMENTATION
// -------------------------------------------------------------------------------------------------

pub struct FormatRequest {
    pub code: String,
}

pub struct FormatRequest {
    pub code: String,
}

pub async fn route_format(req: Json<CompilationRequest>) -> impl Responder {
    let compile_result = compile_strategy(CompilationRequest {
        source: req.source.to_string(),
    });

    match compile_result {
        Ok(result) => {
            let compile_result = serde_json::to_string(&result).unwrap();
            HttpResponse::Ok().body(compile_result)
        }
        Err(err) => {
            eprintln!("{:?}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
}
