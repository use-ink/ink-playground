use std::fs;

use actix_web::{
    body::BoxBody,
    web,
    HttpResponse,
};

pub use sandbox::VersionListResult;
use serde_json::{
    json,
    Value,
};

pub struct AppVersionState {
    pub versions_file_path: String,
}

fn read_json_file(file_path: &str) -> Result<String, std::io::Error> {
    fs::read_to_string(file_path)
}

pub async fn route_version_list(
    data: web::Data<AppVersionState>,
) -> HttpResponse<BoxBody> {
    let versions_file_path = &data.versions_file_path;
    let versions_arr_string = read_json_file(versions_file_path).unwrap();
    let versions_arr_json: Value =
        serde_json::from_str(versions_arr_string.as_str()).expect("Failed to parse JSON");
    let versions_json = json!({
        "versions": versions_arr_json
    });
    let versions_json_string =
        serde_json::to_string_pretty(&versions_json).expect("Failed to stringify JSON");

    HttpResponse::Ok()
        .append_header(("Content-Type", "application/json"))
        .body(versions_json_string)
}
