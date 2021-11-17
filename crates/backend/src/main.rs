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
        gist::create::{
            route_gist_create,
            GH_API,
        },
    },
};
use actix_cors::Cors;
use actix_web::{
    middleware::{
        Condition,
        DefaultHeaders,
    },
    web::{
        get,
        post,
    },
    App,
    HttpResponse,
    HttpServer,
};
use clap::Clap;
use std::path::Path;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let opts: Opts = Opts::parse();
    let port = opts.port;
    let frontend_folder = opts.frontend_folder;
    let host = opts.host;
    let github_token = opts.github_token;

    if let Some(path) = &frontend_folder {
        if !Path::new(path).is_dir() {
            panic!("{} is not a valid directory.", path);
        }
    }

    let dev_mode = opts.dev_mode;
    HttpServer::new(move || {
        let mut app = App::new()
            .wrap(Condition::new(dev_mode, Cors::permissive()))
            .wrap(
                DefaultHeaders::new()
                    .header("Cross-Origin-Opener-Policy", "same-origin")
                    .header("Cross-Origin-Embedder-Policy", "require-corp"),
            )
            .route(
                "/compile",
                post().to(|body| route_compile(COMPILE_SANDBOXED, body)),
            )
            .route(
                "/gist/create",
                post().to(move |body| route_gist_create(GH_API, &github_token, body)),
            )
            .route(
                "/status",
                get().to(|| HttpResponse::Ok().body("ink-backend is live")),
            );

        if let Some(path) = &frontend_folder {
            app = app.service(route_frontend("/", path));
        }

        app
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await?;

    Ok(())
}
