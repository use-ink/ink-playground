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

//! This module contains the service which serves the backend as static files.

use actix_files as fs;

pub fn route_frontend(at: &str, dir: &str) -> actix_files::Files {
    fs::Files::new(at, dir).index_file("index.html")
}

#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{http, test, App};
    use std::{env, fs::File, io::prelude::*};

    #[actix_rt::test]
    async fn test_serve_static_index() {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        let mut test_file = File::create(format!("{}/index.html", temp_dir)).unwrap();
        test_file.write_all(b"Hello, world!").unwrap();

        let app =
            test::init_service(App::new().service(route_frontend("/", temp_dir))).await;

        let req = test::TestRequest::with_uri("/")
            .insert_header(("content-type", "text/plain"))
            .to_request();

        let content = test::call_and_read_body(&app, req).await;

        assert_eq!(content, "Hello, world!".to_string());
    }

    #[actix_rt::test]
    async fn test_serve_static_arbitrary_file() {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        let mut test_file = File::create(format!("{}/foo.txt", temp_dir)).unwrap();
        test_file.write_all(b"Hello, world!").unwrap();

        let app =
            test::init_service(App::new().service(route_frontend("/", temp_dir))).await;

        let req = test::TestRequest::with_uri("/foo.txt")
            .insert_header(("content-type", "text/plain"))
            .to_request();

        let content = test::call_and_read_body(&app, req).await;

        assert_eq!(content, "Hello, world!".to_string());
    }

    #[actix_rt::test]
    async fn test_do_not_serve_nonexistent_file() {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        let mut test_file = File::create(format!("{}/foo.txt", temp_dir)).unwrap();
        test_file.write_all(b"Hello, world!").unwrap();

        let app =
            test::init_service(App::new().service(route_frontend("/", temp_dir))).await;

        let req = test::TestRequest::with_uri("/foobar.txt")
            .insert_header(("content-type", "text/plain"))
            .uri("/foobar.txt")
            .to_request();

        let resp = test::call_service(&app, req).await;

        assert_eq!(resp.status(), http::StatusCode::NOT_FOUND);
    }
}
