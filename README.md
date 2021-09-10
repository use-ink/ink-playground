# ink! Playground

An ink! Playground which provides a Browser based IDE for editing Smart Contracts written in [ink](https://github.com/paritytech/ink).

(Planned) Features:

- Uses the [Monaco editor](https://microsoft.github.io/monaco-editor/)
- Implements a WebAssembly version of [Rust Analyzer](https://rust-analyzer.github.io/) for code editing
- Allows saving and sharing of Smart Contract code
- Implements a one click compile functionality of ink! Smart Contracts to WASM which is provided by a backend service

## Implemented features:

### crate-extractor

Parses Crates and CrateGraph (the package dependency graph) of a Rust Project into a JSON file for Rust Analyzer(=RA) and provides a library for (de-)serialization of these data structures which can be referenced by a WASM implementation of RA.

#### Usage:

Enter:

`gh clone https://github.com/paritytech/ink-playground`

`cd ink-playground`

`cargo run -p crate-extractor -- create -i <input> -o <output>`

Where `<input>` points to the `Cargo.toml` of the project you wich to analyze and `<output>` denotes the path to the resulting '.json' file. Both are optional parameters and default to `/Cargo.toml` and `./change.json`.

For detailed information, check the corresponding [README](crates/crate_extractor/README.md)
