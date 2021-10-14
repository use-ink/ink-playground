import { Layout } from "./components/Layout";
import { Header } from "./components/Header";
import { Editor } from "./components/Editor";
import { Console } from "./components/Console";
import { AppProvider } from "./context";

const App = () => {
  return (
    <AppProvider>
      <Layout>
        <Header />
        <Editor />
        <Console />
      </Layout>
    </AppProvider>
  );
};

export default App;
