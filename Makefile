# entrypoint: playground

install-playground:
	yarn workspace playground install

test-playground:
	yarn workspace playground run test

build-playground:
	yarn workspace playground run build

clean-playground:
	yarn workspace playground run clean

# entrypoint: crate-extractor

test-crate-extractor:
	cargo test -p crate-extractor

build-crate-extractor:
	cargo build -p crate-extractor


# entrypoint: backend

test-backend:
	cargo test -p backend

build-backend:
	cargo build -p backend


# GLOBAL

clean: clean-playground
	rm -rf node_modules; rm -rf target

install: install-playground

test: test-playground test-crate-extractor test-backend

build: build-playground build-crate-extractor build-backend

ci: install test build
