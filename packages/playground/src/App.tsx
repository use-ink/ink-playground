import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Console } from './components/Console';

const App = () => {
  return (
    <Layout>
      <Header />
      <Editor />
      <Console />
    </Layout>
  );
};

export default App;
