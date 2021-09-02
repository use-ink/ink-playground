use std::ops::Index;

use base_db::{CrateData, CrateGraph};
use cfg::CfgOptions;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct CrateGraphJson {
    crates: Vec<(u32, CrateDataJson)>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct CrateDataJson {
    root_file_id: u32,
    edition: String,
    display_name: Option<String>,
    cfg_options: CfgOptionsJson,
    potential_cfg_options: CfgOptionsJson,
    env: EnvJson,
    dependencies: Vec<DependencyJson>,
    proc_macro: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
struct CfgOptionsJson {
    options: Vec<(String, Vec<String>)>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
struct EnvJson {
    env: Vec<(String, Vec<String>)>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
struct DependencyJson {}

impl CrateGraphJson {
    pub fn from_crate_graph(crate_graph: CrateGraph) -> Self {
        let crates = crate_graph
            .iter()
            .map(|id| (id, crate_graph.index(id)))
            .map(|(id, crate_data)| (id.0, CrateDataJson::from(crate_data)))
            .collect::<Vec<_>>();
        CrateGraphJson { crates }
    }
}

impl CrateDataJson {
    fn from(crate_data: &CrateData) -> Self {
        let mut json = CrateDataJson::default();
        json
    }
}

impl CfgOptionsJson {
    pub fn from(cfg_options: CfgOptions) -> Self {
        let options = cfg_options
            .get_cfg_keys()
            .iter()
            .map(|key| {
                (
                    String::from(key.as_str()),
                    cfg_options
                        .get_cfg_values(key)
                        .iter()
                        .map(|val| String::from(val.as_str()))
                        .collect::<Vec<_>>(),
                )
            })
            .collect::<Vec<_>>();
        CfgOptionsJson { options }
    }
}
