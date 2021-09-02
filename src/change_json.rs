use std::sync::Arc;

use base_db::{Change, FileId, FileSet, SourceRoot, VfsPath};

use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};

use crate_graph_json::CrateGraphJson;

use crate::crate_graph_json;

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct ChangeJson {
    crate_graph: CrateGraphJson,
    local_roots: SourceRootJson,
    library_roots: SourceRootJson,
    files: FxHashMap<u32, Option<String>>,
}

impl ChangeJson {
    pub fn from(change: Change) -> ChangeJson {
        ChangeJson::default()
    }

    pub fn change_file(&mut self, file_id: FileId, new_text: Option<Arc<String>>) -> () {
        let new_text = match new_text {
            Some(new_text) => Some(new_text.to_string()),
            None => None,
        };
        let file_id = file_id.0;
        self.files.insert(file_id, new_text);
    }

    pub fn set_roots(&mut self, roots: Vec<SourceRoot>) -> () {
        self.library_roots = SourceRootJson::from_roots(&roots, true);
        self.local_roots = SourceRootJson::from_roots(&roots, false);
    }

    pub fn set_crate_graph(&mut self, crate_graph: CrateGraphJson) -> () {
        self.crate_graph = crate_graph;
    }

    pub fn to_change(&self) -> Change {
        let crate_graph = self.crate_graph.to_crate_graph().clone();
        let mut change = Change::default();
        change.set_crate_graph(crate_graph);
        let mut roots = self.local_roots.to_roots(false);
        roots.append(&mut self.library_roots.to_roots(true));
        change.set_roots(roots);
        self.files.iter().for_each(|(id, text)| {
            let id = FileId(*id);
            let text = match text {
                Some(text) => Some(Arc::new(text.to_string())),
                None => None,
            };
            change.change_file(id, text)
        });
        change
    }
}

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
struct SourceRootJson {
    roots: Vec<Vec<(u32, Option<String>)>>,
}

impl SourceRootJson {
    pub fn from_roots(roots: &Vec<SourceRoot>, library: bool) -> Self {
        let roots = roots
            .iter()
            .filter(|root| root.is_library == library)
            .map(|val| {
                val.iter()
                    .map(move |file_id| (file_id, val.path_for_file(&file_id)))
                    .map(|(id, path)| {
                        let id = id.0;
                        let path = match path {
                            Some(path) => Some(path.to_string()),
                            None => None,
                        };
                        (id, path)
                    })
                    .collect::<Vec<(u32, Option<String>)>>()
            })
            .collect::<Vec<Vec<(u32, Option<String>)>>>();
        SourceRootJson { roots }
    }
    pub fn to_roots(&self, library: bool) -> Vec<SourceRoot> {
        let result = self
            .roots
            .iter()
            .map(|root| {
                let mut file_set = FileSet::default();
                root.iter().for_each(|(file_id, path)| {
                    let file_id = FileId(*file_id);
                    match path {
                        Some(path) => {
                            let path = VfsPath::new_virtual_path(path.to_string());
                            file_set.insert(file_id, path);
                        }
                        None => (),
                    };
                });
                file_set
            })
            .map(|file_set| {
                if library {
                    SourceRoot::new_library(file_set)
                } else {
                    SourceRoot::new_local(file_set)
                }
            })
            .collect::<Vec<_>>();
        result
    }
}
