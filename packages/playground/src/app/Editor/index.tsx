import { useState, useContext, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';
import { loadCode } from '~/context/side-effects/load-code';

export const Editor = (): ReactElement => {
  const [code, setCode] = useState<string>('');
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, dispatchMessage]: [MessageState, MessageDispatch] = useContext(MessageContext);

  const handleChange = (newValue: string): void => {
    setCode(newValue);
  };

  const editorDidMount = async (editor: MonacoEditor['editor']): Promise<void> => {
    if (editor) {
      editor.focus();
      const model = editor.getModel();
      if (model) {
        loadCode(state, { app: dispatch, message: dispatchMessage }).then(code => {
          model.setValue(code);
        });
        dispatch({ type: 'SET_URI', payload: model.uri });
        dispatchMessage({
          type: 'LOG_SYSTEM',
          payload: { status: 'IN_PROGRESS', content: 'Loading Rust Analyzer...' },
        });
        await import('./utils/startRustAnalyzer').then(code => code.startRustAnalyzer(model.uri));
      }
    }
  };

  const options: MonacoEditorProps['options'] = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: state.minimap },
    lineNumbers: state.numbering ? 'on' : 'off',
  };

  return (
    <MonacoEditor
      language="rust"
      theme={state.darkmode ? 'vs-dark' : 'vs'}
      value={code}
      onChange={handleChange}
      options={options}
      editorDidMount={editorDidMount}
    />
  );
};
