//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate playground;
extern crate wasm_bindgen_test;
use std::assert_eq;

use wasm_bindgen_test::*;
use playground::greet;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn pass() {
    assert_eq!(1 + 1, 2);
}

#[wasm_bindgen_test]
fn test_greet() {
    let message = greet("ink Playground");
    assert_eq!(message, "Hello ink Playground from WebAssembly!");
}
