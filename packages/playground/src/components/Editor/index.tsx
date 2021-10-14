import { useState, useContext, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import exampleCode from './example-code';
import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';

export const Editor = (): ReactElement => {
  const [code, setCode] = useState(exampleCode);
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);

  const handleChange = (newValue: string): void => {
    setCode(newValue);
  };

  const editorDidMount = (editor: MonacoEditor['editor']): void => {
    if (editor) {
      editor.focus();
    }
  };

  const options: MonacoEditorProps['options'] = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: state.minimap },
    lineNumbers: state.numbering ? 'on' : 'off',
  };

  return (
    <>
      <div style={{ padding: '1rem', background: 'grey' }}>
        <button
          className="btn"
          onClick={() =>
            dispatch({ type: 'SET_DARKMODE', payload: !state.darkmode })
          }
        >
          Darkmode
        </button>
        <button
          className="btn"
          onClick={() =>
            dispatch({ type: 'SET_MINIMAP', payload: !state.minimap })
          }
        >
          Minimap
        </button>
        <button
          className="btn"
          onClick={() =>
            dispatch({ type: 'SET_NUMBERING', payload: !state.numbering })
          }
        >
          Numbering
        </button>
      </div>
      <MonacoEditor
        width="100vw"
        height="80vh"
        language="rust"
        theme={state.darkmode ? 'vs-dark' : 'vs'}
        value={code}
        options={options}
        onChange={handleChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
};
