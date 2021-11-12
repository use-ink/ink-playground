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

use rust_analyzer_wasm::{WorldState, init_thread_pool};
use wasm_bindgen_test::*;

use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;

use ide::{CrateGraph, CrateId,  Edition, FileId};
use ide_db::{base_db::{Env}};
use cfg::CfgOptions;

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
