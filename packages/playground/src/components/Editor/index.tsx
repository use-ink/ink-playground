import { useState } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import exampleCode from './example-code';

export const Editor = () => {
  const [code, setCode] = useState(exampleCode);
  const [isDark, setIsDark] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showNumbering, setShowNumbering] = useState(true);

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
    minimap: { enabled: showMinimap },
    lineNumbers: showNumbering ? 'on' : 'off',
  };

  return (
    <>
      <div style={{ padding: '1rem', background: 'grey' }}>
        <button className='btn' onClick={() => setIsDark(!isDark)}>
          Darkmode
        </button>
        <button className='btn' onClick={() => setShowMinimap(!showMinimap)}>
          Minimap
        </button>
        <button
          className='btn'
          onClick={() => setShowNumbering(!showNumbering)}>
          Numbering
        </button>
      </div>
      <MonacoEditor
        width='100vw'
        height='80vh'
        language='rust'
        theme={isDark ? 'vs-dark' : 'vs'}
        value={code}
        options={options}
        onChange={handleChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
};
