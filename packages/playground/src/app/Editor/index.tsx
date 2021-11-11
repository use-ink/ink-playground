import { useState, useContext, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import exampleCode from './example-code';
import { AppContext } from '~/context/app/';
import { Dispatch, State } from '~/context/app/reducer';

export const Editor = (): ReactElement => {
  const [code, setCode] = useState(exampleCode);
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  const handleChange = (newValue: string): void => {
    setCode(newValue);
  };

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
      value={code}
      options={options}
      onChange={handleChange}
      editorDidMount={editorDidMount}
    />
  );
};
