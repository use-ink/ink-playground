import * as Comlink from 'comlink';
import { WorldState } from '../../../ink-editor/pkg';

async function initHandlers(): Promise<WorldState & Comlink.ProxyMarked> {
  // If threads are unsupported in this browser, skip this handler.
  const rust_wasm = await import('../../../ink-editor/pkg/rust_analyzer_wasm');
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
