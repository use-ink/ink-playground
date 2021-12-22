# ink! Compiler Dockerfile

This Docker image is based on: https://github.com/paritytech/scripts/blob/master/dockerfiles/ink-ci-linux/Dockerfile

It is modified in a way such that it provides a prebuild ink! Smart Contract in order to minimize build time for standard ink contracts without extra dependencies.

## Usage

While being within the `Dockerfile` directory, build it with:

`sudo docker build -t ink-backend .`

Then, to compile a ink! Smart Contract file `lib.rs`, enter:

`docker run --volume $local_path_to_source$:/builds/contract/lib.rs --volume $local_path_to_result$:/output ink-backend /bin/bash -c "cargo contract build && mv /target/ink/*.contract /output/"`

where you should replace `$local_path_to_source$` to the path on your local machine pointing to `lib.rs` and `$local_path_to_result$` by your desired output path for the resulting `.contract` file.
