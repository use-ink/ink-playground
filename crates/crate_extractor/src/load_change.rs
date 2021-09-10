use std::{path::Path, sync::Arc};

use anyhow::Result;
use crossbeam_channel::{unbounded, Receiver};
use ide::Change;
use ide_db::base_db::CrateGraph;
use project_model::{CargoConfig, ProjectManifest, ProjectWorkspace, WorkspaceBuildScripts};
use vfs::{loader::Handle, AbsPath, AbsPathBuf};

use crate::reload::{ProjectFolders, SourceRootConfig};

pub struct LoadCargoConfig {
    pub load_out_dirs_from_check: bool,
    pub with_proc_macro: bool,
    pub prefill_caches: bool,
}

pub fn load_change_at(
    root: &Path,
    cargo_config: &CargoConfig,
    load_config: &LoadCargoConfig,
    progress: &dyn Fn(String),
) -> Result<Change> {
    let root = AbsPathBuf::assert(std::env::current_dir()?.join(root));
    let root = ProjectManifest::discover_single(&root)?;
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
        let loader =
            vfs_notify::NotifyHandle::spawn(Box::new(move |msg| sender.send(msg).unwrap()));
        Box::new(loader)
    };

    ws.set_build_scripts(if load_config.load_out_dirs_from_check {
        ws.run_build_scripts(cargo_config, progress)?
    } else {
        WorkspaceBuildScripts::default()
    });

    let crate_graph = ws.to_crate_graph(&mut |_: &AbsPath| Vec::new(), &mut |path: &AbsPath| {
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
                    break;
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
