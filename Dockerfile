FROM rust:1.56

WORKDIR /app

COPY . .

RUN make backend-build-prod

ENTRYPOINT ["./target/release/backend", "--port", "4000", "--host", "0.0.0.0"]