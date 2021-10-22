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

mod cli;
mod services;

use crate::{
    cli::Opts,
    services::{
        compile::{
            route_compile,
            COMPILE_SANDBOXED,
        },
        frontend::route_frontend,
    },
};
use actix_web::{
    middleware,
    web::post,
    App,
    HttpServer,
};
use clap::Clap;
use std::path::Path;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let opts: Opts = Opts::parse();
    let port = opts.port;
    let frontend_folder = opts.frontend_folder;
    let host = "127.0.0.1";

    if !Path::new(&frontend_folder).is_dir() {
        panic!("{} is not a valid directory.", frontend_folder);
    }

    HttpServer::new(move || {
        App::new()
            .wrap(
                middleware::DefaultHeaders::new()
                    .header("Cross-Origin-Opener-Policy", "same-origin")
                    .header("Cross-Origin-Embedder-Policy", "require-corp"),
            )
            .route(
                "/compile",
                post().to(|body| route_compile(COMPILE_SANDBOXED, body)),
            )
            .service(route_frontend("/", &frontend_folder))
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await?;

    Ok(())
}
