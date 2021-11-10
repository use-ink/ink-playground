import { Console } from './Console';
import { Editor } from './Editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppProvider } from '~/context';
import { ReactElement } from 'react';
import { Splitter, SplitterPanel } from '@paritytech/components/';

const App = (): ReactElement => {
  return (
    <AppProvider>
      <Layout>
        <Header />
        <Splitter className="content" layout="vertical" gutterSize={6}>
          <SplitterPanel size={80} minSize={0}>
            <Editor />
          </SplitterPanel>
          <SplitterPanel size={20} minSize={0}>
            <Console />
          </SplitterPanel>
        </Splitter>
      </Layout>
    </AppProvider>
  );
};

export default App;
