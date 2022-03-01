ARG REGISTRY_PATH=docker.io/paritytech

FROM ${REGISTRY_PATH}/ink-ci-linux:production

ENV CARGO_TARGET_DIR="/target"

RUN cargo install dylint-link

RUN cargo install --git https://github.com/paritytech/cargo-contract

# Instantiate new Contract
RUN cargo contract new contract

# Provide Cargo.toml with all ink! dependencies
COPY Cargo.toml /builds/contract/Cargo.toml

# Prebuild ink! dependencies
RUN cd contract && cargo contract build

WORKDIR /builds/contract
