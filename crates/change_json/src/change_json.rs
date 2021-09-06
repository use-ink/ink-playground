use std::sync::Arc;

use base_db::{Change, FileId, FileSet, SourceRoot, VfsPath};

use serde::{Deserialize, Serialize};

use crate_graph_json::CrateGraphJson;

use crate::crate_graph_json;

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct ChangeJson {
    crate_graph: Option<CrateGraphJson>,
    local_roots: Option<SourceRootJson>,
    library_roots: Option<SourceRootJson>,
    files_changed: FilesJson,
}

impl ChangeJson {
    pub fn from(change: &Change) -> ChangeJson {
        let crate_graph = match &change.crate_graph {
            Some(crate_graph) => Some(CrateGraphJson::from(&crate_graph)),
            None => None,
        };
        let local_roots = match &change.roots {
            Some(roots) => Some(SourceRootJson::from(&roots, false)),
            None => None,
        };
        let library_roots = match &change.roots {
            Some(roots) => Some(SourceRootJson::from(&roots, true)),
            None => None,
        };
        let files_changed = FilesJson::from(&change.files_changed);
        ChangeJson {
            crate_graph,
            local_roots,
            library_roots,
            files_changed,
        }
    }

    pub fn to_change(&self) -> Change {
        let mut change = Change::default();
        match &self.crate_graph {
            Some(crate_graph_json) => change.set_crate_graph(crate_graph_json.to_crate_graph()),
            None => (),
        };
        let mut roots = Vec::new();
        match &self.local_roots {
            Some(local_roots) => roots.append(&mut local_roots.to_roots(false)),
            None => (),
        }
        match &self.library_roots {
            Some(library_roots) => roots.append(&mut library_roots.to_roots(true)),
            None => (),
        }
        change.set_roots(roots.to_vec());
        self.files_changed.files.iter().for_each(|(id, text)| {
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
    fn from(roots: &Vec<SourceRoot>, library: bool) -> Self {
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
    fn to_roots(&self, library: bool) -> Vec<SourceRoot> {
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

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
struct FilesJson {
    files: Vec<(u32, Option<String>)>,
}

impl FilesJson {
    fn from(files_changed: &Vec<(FileId, Option<Arc<String>>)>) -> Self {
        let files = files_changed
            .iter()
            .map(|(id, value)| {
                let value = match value {
                    Some(value) => Some(value.to_string()),
                    None => None,
                };
                (id.0, value)
            })
            .collect::<Vec<_>>();
        FilesJson { files }
    }
}
