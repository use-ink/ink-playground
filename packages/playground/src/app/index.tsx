import { Console } from './Console';
import { InkEditor, exampleCode } from '@paritytech/ink-editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppContext, AppProvider } from '~/context/app/';
import { MessageProvider } from '../context/messages/';
import { ReactElement, useContext, useState } from 'react';
import { Dispatch, State } from '~/context/app/reducer';

const App = (): ReactElement => {
  const [code, setCode] = useState(exampleCode);
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  return (
    <AppProvider>
      <MessageProvider>
        <Layout
          Header={Header}
          Editor={() => (
            <InkEditor
              code={code}
              onCodeChange={setCode}
              numbering={state.numbering}
              darkmode={state.darkmode}
              minimap={state.minimap}
              setURI={uri => dispatch({ type: 'SET_URI', payload: uri })}
            />
          )}
          Console={Console}
        />
      </MessageProvider>
    </AppProvider>
  );
};

export default App;
