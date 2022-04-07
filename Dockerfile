################################################################################
# Build Base Image
################################################################################

# Start from a rust base image
FROM rust:1.59 as base

# Set the current directory
WORKDIR /app

# Copy everthing that is not dockerignored to the image
COPY . .

# Prepare

RUN rustup toolchain install stable

################################################################################
# Build Frontend - Rust Part
################################################################################

# Start from base image
FROM base as frontend-rust-analyzer

# Prepare

RUN rustup toolchain install nightly-2021-11-04
RUN rustup component add rust-src --toolchain nightly-2021-11-04-x86_64-unknown-linux-gnu
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Build

RUN cd crates/rust_analyzer_wasm && wasm-pack build --target web --out-dir ../../packages/ink-editor/pkg

# Start from base image
FROM base as frontend-generated

# Build

RUN make generate-bindings
RUN make generate-change-json

################################################################################
# Build Frontend - TypeScript Part
################################################################################

# Start from base image
FROM base as frontend-builder

# Install Yarn & NPM dependencies

RUN apt-get --yes update
RUN apt-get --yes upgrade
RUN apt-get install --yes nodejs npm
RUN npm install --global yarn
RUN make install

COPY --from=frontend-generated /app/packages/_generated /app/packages/_generated
COPY --from=frontend-rust-analyzer /app/packages/ink-editor/pkg /app/packages/ink-editor/pkg

ARG COMPILE_URL=/compile
ARG GIST_LOAD_URL=/gist/load
ARG GIST_CREATE_URL=/gist/create

RUN make playground-build

################################################################################
# Build Backend
################################################################################

# Start from base image
FROM base as backend-builder

# Build

RUN rustup default stable
RUN make backend-build-prod

################################################################################
# Compose final image
################################################################################

FROM debian:bullseye-slim

COPY --from=frontend-builder /app/packages/playground/dist /app/packages/playground/dist
COPY --from=backend-builder /app/target/release/backend /app/target/release/backend

# Install Docker
# see: https://www.how2shout.com/linux/install-docker-ce-on-debian-11-bullseye-linux/

RUN apt-get update && apt-get install --yes \
    apt-transport-https ca-certificates curl gnupg lsb-release 

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | \
    gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

RUN echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | \
    tee /etc/apt/sources.list.d/docker.list >/dev/null

RUN apt-get --yes update

RUN apt-get --yes install docker-ce docker-ce-cli containerd.io

# Provide startup scripts

COPY sysbox/on-start.sh /usr/bin
RUN chmod +x /usr/bin/on-start.sh

# Entrypoint

ENTRYPOINT [ "on-start.sh" ]
