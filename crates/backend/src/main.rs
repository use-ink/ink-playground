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
mod envvars;

fn serve_frontend(dir: &str) -> actix_files::Files {
    fs::Files::new("/", dir).index_file("index.html")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = envy::from_env::<envvars::Config>().unwrap();
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
            .service(serve_frontend(&frontend_folder))
    })
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{
        http,
        test,
        App,
    };
    use std::{
        env,
        fs::File,
        io::prelude::*,
    };

    #[actix_rt::test]
    async fn test_serve_static_index() {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        let mut test_file = File::create(format!("{}/index.html", temp_dir)).unwrap();
        test_file.write_all(b"Hello, world!").unwrap();

        let mut app =
            test::init_service(App::new().service(serve_frontend(temp_dir))).await;

        let req = test::TestRequest::with_header("content-type", "text/plain")
            .uri("/")
            .to_request();

        let content = test::read_response(&mut app, req).await;

        assert_eq!(content, "Hello, world!".to_string());
    }

    #[actix_rt::test]
    async fn test_serve_static_arbitrary_file() {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        let mut test_file = File::create(format!("{}/foo.txt", temp_dir)).unwrap();
        test_file.write_all(b"Hello, world!").unwrap();

        let mut app =
            test::init_service(App::new().service(serve_frontend(temp_dir))).await;

        let req = test::TestRequest::with_header("content-type", "text/plain")
            .uri("/foo.txt")
            .to_request();

        let content = test::read_response(&mut app, req).await;

        assert_eq!(content, "Hello, world!".to_string());
    }

    #[actix_rt::test]
    async fn test_dont_serve_nonexistant_file() {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        let mut test_file = File::create(format!("{}/foo.txt", temp_dir)).unwrap();
        test_file.write_all(b"Hello, world!").unwrap();

        let mut app =
            test::init_service(App::new().service(serve_frontend(temp_dir))).await;

        let req = test::TestRequest::with_header("content-type", "text/plain")
            .uri("/foobar.txt")
            .to_request();

        let resp = test::call_service(&mut app, req).await;

        assert_eq!(resp.status(), http::StatusCode::NOT_FOUND);
    }
}
