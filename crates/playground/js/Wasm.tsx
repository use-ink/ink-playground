import { useEffect, useState } from "react";
import * as Comlink from "comlink";
import { Api } from "./wasm.worker";

let start = async (setter: (message: string) => void) => {
  const handlers = await Comlink.wrap<Api>(
    new Worker(new URL("./wasm.worker.ts", import.meta.url), {
      type: "module",
    })
  ).handlers;
  let test = await handlers.greet("ink! Playground");
  setter(test);
};

const Wasm = () => {
  const [message, setMessage] = useState<string>("Check");
  useEffect(() => {
    start(setMessage);
  });

  return <h1>{message}</h1>;
};

export default Wasm;
