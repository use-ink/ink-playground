# Architecture of ink! Playground

## Table of Contents

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

- [Introduction](#introduction)
- [The build process:](#the-build-process)
- [Architecture of the individual packages:](#architecture-of-the-individual-packages)
  - [Playground](#playground)
  - [Components](#components)
  - [Ink Editor](#ink-editor)
  - [Backend](#backend)
  - [Rust Analyzer WASM](#rust-analyzer-wasm)
  - [Crate Extractor](#crate-extractor) - [Description](#description)
  <!-- AUTO-GENERATED-CONTENT:END -->

## Introduction

We provide here a detailed description of the architecture of ink! Playground and each of its components.

## The build process:

<figure>
<p align="center">
  <img src="assets/build_process.png" alt="Build Process">
  <figcaption><p align="center">The build process of the complete Rust Analyzer Repo</p></figcaption>
  </p>
</figure>

1. Build `crate_extractor` dependencies which generate the `change.json` file for Rust Analyzer which contains the ink! source-code and dependency graph.
2. Use `crate_extractor` binary to generate the `change.json` file.
3. Build the `rust_analyzer_wasm` binary which is used to execute Rust Analyzer in the Browser.
5. Use `generate_bindings` to generate the TypeScript types which are used by the Frontend to communicate with the Acrtix Web backend server.
6. Build the `playground` frontend.
7. Build the Actix Web based backend server which serves the Frontend package `playground` to clients.

## Architecture of the individual packages:

### Playground

- Project directory: `/packages/playground`

### Components

- Project directory: `/packages/components`

### Ink Editor

- Project directory: `/packages/ink-editor`

### Backend

- Project directory: `/crates/backend`

### Rust Analyzer WASM

- Project directory: `/crates/rust_analyzer_wasm`

### Crate Extractor

- Project directory: `/crates/crate_extractor`

#### Description

We want to analyze Rust projects with the Rust Analyzer IDE which we compile to WebAssembly.

This CLI tool allows to extract the data of a Rust Cargo project into a .json file which is then processed by `Rust` analyzer. We need this since the dependencies which are usually involved when loading data into Rust analyzers database are accessing the file system and calling rustc. Those dependencies are not available for WebAssembly, hence the corresponding crates won’t compile to WASM.

It uses the following two crates:

- `crate_extractor` creates the actual JSON file which contains the project data and writes it to the hard drive
- `change_json` handles the conversion from the RA specific data structures to serializable objects and vice-versa

When we use the Rust analyzer in e.g. Visual Studio code, the `IDE` crate provides most of its functionalities as auto completion and syntax highlighting. However, when RA processes the source code of a Rust project it collects most of the required data through the `project_model` crate by scanning the project structure on a hard drive. It gathers the required data from the hard disk of your computer and transfers it into the `Change` object. RA then sends this change object to the `Database` and contains the precise instructions on how to update the RA database with the required project data.

We visualize this process, in a strongly simplified way, in Fig.1 below:

<figure>
<p align="center">
  <img src="assets/architecture1.png" alt="Rust Analyzer">
  <figcaption><p align="center">Fig.1 The way how RA loads a  Rust project into its database</p></figcaption>
  </p>
</figure>

Here, all the crates which are colored in red won’t compile to WebAssembly. This is because of the access to the local file system but also since it involves various calls to rustc and also because of many other non-compatible dependencies.

However, all the tools which are provided by the IDE crate compile flawlessly as well as the RA Database to which also the Change object belongs, as same as all the other dependencies of these crates which are abstracted away in Fig. 1.

The crate_extractor crate is creating the `Change` object by utilizing the `project_model` crate similarly then the `Rust Analyzer` crate does it in Fig 1. But then, instead of sending it to the Rust Analyzer database, it uses the `change_json` crate to parse it to JSON. The `change_json` crate defines its own JSON structure which is (de-)serializable by [Serde JSON](https://github.com/serde-rs/json), as well as the required tools to convert the `Change` object to its corresponding JSON structure and vice-versa, see Fig. 2 below for a visualization of this interaction:

<figure>
<p align="center">
  <img src="assets/architecture2.png" alt="Cli Tool">
  <figcaption><p align="center">Fig.2 How this repo extracts Cargo Crate data into a JSON structure</p></figcaption>
  </p>
</figure>

While the `crate_extractor` crate is using various dependencies which won’t compile to WASM, we can’t use it in a WebAssembly version of Rust Analyzer. However, the `change_json` crate consumes just a bare minimum of basic dependencies like the RA Database and therefore compiles to WASM.

We visualize the way it is used to provide a Rust projects source code and dependency graph to a WASM implementation of Rust Analyzer in Fig. 3 below:

<figure>
<p align="center">
  <img src="assets/architecture3.png" alt="WASM Setup for RA">
  <figcaption><p align="center">Fig.3 The WASM version of RA can utilize `change_json` to receive the crate deps</p></figcaption>
  </p>
</figure>
