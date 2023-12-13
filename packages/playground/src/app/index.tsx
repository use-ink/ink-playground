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
import { loadVersionList, setVersion } from '~/context/side-effects/version';
import { monaco } from 'react-monaco-editor';
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter,
  useParams,
  useSearchParams,
} from "react-router-dom";

const App = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, messageDispatch]: [MessageState, MessageDispatch] = useContext(MessageContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { versionParam } = useParams();
  const navigate = useNavigate();

  const { monacoUri: uri, formatting } = state;

  const navigateVersion = (version: string) => {
    navigate(`/v${version}`);
  };

  useEffect(() => {
    if (state.version && versionParam != `v${state.version}`) {
      navigateVersion(state.version);
    }
  }, [state.version])

  useEffect(() => {
    if (versionParam?.startsWith('v') && state.versionList.includes(versionParam?.replace('v', ''))) {
      setVersion(versionParam?.replace('v', ''), state, { app: dispatch })
    } else if (state.versionList.length > 0 && state.versionList[0]) {
      setVersion(state.versionList[0], state, { app: dispatch });
      navigateVersion(state.versionList[0]);
    }
  }, [state.versionList])

  useEffect(() => {
    const searchParamCode = searchParams.get('code');
    if (!uri) return;
    loadCode(state, { app: dispatch, message: messageDispatch }).then(code => {
      const model = monaco.editor.getModel(uri as monaco.Uri);
      if (!model) return;
      model.setValue(searchParamCode ?? code);
      if (searchParamCode) setSearchParams((oldSearchParams) => {
        oldSearchParams.delete('code')
        return oldSearchParams;
      });
    });
    loadVersionList(state, { app: dispatch }).then(() => {
      const version = versionParam ? versionParam?.replace('v', '') : '';
      setVersion(version, state, { app: dispatch });
    })
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
      <h1>{versionParam}</h1>
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
            <Route path="/:versionParam/" element={<App />} />
          </Routes>
        </MessageProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default AppWithProvider;
