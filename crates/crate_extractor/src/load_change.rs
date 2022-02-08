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

use anyhow::Result;
use crossbeam_channel::{
    unbounded,
    Receiver,
};
use ide::Change;
use ide_db::base_db::{
    CrateGraph,
    SourceRoot,
    VfsPath,
};
use project_model::{
    CargoConfig,
    ProjectManifest,
    ProjectWorkspace,
    WorkspaceBuildScripts,
};
use std::sync::Arc;
use vfs::{
    file_set::FileSetConfig,
    loader::Handle,
    AbsPath,
    AbsPathBuf,
};
use rustc_hash::FxHashMap;

pub struct LoadCargoConfig {
    pub load_out_dirs_from_check: bool,
    pub with_proc_macro: bool,
    pub prefill_caches: bool,
}

pub fn load_change_at(
    manifest_path: &AbsPathBuf,
    cargo_config: &CargoConfig,
    load_config: &LoadCargoConfig,
    progress: &dyn Fn(String),
) -> Result<Change> {
    let root = ProjectManifest::discover_single(manifest_path)?;
    let workspace = ProjectWorkspace::load(root, cargo_config, progress)?;

    load_change(workspace, cargo_config, load_config, progress)
}

pub fn load_change(
    mut ws: ProjectWorkspace,
    cargo_config: &CargoConfig,
    load_config: &LoadCargoConfig,
    progress: &dyn Fn(String),
) -> Result<Change> {
    let (sender, receiver) = unbounded();
    let mut vfs = vfs::Vfs::default();
    let mut loader = {
        let loader = vfs_notify::NotifyHandle::spawn(Box::new(move |msg| {
            sender.send(msg).unwrap()
        }));
        Box::new(loader)
    };

    ws.set_build_scripts(
        if load_config.load_out_dirs_from_check {
            ws.run_build_scripts(cargo_config, progress)?
        } else {
            WorkspaceBuildScripts::default()
        },
    );

    let crate_graph =
        ws.to_crate_graph(&FxHashMap::default(), &mut |_: &AbsPath, _| Vec::new(), &mut |path: &AbsPath| {
            let contents = loader.load_sync(path);
            let path = vfs::VfsPath::from(path.to_path_buf());
            vfs.set_file_contents(path.clone(), contents);
            vfs.file_id(&path)
        });

    let project_folders = ProjectFolders::new(&[ws], &[]);
    loader.set_config(vfs::loader::Config {
        load: project_folders.load,
        watch: vec![],
        version: 0,
    });

    log::debug!("crate graph: {:?}", crate_graph);
    let change = load_crate_graph(
        crate_graph,
        project_folders.source_root_config,
        &mut vfs,
        &receiver,
    );

    Ok(change)
}

fn load_crate_graph(
    crate_graph: CrateGraph,
    source_root_config: SourceRootConfig,
    vfs: &mut vfs::Vfs,
    receiver: &Receiver<vfs::loader::Message>,
) -> Change {
    let mut analysis_change = Change::new();

    // wait until Vfs has loaded all roots
    for task in receiver {
        match task {
            vfs::loader::Message::Progress {
                n_done,
                n_total,
                config_version: _,
            } => {
                if n_done == n_total {
                    break
                }
            }
            vfs::loader::Message::Loaded { files } => {
                for (path, contents) in files {
                    vfs.set_file_contents(path.into(), contents);
                }
            }
        }
    }
    let changes = vfs.take_changes();
    for file in changes {
        if file.exists() {
            let contents = vfs.file_contents(file.file_id).to_vec();
            if let Ok(text) = String::from_utf8(contents) {
                analysis_change.change_file(file.file_id, Some(Arc::new(text)))
            }
        }
    }
    let source_roots = source_root_config.partition(vfs);
    analysis_change.set_roots(source_roots);

    analysis_change.set_crate_graph(crate_graph);

    analysis_change
}

#[derive(Default)]
struct ProjectFolders {
    load: Vec<vfs::loader::Entry>,
    watch: Vec<usize>,
    source_root_config: SourceRootConfig,
}

impl ProjectFolders {
    pub(crate) fn new(
        workspaces: &[ProjectWorkspace],
        global_excludes: &[AbsPathBuf],
    ) -> ProjectFolders {
        let mut res = ProjectFolders::default();
        let mut fsc = FileSetConfig::builder();
        let mut local_filesets = vec![];
        for root in workspaces.iter().flat_map(|ws| ws.to_roots()) {
            let file_set_roots: Vec<VfsPath> =
                root.include.iter().cloned().map(VfsPath::from).collect();
            let entry = {
                let mut dirs = vfs::loader::Directories::default();
                dirs.extensions.push("rs".into());
                dirs.include.extend(root.include);
                dirs.exclude.extend(root.exclude);
                for excl in global_excludes {
                    if dirs
                        .include
                        .iter()
                        .any(|incl| incl.starts_with(excl) || excl.starts_with(incl))
                    {
                        dirs.exclude.push(excl.clone());
                    }
                }
                vfs::loader::Entry::Directories(dirs)
            };
            if root.is_local {
                res.watch.push(res.load.len());
            }
            res.load.push(entry);

            if root.is_local {
                local_filesets.push(fsc.len());
            }
            fsc.add_file_set(file_set_roots)
        }
        let fsc = fsc.build();
        res.source_root_config = SourceRootConfig {
            fsc,
            local_filesets,
        };
        res
    }
}

#[derive(Default, Debug)]
struct SourceRootConfig {
    fsc: FileSetConfig,
    local_filesets: Vec<usize>,
}

impl SourceRootConfig {
    fn partition(&self, vfs: &vfs::Vfs) -> Vec<SourceRoot> {
        let _p = profile::span("SourceRootConfig::partition");
        self.fsc
            .partition(vfs)
            .into_iter()
            .enumerate()
            .map(|(idx, file_set)| {
                let is_local = self.local_filesets.contains(&idx);
                if is_local {
                    SourceRoot::new_local(file_set)
                } else {
                    SourceRoot::new_library(file_set)
                }
            })
            .collect()
    }
}
