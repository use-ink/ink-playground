import { useState } from "react";

const App = () => {
  const [message, setMessage] = useState<String>();
  import("../../pkg").then((wasm) => {
    let wasm_message = wasm.greet("ink Playground");
    setMessage(wasm_message);
  });
  return <h1>{message}</h1>;
};

export default App;
