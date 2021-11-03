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

################################################################################
# ENTRYPOINT: playground
################################################################################

playground-build: generate-bindings
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

backend-run:
	cargo run -p backend -- --frontend_folder packages/playground/dist --port 4000

backend-run-dev:
	cargo run -p backend -- --dev_mode --port 4000

backend-test:
	cargo test -p backend

################################################################################
# ENTRYPOINT: crate-playground
################################################################################

crate-playground-test-chrome:
	wasm-pack test --headless --chrome crates/playground

crate-playground-test-firefox:
	wasm-pack test --headless --firefox crates/playground

crate-playground-test: crate-playground-test-chrome
crate-playground-test: crate-playground-test-firefox

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
	cargo clippy --workspace --exclude playground --all-targets --all-features \
	-- -D warnings

rust-test:
	cargo test --workspace --exclude playground 

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
clean: ts-clean

install: ts-install

lint: rust-lint
lint: ts-lint

patch-markdown: ts-patch-markdown

test: crate-playground-test
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
