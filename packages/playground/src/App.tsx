import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Editor } from './components/Editor';
import { Console } from './components/Console';
import { AppContext } from './context';
import { defaultState } from './redux/reducer';

const App = () => {
  return (
    <AppContext.Provider value={defaultState}>
      <Layout>
        <Header />
        <Editor />
        <Console />
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
