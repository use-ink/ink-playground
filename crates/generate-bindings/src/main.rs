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
#![allow(dead_code, clippy::disallowed_names)]
#![allow(unnameable_test_items)]

mod cli;

use crate::cli::Cli;
use backend::services::{
    contract::{
        CompilationRequest,
        CompilationResult,
        FormattingRequest,
        FormattingResult,
        TestingRequest,
        TestingResult,
    },
    gist::{
        common::Gist,
        create::{
            GistCreateRequest,
            GistCreateResponse,
        },
        load::{
            GistLoadRequest,
            GistLoadResponse,
        },
    },
};
use clap::Parser;
use serde::Serialize;
use ts_rs::TS;

fn main() -> std::io::Result<()> {
    let opts: Cli = Cli::parse();
    let target = opts.target;
    #[allow(unused_variables)]
    let target = format!("{:?}/index.d.ts", &target);

    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct CompilationRequestWrapper(CompilationRequest);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct CompilationResultWrapper(CompilationResult);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct TestingRequestWrapper(TestingRequest);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct TestingResultWrapper(TestingResult);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct FormattingResultWrapper(FormattingResult);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct FormattingRequestWrapper(FormattingRequest);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct GistWrapper(Gist);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct GistLoadResponseWrapper(GistLoadResponse);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct GistLoadRequestWrapper(GistLoadRequest);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct GistCreateResponseWrapper(GistCreateResponse);
    #[derive(Serialize, TS)]
    #[ts(export)]
    #[ts(export_to = "${target}")]
    struct GistCreateRequestWrapper(GistCreateRequest);

    Ok(())
}
