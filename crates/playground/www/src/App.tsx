const App = () => {
  import("../../pkg").then((wasm) => wasm.greet());
  return <h1>Basic TypeScript App</h1>;
};

export default App;
