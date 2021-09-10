use std::sync::Arc;

use ide_db::base_db::{Env, ProcMacro, ProcMacroExpander, ProcMacroExpansionError, ProcMacroKind, SourceRoot, VfsPath};
use proc_macro_api::{MacroDylib, ProcMacroServer};
use project_model::ProjectWorkspace;
use vfs::{file_set::FileSetConfig, AbsPath, AbsPathBuf};

#[derive(Default)]
pub(crate) struct ProjectFolders {
    pub(crate) load: Vec<vfs::loader::Entry>,
    pub(crate) watch: Vec<usize>,
    pub(crate) source_root_config: SourceRootConfig,
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

            if root.is_member {
                res.watch.push(res.load.len());
            }
            res.load.push(entry);

            if root.is_member {
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
pub(crate) struct SourceRootConfig {
    pub(crate) fsc: FileSetConfig,
    pub(crate) local_filesets: Vec<usize>,
}

impl SourceRootConfig {
    pub(crate) fn partition(&self, vfs: &vfs::Vfs) -> Vec<SourceRoot> {
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

pub(crate) fn load_proc_macro(client: Option<&ProcMacroServer>, path: &AbsPath) -> Vec<ProcMacro> {
    let dylib = match MacroDylib::new(path.to_path_buf()) {
        Ok(it) => it,
        Err(err) => {
            // FIXME: that's not really right -- we store this error in a
            // persistent status.
            tracing::warn!("failed to load proc macro: {}", err);
            return Vec::new();
        }
    };
    return client
        .map(|it| it.load_dylib(dylib))
        .into_iter()
        .flat_map(|it| match it {
            Ok(Ok(macros)) => macros,
            Err(err) => {
                tracing::error!("proc macro server crashed: {}", err);
                Vec::new()
            }
            Ok(Err(err)) => {
                // FIXME: that's not really right -- we store this error in a
                // persistent status.
                tracing::warn!("failed to load proc macro: {}", err);
                Vec::new()
            }
        })
        .map(expander_to_proc_macro)
        .collect();

    fn expander_to_proc_macro(expander: proc_macro_api::ProcMacro) -> ProcMacro {
        let name = expander.name().into();
        let kind = match expander.kind() {
            proc_macro_api::ProcMacroKind::CustomDerive => ProcMacroKind::CustomDerive,
            proc_macro_api::ProcMacroKind::FuncLike => ProcMacroKind::FuncLike,
            proc_macro_api::ProcMacroKind::Attr => ProcMacroKind::Attr,
        };
        let expander = Arc::new(Expander(expander));
        ProcMacro {
            name,
            kind,
            expander,
        }
    }

    #[derive(Debug)]
    struct Expander(proc_macro_api::ProcMacro);

    impl ProcMacroExpander for Expander {
        fn expand(
            &self,
            subtree: &tt::Subtree,
            attrs: Option<&tt::Subtree>,
            env: &Env,
        ) -> Result<tt::Subtree, ProcMacroExpansionError> {
            let env = env.iter().map(|(k, v)| (k.to_string(), v.to_string())).collect();
            match self.0.expand(subtree, attrs, env) {
                Ok(Ok(subtree)) => Ok(subtree),
                Ok(Err(err)) => Err(ProcMacroExpansionError::Panic(err.0)),
                Err(err) => Err(ProcMacroExpansionError::System(err.to_string())),
            }
        }
    }
}

