use serde::{Deserialize, Serialize};
use base_db::{CrateGraph, CrateId};

#[derive(Serialize, Deserialize, Clone)]
pub struct CrateGraphJson {
    crates: Vec<(u32, CrateDataJson)>
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CrateDataJson {
    name: String
}