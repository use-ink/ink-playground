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

use actix_files as fs;
use actix_web::{
    middleware,
    App,
    HttpServer,
};
use std::path::Path;
mod env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = envy::from_env::<env::Config>().unwrap();
    let port = config.port;
    let frontend_folder = config.frontend_folder;

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
            .service(fs::Files::new("/", &frontend_folder).index_file("index.html"))
    })
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}
