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
use serde::{
    Deserialize,
    Serialize,
};
use ts_rs::TS;

// -------------------------------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------------------------------

pub type CompileStrategy = fn(CompilationRequest) -> CompilationResult;

#[derive(Deserialize, Serialize, TS)]
pub struct CompilationRequest {
    source: String,
}

#[derive(Deserialize, Serialize, TS, PartialEq, Debug)]
#[serde(tag = "type", content = "payload", rename_all = "snake_case")]
pub enum CompilationResult {
    Success { result: String },
    Failure { message: String },
}

// -------------------------------------------------------------------------------------------------
// IMPLEMENTATION
// -------------------------------------------------------------------------------------------------

/// The compile strategy that will be used in production.
/// The actual dockerized compilation will happen in here.
pub const COMPILE_SANDBOXED: CompileStrategy = |req| {
    // TODO: implement!
    CompilationResult::Success { result: req.source }
};

pub async fn route_compile(
    compile_strategy: CompileStrategy,
    req: Json<CompilationRequest>,
) -> impl Responder {
    let compile_result = compile_strategy(CompilationRequest {
        source: req.source.to_string(),
    });
    // TODO: Maybe there's a way to use implicit serialization.
    // Because we have implicit deserialization.
    let compile_result = serde_json::to_string(&compile_result).unwrap();
    HttpResponse::Ok().body(compile_result)
}

// -------------------------------------------------------------------------------------------------
// TESTS
// -------------------------------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        test,
        web,
        App,
    };

    /// A compile strategy mock. Accepts only `foo` as "correct" source code.
    const COMPILE_MOCKED: CompileStrategy = |req| {
        if req.source == "foo" {
            CompilationResult::Success {
                result: format!("Compilation of {} succeeded.", req.source),
            }
        } else {
            CompilationResult::Failure {
                message: format!("Compilation of {} failed.", req.source),
            }
        }
    };

    /// Simulates a compilation success on the service
    #[actix_rt::test]
    async fn test_compilation_success() {
        // TODO: Write reusable helper to setup service
        let mut app = test::init_service(App::new().route(
            "/",
            web::post().to(|body| route_compile(COMPILE_MOCKED, body)),
        ))
        .await;

        let req = CompilationRequest {
            source: "foo".to_string(),
        };
        let req = test::TestRequest::post()
            .set_json(&req)
            .uri("/")
            .to_request();

        let res: CompilationResult = test::read_response_json(&mut app, req).await;

        assert_eq!(
            res,
            CompilationResult::Success {
                result: "Compilation of foo succeeded.".to_string()
            }
        );
    }

    /// Simulates a compilation failure on the service
    #[actix_rt::test]
    async fn test_compilation_failure() {
        // TODO: Write reusable helper to setup service
        let mut app = test::init_service(App::new().route(
            "/",
            web::post().to(|body| route_compile(COMPILE_MOCKED, body)),
        ))
        .await;

        let req = CompilationRequest {
            source: "bar".to_string(),
        };
        let req = test::TestRequest::post()
            .set_json(&req)
            .uri("/")
            .to_request();

        let res: CompilationResult = test::read_response_json(&mut app, req).await;

        assert_eq!(
            res,
            CompilationResult::Failure {
                message: "Compilation of bar failed.".to_string()
            }
        );
    }
}
