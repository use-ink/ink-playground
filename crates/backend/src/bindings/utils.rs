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

use serde::Serialize;
use std::{
    fs::{
        create_dir_all,
        read_dir,
        remove_dir_all,
        File,
    },
    io::{
        Error,
        ErrorKind,
        Result,
        Write,
    },
    path::PathBuf,
};

// -------------------------------------------------------------------------------------------------
// TYPES
// -------------------------------------------------------------------------------------------------

#[derive(Serialize, Debug)]
pub struct PackageJson {
    pub name: String,
    pub types: String,
    pub description: String,
}

// -------------------------------------------------------------------------------------------------
// FUNCTIONS
// -------------------------------------------------------------------------------------------------

/// Generate an `index.d.ts` file in a given directory
/// The index file contains re-exports of all direct sub modules.
/// Submodules of the form "folder/index.ts" are not respected.
///
/// E.g. if a directory has the following contents:
/// ```
/// Foo.ts
/// Bar.ts
/// Baz/index.ts
/// Boo.txt
/// ```
///
/// The contents of the `index.ts` file will be:
/// ```
/// export * from 'Foo';
/// export * from 'Bar';
/// ```
pub fn generate_ts_re_export_index(dir_path: &PathBuf) -> Result<()> {
    if dir_path.is_file() {
        return Err(Error::new(ErrorKind::Other, "Not a directory."))
    };

    create_dir_all(dir_path)?;

    let index_path = dir_path.join(PathBuf::from("index.d.ts"));
    let mut index_file = File::create(index_path)?;

    for entry in read_dir(dir_path)? {
        let path = entry?.path();
        if path.is_file() {
            let module_name = path.with_extension("").with_extension(""); // double because of `.d.ts`;
            let module_name = module_name.file_name().unwrap().to_str().unwrap();
            if module_name != "index" {
                writeln!(index_file, "export * from './{}';", module_name)?;
            }
        }
    }

    Ok(())
}

/// Generate a `package.json` file in a given directory
pub fn generate_package_json_file(
    package_json: &PackageJson,
    dir_path: &PathBuf,
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

/// Removes a directory if it exists
pub fn clean_dir(dir_path: &PathBuf) -> Result<()> {
    if dir_path.exists() {
        remove_dir_all(dir_path)?;
    }

    Ok(())
}
