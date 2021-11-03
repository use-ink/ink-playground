use std::{fs, io, os::unix::prelude::PermissionsExt, path::PathBuf};
use tempdir::TempDir;
use snafu::{Snafu, ResultExt};

pub struct Sandbox {
    #[allow(dead_code)]
    scratch: TempDir,
    input_file: PathBuf,
    output_dir: PathBuf,
}

#[derive(Debug, Snafu)]
pub enum Error {
    #[snafu(display("Unable to create temporary directory: {}", source))]
    UnableToCreateTempDir { source: io::Error },

    #[snafu(display("Unable to create output directory: {}", source))]
    UnableToCreateOutputDir { source: io::Error },

    #[snafu(display("Unable to set permissions for output directory: {}", source))]
    UnableToSetOutputPermissions { source: io::Error },
}

pub type Result<T, E = Error> = std::result::Result<T, E>;

// We must create a world-writable files (rustfmt) and directories
// (LLVM IR) so that the process inside the Docker container can write
// into it.
//
// This problem does *not* occur when using the indirection of
// docker-machine.
fn wide_open_permissions() -> std::fs::Permissions {
    PermissionsExt::from_mode(0o777)
}

#[derive(Debug, Clone)]
pub struct CompileRequest {
}

#[derive(Debug, Clone)]
pub struct CompileResponse {
}

impl Sandbox {
    pub fn new() -> Result<Self> {
        let scratch = TempDir::new("playground").context(UnableToCreateTempDir)?;
        let input_file = scratch.path().join("input.rs");
        let output_dir = scratch.path().join("output");
        fs::create_dir(&output_dir).context(UnableToCreateOutputDir)?;
        fs::set_permissions(&output_dir, wide_open_permissions())
            .context(UnableToSetOutputPermissions)?;

        Ok(Sandbox {
            scratch,
            input_file,
            output_dir,
        })
    }

    pub fn compile(&self, _req: &CompileRequest) -> Result<CompileResponse> {
        Ok(CompileResponse {})
    }
}

