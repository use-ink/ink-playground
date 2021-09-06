use crate::crate_graph_json;
use base_db::{Change, FileId, FileSet, SourceRoot, VfsPath};
use crate_graph_json::CrateGraphJson;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct ChangeJson {
    crate_graph: Option<CrateGraphJson>,
    local_roots: Option<SourceRootJson>,
    library_roots: Option<SourceRootJson>,
    files_changed: FilesJson,
}

impl ChangeJson {
    pub fn from(change: &Change) -> ChangeJson {
        let crate_graph = change.crate_graph.as_ref().map(CrateGraphJson::from);
        let local_roots = change
            .roots
            .as_ref()
            .map(|root| SourceRootJson::from(root, false));
        let library_roots = change
            .roots
            .as_ref()
            .map(|roots| SourceRootJson::from(roots, true));
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
            let text = text.as_ref().map(|text| Arc::new(text.to_string()));
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
    fn from(roots: &[SourceRoot], library: bool) -> Self {
        let roots = roots
            .iter()
            .filter(|root| root.is_library == library)
            .map(|val| {
                val.iter()
                    .map(move |file_id| (file_id, val.path_for_file(&file_id)))
                    .map(|(id, path)| {
                        let id = id.0;
                        let path = path.map(|path| path.to_string());
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
                    if let Some(path) = path
                        .as_ref()
                        .map(String::to_string)
                        .map(VfsPath::new_virtual_path)
                    {
                        file_set.insert(file_id, path)
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
    fn from(files_changed: &[(FileId, Option<Arc<String>>)]) -> Self {
        let files = files_changed
            .iter()
            .map(|(id, value)| (id.0, value.as_ref().map(Arc::to_string)))
            .collect::<Vec<_>>();
        FilesJson { files }
    }
}
