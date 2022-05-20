import { Console } from './Console';
import { InkEditor } from '@paritytech/ink-editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppContext, AppProvider } from '~/context/app/';
import { MessageContext, MessageProvider } from '~/context/messages/';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';
import { loadCode } from '~/context/side-effects/load-code';
import { monaco } from 'react-monaco-editor';

const App = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, messageDispatch]: [MessageState, MessageDispatch] = useContext(MessageContext);
  const [code, setCode] = useState<string>();
  let { monacoUri: uri } = state;

  useEffect(() => {
    if (!uri) return;
    loadCode(state, { app: dispatch, message: messageDispatch }).then(code => {
      const model = monaco.editor.getModel(uri as monaco.Uri);
      if (!model) return;
      model.setValue(code);
    });
  }, [uri]);

  const onRustAnalyzerStartLoad = () => {
    messageDispatch({
      type: 'LOG_SYSTEM',
      payload: { status: 'IN_PROGRESS', content: 'Loading Rust Analyzer...' },
    });
  };

  const onRustAnalyzerFinishLoad = () => {
    dispatch({
      type: 'SET_RUST_ANALYZER_STATE',
      payload: true,
    });
    messageDispatch({
      type: 'LOG_SYSTEM',
      payload: { status: 'DONE', content: 'Rust Analyzer Ready' },
    });
  };

  return (
    <Layout
      header={<Header />}
      editor={
        <InkEditor
          code={code}
          onCodeChange={setCode}
          onRustAnalyzerStartLoad={onRustAnalyzerStartLoad}
          onRustAnalyzerFinishLoad={onRustAnalyzerFinishLoad}
          numbering={state.numbering}
          darkmode={state.darkmode}
          rustAnalyzer={state.rustAnalyzer}
          minimap={state.minimap}
          setURI={uri => dispatch({ type: 'SET_URI', payload: uri })}
        />
      }
      console={<Console />}
    />
  );
};

const AppWithProvider = (): ReactElement => {
  return (
    <AppProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </AppProvider>
  );
};

export default AppWithProvider;
