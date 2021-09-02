use std::ops::Index;

use base_db::{CrateData, CrateGraph, Env};
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
    env: Vec<(String, String)>,
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
        let root_file_id = crate_data.root_file_id.0;
        let edition = crate_data.edition.to_string();
        let display_name = match crate_data.display_name {
            Some(name) => Some(name.to_string()),
            None => None,
        };
        let cfg_options = CfgOptionsJson::from(crate_data.cfg_options);
        let potential_cfg_options = CfgOptionsJson::from(crate_data.potential_cfg_options);
        let env = EnvJson::from(crate_data.env);
        let dependencies = Vec::new();
        let proc_macro = Vec::new();
        CrateDataJson {
            root_file_id,
            edition,
            display_name,
            cfg_options,
            potential_cfg_options,
            env,
            dependencies,
            proc_macro,
        }
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

impl EnvJson {
    fn from(env : Env) -> Self {
        let env = env
            .iter()
            .map(|(a, b)| (String::from(a), String::from(b)))
            .collect::<Vec<(String, String)>>();
        EnvJson { env }
    }
}