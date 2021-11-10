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

The actual ink! playground is a fronted app which is developed using TypeScript and React. It is contained in the `packages/playground` folder.

The repo contains a Rust backend which is implemented with the [actix-web](https://github.com/actix/actix-web) framework and which can be found in the 'crates/backend' folder.

The backend serves the frontend app and it also provides the backend services for compilation and Github gists creation(which we use to provide the code sharing functionality).

To clone and build the whole project on your local machine, enter:

`git clone clone https://github.com/paritytech/ink-playground`

`cd ink-playground`

`make install`

`make build`

and finally, to start the backend:

`make backend-run`

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
