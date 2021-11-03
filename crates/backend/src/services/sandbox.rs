use snafu::{OptionExt, ResultExt, Snafu};
use std::{
    ffi::OsStr,
    fs::{self, File},
    io::{self, prelude::*, BufReader, ErrorKind},
    fmt,
    os::unix::prelude::PermissionsExt,
    path::{Path, PathBuf},
    string,
    time::Duration,
};
use serde::{
    Deserialize,
    Serialize,
};
use tempdir::TempDir;
use tokio::{process::Command};
use ts_rs::TS;

pub struct Sandbox {
    #[allow(dead_code)]
    scratch: TempDir,
    input_file: PathBuf,
    output_dir: PathBuf,
}

fn vec_to_str(v: Vec<u8>) -> Result<String> {
    String::from_utf8(v).context(OutputNotUtf8)
}

#[derive(Debug, Snafu)]
pub enum Error {
    #[snafu(display("Unable to create temporary directory: {}", source))]
    UnableToCreateTempDir { source: io::Error },

    #[snafu(display("Unable to create output directory: {}", source))]
    UnableToCreateOutputDir { source: io::Error },

    #[snafu(display("Unable to set permissions for output directory: {}", source))]
    UnableToSetOutputPermissions { source: io::Error },

    #[snafu(display("Unable to create source file: {}", source))]
    UnableToCreateSourceFile { source: io::Error },

    #[snafu(display("Unable to set permissions for source file: {}", source))]
    UnableToSetSourcePermissions { source: io::Error },

    #[snafu(display("Output was not valid UTF-8: {}", source))]
    OutputNotUtf8 { source: string::FromUtf8Error },

    #[snafu(display("Unable to read output file: {}", source))]
    UnableToReadOutput { source: io::Error },

    #[snafu(display("Unable to start the compiler: {}", source))]
    UnableToStartCompiler { source: io::Error },

    #[snafu(display("Unable to find the compiler ID"))]
    MissingCompilerId,

    #[snafu(display("Unable to wait for the compiler: {}", source))]
    UnableToWaitForCompiler { source: io::Error },

    #[snafu(display("Unable to get output from the compiler: {}", source))]
    UnableToGetOutputFromCompiler { source: io::Error },

    #[snafu(display("Unable to remove the compiler: {}", source))]
    UnableToRemoveCompiler { source: io::Error },

    #[snafu(display("Compiler execution took longer than {} ms", timeout.as_millis()))]
    CompilerExecutionTimedOut {
        source: tokio::time::error::Elapsed,
        timeout: Duration,
    },
    
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
    pub code: String,
}

#[derive(Deserialize, Serialize, TS, PartialEq, Debug, Clone)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum CompilationResult {
    Success {
        wasm: Vec<u8>,
        stdout: String,
        stderr: String,
    },
    Error {
        stdout: String,
        stderr: String,
    },
}

const DOCKER_PROCESS_TIMEOUT_SOFT: Duration = Duration::from_secs(10);

const DOCKER_PROCESS_TIMEOUT_HARD: Duration = Duration::from_secs(12);

const DOCKER_CONTAINER_NAME: &str = "ink-backend";

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

    pub fn compile(&self, req: &CompileRequest) -> Result<CompilationResult> {
        self.write_source_code(&req.code)?;
        let command = self.build_compile_command();

        let output = run_command_with_timeout(command)?;

        // The compiler writes the file to a name like
        // `compilation-3b75174cac3d47fb.ll`, so we just find the
        // first with the right extension.
        let file = fs::read_dir(&self.output_dir)
            .context(UnableToReadOutput)?
            .flat_map(|entry| entry)
            .map(|entry| entry.path())
            .find(|path| path.extension() == Some(OsStr::new("contract")));

        let stdout = vec_to_str(output.stdout)?;
        let mut stderr = vec_to_str(output.stderr)?;

        let compile_response = match file {
            Some(file) => {
                match read(&file) {
                    Ok(Some(wasm)) => {
                        CompilationResult::Success {
                            wasm,
                            stderr,
                            stdout,
                        }
                    }
                    Error => CompilationResult::Error { stderr, stdout },
                }
            }
            None => {
                // If we didn't find the file, it's *most* likely that
                // the user's code was invalid. Tack on our own error
                // to the compiler's error instead of failing the
                // request.
                use self::fmt::Write;
                write!(
                    &mut stderr,
                    "\nUnable to locate file"
                )
                .expect("Unable to write to a string");

                CompilationResult::Error { stderr, stdout }
            }
        };

        Ok(compile_response)
    }

    fn write_source_code(&self, code: &str) -> Result<()> {
        fs::write(&self.input_file, code).context(UnableToCreateSourceFile)?;
        fs::set_permissions(&self.input_file, wide_open_permissions())
            .context(UnableToSetSourcePermissions)?;

        log::debug!(
            "Wrote {} bytes of source to {}",
            code.len(),
            self.input_file.display()
        );
        Ok(())
    }

    fn build_compile_command(&self) -> Command {
        let mut cmd = self.docker_command();

        let execution_cmd = build_execution_command();

        cmd.arg(&DOCKER_CONTAINER_NAME).args(&execution_cmd);

        log::debug!("Compilation command is {:?}", cmd);

        cmd
    }

    fn docker_command(&self) -> Command {
        let file_name = "lib.rs";

        let mut mount_input_file = self.input_file.as_os_str().to_os_string();
        mount_input_file.push(":");
        mount_input_file.push("/playground/");
        mount_input_file.push(file_name);

        let mut mount_output_dir = self.output_dir.as_os_str().to_os_string();
        mount_output_dir.push(":");
        mount_output_dir.push("/playground-result");

        let mut cmd = basic_secure_docker_command();

        cmd.arg("--volume")
            .arg(&mount_input_file)
            .arg("--volume")
            .arg(&mount_output_dir);

        cmd
    }
}

