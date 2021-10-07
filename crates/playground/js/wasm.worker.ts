import * as Comlink from "comlink";

const initHandlers = async () => {
  const rust_wasm = await import("../pkg");
  await rust_wasm.default();
  const numThreads = navigator.hardwareConcurrency;
  // must be included to init rayon thread pool with web workers
  await rust_wasm.initThreadPool(numThreads);
  return Comlink.proxy({
    sim: null,
    numThreads: numThreads,
    greet: rust_wasm.greet,
  });
};

const api = {
  handlers: initHandlers(),
};

export type WorkerApi = typeof api;

Comlink.expose(api);
