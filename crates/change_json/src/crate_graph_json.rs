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

use base_db::{
    CrateData,
    CrateDisplayName,
    CrateGraph,
    CrateId,
    CrateName,
    Edition,
    Env,
    FileId,
};
use cfg::CfgOptions;
use serde::{
    Deserialize,
    Serialize,
};
use std::ops::Index;
use tt::SmolStr;

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
pub struct CrateGraphJson {
    crates: Vec<(u32, CrateDataJson)>,
    deps: Vec<DepJson>,
}

#[derive(Serialize, Deserialize, Clone, Default, Debug, PartialEq)]
struct CrateDataJson {
    root_file_id: u32,
    edition: String,
    display_name: Option<String>,
    cfg_options: CfgOptionsJson,
    potential_cfg_options: CfgOptionsJson,
    env: EnvJson,
    proc_macro: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
struct CfgOptionsJson {
    options: Vec<(String, Vec<String>)>,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default, PartialEq)]
struct EnvJson {
    env: Vec<(String, String)>,
}

#[derive(Serialize, Deserialize, Debug, Default, Clone, PartialEq)]
struct DepJson {
    from: u32,
    name: String,
    to: u32,
}

impl CrateGraphJson {
    pub fn from(crate_graph: &CrateGraph) -> Self {
        let mut deps: Vec<DepJson> = Vec::new();
        let mut crates = crate_graph
            .iter()
            .map(|id| (id, crate_graph.index(id)))
            .map(|(id, crate_data)| {
                (id.0, {
                    let mut crate_deps = crate_data
                        .dependencies
                        .iter()
                        .map(|dep| {
                            DepJson {
                                from: id.0,
                                name: dep.name.to_string(),
                                to: dep.crate_id.0,
                            }
                        })
                        .collect::<Vec<_>>();
                    deps.append(&mut crate_deps);
                    CrateDataJson::from(crate_data)
                })
            })
            .collect::<Vec<_>>();
        crates.sort_by(|(id_a, _), (id_b, _)| id_a.cmp(id_b));
        CrateGraphJson { crates, deps }
    }

    pub fn to_crate_graph(&self) -> CrateGraph {
        let mut crate_graph = CrateGraph::default();
        self.crates.iter().for_each(|(_, data)| {
            let file_id = FileId(data.root_file_id);
            let edition = data.edition.parse::<Edition>().unwrap_or(Edition::CURRENT);
            let display_name = data
                .display_name
                .as_ref()
                .map(|name| CrateDisplayName::from_canonical_name(name.to_string()));
            let cfg_options = data.cfg_options.to_cfg_options();
            let potential_cfg_options = data.potential_cfg_options.to_cfg_options();
            let env = data.env.to_env();
            crate_graph.add_crate_root(
                file_id,
                edition,
                display_name,
                cfg_options,
                potential_cfg_options,
                env,
                Vec::new(),
            );
        });
        self.deps.iter().for_each(|dep| {
            let from = CrateId(dep.from);
            let to = CrateId(dep.to);
            if let Ok(name) = CrateName::new(&dep.name) {
                crate_graph.add_dep(from, name, to).unwrap_or_else(|err| {
                    panic!("Cyclic Dependency in parsed data: {}", err)
                });
            };
        });
        crate_graph
    }
}

impl CrateDataJson {
    fn from(crate_data: &CrateData) -> Self {
        let root_file_id = crate_data.root_file_id.0;
        let edition = crate_data.edition.to_string();
        let display_name = crate_data
            .display_name
            .as_ref()
            .map(|name| name.to_string());
        let cfg_options = CfgOptionsJson::from(&crate_data.cfg_options);
        let potential_cfg_options =
            CfgOptionsJson::from(&crate_data.potential_cfg_options);
        let env = EnvJson::from(crate_data.env.clone());
        let proc_macro = Vec::new();
        CrateDataJson {
            root_file_id,
            edition,
            display_name,
            cfg_options,
            potential_cfg_options,
            env,
            proc_macro,
        }
    }
}

impl CfgOptionsJson {
    fn from(cfg_options: &CfgOptions) -> Self {
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

    fn to_cfg_options(&self) -> CfgOptions {
        let mut cfg_options = CfgOptions::default();
        self.options.iter().for_each(|(key, values)| {
            values.iter().for_each(|value| {
                let key = SmolStr::from(key);
                let value = SmolStr::from(value);
                cfg_options.insert_key_value(key, value);
            })
        });
        cfg_options
    }
}

impl EnvJson {
    fn from(env: Env) -> Self {
        let env = env
            .iter()
            .map(|(a, b)| (String::from(a), String::from(b)))
            .collect::<Vec<(String, String)>>();
        EnvJson { env }
    }
    
    fn to_env(&self) -> Env {
        let mut env = Env::default();
        self.env
            .iter()
            .for_each(|(key, value)| env.set(key, value.to_string()));
        env
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn serialize_crategraph_check_deps() {
        // given
        let mut graph = CrateGraph::default();
        let crate1 = graph.add_crate_root(
            FileId(1u32),
            Edition::Edition2018,
            None,
            CfgOptions::default(),
            CfgOptions::default(),
            Env::default(),
            Default::default(),
        );
        let crate2 = graph.add_crate_root(
            FileId(2u32),
            Edition::Edition2018,
            None,
            CfgOptions::default(),
            CfgOptions::default(),
            Env::default(),
            Default::default(),
        );
        let crate3 = graph.add_crate_root(
            FileId(3u32),
            Edition::Edition2018,
            None,
            CfgOptions::default(),
            CfgOptions::default(),
            Env::default(),
            Default::default(),
        );
        graph
            .add_dep(crate1, CrateName::new("crate2").unwrap(), crate2)
            .unwrap();
        graph
            .add_dep(crate2, CrateName::new("crate3").unwrap(), crate3)
            .unwrap();

        // when
        let serialized_graph = CrateGraphJson::from(&graph);

        // then
        let expected_deps = vec![
            DepJson {
                from: 0,
                name: "crate2".to_string(),
                to: 1,
            },
            DepJson {
                from: 1,
                name: "crate3".to_string(),
                to: 2,
            },
        ];
        assert_eq!(serialized_graph.deps, expected_deps);
    }
}