macro_rules! docker_command {
    ($($arg:expr),* $(,)?) => ({
        let mut cmd = Command::new("docker");
        $( cmd.arg($arg); )*
        cmd
    });
}

fn basic_secure_docker_command() -> Command {
    let mut cmd = docker_command!(
        "run",
        "--detach",
        "--cap-drop=ALL",
        // Needed to allow overwriting the file
        "--cap-add=DAC_OVERRIDE",
        "--security-opt=no-new-privileges",
        "--workdir",
        "/playground",
        "--net",
        "none",
        "--memory",
        "512m",
        "--memory-swap",
        "640m",
        "--env",
        format!(
            "PLAYGROUND_TIMEOUT={}",
            DOCKER_PROCESS_TIMEOUT_SOFT.as_secs()
        ),
    );

    if cfg!(feature = "fork-bomb-prevention") {
        cmd.args(&["--pids-limit", "512"]);
    }

    cmd.kill_on_drop(true);

    cmd
}

fn build_execution_command() -> Vec<&'static str> {
    let cmd = vec![
        "/bin/bash",
        "-c",
        "cargo contract build && mv /target/ink/*.contract /output/",
    ];

    cmd
}

fn read(path: &Path) -> Result<Option<Vec<u8>>> {
    let f = match File::open(path) {
        Ok(f) => f,
        Err(ref e) if e.kind() == ErrorKind::NotFound => return Ok(None),
        e => e.context(UnableToReadOutput)?,
    };
    let mut f = BufReader::new(f);
    let metadata = fs::metadata(path).expect("unable to read metadata");
    // f.read_to_string(&mut s).context(UnableToReadOutput)?;
    let mut buffer = vec![0; metadata.len() as usize];
    f.read(&mut buffer).expect("buffer overflow");
    Ok(Some(buffer))
}

#[tokio::main]
async fn run_command_with_timeout(mut command: Command) -> Result<std::process::Output> {
    use std::os::unix::process::ExitStatusExt;

    let timeout = DOCKER_PROCESS_TIMEOUT_HARD;
    println!("now compiling!");
    let output = command.output().await.context(UnableToStartCompiler)?;
    println!("Done! {:?}", output);
    // Exit early, in case we don't have the container
    // if !output.status.success() {
    // return Ok(output);
    // }
    // let response = &output.stdout;
    let stdout = String::from_utf8_lossy(&output.stdout);

    let id = stdout.lines().next().context(MissingCompilerId)?.trim();
    let stderr = &output.stderr;

    // ----------

    let mut command = docker_command!("wait", id);

    let timed_out = match tokio::time::timeout(timeout, command.output()).await {
        Ok(Ok(o)) => {
            // Didn't time out, didn't fail to run
            let o = String::from_utf8_lossy(&o.stdout);
            let code = o
                .lines()
                .next()
                .unwrap_or("")
                .trim()
                .parse()
                .unwrap_or(i32::MAX);
            Ok(ExitStatusExt::from_raw(code))
        }
        Ok(e) => return e.context(UnableToWaitForCompiler), // Failed to run
        Err(e) => Err(e),                                   // Timed out
    };

    // ----------

    let mut command = docker_command!("logs", id);
    let mut output = command
        .output()
        .await
        .context(UnableToGetOutputFromCompiler)?;

    // ----------

    let mut command = docker_command!(
        "rm", // Kills container if still running
        "--force", id
    );
    command.stdout(std::process::Stdio::null());
    command.status().await.context(UnableToRemoveCompiler)?;

    let code = timed_out.context(CompilerExecutionTimedOut { timeout })?;

    output.status = code;
    output.stderr = stderr.to_owned();

    Ok(output)
}
