import * as Comlink from 'comlink';

async function initHandlers(): Promise<any> {
  // If threads are unsupported in this browser, skip this handler.
  const rust_wasm = await import('../../../pkg');
  await rust_wasm.default();
  const numThreads = navigator.hardwareConcurrency;
  // must be included to init rayon thread pool with web workers
  await rust_wasm.initThreadPool(numThreads);
  const state = new rust_wasm.WorldState();
  return Comlink.proxy<typeof state>(state);
}

const api = {
  handlers: initHandlers(),
};

export type WorkerApi = typeof api;

Comlink.expose(api);
