use actix_web::{
  body::BoxBody,
  HttpResponse,
};

pub use sandbox::VersionListResult;

pub async fn route_version_list() -> HttpResponse<BoxBody> {
  let formatting_result = "{\"versions\": [\"1.0.0\"]}".to_string();
  // let formatting_result = serde_json::to_string(&result).unwrap();
  HttpResponse::Ok().append_header(("Content-Type","application/json")).body(formatting_result)
}