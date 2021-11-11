# Start from a rust base image
FROM rust:1.56

# Set the current directory
WORKDIR /app

# Copy everthing that is not dockerignored to the image
COPY . .

# Install
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y nodejs npm
RUN npm install --global yarn
RUN make install

# Prepare
RUN rustup toolchain install nightly-2021-07-29-x86_64
RUN rustup toolchain install stable
RUN rustup component add rust-src --toolchain nightly-2021-07-29-x86_64-unknown-linux-gnu

# Build
RUN rustup default stable
RUN make generate-bindings

RUN rustup default nightly
RUN make playground-build

RUN rustup default stable
RUN make backend-build-prod

# Run backend
ENTRYPOINT [ \
    "./target/release/backend", \
    "--port", "4000", \
    "--host", "0.0.0.0", \
    "--frontend_folder", "packages/playground/dist" \
    ]
