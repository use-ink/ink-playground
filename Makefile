################################################################################
# This file contains all major commands that can be run on the monorepo.
#
# You'll find commands that run
#   - spcifically on entrypoints like CLIs, webapps or servers.
#   - ecosystem specific (e.g. Rust or TypeScript)
#
# You can run them like `make backend-test` or `make rust-clean`
# 
# Those commands are composed in the global commands. E.g to run all tests
# composed from the above categories, run:
# `make test`
#
# Finally a composition of all checking commands is provided:
# `make ci`
# This is useful to get an early local feedback how real CI will run.
################################################################################

################################################################################
# GENERATE
################################################################################

generate-bindings:
	cargo run -p generate-bindings -- --target ../../packages/_generated/commontypes/src

generate-change-json:
	cargo run --package crate-extractor -- create \
	  -m crates/contract/Cargo.toml \
	  -o packages/_generated/change/src/change.json

generate: generate-bindings
generate: generate-change-json

################################################################################
# ENTRYPOINT: playground
################################################################################

playground-build:
	COMPILE_URL=/compile yarn workspace playground run build

playground-start: generate-bindings
playground-start:
	COMPILE_URL=http://localhost:4000/compile yarn workspace playground run start

playground-clean:
	yarn workspace playground run clean

playground-test:
	yarn workspace playground run test

playground-test-watch:
	yarn workspace playground run test:watch

playground-bundlesize:
	yarn workspace playground run bundlesize

################################################################################
# ENTRYPOINT: components
################################################################################

components-clean:
	yarn workspace @paritytech/components run clean

components-test:
	yarn workspace @paritytech/components run test

components-test-watch:
	yarn workspace @paritytech/components run test:watch

################################################################################
# ENTRYPOINT: crate-extractor
################################################################################

crate-extractor-build:
	cargo build -p crate-extractor

crate-extractor-test:
	cargo test -p crate-extractor

################################################################################
# ENTRYPOINT: backend
################################################################################

backend-build:
	cargo build -p backend

backend-build-prod:
	cargo build -p backend --bin backend --release

backend-run:
	cargo run -p backend -- --frontend_folder packages/playground/dist --port 4000

backend-run-dev:
	cargo run -p backend -- --dev_mode --port 4000

backend-test:
	cargo test -p backend

################################################################################
# ENTRYPOINT: crate-rust-analyzer-wasm
################################################################################

crate-rust-analyzer-wasm-test-chrome:
	wasm-pack test --headless --chrome crates/rust_analyzer_wasm

crate-rust-analyzer-wasm-test-firefox:
	wasm-pack test --headless --firefox crates/rust_analyzer_wasm

crate-rust-analyzer-wasm-test: crate-rust-analyzer-wasm-test-chrome
crate-rust-analyzer-wasm-test: crate-rust-analyzer-wasm-test-firefox

################################################################################
# ECOSYSTEM: RUST
################################################################################

rust-check-format:
	cargo fmt --all -- --check

rust-format:
	cargo fmt --all -- --emit files

rust-clean:
	rm -rf target

rust-lint:
	cargo clippy --workspace --exclude rust_analyzer_wasm --all-targets --all-features \
	-- -D warnings

rust-test:
	cargo test --workspace --exclude rust_analyzer_wasm 

################################################################################
# ECOSYSTEM: TYPESCRIPT
################################################################################

ts-check-format:
	yarn run prettier --check .

ts-check-spelling:
	yarn cspell '**/*.*'

ts-clean:
	rm -rf node_modules

ts-format:
	yarn run prettier --write .

ts-install:
	yarn install

ts-lint:
	yarn run eslint . --ext .ts --ext .tsx --max-warnings 0

ts-patch-markdown:
	yarn markdown

ts-check-all: ts-check-spelling
ts-check-all: ts-check-format
ts-check-all: ts-lint
ts-check-all: playground-test
ts-check-all: components-test

################################################################################
# DOCKER
################################################################################

docker-build:
	docker build --tag ink-playground .

docker-run:
	docker run \
	  --volume /var/run/docker.sock:/var/run/docker.sock \
	  --publish $(PORT):4000 \
	  ink-playground

docker-run-detach:
	docker run --detach --publish 80:4000 ink-playground

docker-test:
	yarn workspace docker-tests run test

################################################################################
# GLOBAL
################################################################################

build: playground-build
build: crate-extractor-build
build: backend-build

check-format: rust-check-format
check-format: ts-check-format

check-spelling: ts-check-spelling

clean: rust-clean
clean: components-clean
clean: ts-clean


install: ts-install

lint: rust-lint
lint: ts-lint

patch-markdown: ts-patch-markdown

test: crate-rust-analyzer-wasm-test
test: rust-test
test: playground-test
test: crate-extractor-test
test: backend-test

################################################################################
# CI
################################################################################

ci: clean
ci: install
ci: check-spelling
ci: check-format
ci: lint
ci: test
ci: build
