import { Layout } from './Layout';
import { Header } from './Header';
import { Editor } from './Editor';
import { Console } from './Console';
import { AppProvider } from '~/context';
import { ReactElement } from 'react';

const App = (): ReactElement => {
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
