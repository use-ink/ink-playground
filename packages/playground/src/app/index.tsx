import { Console } from './Console';
import { InkEditor, exampleCode } from '@paritytech/ink-editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppContext, AppProvider } from '~/context/app/';
import { MessageContext, MessageProvider } from '../context/messages/';
import { ReactElement, useContext, useState } from 'react';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';

const App = (): ReactElement => {
  const [code, setCode] = useState(exampleCode);
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [messageState, messageDispatch]: [MessageState, MessageDispatch] =
    useContext(MessageContext);

  return (
    <AppProvider>
      <MessageProvider>
        <Layout
          Header={Header}
          Editor={() => (
            <InkEditor
              code={code}
              onCodeChange={setCode}
              onRustAnalyzerStartLoad={() => {
                console.log(3);
                messageDispatch({
                  type: 'LOG_SYSTEM',
                  payload: { status: 'IN_PROGRESS', content: 'Loading Rust Analyzer...' },
                });
              }}
              onRustAnalyzerFinishLoad={() =>
                messageDispatch({
                  type: 'LOG_SYSTEM',
                  payload: { status: 'DONE', content: 'Rust Analyzer Ready' },
                })
              }
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
