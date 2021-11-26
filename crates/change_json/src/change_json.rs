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

use crate::crate_graph_json;
use base_db::{
    Change,
    CrateGraph,
    FileId,
    FileSet,
    SourceRoot,
    VfsPath,
};
use crate_graph_json::CrateGraphJson;
use serde::{
    Deserialize,
    Serialize,
};
use std::sync::Arc;

/// Provides a (de-)serializable version of Rust Analyzers `Change` object, together with an implementation of the From traits for `Change` and `ChangeJson`.
#[derive(Serialize, Deserialize, Debug, Default, Clone)]
pub struct ChangeJson {
    crate_graph: Option<CrateGraphJson>,
    local_roots: Option<SourceRootJson>,
    library_roots: Option<SourceRootJson>,
    files_changed: FilesJson,
}

impl From<&Change> for ChangeJson {
    fn from(change: &Change) -> Self {
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
}

impl From<Change> for ChangeJson {
    fn from(change: Change) -> Self {
        ChangeJson::from(&change)
    }
}

impl From<&ChangeJson> for Change {
    fn from(change_json: &ChangeJson) -> Self {
        let mut change = Change::default();
        if let Some(graph) = change_json.crate_graph.as_ref() {
            change.set_crate_graph(CrateGraph::from(graph))
        }
        let mut roots = Vec::new();
        if let Some(local) = change_json.local_roots.as_ref() {
            roots.append(&mut local.to_roots(false))
        }
        if let Some(library) = change_json.library_roots.as_ref() {
            roots.append(&mut library.to_roots(true))
        }
        change.set_roots(roots);
        for (id, text) in &change_json.files_changed.files {
            let id = FileId(*id);
            let text = text.as_ref().map(|text| Arc::new(text.to_string()));
            change.change_file(id, text)
        }
        change
    }
}

impl From<ChangeJson> for Change {
    fn from(change_json: ChangeJson) -> Self {
        Change::from(&change_json)
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
                for (file_id, path) in root {
                    let file_id = FileId(*file_id);
                    if let Some(path) = path
                        .as_ref()
                        .map(String::to_string)
                        .map(VfsPath::new_virtual_path)
                    {
                        file_set.insert(file_id, path)
                    };
                }
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
