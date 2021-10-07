use std::{path::Path};

use actix_files as fs;
use actix_web::{App, HttpServer};



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let serve_from = "../../packages/playground/dist";
    if !Path::new(serve_from).is_dir() {
        panic!("{} is not a valid directory", serve_from);
    } 

    HttpServer::new(move || {
        App::new().service(fs::Files::new("/",  serve_from).index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}