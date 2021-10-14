import { useState, useContext, useReducer } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import exampleCode from './example-code';
import { AppContext } from '~/context';
import { reducer } from '~/redux/reducer';

export const Editor = () => {
  const [code, setCode] = useState(exampleCode);

  const [state, dispatch] = useContext(AppContext);

  //const x = useReducer(reducer);

  console.log(state);

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
        <button className='btn' onClick={() => dispatch({ action: "SET_DARKMODE", payload: !state.darkmode })}>
          Darkmode
        </button>
        <button className='btn' onClick={() => setShowMinimap(!state.minimap)}>
          Minimap
        </button>
        <button
          className='btn'
          onClick={() => setShowNumbering(!state.numbering)}>
          Numbering
        </button>
      </div>
      <MonacoEditor
        width='100vw'
        height='80vh'
        language='rust'
        theme={state.darkmode ? 'vs-dark' : 'vs'}
        value={code}
        options={options}
        onChange={handleChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
};
