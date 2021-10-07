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

use std::path::Path;

use actix_files as fs;
use actix_web::{
    middleware,
    App,
    HttpServer,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let serve_from = "../../packages/playground/dist";
    if !Path::new(serve_from).is_dir() {
        panic!("{} is not a valid directory \n Hint: try to run yarn build inside the Frontend Repo first.", serve_from);
    }

    HttpServer::new(move || {
        App::new()
            .wrap(
                middleware::DefaultHeaders::new()
                    .header("Cross-Origin-Opener-Policy", "same-origin")
                    .header("Cross-Origin-Embedder-Policy", "require-corp"),
            )
            .service(fs::Files::new("/", serve_from).index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
