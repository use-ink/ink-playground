import { useState, useContext, ReactElement, useEffect } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { Dispatch, State } from '~/context/app/reducer';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';
import { loadCode } from '~/context/side-effects/load-code';

export const Editor = (): ReactElement => {
  const [initialCode, setInitialCode] = useState<string>('');
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, dispatchMessage]: [MessageState, MessageDispatch] = useContext(MessageContext);

  useEffect(() => {
    loadCode(state, dispatch, dispatchMessage).then(code => {
      setInitialCode(code);
    });
  }, []);

  const editorDidMount = async (editor: MonacoEditor['editor']): Promise<void> => {
    if (editor) {
      editor.focus();
      const model = editor.getModel();
      if (model) {
        dispatch({ type: 'SET_URI', payload: model.uri });
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
      value={initialCode}
      options={options}
      editorDidMount={editorDidMount}
    />
  );
};
