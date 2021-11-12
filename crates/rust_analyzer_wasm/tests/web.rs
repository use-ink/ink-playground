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

//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate rust_analyzer_wasm;
extern crate wasm_bindgen_test;
use std::assert_eq;

use rust_analyzer_wasm::{
    init_thread_pool,
    WorldState,
};
use wasm_bindgen_test::*;

use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

use std::sync::Arc;
use cfg::CfgOptions;
use ide::{
    Change,
    CrateGraph,
    CrateId,
    Edition,
    FileId,
    SourceRoot,
};
use ide_db::base_db::{
    CrateName,
    Dependency,
    Env,
    FileSet,
    VfsPath,
};

wasm_bindgen_test_configure!(run_in_browser);

pub fn create_crate(crate_graph: &mut CrateGraph, f: FileId) -> CrateId {
    let mut cfg = CfgOptions::default();
    cfg.insert_atom("unix".into());
    cfg.insert_key_value("target_arch".into(), "x86_64".into());
    cfg.insert_key_value("target_pointer_width".into(), "64".into());
    crate_graph.add_crate_root(
        f,
        Edition::Edition2018,
        None,
        cfg,
        CfgOptions::default(),
        Env::default(),
        Default::default(),
    )
}

pub fn create_source_root(name: &str, f: FileId) -> SourceRoot {
  let mut file_set = FileSet::default();
  file_set.insert(f, VfsPath::new_virtual_path(format!("/{}/src/lib.rs", name)));
  SourceRoot::new_library(file_set)
}

pub fn from_single_file(
    text: String,
    fake_std: String,
    fake_core: String,
    fake_alloc: String,
) -> Change {
    let file_id = FileId(0);
    let std_id = FileId(1);
    let core_id = FileId(2);
    let alloc_id = FileId(3);

    let mut file_set = FileSet::default();
    file_set.insert(
        file_id,
        VfsPath::new_virtual_path("/my_crate/main.rs".to_string()),
    );
    let source_root = SourceRoot::new_local(file_set);

    let mut change = Change::new();
    change.set_roots(vec![
        source_root,
        create_source_root("std", std_id),
        create_source_root("core", core_id),
        create_source_root("alloc", alloc_id),
    ]);
    let mut crate_graph = CrateGraph::default();
    let my_crate = create_crate(&mut crate_graph, file_id);
    let std_crate = create_crate(&mut crate_graph, std_id);
    let core_crate = create_crate(&mut crate_graph, core_id);
    let alloc_crate = create_crate(&mut crate_graph, alloc_id);
    crate_graph
        .add_dep(
            std_crate,
            Dependency::new(CrateName::new("core").unwrap(), core_crate),
        )
        .unwrap();
    crate_graph
        .add_dep(
            std_crate,
            Dependency::new(CrateName::new("alloc").unwrap(), alloc_crate),
        )
        .unwrap();
    crate_graph
        .add_dep(
            alloc_crate,
            Dependency::new(CrateName::new("core").unwrap(), core_crate),
        )
        .unwrap();
    crate_graph
        .add_dep(
            my_crate,
            Dependency::new(CrateName::new("core").unwrap(), core_crate),
        )
        .unwrap();
    crate_graph
        .add_dep(
            my_crate,
            Dependency::new(CrateName::new("alloc").unwrap(), alloc_crate),
        )
        .unwrap();
    crate_graph
        .add_dep(
            my_crate,
            Dependency::new(CrateName::new("std").unwrap(), std_crate),
        )
        .unwrap();
    change.change_file(file_id, Some(Arc::new(text)));
    change.change_file(std_id, Some(Arc::new(fake_std)));
    change.change_file(core_id, Some(Arc::new(fake_core)));
    change.change_file(alloc_id, Some(Arc::new(fake_alloc)));
    change.set_crate_graph(crate_graph);
    change
}

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[wasm_bindgen_test]
async fn test_greet() {
    let promise = js_sys::Promise::resolve(&init_thread_pool(4));
    let _ = JsFuture::from(promise).await;
    let mut state = WorldState::new();
    state.load("hello".to_string());
}
