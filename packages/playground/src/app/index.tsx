import { Console } from './Console';
import { Editor } from './Editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppProvider } from '~/context/app/';
import { MessageProvider } from '../context/messages/';
import { ReactElement } from 'react';

const App = (): ReactElement => {
  return (
    <AppProvider>
      <MessageProvider>
        <Layout Header={Header} Editor={Editor} Console={Console} />
      </MessageProvider>
    </AppProvider>
  );
};

export default App;
