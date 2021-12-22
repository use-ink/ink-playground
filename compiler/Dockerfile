ARG REGISTRY_PATH=docker.io/paritytech

FROM ${REGISTRY_PATH}/ink-ci-linux:production

# Instantiate new Contract
RUN cargo contract new contract

# Provide Cargo.toml with all ink! dependencies
COPY Cargo.toml /builds/contract/Cargo.toml

# Prebuild ink! dependencies
RUN cd contract && cargo contract build

WORKDIR /builds/contract
