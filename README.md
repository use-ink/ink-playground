# ink! Playground

An ink! Playground which provides a Browser based IDE for editing Smart Contracts written in [ink!](https://github.com/paritytech/ink).

(Planned) Features:

- Uses the [Monaco editor](https://microsoft.github.io/monaco-editor/)
- Implements a WebAssembly version of [Rust Analyzer](https://rust-analyzer.github.io/) for code editing
- Allows saving and sharing of Smart Contract code
- Implements a one click compile functionality of ink! Smart Contracts to WASM which is provided by a backend service

## Table of Contents

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

- [Getting started](#getting-started)
- [Implemented features:](#implemented-features)
  - [crate-extractor](#crate-extractor) - [Usage:](#usage) - [Description](#description)
  <!-- AUTO-GENERATED-CONTENT:END -->

## Getting started

The ink! playground is a fronted app which is developed using TypeScript and React. It is contained in the `packages/playground` folder.

The repo contains a Rust backend which is implemented with the [actix-web](https://github.com/actix/actix-web) framework and which can be found in the 'crates/backend' folder.

The backend serves the frontend app and it also provides the backend services for compilation and Github gists creation(which we use to provide the code sharing functionality).

To clone and build the whole project on your local machine, enter:

`git clone clone https://github.com/paritytech/ink-playground`

`cd ink-playground`

`make install`

`make generate`

`make build`

and finally, to start the backend:

`make backend-run`

The last command starts the Rust webserver locally on you computer. You can then access `localhost:4000` from your Browser to open the locally compiled ink! Playground open.

## Overview of the (sub-)repos

We can divide this Repo into two main contributions:

- The folder `crates` is a monorepo containing the Rust source code, its separate crates serve functionalities like the web server which serves the frontend app, the backend services for Smart Contract compilation and Github Gist generation (code sharing) or the rust analyzer functionalities for the IDE.
- The folder `packages` is a TypeScript/React monorepo, containing the Frontend App which is served by the Rust backend.

### The components of `crates`

#### The crate `backend`

This is the main crate of the web server which serves the frontend app. It is based on the [Actix Web](https://actix.rs/) framework. It serves the directory of the compiled playground app which is located in the `/packages/playground/dist` folder after executing `make build` (which involves the compilation of the produciton bundle of the Frontend app).

#### The crate `change_json`

The IDE of the frontend app contains a WebAssembly version of [Rust Analyzer](https://rust-analyzer.github.io/). We need to provide Rust Analyzer the source code and crate graph of the analyzed smart contract. Usually, Rust Analyzer will scan the file system, load the dependeny data of a rust project into an object, the `change` object and will send this object to its db. Since we can not access the file system in browser based wasm, we had to find another approach. For this we (de-)serialize the `change` object which is encoding the data. This crate contains the methods/traits to (de-)serialize the `change` object.

#### The crate `contract`

This is the sample crate which serves as a blueprint for creating the serialized `change` object.

#### The crate `crate_extractor`

#### The crate `generate_bindings`

Utilizes []

#### The crate `rust_analyzer_wasm`

A LSP ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/)) of [Rust Analyzer](https://rust-analyzer.github.io/) for the [monaco](https://microsoft.github.io/monaco-editor/) editor which is compiled to WebAssembly and which we execute in the Browser. This crate gets compiled to the `/packages/playground/pkg` subfolder of the `playground` package. Its compiled version provides the executable WebAssembly code and the corresponding TypeScript types.

#### The crate `sandbox`

Provides the sandbox environment which triggers the compilation of ink! Smart Contracts which is executed by the backend server from the `backend` crate.

### The components of `packages`

#### The package `playground`

#### The package `components`

#### The package `_generated`

#### The package `docker_tests`

## Implemented features:

### crate-extractor

Parses Crates and CrateGraph (the package dependency graph) of a Rust Project into a JSON file for Rust Analyzer(=RA) and provides a library for (de-)serialization of these data structures which can be referenced by a WASM implementation of RA.

#### Usage:

Enter:

`gh clone https://github.com/paritytech/ink-playground`

`cd ink-playground`

`cargo run -p crate-extractor -- create -i <input> -o <output>`

Where `<input>` points to the `Cargo.toml` of the project you which to analyze and `<output>` denotes the path to the resulting '.json' file. Both are optional parameters and default to `/Cargo.toml` and `./change.json`.

For a detailed description, refer to the corresponding section of [ARCHITECTURE.md](ARCHITECTURE.md)
