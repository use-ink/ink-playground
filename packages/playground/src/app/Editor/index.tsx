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

  const editorDidMount = (editor: MonacoEditor['editor']): void => {
    if (editor) {
      editor.focus();
      const uri = editor.getModel()?.uri;
      if (uri) dispatch({ type: 'SET_URI', payload: uri });
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
