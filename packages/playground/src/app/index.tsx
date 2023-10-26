import { Console } from './Console';
import { InkEditor } from '@paritytech/ink-editor';
import { Layout } from './Layout';
import { Header } from './Header';
import { AppContext, AppProvider } from '~/context/app/';
import { MessageContext, MessageProvider } from '~/context/messages/';
import { ReactElement, useContext, useEffect } from 'react';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';
import { loadCode } from '~/context/side-effects/load-code';
import { loadVersionList } from '~/context/side-effects/version';
import { monaco } from 'react-monaco-editor';
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter,
  useParams,
} from "react-router-dom";

const App = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, messageDispatch]: [MessageState, MessageDispatch] = useContext(MessageContext);
  const navigate = useNavigate();
  const { versionId } = useParams();
  const { monacoUri: uri, formatting } = state;

  useEffect(() => {
    if (!uri) return;
    loadCode(state, { app: dispatch, message: messageDispatch }).then(code => {
      const model = monaco.editor.getModel(uri as monaco.Uri);
      if (!model) return;
      model.setValue(code);
    });
    loadVersionList(state, { app: dispatch }).then()
  }, [uri]);

  useEffect(() => {
    if (!(formatting.type === 'RESULT')) return;
    if (!(formatting.payload.type === 'OK')) return;
    if (!(formatting.payload.payload.type === 'SUCCESS')) return;
    if (!uri) return;
    const model = monaco.editor.getModel(uri as monaco.Uri);
    if (!model) return;
    const code = formatting.payload.payload.payload.source;
    model.setValue(code);
  }, [formatting]);

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
    <>
      <h1>{versionId}</h1>
      <Layout
        header={<Header />}
        editor={
          <InkEditor
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
    </>
  );
};

const AppWithProvider = (): ReactElement => {
  return (
    <BrowserRouter>
      <AppProvider>
        <MessageProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:versionId" element={<App />} />
          </Routes>
        </MessageProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default AppWithProvider;
