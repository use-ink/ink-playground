import { useEffect, useState } from "react";
import * as wasm from "../../pkg";

const App = () => {
  const [message, setMessage] = useState<String>("Check");
  useEffect(() => {
    let wasm_message = wasm.greet("ink Playground");
    setMessage(wasm_message);
  });

  return (
    <>
      <h1>Basic TypeScript App</h1>
      <h1>{message}</h1>
    </>
  );
};

export default App;
