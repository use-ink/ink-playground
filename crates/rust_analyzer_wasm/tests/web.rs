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

use rust_analyzer_wasm::WorldState;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[wasm_bindgen_test]
fn test_greet() {
  //  let message = greet("ink! Playground");
  //  assert_eq!(message, "Hello ink! Playground from WebAssembly!");
}
