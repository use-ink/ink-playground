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

#[cfg(test)]
pub mod tests {
    use serde::Serialize;
    use std::{
        fs::{
            create_dir_all,
            File,
        },
        io::{
            Error,
            ErrorKind,
            Result,
            Write,
        },
        path::{
            Path,
            PathBuf,
        },
    };

    #[derive(Serialize, Debug)]
    pub struct PackageJson {
        pub name: String,
        pub types: String,
        pub description: String,
    }

    /// Generate a `package.json` file in a given directory
    pub fn generate_package_json(
        package_json: &PackageJson,
        dir_path: &Path,
    ) -> Result<()> {
        if dir_path.is_file() {
            return Err(Error::new(ErrorKind::Other, "Not a directory."))
        };

        create_dir_all(dir_path)?;

        let package_json_path = dir_path.join(PathBuf::from("package.json"));
        let mut package_json_file = File::create(package_json_path)?;
        let content = serde_json::to_string(&package_json)?;

        writeln!(package_json_file, "{}", content)?;

        Ok(())
    }
}
