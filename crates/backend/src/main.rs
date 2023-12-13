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
        contract::{
            route_compile,
            route_format,
            route_status,
            route_test,
            COMPILE_SANDBOXED,
            FORMAT_SANDBOXED,
            TEST_SANDBOXED,
        },
        frontend::{
            route_frontend,
            route_frontend_version,
            FrontendState,
        },
        gist::{
            create::route_gist_create,
            load::route_gist_load,
        },
        version::{
            route_version_list,
            AppVersionState,
        },
    },
};
use actix_cors::Cors;
use actix_web::{
    middleware::{
        self,
        Condition,
        DefaultHeaders,
    },
    web,
    web::{
        get,
        post,
    },
    App,
    HttpResponse,
    HttpServer,
};
use actix_web_prom::PrometheusMetricsBuilder;

use clap::Parser;
use std::{
    collections::HashMap,
    path::Path,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let opts: Opts = Opts::parse();

    let port = opts.port;
    let host = opts.host.clone();

    if let Some(path) = &opts.frontend_folder {
        if !Path::new(path).is_dir() {
            panic!("{} is not a valid directory.", path);
        }
    }

    if !Path::new(&opts.versions_file_path.clone()).is_file() {
        panic!("{} is not a valid file.", opts.versions_file_path);
    }

    async fn health() -> HttpResponse {
        HttpResponse::Ok().finish()
    }

    let mut labels = HashMap::new();
    labels.insert("label1".to_string(), "value1".to_string());
    let prometheus = PrometheusMetricsBuilder::new("api")
        .endpoint("/metrics")
        .const_labels(labels)
        .build()
        .unwrap();

    HttpServer::new(move || {
        let opts: Opts = opts.clone();
        let frontend_folder = opts.frontend_folder.clone();
        let versions_file_path = opts.versions_file_path.clone();

        let mut app = App::new()
            .wrap(prometheus.clone())
            .service(web::resource("/health").to(health))
            .wrap(middleware::Compress::default())
            .wrap(Condition::new(opts.dev_mode, Cors::permissive()))
            .wrap(
                DefaultHeaders::new()
                    .add(("Cross-Origin-Opener-Policy", "same-origin"))
                    .add(("Cross-Origin-Embedder-Policy", "require-corp")),
            )
            .route(
                "/compile",
                post().to(|body| route_compile(COMPILE_SANDBOXED, body)),
            )
            .route(
                "/test",
                post().to(|body| route_test(TEST_SANDBOXED, body)),
            )
            .route(
                "/format",
                post().to(|body| route_format(FORMAT_SANDBOXED, body)),
            )
            .route(
                "/status",
                get().to(route_status),
            )
            .app_data(web::Data::new(AppVersionState {
                versions_file_path: versions_file_path,
            }))
            .service(
                web::resource("/version_list").to(route_version_list)
            );

        match opts.github_token {
            Some(github_token) => {
                let github_token_a = github_token.clone();
                let github_token_b = github_token;
                app = app
                    .route(
                        "gist/create",
                        post().to(move |body| {
                            route_gist_create(github_token_a.clone(), body)
                        }),
                    )
                    .route(
                        "gist/load",
                        post().to(move |body| {
                            route_gist_load(github_token_b.clone(), body)
                        }),
                    );
            }
            None => {
                println!("Warning: Starting backend without gist endpoint due to missing token.")
            }
        }

        match frontend_folder {
            Some(path) => {
                app = app
                    .app_data(web::Data::new(FrontendState {
                        frontend_folder: path.clone(),
                    }))
                    .route("/v{tail:.*}", web::get().to(route_frontend_version))
                    .service(route_frontend("/", path.as_ref()));
            }
            None => {
                println!("Warning: Starting backend without serving static frontend files due to missing configuration.")
            }
        }

        app
    })
    .bind(format!("{}:{}", &host, &port))?
    .run()
    .await?;

    Ok(())
}
