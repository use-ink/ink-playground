import { useEffect, useState } from 'react';
import * as Comlink from 'comlink';
import { WorkerApi } from './wasm.worker';

const start = async (setter: (message: string) => void) => {
  const handlers = await Comlink.wrap<WorkerApi>(
    new Worker(new URL('./wasm.worker.ts', import.meta.url), {
      type: 'module',
    })
  ).handlers;
  const test = 'Nothing to do ehere right now';
  setter(test);
};

export const Wasm = () => {
  const [message, setMessage] = useState<string>('Check');
  useEffect(() => {
    start(setMessage);
  });

  return <h1>{message}</h1>;
};
